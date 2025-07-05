import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

// Include RateLimiterMemory class directly in the edge function
class RateLimiterMemory {
  private requests: Map<string, number[]> = new Map()
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  async take(key: string): Promise<void> {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...validRequests)
      const waitTime = this.windowMs - (now - oldestRequest)
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime))
        return this.take(key) // Retry after waiting
      }
    }
    
    validRequests.push(now)
    this.requests.set(key, validRequests)
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
}

const rateLimiter = new RateLimiterMemory(10, 60000) // 10 requests per minute

interface ContactRecord {
  id: string
  properties: Record<string, unknown>
}

// Enhanced input validation function
function validateSearchInput(query: string, limit: number): { isValid: boolean; error?: string } {
  if (typeof query !== 'string') {
    return { isValid: false, error: 'Query must be a string' }
  }
  
  if (query.length > 1000) {
    return { isValid: false, error: 'Query too long (max 1000 characters)' }
  }
  
  if (limit < 1 || limit > 50) {
    return { isValid: false, error: 'Limit must be between 1 and 50' }
  }
  
  // Enhanced SQL injection protection
  const sqlInjectionPattern = /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror)\b|--|\/\*|\*\/|;|'|"|<|>)/i
  if (sqlInjectionPattern.test(query)) {
    return { isValid: false, error: 'Invalid query format' }
  }
  
  // XSS protection
  const xssPattern = /<[^>]*>|javascript:|data:|vbscript:/i
  if (xssPattern.test(query)) {
    return { isValid: false, error: 'Invalid query format' }
  }
  
  return { isValid: true }
}

async function ensureAccessToken(portalId: string, supabase: SupabaseClient): Promise<string> {
  const { data: tokenData } = await supabase
    .from('hubspot_tokens')
    .select('*')
    .eq('portal_id', portalId)
    .maybeSingle()

  if (!tokenData) {
    throw new Error('No HubSpot token found')
  }

  // Check if token is expired with buffer time
  const expiresAt = new Date(tokenData.expires_at)
  const now = new Date()
  const bufferTime = 5 * 60 * 1000 // 5 minutes buffer
  
  if (expiresAt.getTime() - bufferTime <= now.getTime()) {
    // Token is expired or about to expire, refresh it
    const refreshResponse = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: Deno.env.get('HUBSPOT_CLIENT_ID') || '',
        client_secret: Deno.env.get('HUBSPOT_CLIENT_SECRET') || '',
        refresh_token: tokenData.refresh_token,
      }),
    })

    if (!refreshResponse.ok) {
      console.error('Token refresh failed:', refreshResponse.status)
      // Clean up invalid tokens
      await supabase
        .from('hubspot_tokens')
        .delete()
        .eq('portal_id', portalId)
      throw new Error('Token refresh failed')
    }

    const refreshData = await refreshResponse.json()
    const newExpiresAt = new Date(Date.now() + (refreshData.expires_in * 1000)).toISOString()

    const { error: updateError } = await supabase
      .from('hubspot_tokens')
      .update({
        access_token: refreshData.access_token,
        refresh_token: refreshData.refresh_token || tokenData.refresh_token,
        expires_at: newExpiresAt,
      })
      .eq('portal_id', portalId)

    if (updateError) {
      console.error('Token update failed:', updateError)
      throw new Error('Token update failed')
    }

    return refreshData.access_token
  }

  return tokenData.access_token
}

async function searchHubSpotContacts(portalId: string, query: string, limit: number, supabase: SupabaseClient): Promise<ContactRecord[]> {
  const accessToken = await ensureAccessToken(portalId, supabase)
  await rateLimiter.take(portalId)
  
  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            { propertyName: 'firstname', operator: 'CONTAINS_TOKEN', value: query },
            { propertyName: 'lastname', operator: 'CONTAINS_TOKEN', value: query },
            { propertyName: 'email', operator: 'CONTAINS_TOKEN', value: query },
          ],
        },
      ],
      limit,
    }),
  })

  if (!response.ok) {
    console.error('HubSpot search failed:', response.status)
    throw new Error('HubSpot search failed')
  }
  
  const json = await response.json()
  return json.results || []
}

async function searchLocal(portalId: string, query: string, limit: number, supabase: SupabaseClient): Promise<ContactRecord[]> {
  const { data } = await supabase
    .from('hubspot_contacts_cache')
    .select('*')
    .eq('portal_id', portalId)
    .textSearch('search_vector', query, { config: 'simple' })
    .limit(limit)

  return (data as ContactRecord[]) || []
}

async function searchRemote(portalId: string, query: string, limit: number, supabase: SupabaseClient): Promise<ContactRecord[]> {
  const contacts = await searchHubSpotContacts(portalId, query, limit, supabase)

  if (contacts.length > 0) {
    const now = new Date().toISOString()
    const { error } = await supabase
      .from('hubspot_contacts_cache')
      .upsert(contacts.map(contact => ({
        portal_id: portalId,
        id: contact.id,
        properties: contact.properties,
        updated_at: now
      })))
    
    if (error) {
      console.error('Cache upsert error:', error)
    }
  }

  return contacts.slice(0, limit)
}

async function searchContacts(portalId: string, query: string, limit: number, supabase: SupabaseClient): Promise<ContactRecord[]> {
  // Validate input
  const validation = validateSearchInput(query, limit)
  if (!validation.isValid) {
    throw new Error(validation.error)
  }

  // Sanitize query to prevent XSS
  const sanitizedQuery = query.replace(/[<>'"&]/g, '')

  const local = await searchLocal(portalId, sanitizedQuery, limit, supabase)
  const seen = new Set(local.map(r => r.id))
  const results = [...local]
  
  if (results.length < 5) {
    const remote = await searchRemote(portalId, sanitizedQuery, limit, supabase)
    for (const contact of remote) {
      if (!seen.has(contact.id)) {
        results.push(contact)
        seen.add(contact.id)
      }
      if (results.length >= limit) break
    }
  }
  
  return results.slice(0, limit)
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const query = url.searchParams.get('q') || ''
    const limit = parseInt(url.searchParams.get('limit') || '10', 10)

    const auth = req.headers.get('Authorization') || ''
    const token = auth.replace(/^Bearer\s+/i, '')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    function getSub(h: string): string | null {
      try {
        const payload = JSON.parse(atob(h.split('.')[1]))
        return payload.sub ?? null
      } catch {
        return null
      }
    }

    const userId = getSub(token)
    if (!userId) {
      return new Response('Unauthorized', {
        status: 401,
        headers: corsHeaders,
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      accessToken: () => Promise.resolve(token),
    })

    // Rate limiting per user
    await rateLimiter.take(userId)

    const results = await searchContacts(userId, query, limit, supabase)
    
    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in search_contacts function:', error)
    
    // Generic error response for security
    const isRateLimit = error.message === 'Rate limit exceeded'
    const status = isRateLimit ? 429 : 500
    const message = isRateLimit ? 'Too many requests' : 'Internal server error'
    
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    })
  }
})

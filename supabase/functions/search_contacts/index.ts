
import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { RateLimiterMemory } from '../../../src/server/rate_limiter_memory.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const rateLimiter = new RateLimiterMemory(10, 60000) // 10 requests per minute

interface ContactRecord {
  id: string
  properties: Record<string, unknown>
}

// Input validation function
function validateSearchInput(query: string, limit: number): { isValid: boolean; error?: string } {
  if (typeof query !== 'string') {
    return { isValid: false, error: 'Query must be a string' }
  }
  
  if (query.length > 100) {
    return { isValid: false, error: 'Query too long' }
  }
  
  if (limit < 1 || limit > 50) {
    return { isValid: false, error: 'Limit must be between 1 and 50' }
  }
  
  // Basic SQL injection protection
  const sqlInjectionPattern = /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i
  if (sqlInjectionPattern.test(query)) {
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

  const local = await searchLocal(portalId, query, limit, supabase)
  const seen = new Set(local.map(r => r.id))
  const results = [...local]
  
  if (results.length < 5) {
    const remote = await searchRemote(portalId, query, limit, supabase)
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      global: { headers: { Authorization: auth } },
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response('Unauthorized', { 
        status: 401, 
        headers: corsHeaders 
      })
    }

    // Rate limiting per user
    await rateLimiter.take(user.id)

    const results = await searchContacts(user.id, query, limit, supabase)
    
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

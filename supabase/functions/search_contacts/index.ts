
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiter implementation
class RateLimiterMemory {
  private tokens: Map<string, { count: number; resetTime: number }> = new Map()
  
  constructor(private maxRequests: number, private windowMs: number) {}
  
  async take(key: string): Promise<void> {
    const now = Date.now()
    const bucket = this.tokens.get(key) || { count: 0, resetTime: now + this.windowMs }
    
    if (now > bucket.resetTime) {
      bucket.count = 0
      bucket.resetTime = now + this.windowMs
    }
    
    if (bucket.count >= this.maxRequests) {
      const waitTime = bucket.resetTime - now
      await new Promise(resolve => setTimeout(resolve, waitTime))
      return this.take(key)
    }
    
    bucket.count++
    this.tokens.set(key, bucket)
  }
}

const rateLimiter = new RateLimiterMemory(5, 1000)

interface ContactRecord {
  id: string
  properties: Record<string, any>
}

async function ensureAccessToken(portalId: string, supabase: any): Promise<string> {
  const { data: tokenData } = await supabase
    .from('hubspot_tokens')
    .select('*')
    .eq('portal_id', portalId)
    .maybeSingle()

  if (!tokenData) {
    throw new Error('No HubSpot token found')
  }

  // Check if token is expired
  const expiresAt = new Date(tokenData.expires_at)
  const now = new Date()
  
  if (expiresAt <= now) {
    // Token is expired, refresh it
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
      throw new Error('Failed to refresh HubSpot token')
    }

    const refreshData = await refreshResponse.json()
    const newExpiresAt = new Date(Date.now() + (refreshData.expires_in * 1000)).toISOString()

    await supabase
      .from('hubspot_tokens')
      .update({
        access_token: refreshData.access_token,
        refresh_token: refreshData.refresh_token || tokenData.refresh_token,
        expires_at: newExpiresAt,
      })
      .eq('portal_id', portalId)

    return refreshData.access_token
  }

  return tokenData.access_token
}

async function searchHubSpotContacts(portalId: string, query: string, limit: number, supabase: any): Promise<ContactRecord[]> {
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
    throw new Error('HubSpot search failed')
  }
  
  const json = await response.json()
  return json.results || []
}

async function searchLocal(portalId: string, query: string, limit: number, supabase: any): Promise<ContactRecord[]> {
  const { data } = await supabase
    .from('hubspot_contacts_cache')
    .select('*')
    .eq('portal_id', portalId)
    .textSearch('search_vector', query, { config: 'simple' })
    .limit(limit)

  return (data as ContactRecord[]) || []
}

async function searchRemote(portalId: string, query: string, limit: number, supabase: any): Promise<ContactRecord[]> {
  const contacts = await searchHubSpotContacts(portalId, query, limit, supabase)

  if (contacts.length > 0) {
    const now = new Date().toISOString()
    await supabase
      .from('hubspot_contacts_cache')
      .upsert(contacts.map(contact => ({
        portal_id: portalId,
        id: contact.id,
        properties: contact.properties,
        updated_at: now
      })))
  }

  return contacts.slice(0, limit)
}

async function searchContacts(portalId: string, query: string, limit: number, supabase: any): Promise<ContactRecord[]> {
  const local = await searchLocal(portalId, query, limit, supabase)
  const seen = new Set(local.map(r => r.id))
  let results = [...local]
  
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

    const results = await searchContacts(user.id, query, limit, supabase)
    
    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in search_contacts function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

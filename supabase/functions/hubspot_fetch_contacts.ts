import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

class RateLimiterMemory {
  private requests = new Map<string, number[]>()
  constructor(private maxRequests: number, private windowMs: number) {}

  async take(key: string): Promise<void> {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    const valid = requests.filter(t => now - t < this.windowMs)
    if (valid.length >= this.maxRequests) {
      const oldest = Math.min(...valid)
      const wait = this.windowMs - (now - oldest)
      if (wait > 0) {
        await new Promise(res => setTimeout(res, wait))
        return this.take(key)
      }
    }
    valid.push(now)
    this.requests.set(key, valid)
  }
}

const rateLimiter = new RateLimiterMemory(100, 1000)

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const HUBSPOT_CLIENT_ID = Deno.env.get('HUBSPOT_CLIENT_ID') ?? ''
const HUBSPOT_CLIENT_SECRET = Deno.env.get('HUBSPOT_CLIENT_SECRET') ?? ''

function getSupabaseClient() {
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
}

async function ensureAccessToken(portalId: string, sb = getSupabaseClient() ) {
  const { data: tokenData, error } = await sb
    .from('hubspot_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('portal_id', portalId)
    .maybeSingle()

  if (error || !tokenData) {
    throw new Error('No HubSpot token found')
  }

  const expiresAt = new Date(tokenData.expires_at ?? '')
  const needsRefresh = expiresAt.getTime() <= Date.now() + 300000

  if (needsRefresh && tokenData.refresh_token) {
    const resp = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: HUBSPOT_CLIENT_ID,
        client_secret: HUBSPOT_CLIENT_SECRET,
        refresh_token: tokenData.refresh_token
      })
    })

    if (resp.ok) {
      const data = await resp.json()
      await sb.from('hubspot_tokens').update({
        access_token: data.access_token,
        refresh_token: data.refresh_token || tokenData.refresh_token,
        expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString()
      }).eq('portal_id', portalId)
      return data.access_token as string
    }
  }

  return tokenData.access_token as string
}

const supabase = getSupabaseClient()

export interface HubSpotContact {
  id: string
  properties: Record<string, unknown>
}

export interface HubSpotSearchResponse {
  results: HubSpotContact[]
}

export async function hubspotFetchContacts(
  portal_id: string,
  after?: string,
  sb = supabase,
  fetchFn: typeof fetch = fetch,
): Promise<void> {
  const accessToken = await ensureAccessToken(portal_id, sb)
  await rateLimiter.take(portal_id)

  const body: Record<string, unknown> = {
    limit: 100,
    sorts: ['hs_lastmodifieddate'],
    properties: ['firstname', 'lastname', 'email', 'hs_lastmodifieddate']
  }
  if (after) {
    body.filterGroups = [{
      filters: [{ propertyName: 'hs_lastmodifieddate', operator: 'GT', value: after }]
    }]
  }

  const resp = await fetchFn('https://api.hubapi.com/crm/v3/objects/contacts/search', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!resp.ok) throw new Error('HubSpot fetch failed')
  const json: HubSpotSearchResponse = await resp.json()
  const results = json.results || []

  if (results.length) {
    const rows = results.map(r => ({
      portal_id,
      id: r.id,
      properties: r.properties,
      updated_at: (r.properties.hs_lastmodifieddate as string) || new Date().toISOString()
    }))
    await sb.from('hubspot_contacts_cache').upsert(rows)

    const last = rows.reduce<string | undefined>((max, r) => {
      const ts = r.updated_at as string
      if (!max || ts > max) return ts
      return max
    }, after)

    if (last) {
      await sb.from('hubspot_sync_cursors').upsert({ portal_id, object_type: 'contacts', hs_timestamp: last })
    }
  }
}

export async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const portal_id = url.searchParams.get('portal_id') || ''
  const after = url.searchParams.get('after') || undefined

  if (!portal_id) {
    return new Response('portal_id required', { status: 400 })
  }

  try {
    await hubspotFetchContacts(portal_id, after)
    return new Response(null, { status: 204 })
  } catch (err) {
    console.error('hubspotFetchContacts error:', err)
    return new Response('Internal server error', { status: 500 })
  }
}

Deno.serve(handleRequest)

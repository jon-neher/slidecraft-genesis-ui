import { createClient, SupabaseClient } from '@supabase/supabase-js'
import rateLimiter from './rate_limiter_memory'
import {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  HUBSPOT_CLIENT_ID,
  HUBSPOT_CLIENT_SECRET,
} from './config'

export interface ContactRecord {
  id: string
  properties: Record<string, any>
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function ensureAccessToken(portal_id: string, sb: SupabaseClient = supabase): Promise<string> {
  const { data, error } = await sb
    .from('hubspot_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('portal_id', portal_id)
    .maybeSingle()

  if (error || !data) {
    throw new Error('Token fetch failed')
  }

  if (data.expires_at && new Date(data.expires_at).getTime() > Date.now() + 60_000) {
    return data.access_token
  }

  const resp = await fetch('https://api.hubapi.com/oauth/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: data.refresh_token,
      client_id: HUBSPOT_CLIENT_ID,
      client_secret: HUBSPOT_CLIENT_SECRET,
    }).toString(),
  })

  if (!resp.ok) throw new Error('Refresh failed')
  const json: any = await resp.json()

  await sb
    .from('hubspot_tokens')
    .update({
      access_token: json.access_token,
      refresh_token: json.refresh_token ?? data.refresh_token,
      expires_at: new Date(Date.now() + json.expires_in * 1000).toISOString(),
    })
    .eq('portal_id', portal_id)

  return json.access_token
}

export async function searchLocal(
  portal_id: string,
  q: string,
  limit: number,
  sb: SupabaseClient = supabase
): Promise<ContactRecord[]> {
  const { data } = await sb
    .from('hubspot_contacts_cache')
    .select('*')
    .eq('portal_id', portal_id)
    .textSearch('search_vector', q, { config: 'simple' })
    .limit(limit)
  return (data as ContactRecord[]) || []
}

async function searchRemote(
  portal_id: string,
  q: string,
  limit: number,
  sb: SupabaseClient = supabase,
  fetchFn: typeof fetch = fetch
): Promise<ContactRecord[]> {
  const accessToken = await ensureAccessToken(portal_id, sb)
  await rateLimiter.take(portal_id)
  const response = await fetchFn('https://api.hubapi.com/crm/v3/objects/contacts/search', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            { propertyName: 'firstname', operator: 'CONTAINS_TOKEN', value: q },
            { propertyName: 'lastname', operator: 'CONTAINS_TOKEN', value: q },
            { propertyName: 'email', operator: 'CONTAINS_TOKEN', value: q },
          ],
        },
      ],
      limit: 20,
    }),
  })

  if (!response.ok) throw new Error('HubSpot search failed')
  const json: any = await response.json()
  const rows: ContactRecord[] = json.results || []
  const now = new Date().toISOString()
  if (rows.length) {
    await sb.from('hubspot_contacts_cache').upsert(
      rows.map(r => ({ portal_id, id: r.id, properties: r.properties, updated_at: now }))
    )
  }
  return rows.slice(0, limit)
}

export async function searchContacts(
  portal_id: string,
  q: string,
  limit: number,
  sb: SupabaseClient = supabase,
  fetchFn: typeof fetch = fetch
): Promise<ContactRecord[]> {
  const local = await searchLocal(portal_id, q, limit, sb)
  const seen = new Set(local.map(r => r.id))
  let results = [...local]
  if (results.length < 5) {
    const remote = await searchRemote(portal_id, q, limit, sb, fetchFn)
    for (const r of remote) {
      if (!seen.has(r.id)) {
        results.push(r)
        seen.add(r.id)
      }
      if (results.length >= limit) break
    }
  }
  return results.slice(0, limit)
}

export async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const q = url.searchParams.get('q') || ''
  const limit = parseInt(url.searchParams.get('limit') || '10', 10)

  const auth = req.headers.get('Authorization') || ''
  const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: auth } },
  })
  const {
    data: { user },
  } = await client.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const results = await searchContacts(user.id, q, limit, client)
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export default { searchContacts, handleRequest }


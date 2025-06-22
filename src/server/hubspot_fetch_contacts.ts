import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../integrations/supabase/types'
import { ensureAccessToken } from '../integrations/hubspot/tokens'
import rateLimiter from './rate_limiter_memory'
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './config'

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export interface HubSpotContact {
  id: string
  properties: Record<string, any>
}

export interface HubSpotSearchResponse {
  results: HubSpotContact[]
}

export async function hubspotFetchContacts(
  portal_id: string,
  after?: string,
  sb: SupabaseClient<Database> = supabase,
  fetchFn: typeof fetch = fetch,
): Promise<void> {
  const accessToken = await ensureAccessToken(portal_id, sb, fetchFn)
  await rateLimiter.take(portal_id)

  const body: Record<string, any> = {
    limit: 100,
    sorts: ['hs_lastmodifieddate'],
    properties: ['firstname', 'lastname', 'email', 'hs_lastmodifieddate'],
  }
  if (after) {
    body.filterGroups = [
      {
        filters: [
          {
            propertyName: 'hs_lastmodifieddate',
            operator: 'GT',
            value: after,
          },
        ],
      },
    ]
  }

  const resp = await fetchFn(
    'https://api.hubapi.com/crm/v3/objects/contacts/search',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  )

  if (!resp.ok) throw new Error('HubSpot fetch failed')
  const json: HubSpotSearchResponse = await resp.json()
  const results = json.results || []

  if (results.length) {
    const rows = results.map((r) => ({
      portal_id,
      id: r.id,
      properties: r.properties,
      updated_at: r.properties.hs_lastmodifieddate,
    }))
    await sb.from('hubspot_contacts_cache').upsert(rows)

    const last = rows.reduce<string | undefined>((max, r) => {
      if (!max || r.updated_at > max) return r.updated_at
      return max
    }, after)
    if (last) {
      await sb
        .from('hubspot_sync_cursors')
        .upsert({ portal_id, object_type: 'contacts', hs_timestamp: last })
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
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(message, { status: 500 })
  }
}

export default { hubspotFetchContacts, handleRequest }

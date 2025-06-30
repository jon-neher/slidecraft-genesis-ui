
import { type SupabaseClient } from '@supabase/supabase-js'
import type { Database, Json } from '../integrations/supabase/types'
import { ensureAccessToken } from '../integrations/hubspot/tokens'
import rateLimiter from './rate_limiter_memory'
import { getSupabaseClient } from './supabaseClient'

const supabase = getSupabaseClient()

export interface HubSpotContact {
  id: string
  properties: { [key: string]: Json }
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

  const body: Record<string, unknown> = {
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
      properties: r.properties as Database['public']['Tables']['hubspot_contacts_cache']['Insert']['properties'],
      updated_at: (r.properties.hs_lastmodifieddate as string) || new Date().toISOString(),
    }))
    await sb.from('hubspot_contacts_cache').upsert(rows)

    const last = rows.reduce<string | undefined>((max, r) => {
      const currentTimestamp = r.updated_at as string
      if (!max || currentTimestamp > max) return currentTimestamp
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
    console.error('hubspotFetchContacts error:', err)
    return new Response('Internal server error', { status: 500 })
  }
}

export default { hubspotFetchContacts, handleRequest }

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../supabase/types'
import rateLimiter from '../../server/rate_limiter_memory'
import supabase from '../../server/supabaseClient'
import { ensureAccessToken } from './tokens'
import crypto from 'crypto'

export interface HubSpotContact {
  id: string
  properties: Record<string, unknown>
}

export interface HubSpotSearchResponse {
  total?: number
  results: HubSpotContact[]
}

export interface HubSpotNoteResponse {
  id: string
}

export interface PostNoteInput {
  portal_id: string
  hubspot_object_id: string
  app_record_url: string
}

export async function searchContacts(
  portal_id: string,
  q: string,
  limit: number,
  sb: SupabaseClient<Database> = supabase,
  fetchFn: typeof fetch = fetch
): Promise<HubSpotContact[]> {
  const accessToken = await ensureAccessToken(portal_id, sb, fetchFn)
  await rateLimiter.take(portal_id)
  const response = await fetchFn(
    'https://api.hubapi.com/crm/v3/objects/contacts/search',
    {
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
        limit,
      }),
    }
  )

  if (!response.ok) throw new Error('HubSpot search failed')
  const json: HubSpotSearchResponse = await response.json()
  return json.results ?? []
}

export async function postNote(
  { portal_id, hubspot_object_id, app_record_url }: PostNoteInput,
  sb: SupabaseClient<Database> = supabase,
  fetchFn: typeof fetch = fetch
): Promise<{ noteId: string } | { error: unknown }> {
  try {
    const accessToken = await ensureAccessToken(portal_id, sb, fetchFn)
    await rateLimiter.take(portal_id)
    const response = await fetchFn('https://api.hubapi.com/crm/v3/objects/notes', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': crypto
          .createHash('sha256')
          .update(app_record_url)
          .digest('hex'),
      },
      body: JSON.stringify({
        properties: {
          hs_note_body: `\u{1F517} View in App: ${app_record_url}`,
          hs_timestamp: new Date().toISOString(),
        },
        associations: [{ to: { id: hubspot_object_id, type: 'contact' } }],
      }),
    })

    const json: HubSpotNoteResponse = await response.json()
    if (!response.ok) {
      return { error: json }
    }
    return { noteId: json.id }
  } catch (err) {
    return { error: err }
  }
}

export default { searchContacts, postNote }

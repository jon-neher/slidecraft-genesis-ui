import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../supabase/types'
import { getSupabaseClient } from '../../server/supabaseClient'
import {
  HUBSPOT_CLIENT_ID,
  HUBSPOT_CLIENT_SECRET,
} from '../../server/config'


export interface HubSpotTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  scope?: string
}

export async function ensureAccessToken(
  portal_id: string,
  sb: SupabaseClient<Database> = getSupabaseClient(),
  fetchFn: typeof fetch = fetch
): Promise<string> {
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

  const resp = await fetchFn('https://api.hubapi.com/oauth/v1/token', {
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
  const json: HubSpotTokenResponse = await resp.json()

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

export default { ensureAccessToken }

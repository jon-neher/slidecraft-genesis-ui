import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../supabase/types'
import {
  HUBSPOT_CLIENT_ID,
  HUBSPOT_CLIENT_SECRET,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from '../../server/config'

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export async function refreshToken(
  portalId: string,
  sb: SupabaseClient<Database> = supabase,
): Promise<string> {
  const { data, error } = await sb
    .from('hubspot_tokens')
    .select('refresh_token')
    .eq('portal_id', portalId)
    .maybeSingle()

  if (error || !data?.refresh_token) {
    throw new Error('Token fetch failed')
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
    .eq('portal_id', portalId)

  return json.access_token
}

export async function getAccessToken(
  portalId: string,
  sb: SupabaseClient<Database> = supabase,
): Promise<string> {
  const { data, error } = await sb
    .from('hubspot_tokens')
    .select('access_token, expires_at')
    .eq('portal_id', portalId)
    .maybeSingle()

  if (error || !data) {
    throw new Error('Token fetch failed')
  }

  if (data.expires_at && new Date(data.expires_at).getTime() > Date.now() + 60_000) {
    return data.access_token
  }

  return refreshToken(portalId, sb)
}

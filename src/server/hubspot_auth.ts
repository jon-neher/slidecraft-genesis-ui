import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID || '';
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function ensureAccessToken(
  portalId: string,
  sb: SupabaseClient = supabase,
  fetchFn: typeof fetch = fetch
): Promise<string> {
  const { data, error } = await sb
    .from('hubspot_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('portal_id', portalId)
    .maybeSingle();

  if (error || !data) {
    throw new Error('Token fetch failed');
  }

  if (data.expires_at && new Date(data.expires_at).getTime() > Date.now() + 60_000) {
    return data.access_token;
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
  });

  if (!resp.ok) throw new Error('Refresh failed');
  const json = (await resp.json()) as {
    access_token: string
    refresh_token?: string
    expires_in: number
  }

  await sb
    .from('hubspot_tokens')
    .update({
      access_token: json.access_token,
      refresh_token: json.refresh_token ?? data.refresh_token,
      expires_at: new Date(Date.now() + json.expires_in * 1000).toISOString(),
    })
    .eq('portal_id', portalId);

  return json.access_token;
}


import type { SupabaseClient } from '@supabase/supabase-js';

export async function ensureAccessToken(
  portalId: string,
  client?: SupabaseClient
): Promise<string> {
  if (!client) {
    throw new Error('Supabase client is required');
  }

  const { data, error } = await client.functions.invoke('hubspot_token_manager', {
    body: { portal_id: portalId }
  });

  if (error) {
    throw new Error(`Failed to get access token: ${error.message}`);
  }

  if (!data?.access_token) {
    throw new Error('No access token available');
  }

  return data.access_token;
}

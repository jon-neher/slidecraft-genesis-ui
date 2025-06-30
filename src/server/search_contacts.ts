
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ContactRecord } from '@/integrations/hubspot/types';

export async function searchContacts(
  portalId: string,
  query: string,
  limit: number = 10,
  client?: SupabaseClient
): Promise<ContactRecord[]> {
  if (!client) {
    throw new Error('Supabase client is required');
  }

  try {
    const { data, error } = await client.functions.invoke('search_contacts', {
      body: {
        portal_id: portalId,
        query,
        limit
      }
    });

    if (error) {
      throw new Error(`Search failed: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error searching contacts:', error);
    throw error;
  }
}

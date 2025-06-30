
import type { SupabaseClient } from '@supabase/supabase-js';

export interface ContactRecord {
  id: string;
  properties: {
    firstname?: string;
    lastname?: string;
    email?: string;
    company?: string;
    hs_lastmodifieddate?: string;
    [key: string]: any;
  };
}

export interface PostNoteInput {
  portal_id: string;
  hubspot_object_id: string;
  app_record_url: string;
  note_body?: string;
}

export async function postNote(
  input: PostNoteInput,
  client?: SupabaseClient,
  fetchFn: typeof fetch = fetch
): Promise<{ noteId: string } | { error: unknown }> {
  try {
    if (!client) {
      throw new Error('Supabase client is required');
    }

    const { data, error } = await client.functions.invoke('post_note', {
      body: input
    });

    if (error) {
      return { error };
    }

    return data;
  } catch (error) {
    console.error('Error posting note:', error);
    return { error };
  }
}

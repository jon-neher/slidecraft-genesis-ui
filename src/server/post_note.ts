
import type { SupabaseClient } from '@supabase/supabase-js'

export interface PostNoteInput {
  portal_id: string;
  hubspot_object_id: string;
  app_record_url: string;
  note_body?: string;
}

export async function postNote(
  input: PostNoteInput,
  client?: SupabaseClient,
  fetchFn?: typeof fetch
): Promise<{ noteId: string } | { error: unknown }> {
  if (!client) {
    return { error: 'Supabase client is required' };
  }

  try {
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

export default { postNote }

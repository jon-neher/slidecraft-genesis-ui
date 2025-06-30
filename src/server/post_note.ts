
import { postNote as hubspotPostNote, PostNoteInput } from '../integrations/hubspot/client'
import type { SupabaseClient } from '@supabase/supabase-js'

export async function postNote(
  input: PostNoteInput,
  client?: SupabaseClient,
  fetchFn?: typeof fetch
): Promise<{ noteId: string } | { error: unknown }> {
  return hubspotPostNote(input, client, fetchFn)
}

export default { postNote }

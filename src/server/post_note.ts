import { postNote as hubspotPostNote, PostNoteInput } from '../integrations/hubspot/

export async function postNote(input: PostNoteInput): Promise<{ noteId: string } | { error: any }> {
  return hubspotPostNote(input)

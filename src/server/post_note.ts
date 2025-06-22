import { postNote as hubspotPostNote, PostNoteInput } from '../integrations/hubspot/client'

export async function postNote(
  input: PostNoteInput,
): Promise<{ noteId: string } | { error: any }> {
  return hubspotPostNote(input)
}

export default { postNote }

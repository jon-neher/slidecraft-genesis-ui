
import { describe, it, expect, vi } from 'vitest'
import { postNote } from './post_note'

// Mock the HubSpot client
vi.mock('../integrations/hubspot/client', () => ({
  postNote: vi.fn(async (input) => {
    if (input.contactId === 'error') {
      return { error: 'Test error' }
    }
    return { noteId: 'test-note-id' }
  }),
}))

describe('postNote', () => {
  it('should return noteId on success', async () => {
    const result = await postNote({
      contactId: 'test-contact-id',
      noteBody: 'Test note',
      portalId: 'test-portal',
    })

    expect(result).toEqual({ noteId: 'test-note-id' })
  })

  it('should return error on failure', async () => {
    const result = await postNote({
      contactId: 'error',
      noteBody: 'Test note',
      portalId: 'test-portal',
    })

    expect(result).toEqual({ error: 'Test error' })
  })
})

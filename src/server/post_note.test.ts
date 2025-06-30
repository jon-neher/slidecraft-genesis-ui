
import { describe, it, expect, jest } from '@jest/globals'
import { postNote } from './post_note'

// Mock the HubSpot client
jest.mock('../integrations/hubspot/client', () => ({
  postNote: jest.fn(async (input) => {
    if (input.hubspot_object_id === 'error') {
      return { error: 'Test error' }
    }
    return { noteId: 'test-note-id' }
  }),
}))

describe('postNote', () => {
  it('should return noteId on success', async () => {
    const result = await postNote({
      portal_id: 'test-portal',
      hubspot_object_id: 'test-contact-id',
      app_record_url: 'http://example.com/app-record',
    })

    expect(result).toEqual({ noteId: 'test-note-id' })
  })

  it('should return error on failure', async () => {
    const result = await postNote({
      portal_id: 'test-portal',
      hubspot_object_id: 'error',
      app_record_url: 'http://example.com/app-record',
    })

    expect(result).toEqual({ error: 'Test error' })
  })
})

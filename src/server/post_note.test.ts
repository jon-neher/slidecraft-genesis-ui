
import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { postNote } from './post_note'
import type { SupabaseClient } from '@supabase/supabase-js'

const mockClient = {
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        maybeSingle: jest.fn().mockResolvedValue({ data: { access_token: 'mock-token' }, error: null })
      })
    })
  })
} as unknown as SupabaseClient

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>

describe('postNote', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'note-123' })
    } as Response)
  })

  it('posts note to HubSpot', async () => {
    const input = {
      portal_id: 'test-portal',
      hubspot_object_id: 'contact-123',
      app_record_url: 'https://app.example.com/record/1'
    }

    const result = await postNote(input, mockClient, mockFetch)
    
    expect(result).toEqual({ noteId: 'note-123' })
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.hubapi.com/crm/v3/objects/notes',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-token',
          'Content-Type': 'application/json'
        })
      })
    )
  })

  it('handles errors gracefully', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'API Error' })
    } as Response)

    const input = {
      portal_id: 'test-portal',
      hubspot_object_id: 'contact-123',
      app_record_url: 'https://app.example.com/record/1'
    }

    const result = await postNote(input, mockClient, mockFetch)
    
    expect(result).toHaveProperty('error')
  })
})


import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { postNote } from './post_note'
import type { SupabaseClient } from '@supabase/supabase-js'

const invokeMock = jest.fn()
const mockClient = {
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        maybeSingle: jest.fn() as jest.MockedFunction<any>
      })
    })
  }),
  functions: { invoke: invokeMock }
} as unknown as SupabaseClient

describe('postNote', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    invokeMock.mockResolvedValue({ data: { noteId: 'note-123' }, error: null })
    const mockSelectChain = (mockClient.from as jest.MockedFunction<any>)().select().eq()
    mockSelectChain.maybeSingle.mockResolvedValue({ data: { access_token: 'mock-token' }, error: null })
  })

  it('posts note to HubSpot', async () => {
    const input = {
      portal_id: 'test-portal',
      hubspot_object_id: 'contact-123',
      app_record_url: 'https://app.example.com/record/1'
    }

    const result = await postNote(input, mockClient)

    expect(result).toEqual({ noteId: 'note-123' })
    expect(invokeMock).toHaveBeenCalledWith('post_note', { body: input })
  })

  it('handles errors gracefully', async () => {
    invokeMock.mockResolvedValueOnce({ error: new Error('API Error'), data: null })

    const input = {
      portal_id: 'test-portal',
      hubspot_object_id: 'contact-123',
      app_record_url: 'https://app.example.com/record/1'
    }

    const result = await postNote(input, mockClient)
    
    expect(result).toHaveProperty('error')
  })
})

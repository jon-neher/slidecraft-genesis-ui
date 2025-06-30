
import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { handleRequest } from './hubspot_webhook'

const upsertMock = jest.fn()
const fromMock = jest.fn(() => ({ upsert: upsertMock }))
const mockClient = { from: fromMock }

jest.doMock('./supabaseClient', () => ({
  getSupabaseClient: jest.fn(() => mockClient)
}))

describe('hubspotWebhook', () => {
  beforeEach(() => {
    upsertMock.mockClear().mockResolvedValue({ error: null })
    fromMock.mockClear()
  })

  it('processes webhook payload', async () => {
    const req = new Request('http://test/webhook', {
      method: 'POST',
      body: JSON.stringify([{
        objectId: 123,
        propertyName: 'email',
        propertyValue: 'test@example.com',
        changeSource: 'CRM_UI'
      }])
    })

    const res = await handleRequest(req)
    expect(res.status).toBe(204)
    expect(upsertMock).toHaveBeenCalled()
  })
})

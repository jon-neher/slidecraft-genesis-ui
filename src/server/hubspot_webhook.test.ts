
import { describe, it, expect, jest, beforeEach, beforeAll } from '@jest/globals'

const upsertMock = jest.fn() as jest.MockedFunction<any>
const fromMock = jest.fn(() => ({ upsert: upsertMock }))
const mockClient = { from: fromMock }

jest.mock('./supabaseClient', () => ({
  getSupabaseClient: jest.fn(() => mockClient)
}))

let handleRequest: typeof import('./hubspot_webhook').handleRequest

beforeAll(async () => {
  ;({ handleRequest } = await import('./hubspot_webhook'))
})

describe('hubspotWebhook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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

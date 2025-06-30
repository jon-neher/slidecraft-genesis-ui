
import { describe, it, expect, jest, beforeEach } from '@jest/globals'

const upsertCache = jest.fn() as jest.MockedFunction<any>
const upsertCursor = jest.fn() as jest.MockedFunction<any>

jest.doMock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: (table: string) => ({
      upsert: table === 'hubspot_contacts_cache' ? upsertCache : upsertCursor,
    }),
  })),
}))

jest.mock('../integrations/hubspot/tokens', () => ({
  ensureAccessToken: jest.fn(async () => 'tok'),
}))

jest.mock('./rate_limiter_memory', () => ({
  __esModule: true,
  default: { take: jest.fn() },
}));

let hubspotFetchContacts: typeof import('./hubspot_fetch_contacts').hubspotFetchContacts

beforeEach(async () => {
  jest.clearAllMocks()
  upsertCache.mockClear().mockResolvedValue({ error: null })
  upsertCursor.mockClear().mockResolvedValue({ error: null })
  jest.resetModules()
  ;({ hubspotFetchContacts } = await import('./hubspot_fetch_contacts'))
})

describe('hubspotFetchContacts', () => {
  it('stores fetched contacts and updates cursor', async () => {
    const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          { id: '1', properties: { hs_lastmodifieddate: '2024-01-01T00:00:00Z' } },
        ],
      }),
    } as Response)

    await hubspotFetchContacts('p1', undefined, undefined, fetchMock)

    expect(fetchMock).toHaveBeenCalled()
    expect(upsertCache).toHaveBeenCalled()
    expect(upsertCursor).toHaveBeenCalled()
  })
})

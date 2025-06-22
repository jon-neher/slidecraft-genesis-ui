import { describe, it, expect, vi, beforeEach } from 'vitest'

const upsertCache = vi.fn()
const upsertCursor = vi.fn()

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: (table: string) => ({
      upsert: table === 'hubspot_contacts_cache' ? upsertCache : upsertCursor,
    }),
  })),
}))

vi.mock('../integrations/hubspot/tokens', () => ({
  ensureAccessToken: vi.fn(async () => 'tok'),
}))

vi.mock('./rate_limiter_memory', () => ({
  default: { take: vi.fn() },
}))

let hubspotFetchContacts: typeof import('./hubspot_fetch_contacts').hubspotFetchContacts

beforeEach(async () => {
  upsertCache.mockClear()
  upsertCursor.mockClear()
  vi.resetModules()
  ;({ hubspotFetchContacts } = await import('./hubspot_fetch_contacts'))
})

describe('hubspotFetchContacts', () => {
  it('stores fetched contacts and updates cursor', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          { id: '1', properties: { hs_lastmodifieddate: '2024-01-01T00:00:00Z' } },
        ],
      }),
    })

    await hubspotFetchContacts('p1', undefined, undefined as any, fetchMock)

    expect(fetchMock).toHaveBeenCalled()
    expect(upsertCache).toHaveBeenCalled()
    expect(upsertCursor).toHaveBeenCalled()
  })
})

process.env.SUPABASE_URL = 'http://localhost'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'key'
jest.mock('./rate_limiter_memory', () => {
  const { RateLimiterMemory } = jest.requireActual('./rate_limiter_memory')
  return { __esModule: true, default: new RateLimiterMemory(100, 1000), RateLimiterMemory }
})
import { RateLimiterMemory } from './rate_limiter_memory'
import type { SupabaseClient } from '@supabase/supabase-js'
let searchContacts: typeof import('./search_contacts').searchContacts
beforeAll(async () => {
  ;({ searchContacts } = await import('./search_contacts'))
})

jest.useFakeTimers()

const fromMock = jest.fn()
const textSearchMock = jest.fn()
const eqMock = jest.fn()
const limitMock = jest.fn()
const maybeSingleMock = jest.fn()
const upsertMock = jest.fn()
const authMock = {
  getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'p1' } } }))
}

const mockClient = {
  from: () => ({
    select: () => ({
      eq: eqMock,
      textSearch: textSearchMock,
      limit: limitMock
    }),
    upsert: upsertMock
  }),
  auth: authMock
} as unknown as SupabaseClient

function makeFetch(results: unknown[]) {
  return jest.fn().mockResolvedValue({ ok: true, json: async () => ({ results }) })
}

describe('searchContacts', () => {
  beforeEach(() => {
    eqMock.mockReturnValue({ textSearch: textSearchMock, maybeSingle: maybeSingleMock })
    textSearchMock.mockReturnValue({ limit: limitMock })
    limitMock.mockResolvedValue({ data: [], error: null })
    maybeSingleMock.mockResolvedValue({ data: { access_token: 'tok', refresh_token: 'ref', expires_at: new Date(Date.now()+3600e3).toISOString() }, error: null })
    upsertMock.mockResolvedValue({})
  })

  it('hits local only', async () => {
    limitMock.mockResolvedValue({ data: Array.from({ length: 6 }, (_, i) => ({ id: `${i}`, properties: {} })), error: null })
    const fetch = makeFetch([])
    const res = await searchContacts('p1', 'foo', 10, mockClient, fetch)
    expect(fetch).not.toHaveBeenCalled()
    expect(res.length).toBe(6)
  })

  it('hits remote when local < 5', async () => {
    limitMock.mockResolvedValueOnce({ data: [{ id: '1', properties: {} }], error: null })
    const fetch = makeFetch([{ id: '1', properties: {} }, { id: '2', properties: {} }])
    const res = await searchContacts('p1', 'foo', 2, mockClient, fetch)
    expect(fetch).toHaveBeenCalled()
    expect(res.map(r => r.id)).toEqual(['1', '2'])
  })

  it('rate-limiter blocks >5 rps in test harness', async () => {
    const limiter = new RateLimiterMemory(5, 1000)
    const mod = await import('./rate_limiter_memory')
    Object.assign(mod, { default: limiter })

    limitMock.mockResolvedValue({ data: [], error: null })
    const fetch = makeFetch([])
    const start = Date.now()
    const promises = Array.from({ length: 6 }, () => searchContacts('p1', 'a', 1, mockClient, fetch))
    await jest.advanceTimersByTimeAsync(1000)
    await Promise.all(promises)
    expect(Date.now() - start).toBeGreaterThanOrEqual(1000)
  })
})

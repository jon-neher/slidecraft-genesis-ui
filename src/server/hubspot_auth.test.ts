import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'

process.env.SUPABASE_URL = 'http://localhost'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'key'

let ensureAccessToken: typeof import('./hubspot_auth').ensureAccessToken
beforeAll(async () => {
  ;({ ensureAccessToken } = await import('./hubspot_auth'))
})

const selectMock = vi.fn()
const updateMock = vi.fn()

const mockSb = {
  from: () => ({
    select: () => ({
      eq: () => ({ maybeSingle: selectMock })
    }),
    update: updateMock
  })
} as unknown as SupabaseClient

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  fetchMock = vi.fn()
  selectMock.mockReset()
  updateMock.mockReset()
})

describe('ensureAccessToken', () => {
  it('returns current token when not expired', async () => {
    selectMock.mockResolvedValue({ data: { access_token: 'tok', refresh_token: 'ref', expires_at: new Date(Date.now()+3600e3).toISOString() }, error: null })

    const tok = await ensureAccessToken('p1', mockSb, fetchMock)
    expect(tok).toBe('tok')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('refreshes expired token', async () => {
    const expired = new Date(Date.now()-1000).toISOString()
    selectMock.mockResolvedValue({ data: { access_token: 'old', refresh_token: 'ref', expires_at: expired }, error: null })
    updateMock.mockReturnValue({ eq: () => Promise.resolve({}) })
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ access_token: 'new', refresh_token: 'newr', expires_in: 3600 }) })

    const tok = await ensureAccessToken('p1', mockSb, fetchMock)
    expect(fetchMock).toHaveBeenCalled()
    expect(updateMock).toHaveBeenCalled()
    expect(tok).toBe('new')
  })
})

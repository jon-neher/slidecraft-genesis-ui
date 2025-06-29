import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleRequest } from './blueprints'

const insertMock = vi.fn()
const updateMock = vi.fn()
const deleteMock = vi.fn()
const builder = {
  or: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  then: (resolve: (v: unknown) => unknown) => Promise.resolve({ data: [], error: null }).then(resolve),
}
const orMock = builder.or
const eqMock = builder.eq

const fromMock = vi.fn(() => ({
  select: vi.fn(() => builder),
  insert: insertMock,
  update: updateMock,
  delete: deleteMock,
  maybeSingle: vi.fn(),
  single: vi.fn(),
}))

const authMock = {
  getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'u1' } } })),
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: fromMock,
    auth: authMock,
  })),
}))

beforeEach(() => {
  insertMock.mockReset()
  updateMock.mockReset()
  deleteMock.mockReset()
  orMock.mockClear()
  eqMock.mockClear()
})

describe('handleRequest blueprints', () => {
  it('lists user blueprints', async () => {
    const res = await handleRequest(new Request('http://x/blueprints'))
    expect(res.status).toBe(200)
    expect(orMock).not.toHaveBeenCalled()
    expect(eqMock).toHaveBeenCalledWith('user_id', 'u1')
  })

  it('includes defaults when requested', async () => {
    const res = await handleRequest(new Request('http://x/blueprints?includeDefaults=true'))
    expect(res.status).toBe(200)
    expect(orMock).toHaveBeenCalled()
  })
})

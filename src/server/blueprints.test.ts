import { describe, it, expect, jest, beforeEach, beforeAll } from '@jest/globals'

let handleRequest: typeof import('./blueprints').handleRequest

const insertMock = jest.fn()
const updateMock = jest.fn()
const deleteMock = jest.fn()
const builder = {
  or: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  then: (resolve: (v: unknown) => unknown) => Promise.resolve({ data: [], error: null }).then(resolve),
}
const orMock = builder.or
const eqMock = builder.eq

const fromMock = jest.fn(() => ({
  select: jest.fn(() => builder),
  insert: insertMock,
  update: updateMock,
  delete: deleteMock,
  maybeSingle: jest.fn(),
  single: jest.fn(),
}))

const authMock = {
  getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'u1' } } })),
}

jest.doMock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: fromMock,
    auth: authMock,
  })),
}))

beforeAll(async () => {
  process.env.SUPABASE_URL = 'http://localhost'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'key'
  ;({ handleRequest } = await import('./blueprints'))
})

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

  it('filters by theme', async () => {
    const res = await handleRequest(new Request('http://x/blueprints?theme=dark'))
    expect(res.status).toBe(200)
    expect(eqMock.mock.calls.some(c => c[0] === 'theme' && c[1] === 'dark')).toBe(true)
  })
})

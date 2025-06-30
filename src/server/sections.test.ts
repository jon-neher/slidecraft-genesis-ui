import { describe, it, expect, vi, beforeEach } from 'vitest'

let handleRequest: typeof import('./sections').handleRequest

const authMock = { getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'u1' } } })) }

const createMock = vi.fn()

vi.doMock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({ auth: authMock })),
}))

vi.mock('openai', () => ({
  default: class {
    chat = { completions: { create: createMock } }
  },
}))

beforeEach(async () => {
  vi.resetModules()
  createMock.mockClear()
  ;({ handleRequest } = await import('./sections'))
})

describe('handleRequest sections', () => {
  it('returns rule-based sections when matched', async () => {
    const req = new Request('http://x/sections/suggest', {
      method: 'POST',
      body: JSON.stringify({ goal: 'QBR', audience: 'executive' }),
    })
    const res = await handleRequest(req)
    const json = await res.json()
    expect(json.sections).toContain('highlights')
    expect(createMock).not.toHaveBeenCalled()
  })

  it('falls back to LLM when no rule', async () => {
    createMock.mockResolvedValueOnce({ choices: [{ message: { content: '["a"]' } }] })
    const req = new Request('http://x/sections/suggest', {
      method: 'POST',
      body: JSON.stringify({ goal: 'unknown', audience: 'foo' }),
    })
    const res = await handleRequest(req)
    const json = await res.json()
    expect(json.sections).toEqual(['a'])
    expect(createMock).toHaveBeenCalled()
  })

  it('caches results', async () => {
    createMock.mockResolvedValueOnce({ choices: [{ message: { content: '["c"]' } }] })
    const body = JSON.stringify({ goal: 'cache', audience: 'me' })
    await handleRequest(new Request('http://x/sections/suggest', { method: 'POST', body }))
    await handleRequest(new Request('http://x/sections/suggest', { method: 'POST', body }))
    expect(createMock).toHaveBeenCalledTimes(1)
  })
})


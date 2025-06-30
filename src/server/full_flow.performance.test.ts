import { describe, it, expect, jest, beforeAll, beforeEach } from '@jest/globals'
import { performance } from 'node:perf_hooks'

let blueprintsHandler: typeof import('./blueprints').handleRequest
let sectionsHandler: typeof import('./sections').handleRequest
let renderHandler: typeof import('./decks_render').handleRequest

const builder = {
  select: jest.fn().mockReturnThis(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  eq: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn(),
  single: jest.fn(),
  then: (resolve: (v: unknown) => unknown) => Promise.resolve({ data: [], error: null }).then(resolve),
}

let fromMock: ReturnType<typeof jest.fn>
const authMock = { getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'u1' } } })) }

beforeAll(async () => {
  jest.doMock('@supabase/supabase-js', () => {
    fromMock = jest.fn(() => builder)
    return { createClient: jest.fn(() => ({ from: fromMock, auth: authMock })) }
  })
  jest.doMock('openai', () => ({
    default: class {
      chat = { completions: { create: jest.fn() } }
    }
  }))
  ;({ handleRequest: blueprintsHandler } = await import('./blueprints'))
  ;({ handleRequest: sectionsHandler } = await import('./sections'))
  ;({ handleRequest: renderHandler } = await import('./decks_render'))
})

beforeEach(() => {
  builder.select.mockReturnThis()
  builder.insert.mockReset()
  builder.update.mockReset()
  builder.delete.mockReturnThis()
  builder.eq.mockReturnThis()
  builder.or.mockReturnThis()
  builder.in.mockReturnThis()
  builder.maybeSingle.mockReset()
  builder.single.mockReset()
  builder.then = (resolve: (v: unknown) => unknown) => Promise.resolve({ data: [], error: null }).then(resolve)
})

describe('full API flow performance', () => {
  it('runs the blueprint clone/update/render sequence quickly', async () => {
    const defaultBlueprint = {
      blueprint_id: 'd1',
      user_id: 'u1',
      name: 'Default',
      is_default: true,
      goal: 'quarterly review',
      audience: 'executive',
      section_sequence: ['intro'],
      theme: 'brand',
      slide_library: [],
      extra_metadata: {},
    }

    builder.then = (resolve: (v: unknown) => unknown) =>
      Promise.resolve({ data: [defaultBlueprint], error: null }).then(resolve)

    const t1 = performance.now()
    const res1 = await blueprintsHandler(new Request('http://x/blueprints?includeDefaults=true'))
    const d1 = performance.now() - t1
    expect(res1.status).toBe(200)
    expect(d1).toBeLessThan(200)

    builder.single.mockResolvedValueOnce({ data: defaultBlueprint, error: null })
    const clone = { ...defaultBlueprint, blueprint_id: 'b1', is_default: false }
    builder.insert.mockReturnValueOnce({
      select: () => ({ single: jest.fn(async () => ({ data: clone, error: null })) }),
    })
    const t2 = performance.now()
    const res2 = await blueprintsHandler(new Request('http://x/blueprints/d1/clone', { method: 'POST' }))
    const d2 = performance.now() - t2
    expect(res2.status).toBe(201)
    expect(d2).toBeLessThan(100)

    const t3 = performance.now()
    const res3 = await sectionsHandler(
      new Request('http://x/sections/suggest', {
        method: 'POST',
        body: JSON.stringify({ goal: clone.goal, audience: clone.audience }),
      })
    )
    const d3 = performance.now() - t3
    expect(res3.status).toBe(200)
    expect(d3).toBeLessThan(200)

    builder.maybeSingle.mockResolvedValueOnce({ data: { is_default: false }, error: null })
    builder.update.mockReturnValueOnce({ eq: () => ({ eq: () => ({ error: null }) }) })
    const t4 = performance.now()
    const res4 = await blueprintsHandler(
      new Request('http://x/blueprints/b1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated', data: { goal: clone.goal } }),
      })
    )
    const d4 = performance.now() - t4
    expect(res4.status).toBe(200)
    expect(d4).toBeLessThan(100)

    builder.maybeSingle.mockResolvedValueOnce({ data: clone, error: null })
    builder.maybeSingle.mockResolvedValueOnce({ data: { css: '.brand{}' }, error: null })
    builder.in.mockResolvedValueOnce({ data: [{ section_id: 'intro', default_templates: ['t1'] }], error: null })
    const t5 = performance.now()
    const res5 = await renderHandler(
      new Request('http://x/decks/render', { method: 'POST', body: JSON.stringify({ blueprint_id: 'b1' }) })
    )
    const d5 = performance.now() - t5
    expect(res5.status).toBe(200)
    expect(d5).toBeLessThan(200)
    const json = await res5.json()
    expect(json.presentation_url).toContain('/decks/')
  })
})

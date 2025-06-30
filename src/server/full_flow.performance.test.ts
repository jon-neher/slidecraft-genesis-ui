
import { describe, it, expect, jest, beforeEach, beforeAll } from '@jest/globals'

let handleRequest: typeof import('./blueprints').handleRequest

const builder = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  single: jest.fn(),
  maybeSingle: jest.fn(),
}

const authBuilder = {
  getUser: jest.fn(),
}

let fromMock: ReturnType<typeof jest.fn>
let supabaseClient: any

beforeAll(async () => {
  jest.doMock('@supabase/supabase-js', () => {
    fromMock = jest.fn(() => builder)
    supabaseClient = { 
      from: fromMock,
      auth: authBuilder
    }
    return { createClient: jest.fn(() => supabaseClient) }
  })
  ;({ handleRequest } = await import('./blueprints'))
})

beforeEach(() => {
  builder.select.mockReturnThis()
  builder.eq.mockReturnThis()
  builder.or.mockReturnThis()
  builder.insert.mockReturnThis()
  builder.update.mockReturnThis()
  builder.delete.mockReturnThis()
  builder.single.mockResolvedValue({ data: null, error: null })
  builder.maybeSingle.mockResolvedValue({ data: null, error: null })
  authBuilder.getUser.mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null })
})

describe('blueprint performance tests', () => {
  it('handles blueprint creation efficiently', async () => {
    const mockBlueprint = {
      blueprint_id: 'bp1',
      user_id: 'test-user',
      name: 'Test Blueprint',
      is_default: false,
      goal: 'test goal',
      audience: 'test audience',
      section_sequence: ['intro', 'body', 'conclusion'],
      theme: 'default',
      slide_library: [],
      extra_metadata: {},
    }

    builder.single.mockResolvedValueOnce({ 
      data: mockBlueprint, 
      error: null 
    })

    const startTime = Date.now()
    const res = await handleRequest(new Request('http://x/blueprints', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Blueprint',
        data: {
          goal: 'test goal',
          audience: 'test audience',
          section_sequence: ['intro', 'body', 'conclusion']
        }
      })
    }))
    const endTime = Date.now()

    expect(res.status).toBe(201)
    expect(endTime - startTime).toBeLessThan(1000) // Should complete within 1 second
  })

  it('lists blueprints efficiently', async () => {
    builder.select.mockResolvedValueOnce({ data: [], error: null })

    const startTime = Date.now()
    const res = await handleRequest(new Request('http://x/blueprints'))
    const endTime = Date.now()

    expect(res.status).toBe(200)
    expect(endTime - startTime).toBeLessThan(500) // Should complete within 500ms
  })

  it('gets blueprint by id efficiently', async () => {
    builder.maybeSingle.mockResolvedValueOnce({ 
      data: { 
        blueprint_id: 'bp1', 
        is_default: false, 
        user_id: 'test-user', 
        name: 'Test', 
        goal: 'test goal', 
        audience: 'test audience', 
        section_sequence: ['intro'], 
        theme: 'default', 
        slide_library: [], 
        extra_metadata: {} 
      }, 
      error: null 
    })

    const startTime = Date.now()
    const res = await handleRequest(new Request('http://x/blueprints/bp1'))
    const endTime = Date.now()

    expect(res.status).toBe(200)
    expect(endTime - startTime).toBeLessThan(500) // Should complete within 500ms
  })

  it('clones blueprint efficiently', async () => {
    const originalBlueprint = {
      blueprint_id: 'bp1',
      is_default: true,
      user_id: 'system',
      name: 'Default Blueprint',
      goal: 'default goal',
      audience: 'general',
      section_sequence: ['intro'],
      theme: 'default',
      slide_library: [],
      extra_metadata: {},
      blueprint: {}
    }

    builder.single.mockResolvedValueOnce({ data: originalBlueprint, error: null })
    builder.single.mockResolvedValueOnce({ 
      data: { ...originalBlueprint, user_id: 'test-user', blueprint_id: 'bp2' }, 
      error: null 
    })

    const startTime = Date.now()
    const res = await handleRequest(new Request('http://x/blueprints/bp1/clone', { method: 'POST' }))
    const endTime = Date.now()

    expect(res.status).toBe(201)
    expect(endTime - startTime).toBeLessThan(1000) // Should complete within 1 second
  })
})

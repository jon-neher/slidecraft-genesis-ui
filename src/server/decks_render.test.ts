
import { describe, it, expect, jest, beforeEach, beforeAll } from '@jest/globals'

let handleRequest: typeof import('./decks_render').handleRequest

const builder = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn(),
  single: jest.fn(),
  from: jest.fn().mockReturnThis(),
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
  ;({ handleRequest } = await import('./decks_render'))
})

beforeEach(() => {
  builder.select.mockReturnThis()
  builder.eq.mockReturnThis()
  builder.in.mockReturnThis()
  builder.maybeSingle.mockResolvedValue({ data: null, error: null })
  builder.single.mockResolvedValue({ data: null, error: null })
  authBuilder.getUser.mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null })
})

describe('deckRender handleRequest', () => {
  it('returns 404 for non-matching path', async () => {
    const res = await handleRequest(new Request('http://x/api/other'))
    expect(res.status).toBe(404)
  })

  it('returns 401 when no user', async () => {
    authBuilder.getUser.mockResolvedValueOnce({ data: { user: null }, error: null })
    const res = await handleRequest(new Request('http://x/api/decks/render', { method: 'POST' }))
    expect(res.status).toBe(401)
  })

  it('renders deck with blueprint', async () => {
    builder.maybeSingle.mockResolvedValueOnce({ 
      data: { 
        blueprint_id: 'bp1', 
        user_id: 'test-user', 
        is_default: false, 
        section_sequence: ['intro', 'solution'], 
        theme: 'default' 
      }, 
      error: null 
    })
    builder.select.mockResolvedValueOnce({ 
      data: [{ section_id: 'intro', default_templates: ['t1'] }], 
      error: null 
    })
    builder.maybeSingle.mockResolvedValueOnce({ 
      data: { css: '.test {}' }, 
      error: null 
    })
    
    const res = await handleRequest(new Request('http://x/api/decks/render', {
      method: 'POST',
      body: JSON.stringify({ blueprint_id: 'bp1' })
    }))
    expect(res.status).toBe(200)
  })

  it('renders with overrides', async () => {
    builder.maybeSingle.mockResolvedValueOnce({ 
      data: { 
        blueprint_id: 'bp1', 
        user_id: 'test-user', 
        is_default: false, 
        section_sequence: ['intro'], 
        theme: 'default' 
      }, 
      error: null 
    })
    builder.select.mockResolvedValueOnce({ 
      data: [], 
      error: null 
    })
    builder.maybeSingle.mockResolvedValueOnce({ 
      data: { css: '.test {}' }, 
      error: null 
    })
    
    const res = await handleRequest(new Request('http://x/api/decks/render', {
      method: 'POST',
      body: JSON.stringify({ 
        blueprint_id: 'bp1', 
        overrides: { intro: ['custom-template'] } 
      })
    }))
    expect(res.status).toBe(200)
  })

  it('returns 404 for missing blueprint', async () => {
    builder.maybeSingle.mockResolvedValueOnce({ data: null, error: null })
    
    const res = await handleRequest(new Request('http://x/api/decks/render', {
      method: 'POST',
      body: JSON.stringify({ blueprint_id: 'missing' })
    }))
    expect(res.status).toBe(404)
  })
})

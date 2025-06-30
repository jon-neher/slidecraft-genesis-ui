
import { describe, it, expect, jest, beforeEach, beforeAll } from '@jest/globals'

let handleRequest: typeof import('./section_templates').handleRequest

const builder = {
  select: jest.fn() as jest.MockedFunction<any>,
  eq: jest.fn() as jest.MockedFunction<any>,
  maybeSingle: jest.fn() as jest.MockedFunction<any>,
  insert: jest.fn() as jest.MockedFunction<any>,
  update: jest.fn() as jest.MockedFunction<any>,
  delete: jest.fn() as jest.MockedFunction<any>,
}

const authBuilder = {
  getUser: jest.fn() as jest.MockedFunction<any>,
}

let fromMock: jest.MockedFunction<any>
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
  ;({ handleRequest } = await import('./section_templates'))
})

beforeEach(() => {
  jest.clearAllMocks()
  
  // Reset builder chain
  builder.select.mockReturnValue(builder)
  builder.eq.mockReturnValue(builder)
  builder.maybeSingle.mockResolvedValue({ data: null, error: null })
  builder.insert.mockResolvedValue({ data: null, error: null })
  builder.update.mockResolvedValue({ data: null, error: null })
  builder.delete.mockResolvedValue({ data: null, error: null })
  
  // Reset auth
  authBuilder.getUser.mockResolvedValue({ data: { user: { id: 'test-user' } }, error: null })
})

describe('sectionTemplates handleRequest', () => {
  it('gets all section templates', async () => {
    // Override select for this specific test to return resolved data
    builder.select.mockResolvedValueOnce({ 
      data: [{ section_id: 'intro', name: 'Introduction' }], 
      error: null 
    })
    
    const res = await handleRequest(new Request('http://x/api/section-templates'))
    expect(res.status).toBe(200)
  })

  it('gets specific section template', async () => {
    builder.maybeSingle.mockResolvedValueOnce({ 
      data: { section_id: 'intro' }, 
      error: null 
    })
    
    const res = await handleRequest(new Request('http://x/api/section-templates/intro'))
    expect(res.status).toBe(200)
  })

  it('returns 404 for missing template', async () => {
    builder.maybeSingle.mockResolvedValueOnce({ data: null, error: null })
    
    const res = await handleRequest(new Request('http://x/api/section-templates/missing'))
    expect(res.status).toBe(404)
  })
})


import { describe, it, expect, jest, beforeEach, beforeAll } from '@jest/globals'

let handleRequest: typeof import('./slide_templates').handleRequest

const builder = {
  select: jest.fn() as jest.MockedFunction<any>,
  eq: jest.fn() as jest.MockedFunction<any>,
  maybeSingle: jest.fn() as jest.MockedFunction<any>,
  single: jest.fn() as jest.MockedFunction<any>,
  insert: jest.fn() as jest.MockedFunction<any>,
  update: jest.fn() as jest.MockedFunction<any>,
  delete: jest.fn() as jest.MockedFunction<any>,
}
let fromMock: jest.MockedFunction<any>

beforeAll(async () => {
  jest.doMock('@supabase/supabase-js', () => {
    fromMock = jest.fn(() => builder)
    return { createClient: jest.fn(() => ({ from: fromMock })) }
  })
  ;({ handleRequest } = await import('./slide_templates'))
})

beforeEach(() => {
  jest.clearAllMocks()
  
  // Reset builder chain
  builder.select.mockReturnValue(builder)
  builder.eq.mockReturnValue(builder)
  builder.maybeSingle.mockResolvedValue({ data: null, error: null })
  builder.single.mockResolvedValue({ data: null, error: null })
  builder.insert.mockReturnValue(builder)
  builder.update.mockReturnValue(builder)
  builder.delete.mockReturnValue(builder)
})

describe('slideTemplates handleRequest', () => {
  it('lists templates', async () => {
    // Override select for this specific test to return resolved data
    builder.select.mockResolvedValueOnce({ data: [], error: null })
    const res = await handleRequest(new Request('http://x/slide-templates'))
    expect(res.status).toBe(200)
    expect(fromMock).toHaveBeenCalledWith('slide_templates')
  })

  it('reads one template', async () => {
    builder.maybeSingle.mockResolvedValueOnce({ data: { template_id: 't1' }, error: null })
    const res = await handleRequest(new Request('http://x/slide-templates/t1'))
    expect(res.status).toBe(200)
    expect(builder.eq).toHaveBeenCalledWith('template_id', 't1')
  })

  it('returns 404 when missing', async () => {
    builder.maybeSingle.mockResolvedValueOnce({ data: null, error: null })
    const res = await handleRequest(new Request('http://x/slide-templates/miss'))
    expect(res.status).toBe(404)
  })

  it('creates template', async () => {
    builder.single.mockResolvedValueOnce({ data: { template_id: 'n' }, error: null })
    const res = await handleRequest(new Request('http://x/slide-templates', { method: 'POST', body: '{}' }))
    expect(builder.insert).toHaveBeenCalled()
    expect(res.status).toBe(201)
  })

  it('updates template', async () => {
    builder.maybeSingle.mockResolvedValueOnce({ data: { template_id: 'u' }, error: null })
    const res = await handleRequest(new Request('http://x/slide-templates/u', { method: 'PUT', body: '{}' }))
    expect(builder.update).toHaveBeenCalled()
    expect(res.status).toBe(200)
  })

  it('deletes template', async () => {
    builder.maybeSingle.mockResolvedValueOnce({ data: { template_id: 'd' }, error: null })
    const res = await handleRequest(new Request('http://x/slide-templates/d', { method: 'DELETE' }))
    expect(builder.delete).toHaveBeenCalled()
    expect(res.status).toBe(204)
  })
})

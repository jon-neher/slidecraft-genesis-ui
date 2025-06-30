
import { describe, it, expect, jest, beforeEach, beforeAll } from '@jest/globals'

let handleRequest: typeof import('./slide_templates').handleRequest

const builder = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
  single: jest.fn().mockResolvedValue({ data: null, error: null }),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
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
  builder.select.mockReturnThis()
  builder.eq.mockReturnThis()
  builder.maybeSingle.mockResolvedValue({ data: null, error: null })
  builder.single.mockResolvedValue({ data: null, error: null })
  builder.insert.mockReturnThis()
  builder.update.mockReturnThis()
  builder.delete.mockReturnThis()
})

describe('slideTemplates handleRequest', () => {
  it('lists templates', async () => {
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

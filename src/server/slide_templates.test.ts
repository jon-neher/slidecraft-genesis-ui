import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'

let handleRequest: typeof import('./slide_templates').handleRequest

const builder = {
  select: vi.fn(() => builder),
  eq: vi.fn(() => builder),
  maybeSingle: vi.fn(),
  single: vi.fn(),
  insert: vi.fn(() => builder),
  update: vi.fn(() => builder),
  delete: vi.fn(() => builder),
}
let fromMock: ReturnType<typeof vi.fn>

beforeAll(async () => {
  vi.doMock('@supabase/supabase-js', () => {
    fromMock = vi.fn(() => builder)
    return { createClient: vi.fn(() => ({ from: fromMock })) }
  })
  ;({ handleRequest } = await import('./slide_templates'))
})

beforeEach(() => {
  builder.select.mockReturnThis()
  builder.eq.mockReturnThis()
  builder.maybeSingle.mockResolvedValue({ data: null, error: null })
  builder.single.mockResolvedValue({ data: null, error: null })
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

import { describe, it, expect, jest, beforeEach, beforeAll } from '@jest/globals'

let handleRequest: typeof import('./section_templates').handleRequest

const builder = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn(),
}
let fromMock: ReturnType<typeof jest.fn>
beforeAll(async () => {
  jest.doMock('@supabase/supabase-js', () => {
    fromMock = jest.fn(() => builder)
    return { createClient: jest.fn(() => ({ from: fromMock })) }
  })
  ;({ handleRequest } = await import('./section_templates'))
})

beforeEach(() => {
  builder.select.mockReturnThis()
  builder.eq.mockReturnThis()
  builder.maybeSingle.mockResolvedValue({ data: null, error: null })
})

describe('sectionTemplates handleRequest', () => {
  it('lists mappings', async () => {
    builder.select.mockResolvedValueOnce({ data: [], error: null })
    const res = await handleRequest(new Request('http://x/section-templates'))
    expect(res.status).toBe(200)
    expect(fromMock).toHaveBeenCalledWith('section_templates')
  })

  it('reads one mapping', async () => {
    builder.maybeSingle.mockResolvedValueOnce({ data: { section_id: 'intro' }, error: null })
    const res = await handleRequest(new Request('http://x/section-templates/intro'))
    expect(builder.eq).toHaveBeenCalledWith('section_id', 'intro')
    expect(res.status).toBe(200)
  })

  it('returns 404 when missing', async () => {
    builder.maybeSingle.mockResolvedValueOnce({ data: null, error: null })
    const res = await handleRequest(new Request('http://x/section-templates/miss'))
    expect(res.status).toBe(404)
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleRequest } from './section_templates'

const builder = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  maybeSingle: vi.fn(),
}
// eslint-disable-next-line no-var
var fromMock: ReturnType<typeof vi.fn>
vi.mock('@supabase/supabase-js', () => {
  fromMock = vi.fn(() => builder)
  return { createClient: vi.fn(() => ({ from: fromMock })) }
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

import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest'

let handleRequest: typeof import('./decks_render').handleRequest

const builder = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  maybeSingle: vi.fn(),
}
let fromMock: ReturnType<typeof vi.fn>
const authMock = { getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'u1' } } })) }

beforeAll(async () => {
  vi.doMock('@supabase/supabase-js', () => {
    fromMock = vi.fn(() => builder)
    return { createClient: vi.fn(() => ({ from: fromMock, auth: authMock })) }
  })
  ;({ handleRequest } = await import('./decks_render'))
})

beforeEach(() => {
  builder.select.mockReturnThis()
  builder.eq.mockReturnThis()
  builder.in.mockReturnThis()
  builder.maybeSingle.mockResolvedValue({ data: null, error: null })
})

describe('decks render handler', () => {
  it('returns presentation URLs', async () => {
    builder.maybeSingle.mockResolvedValueOnce({ data: { blueprint_id: 'b1', user_id: 'u1', is_default: false, section_sequence: ['intro'] }, error: null })
    builder.in.mockResolvedValueOnce({ data: [{ section_id: 'intro', default_templates: ['t1'] }], error: null })
    const body = JSON.stringify({ blueprint_id: 'b1' })
    const res = await handleRequest(new Request('http://x/decks/render', { method: 'POST', body }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.presentation_url).toContain('/decks/')
    expect(json.assets_bundle_url).toContain('/decks/')
  })

  it('applies slide overrides', async () => {
    builder.maybeSingle.mockResolvedValueOnce({ data: { blueprint_id: 'b1', user_id: 'u1', is_default: false, section_sequence: ['solution'] }, error: null })
    builder.in.mockResolvedValueOnce({ data: [{ section_id: 'solution', default_templates: ['t1'] }], error: null })
    const body = JSON.stringify({ blueprint_id: 'b1', overrides: { solution: ['custom'] } })
    const res = await handleRequest(new Request('http://x/decks/render', { method: 'POST', body }))
    const json = await res.json()
    expect(json.html).toContain('custom')
    expect(fromMock).toHaveBeenCalledWith('section_templates')
  })

  it('returns 404 when blueprint missing', async () => {
    builder.maybeSingle.mockResolvedValueOnce({ data: null, error: null })
    const body = JSON.stringify({ blueprint_id: 'missing' })
    const res = await handleRequest(new Request('http://x/decks/render', { method: 'POST', body }))
    expect(res.status).toBe(404)
  })
})

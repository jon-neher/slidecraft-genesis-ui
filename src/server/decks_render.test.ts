import { describe, it, expect, jest, beforeAll, beforeEach } from '@jest/globals'

let handleRequest: typeof import('./decks_render').handleRequest

const builder = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  maybeSingle: jest.fn(),
}
let fromMock: ReturnType<typeof jest.fn>
const authMock = { getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'u1' } } })) }

beforeAll(async () => {
  jest.doMock('@supabase/supabase-js', () => {
    fromMock = jest.fn(() => builder)
    return { createClient: jest.fn(() => ({ from: fromMock, auth: authMock })) }
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
    builder.maybeSingle.mockResolvedValueOnce({
      data: { blueprint_id: 'b1', user_id: 'u1', is_default: false, section_sequence: ['intro'], theme: 'brand' },
      error: null,
    })
    builder.maybeSingle.mockResolvedValueOnce({ data: { css: '.brand{}' }, error: null })
    builder.in.mockResolvedValueOnce({ data: [{ section_id: 'intro', default_templates: ['t1'] }], error: null })
    const body = JSON.stringify({ blueprint_id: 'b1' })
    const res = await handleRequest(new Request('http://x/decks/render', { method: 'POST', body }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.presentation_url).toContain('/decks/')
    expect(json.assets_bundle_url).toContain('/decks/')
    expect(fromMock).toHaveBeenCalledWith('themes')
  })

  it('applies slide overrides', async () => {
    builder.maybeSingle.mockResolvedValueOnce({
      data: { blueprint_id: 'b1', user_id: 'u1', is_default: false, section_sequence: ['solution'], theme: 'brand' },
      error: null,
    })
    builder.maybeSingle.mockResolvedValueOnce({ data: { css: '.brand{}' }, error: null })
    builder.in.mockResolvedValueOnce({ data: [{ section_id: 'solution', default_templates: ['t1'] }], error: null })
    const body = JSON.stringify({ blueprint_id: 'b1', overrides: { solution: ['custom'] } })
    const res = await handleRequest(new Request('http://x/decks/render', { method: 'POST', body }))
    const json = await res.json()
    expect(json.html).toContain('custom')
    expect(fromMock).toHaveBeenCalledWith('section_templates')
    expect(fromMock).toHaveBeenCalledWith('themes')
  })

  it('returns 404 when blueprint missing', async () => {
    builder.maybeSingle.mockResolvedValueOnce({ data: null, error: null })
    const body = JSON.stringify({ blueprint_id: 'missing' })
    const res = await handleRequest(new Request('http://x/decks/render', { method: 'POST', body }))
    expect(res.status).toBe(404)
  })
})

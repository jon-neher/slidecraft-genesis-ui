import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postNote } from './post_note';

const fromMock = vi.fn();
const selectMock = vi.fn();
const updateMock = vi.fn();
const eqMock = vi.fn();

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: () => ({
      select: selectMock,
      update: updateMock,
    }),
  })),
}));

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  selectMock.mockReset();
  updateMock.mockReset();
});

describe('postNote', () => {
  it('posts note with valid token', async () => {
    selectMock.mockReturnValue({
      eq: () => ({ maybeSingle: () => Promise.resolve({ data: {
        access_token: 'tok', refresh_token: 'ref', expires_at: new Date(Date.now()+3600e3).toISOString() }, error: null }) }),
    });

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'note1' }),
    });

    const result = await postNote({ portal_id: 'p1', hubspot_object_id: '123', app_record_url: 'https://app.example.com/a' });

    expect(result).toEqual({ noteId: 'note1' });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.hubapi.com/crm/v3/objects/notes',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Idempotency-Key': expect.any(String) }),
      })
    );
  });

  it('refreshes expired token', async () => {
    const expired = new Date(Date.now() - 1000).toISOString();
    selectMock.mockReturnValue({
      eq: () => ({ maybeSingle: () => Promise.resolve({ data: {
        access_token: 'old', refresh_token: 'ref', expires_at: expired }, error: null }) }),
    });

    updateMock.mockReturnValue({ eq: () => Promise.resolve({}) });

    fetchMock
      .mockResolvedValueOnce({ ok: true, json: async () => ({ access_token: 'new', expires_in: 3600 }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'note2' }) });

    const result = await postNote({ portal_id: 'p1', hubspot_object_id: '123', app_record_url: 'https://app.example.com/b' });

    expect(updateMock).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ noteId: 'note2' });
  });
});

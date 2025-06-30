import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { hubspotOAuthCallback } from './supabase/functions/hubspot_oauth_callback';

let selectResult: { data: { user_id: string } | null; error: null };
const upsertMock = jest.fn().mockResolvedValue({ error: null });
const deleteMock = jest.fn().mockResolvedValue({ error: null });

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: (table: string) => {
      if (table === 'hubspot_tokens') {
        return { upsert: upsertMock };
      }
      if (table === 'hubspot_oauth_states') {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: jest.fn(async () => selectResult),
            }),
          }),
          delete: () => ({ eq: () => deleteMock() }),
        };
      }
      return {} as unknown;
    },
  })),
}));

const fetchMock = jest.fn();
// @ts-expect-error assigning mock fetch
global.fetch = fetchMock;

describe('hubspotOAuthCallback', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    selectResult = { data: { user_id: 'me' }, error: null };
    upsertMock.mockClear();
    deleteMock.mockClear();
  });

  it('redirects on successful token exchange', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'a', refresh_token: 'b', expires_in: 10, scope: 'contacts' }),
    } as Response);

    const res = await hubspotOAuthCallback(new Request('https://example.com/cb?code=123&state=me'));

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.hubapi.com/oauth/v1/token',
      expect.objectContaining({ method: 'POST' })
    );
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe('/dashboard');
    expect(upsertMock).toHaveBeenCalledWith(
      expect.objectContaining({ portal_id: 'me' })
    );
    expect(deleteMock).toHaveBeenCalled();
  });

  it('returns 400 if code missing', async () => {
    const res = await hubspotOAuthCallback(new Request('https://example.com/cb'));
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid state', async () => {
    selectResult = { data: null, error: null };
    const res = await hubspotOAuthCallback(new Request('https://example.com/cb?code=123&state=bad'));
    expect(res.status).toBe(400);
  });

  it('renders error when token exchange fails', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      text: async () => 'fail',
    } as Response);

    const res = await hubspotOAuthCallback(new Request('https://example.com/cb?code=123&state=me'));
    expect(res.status).toBe(500);
    const body = await res.text();
    expect(body).toContain('HubSpot token exchange failed');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hubspotOAuthCallback } from './supabase/functions/hubspot_oauth_callback';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: () => ({
      upsert: vi.fn().mockResolvedValue({ error: null }),
    }),
  })),
}));

const fetchMock = vi.fn();
// @ts-expect-error assigning mock fetch
global.fetch = fetchMock;

describe('hubspotOAuthCallback', () => {
  beforeEach(() => {
    fetchMock.mockReset();
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
  });

  it('returns 400 if code missing', async () => {
    const res = await hubspotOAuthCallback(new Request('https://example.com/cb'));
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

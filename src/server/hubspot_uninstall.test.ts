import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

vi.mock('@clerk/express', () => ({
  requireAuth: () => (req: express.Request & { auth?: { userId: string } }, _res: express.Response, next: express.NextFunction) => {
    req.auth = { userId: 'user_123' };
    next();
  },
}));

const fromMock = vi.fn();
const deleteMock1 = vi.fn(() => ({ eq: vi.fn().mockResolvedValue({}) }));
const deleteMock2 = vi.fn(() => ({ eq: vi.fn().mockResolvedValue({}) }));

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: fromMock,
  })),
}));

let hubspotUninstallHandler: typeof import('./hubspot_uninstall').hubspotUninstallHandler;

beforeEach(async () => {
  fromMock.mockClear();
  deleteMock1.mockClear();
  deleteMock2.mockClear();
  fromMock
    .mockImplementationOnce(() => ({ delete: deleteMock1 }))
    .mockImplementationOnce(() => ({ delete: deleteMock2 }));
  vi.resetModules();
  ({ hubspotUninstallHandler } = await import('./hubspot_uninstall'));
});

describe('hubspotUninstallHandler', () => {
  it('purges tokens and contacts for authed user', async () => {
    const app = express();
    app.post('/', ...hubspotUninstallHandler);

    const res = await request(app).post('/');

    expect(res.status).toBe(204);
    expect(fromMock).toHaveBeenNthCalledWith(1, 'hubspot_tokens');
    expect(fromMock).toHaveBeenNthCalledWith(2, 'hubspot_contacts_cache');
  });
});

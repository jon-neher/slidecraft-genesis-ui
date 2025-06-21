import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { createHmac } from 'crypto';

vi.mock('@clerk/express', () => ({
  requireAuth: () => (req: express.Request & { auth?: { userId: string } }, _res: express.Response, next: express.NextFunction) => {
    req.auth = { userId: 'user_123' };
    next();
  },
}));

const insertMock = vi.fn().mockResolvedValue({});

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: () => ({ insert: insertMock }),
  })),
}));

let hubspotWebhookHandler: typeof import('./hubspot_webhook').hubspotWebhookHandler;
let jsonWithRaw: typeof import('./hubspot_webhook').jsonWithRaw;

const secret = 'test_secret';

beforeEach(async () => {
  insertMock.mockClear();
  process.env.HUBSPOT_APP_SECRET = secret;
  vi.resetModules();
  ({ hubspotWebhookHandler, jsonWithRaw } = await import('./hubspot_webhook'));
});

describe('hubspotWebhookHandler', () => {
  it('stores payload with valid signature', async () => {
    const payload = [{ id: 1 }];
    const sig = createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('base64');

    const app = express();
    app.use(jsonWithRaw);
    app.post('/', ...hubspotWebhookHandler);

    const res = await request(app)
      .post('/')
      .set('X-HubSpot-Signature-V3', sig)
      .send(payload);

    expect(res.status).toBe(204);
    expect(insertMock).toHaveBeenCalledWith({ portal_id: 'user_123', raw: payload });
  });

  it('returns 401 for invalid signature', async () => {
    const payload = [{ id: 1 }];
    const app = express();
    app.use(jsonWithRaw);
    app.post('/', ...hubspotWebhookHandler);

    const res = await request(app)
      .post('/')
      .set('X-HubSpot-Signature-V3', 'bad')
      .send(payload);

    expect(res.status).toBe(401);
    expect(insertMock).not.toHaveBeenCalled();
  });
});

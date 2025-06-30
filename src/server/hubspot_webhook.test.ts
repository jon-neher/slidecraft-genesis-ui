
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { createHmac } from 'crypto';

jest.mock('@clerk/express', () => ({
  requireAuth: () => (req: express.Request & { auth?: { userId: string } }, _res: express.Response, next: express.NextFunction) => {
    req.auth = { userId: 'user_123' };
    next();
  },
}));

const insertMock = jest.fn().mockResolvedValue({});
const deleteTokensMock = jest.fn().mockResolvedValue({});
const deleteCacheMock = jest.fn().mockResolvedValue({});
const deleteCursorsMock = jest.fn().mockResolvedValue({});

jest.doMock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: (table: string) => ({
      insert: table === 'hubspot_events_raw' ? insertMock : undefined,
      delete: () => ({
        eq: (field: string, val: string) => {
          if (table === 'hubspot_tokens') return deleteTokensMock(field, val);
          if (table === 'hubspot_contacts_cache') return deleteCacheMock(field, val);
          if (table === 'hubspot_sync_cursors') return deleteCursorsMock(field, val);
          return undefined;
        },
      }),
    }),
  })),
}));

let hubspotWebhookHandler: typeof import('./hubspot_webhook').hubspotWebhookHandler;
let jsonWithRaw: typeof import('./hubspot_webhook').jsonWithRaw;

const secret = 'test_secret';

beforeEach(async () => {
  insertMock.mockClear();
  deleteTokensMock.mockClear();
  deleteCacheMock.mockClear();
  deleteCursorsMock.mockClear();
  process.env.HUBSPOT_APP_SECRET = secret;
  jest.resetModules();
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

  it('purges data on uninstall event', async () => {
    const payload = [{ subscriptionType: 'app.uninstalled' }];
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
    expect(deleteTokensMock).toHaveBeenCalledWith('portal_id', 'user_123');
    expect(deleteCacheMock).toHaveBeenCalledWith('portal_id', 'user_123');
    expect(deleteCursorsMock).toHaveBeenCalledWith('portal_id', 'user_123');
  });
});

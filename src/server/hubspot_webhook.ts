import express, { RequestHandler, Request, Response } from 'express';
import { requireAuth } from '@clerk/express';
import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'crypto';

const HUBSPOT_SECRET = process.env.HUBSPOT_APP_SECRET || 'test_secret';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export interface AuthedRequest extends Request {
  rawBody?: string;
  auth: { userId: string };
}

// capture raw body for signature validation
export const jsonWithRaw = express.json({
  verify: (req, _res, buf) => {
    (req as AuthedRequest).rawBody = buf.toString();
  },
});

export const hubspotWebhookHandler: RequestHandler[] = [
  requireAuth(),
  async (req: Request, res: Response) => {
    const authedReq = req as AuthedRequest;
    const signature = req.header('x-hubspot-signature-v3');
    const raw = authedReq.rawBody || '';
    const expected = createHmac('sha256', HUBSPOT_SECRET)
      .update(raw)
      .digest('base64');

    if (signature !== expected) {
      return res.sendStatus(401);
    }

    const portalId = authedReq.auth.userId;
    const payload = req.body;

    // insert asynchronously
    supabase
      .from('hubspot_events_raw')
      .insert({ portal_id: portalId, raw: payload })
      .catch((err) => console.error('insert error', err));

    return res.status(204).end();
  },
];

export default hubspotWebhookHandler;

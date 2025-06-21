import express, { RequestHandler, Request, Response } from 'express';
import { requireAuth } from '@clerk/express';
import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'crypto';
import {
  HUBSPOT_APP_SECRET as HUBSPOT_SECRET,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from './config';

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

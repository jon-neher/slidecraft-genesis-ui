
import express, { RequestHandler, Request, Response, json } from 'express';
import { requireAuth } from '@clerk/express';
import { getSupabaseClient } from './supabaseClient';
import { createHmac } from 'crypto';
import {
  HUBSPOT_APP_SECRET as HUBSPOT_SECRET,
} from './config';
import { devLog } from '../lib/dev-log';

const supabase = getSupabaseClient();

export interface AuthedRequest extends Request {
  rawBody?: string;
  auth: { userId: string };
}

// capture raw body for signature validation
export const jsonWithRaw = json({
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
    
    // Enhanced signature validation
    if (!signature) {
      console.warn('Missing HubSpot signature');
      return res.sendStatus(401);
    }
    
    const expected = createHmac('sha256', HUBSPOT_SECRET)
      .update(raw)
      .digest('base64');

    if (signature !== expected) {
      console.warn('Invalid HubSpot signature');
      return res.sendStatus(401);
    }

    const portalId = authedReq.auth.userId;
    const payload = req.body;

    // Input validation
    if (!payload || (Array.isArray(payload) && payload.length === 0)) {
      console.warn('Empty webhook payload');
      return res.sendStatus(400);
    }

    const events = Array.isArray(payload) ? payload : [payload];
    const uninstall = events.some((e: Record<string, unknown>) => e.subscriptionType === 'app.uninstalled');

    if (uninstall) {
      devLog(`Processing uninstall for portal ${portalId}`);
      // Handle cleanup operations with proper async/await and error logging
      try {
        const { error: tokensError } = await supabase
          .from('hubspot_tokens')
          .delete()
          .eq('portal_id', portalId);
        
        if (tokensError) {
          console.error('uninstall delete tokens error', tokensError);
        }
      } catch (err) {
        console.error('uninstall delete tokens error', err);
      }

      try {
        const { error: cacheError } = await supabase
          .from('hubspot_contacts_cache')
          .delete()
          .eq('portal_id', portalId);
        
        if (cacheError) {
          console.error('uninstall delete cache error', cacheError);
        }
      } catch (err) {
        console.error('uninstall delete cache error', err);
      }

      try {
        const { error: cursorsError } = await supabase
          .from('hubspot_sync_cursors')
          .delete()
          .eq('portal_id', portalId);
        
        if (cursorsError) {
          console.error('uninstall delete cursors error', cursorsError);
        }
      } catch (err) {
        console.error('uninstall delete cursors error', err);
      }
    }

    // insert asynchronously with proper error handling
    try {
      const { error: insertError } = await supabase
        .from('hubspot_events_raw')
        .insert({ portal_id: portalId, raw: payload });
      
      if (insertError) {
        console.error('insert error', insertError);
      }
    } catch (err) {
      console.error('insert error', err);
    }

    return res.status(204).end();
  },
];

export default hubspotWebhookHandler;

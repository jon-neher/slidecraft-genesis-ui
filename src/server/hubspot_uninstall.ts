import type { Request } from "express";
import { RequestHandler } from 'express';
import { requireAuth } from '@clerk/express';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './config';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface AuthedRequest extends Request {
  auth: { userId: string };
}

export const hubspotUninstallHandler: RequestHandler[] = [
  requireAuth(),
  async (req, res) => {
    const portalId = (req as AuthedRequest).auth.userId;
    await supabase.from('hubspot_tokens').delete().eq('portal_id', portalId);
    await supabase.from('hubspot_contacts_cache').delete().eq('portal_id', portalId);
    res.status(204).end();
  },
];

export default hubspotUninstallHandler;

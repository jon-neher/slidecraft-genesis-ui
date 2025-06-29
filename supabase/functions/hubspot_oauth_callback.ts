import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../src/integrations/supabase/types';
import {
  HUBSPOT_CLIENT_ID,
  HUBSPOT_CLIENT_SECRET,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from '../../src/server/config.ts';

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function htmlError(msg: string) {
  return `<html><body><h1>OAuth Error</h1><p>${msg}</p></body></html>`;
}

export async function hubspotOAuthCallback(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state') ?? '';

  if (!code) {
    return new Response(htmlError('Missing code parameter'), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  try {
    const {
      data: stateData,
      error: stateError,
    } = await supabase
      .from('hubspot_oauth_states')
      .select('user_id')
      .eq('state', state)
      .maybeSingle();

    if (stateError || !stateData) {
      return new Response(htmlError('Invalid state parameter'), {
        status: 400,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const portalId = stateData.user_id;

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: HUBSPOT_CLIENT_ID,
      client_secret: HUBSPOT_CLIENT_SECRET,
      code,
    });

    const tokenRes = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      throw new Error(`HubSpot token exchange failed: ${text}`);
    }

    const token = await tokenRes.json() as {
      access_token: string;
      refresh_token: string;
      expires_in?: number;
      scope?: string;
    };

    const expiresAt = new Date(Date.now() + (token.expires_in ?? 0) * 1000).toISOString();
    const scopeArray = token.scope ? token.scope.split(' ') : [];

    const { error } = await supabase.from('hubspot_tokens').upsert({
      portal_id: portalId,
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expires_at: expiresAt,
      scope: scopeArray,
    });

    await supabase.from('hubspot_oauth_states').delete().eq('state', state);

    if (error) {
      throw new Error(error.message);
    }

    return new Response(null, {
      status: 302,
      headers: { Location: '/dashboard' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(htmlError(message), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

// When running in a Deno environment (Supabase Edge Functions), start the server.
if (typeof Deno !== 'undefined') {
  const { serve } = await import('https://deno.land/std@0.205.0/http/server.ts');
  serve(hubspotOAuthCallback);
}


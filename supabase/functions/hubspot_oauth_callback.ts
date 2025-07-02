
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const HUBSPOT_CLIENT_ID = Deno.env.get('HUBSPOT_CLIENT_ID') ?? '';
const HUBSPOT_CLIENT_SECRET = Deno.env.get('HUBSPOT_CLIENT_SECRET') ?? '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
};

function htmlError(msg: string) {
  return `<html><body><h1>OAuth Error</h1><p>${msg}</p></body></html>`;
}

export async function hubspotOAuthCallback(request: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle both GET (from HubSpot redirect) and POST (from frontend)
  let code: string | null = null;
  let state: string | null = null;

  if (request.method === 'GET') {
    const { searchParams } = new URL(request.url);
    code = searchParams.get('code');
    state = searchParams.get('state');
    
    // Redirect to frontend callback page
    const callbackUrl = new URL('/hubspot/callback', 'https://igspkppkbqbbxffhdqlq.lovable.app');
    callbackUrl.searchParams.set('code', code || '');
    callbackUrl.searchParams.set('state', state || '');
    
    return new Response(null, {
      status: 302,
      headers: { ...corsHeaders, Location: callbackUrl.toString() },
    });
  }

  // Handle POST from frontend
  if (request.method === 'POST') {
    const body = await request.json();
    code = body.code;
    state = body.state;
  }

  if (!code || !state) {
    return new Response(JSON.stringify({ error: 'Missing code or state parameter' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
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
      console.error('HubSpot token exchange failed:', text);
      throw new Error('HubSpot token exchange failed');
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

    // Enhanced cleanup - remove expired states and current state
    await supabase.from('hubspot_oauth_states').delete().eq('state', state);
    await supabase.rpc('cleanup_expired_oauth_states');

    // Log security event
    await supabase.from('security_events').insert({
      user_id: portalId,
      event_type: 'oauth_token_exchange',
      event_data: { scope: scopeArray },
    });

    if (error) {
      throw new Error(error.message);
    }

    // Return success response for POST requests (from frontend)
    if (request.method === 'POST') {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Redirect for GET requests (shouldn't reach here due to earlier redirect)
    return new Response(null, {
      status: 302,
      headers: { ...corsHeaders, Location: '/dashboard' },
    });
  } catch (err) {
    console.error('OAuth callback error:', err);
    return new Response(htmlError('HubSpot token exchange failed'), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
    });
  }
}

Deno.serve(hubspotOAuthCallback);

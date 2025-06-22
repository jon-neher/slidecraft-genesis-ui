import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/integrations/supabase/types';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from '../src/server/config.ts';

export async function hubspotUninstall(request: Request): Promise<Response> {
  const auth = request.headers.get('Authorization') || '';
  const sb = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: auth } },
  });
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  await sb.from('hubspot_tokens').delete().eq('portal_id', user.id);
  await sb.from('hubspot_contacts_cache').delete().eq('portal_id', user.id);

  return new Response(null, { status: 204 });
}

if (typeof Deno !== 'undefined') {
  const { serve } = await import('https://deno.land/std@0.205.0/http/server.ts');
  serve(hubspotUninstall);
}


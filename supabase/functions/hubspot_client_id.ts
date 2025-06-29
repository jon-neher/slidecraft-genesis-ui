// The client id is read from Supabase Edge Function secrets at runtime

const HUBSPOT_CLIENT_ID = Deno.env.get('HUBSPOT_CLIENT_ID') || ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve((req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  return new Response(JSON.stringify({ client_id: HUBSPOT_CLIENT_ID }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})

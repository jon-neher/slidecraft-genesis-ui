
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { portal_id } = await req.json()

    if (!portal_id) {
      throw new Error('Portal ID is required')
    }

    // Get the stored token
    const { data: tokenData, error: tokenError } = await supabase
      .from('hubspot_tokens')
      .select('access_token, refresh_token, expires_at')
      .eq('portal_id', portal_id)
      .maybeSingle()

    if (tokenError) {
      throw tokenError
    }

    if (!tokenData) {
      throw new Error('No HubSpot token found for this portal')
    }

    // Check if token needs refresh
    const expiresAt = new Date(tokenData.expires_at)
    const needsRefresh = expiresAt.getTime() <= Date.now() + 300000 // 5 minutes buffer

    if (needsRefresh && tokenData.refresh_token) {
      // Refresh the token
      const refreshResponse = await fetch('https://api.hubapi.com/oauth/v1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: Deno.env.get('HUBSPOT_CLIENT_ID') ?? '',
          client_secret: Deno.env.get('HUBSPOT_CLIENT_SECRET') ?? '',
          refresh_token: tokenData.refresh_token,
        }),
      })

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json()
        
        // Update the stored token
        const { error: updateError } = await supabase
          .from('hubspot_tokens')
          .update({
            access_token: refreshData.access_token,
            refresh_token: refreshData.refresh_token || tokenData.refresh_token,
            expires_at: new Date(Date.now() + refreshData.expires_in * 1000).toISOString(),
          })
          .eq('portal_id', portal_id)

        if (updateError) {
          console.error('Failed to update refreshed token:', updateError)
        } else {
          return new Response(
            JSON.stringify({ access_token: refreshData.access_token }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
    }

    return new Response(
      JSON.stringify({ access_token: tokenData.access_token }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error getting HubSpot token:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

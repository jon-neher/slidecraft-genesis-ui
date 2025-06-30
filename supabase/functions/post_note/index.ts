
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { portal_id, hubspot_object_id, app_record_url, note_body } = await req.json()

    if (!portal_id || !hubspot_object_id || !app_record_url) {
      throw new Error('Missing required parameters')
    }

    // Get access token
    const { data: tokenData, error: tokenError } = await supabase
      .from('hubspot_tokens')
      .select('access_token')
      .eq('portal_id', portal_id)
      .maybeSingle()

    if (tokenError || !tokenData) {
      throw new Error('No valid HubSpot token found')
    }

    // Create note in HubSpot
    const notePayload = {
      properties: {
        hs_note_body: note_body || `Record updated via ${app_record_url}`,
        hs_timestamp: new Date().toISOString(),
      },
      associations: [
        {
          to: { id: hubspot_object_id },
          types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }]
        }
      ]
    }

    const response = await fetch('https://api.hubapi.com/crm/v3/objects/notes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notePayload),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`HubSpot API error: ${errorData.message || response.statusText}`)
    }

    const noteData = await response.json()

    return new Response(
      JSON.stringify({ noteId: noteData.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error posting note to HubSpot:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

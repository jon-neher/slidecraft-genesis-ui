import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

type ClerkEvent = {
  type: string
  data: {
    id: string
    email_addresses: Array<{ email_address: string }>
    first_name?: string
    last_name?: string
    image_url?: string
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload: ClerkEvent = await req.json()
    if (!payload || !payload.type || !payload.data || !payload.data.id) {
      throw new Error('Invalid payload')
    }

    if (payload.type !== 'user.created' && payload.type !== 'user.updated') {
      return new Response('Event ignored', { status: 200, headers: corsHeaders })
    }

    const email = payload.data.email_addresses?.[0]?.email_address || ''
    const firstName = payload.data.first_name || ''
    const lastName = payload.data.last_name || ''
    const imageUrl = payload.data.image_url || ''

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: payload.data.id,
        email,
        first_name: firstName,
        last_name: lastName,
        image_url: imageUrl,
      })

    if (error) {
      throw error
    }

    return new Response('OK', { status: 200, headers: corsHeaders })
  } catch (err) {
    console.error('clerk-webhook error:', err)
    return new Response('Bad Request', { status: 400, headers: corsHeaders })
  }
})

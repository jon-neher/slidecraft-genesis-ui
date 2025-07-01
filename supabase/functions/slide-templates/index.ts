
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export async function handleRequest(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const segments = url.pathname.replace(/^\/+|\/+$/g, '').split('/')

  if (segments[0] !== 'slide-templates') {
    return new Response('Not found', { 
      status: 404,
      headers: corsHeaders
    })
  }

  try {
    if (req.method === 'GET') {
      if (segments.length === 1) {
        const { data, error } = await supabase
          .from('slide_templates')
          .select('*')
        if (error) throw error
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      if (segments.length === 2) {
        const id = segments[1]
        const { data, error } = await supabase
          .from('slide_templates')
          .select('*')
          .eq('template_id', id)
          .maybeSingle()
        if (error) throw error
        if (!data) return new Response('Not Found', { 
          status: 404,
          headers: corsHeaders
        })
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    }

    if (req.method === 'POST' && segments.length === 1) {
      const body = await req.json()
      const { data, error } = await supabase
        .from('slide_templates')
        .insert(body)
        .select()
        .single()
      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201
      })
    }

    if (req.method === 'PUT' && segments.length === 2) {
      const id = segments[1]
      const body = await req.json()
      const { data, error } = await supabase
        .from('slide_templates')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('template_id', id)
        .select()
        .maybeSingle()
      if (error) throw error
      if (!data) return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders
      })
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (req.method === 'DELETE' && segments.length === 2) {
      const id = segments[1]
      const { data, error } = await supabase
        .from('slide_templates')
        .delete()
        .eq('template_id', id)
        .select('template_id')
        .maybeSingle()
      if (error) throw error
      if (!data) return new Response('Not Found', { 
        status: 404,
        headers: corsHeaders
      })
      return new Response(null, { 
        status: 204,
        headers: corsHeaders
      })
    }

    return new Response('Not found', { 
      status: 404,
      headers: corsHeaders
    })
  } catch (err) {
    console.error('Slide templates handler error:', err)
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders
    })
  }
}

Deno.serve(handleRequest)

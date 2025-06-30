import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const segments = url.pathname.replace(/^\/+|\/+$/g, '').split('/')

  if (segments[0] !== 'section-templates') {
    return new Response('Not found', { status: 404 })
  }

  try {
    if (req.method === 'GET') {
      if (segments.length === 1) {
        const { data, error } = await supabase
          .from('section_templates')
          .select('*')
        if (error) throw error
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
      if (segments.length === 2) {
        const id = segments[1]
        const { data, error } = await supabase
          .from('section_templates')
          .select('*')
          .eq('section_id', id)
          .maybeSingle()
        if (error) throw error
        if (!data) return new Response('Not Found', { status: 404 })
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }
    return new Response('Not found', { status: 404 })
  } catch (err) {
    console.error('Section templates handler error:', err)
    return new Response('Internal server error', { status: 500 })
  }
}

Deno.serve(handleRequest)

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../integrations/supabase/types'
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './config'

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const segments = url.pathname.replace(/^\/+|\/+$/g, '').split('/')

  if (segments[0] !== 'slide-templates') {
    return new Response('Not found', { status: 404 })
  }

  try {
    if (req.method === 'GET') {
      if (segments.length === 1) {
        const { data, error } = await supabase
          .from('slide_templates')
          .select('*')
        if (error) throw error
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
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
        if (!data) return new Response('Not Found', { status: 404 })
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
        status: 201,
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
      if (!data) return new Response('Not Found', { status: 404 })
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
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
      if (!data) return new Response('Not Found', { status: 404 })
      return new Response(null, { status: 204 })
    }

    return new Response('Not found', { status: 404 })
  } catch (err) {
    console.error('Slide templates handler error:', err)
    return new Response('Internal server error', { status: 500 })
  }
}

export default { handleRequest }

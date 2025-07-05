
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function getSupabaseClient(token?: string) {
  return createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    token ? { accessToken: () => Promise.resolve(token) } : {}
  )
}

function parseBlueprintData(data: Record<string, unknown> | null | undefined) {
  const {
    goal = '',
    audience = '',
    section_sequence = [],
    theme = '',
    slide_library = [],
    ...extra_metadata
  } = (data || {}) as Record<string, unknown>

  return {
    goal: goal as string,
    audience: audience as string,
    section_sequence: section_sequence as string[],
    theme: theme as string,
    slide_library: slide_library as string[],
    extra_metadata: extra_metadata as Record<string, unknown>,
    blueprint: data as Record<string, unknown>
  }
}

function rowToResponse(row: Record<string, any>) {
  const {
    blueprint_id,
    user_id,
    name,
    is_default,
    created_at,
    updated_at,
    goal,
    audience,
    section_sequence,
    theme,
    slide_library,
    extra_metadata
  } = row

  return {
    blueprint_id,
    user_id,
    name,
    is_default,
    created_at,
    updated_at,
    data: {
      goal,
      audience,
      section_sequence,
      theme,
      slide_library,
      ...(extra_metadata || {})
    }
  }
}

export async function handleRequest(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const { method, url } = req
  const parsed = new URL(url)
  const auth = req.headers.get('Authorization') || ''
  const token = auth.replace(/^Bearer\s+/i, '')

  function getSub(h: string): string | null {
    try {
      const payload = JSON.parse(atob(h.split('.')[1]))
      return payload.sub ?? null
    } catch {
      return null
    }
  }

  const userId = getSub(token)
  if (!userId) {
    return new Response('Unauthorized', {
      status: 401,
      headers: corsHeaders,
    })
  }

  const client = getSupabaseClient(token)

  const path = parsed.pathname.replace(/\/+/, '/').replace(/^\/+|\/+$/g, '')
  const segments = path.split('/')

  try {
    if (segments[0] !== 'blueprints') {
      return new Response('Not found', { 
        status: 404,
        headers: corsHeaders
      })
    }

    if (segments.length === 1) {
      if (method === 'GET') {
        const includeDefaults = parsed.searchParams.get('includeDefaults') === 'true'
        const query = client.from('blueprints').select('*')
        if (includeDefaults) {
          query.or(`is_default.eq.true,user_id.eq.${userId}`)
        } else {
          query.eq('user_id', userId)
        }
        const themeFilter = parsed.searchParams.get('theme')
        if (themeFilter) {
          query.eq('theme', themeFilter)
        }
        const { data, error } = await query
        if (error) throw error
        return new Response(JSON.stringify(data.map(rowToResponse)), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      if (method === 'POST') {
        const body = await req.json()
        const parsedData = parseBlueprintData(body.data)
        const { data, error } = await client
          .from('blueprints')
          .insert({
            user_id: userId,
            name: body.name,
            blueprint: parsedData.blueprint,
            goal: parsedData.goal,
            audience: parsedData.audience,
            section_sequence: parsedData.section_sequence,
            theme: parsedData.theme,
            slide_library: parsedData.slide_library,
            extra_metadata: parsedData.extra_metadata
          })
          .select()
          .single()
        if (error) throw error
        return new Response(JSON.stringify(rowToResponse(data)), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201
        })
      }
    }

    if (segments.length >= 2) {
      const id = segments[1]
      if (segments.length === 3 && segments[2] === 'clone' && method === 'POST') {
        const { data: orig, error } = await client
          .from('blueprints')
          .select('*')
          .eq('blueprint_id', id)
          .single()
        if (error) return new Response('Not Found', { 
          status: 404,
          headers: corsHeaders
        })
        if (!orig.is_default) return new Response('Not Found', { 
          status: 404,
          headers: corsHeaders
        })
        const { data, error: insertError } = await client
          .from('blueprints')
          .insert({
            user_id: userId,
            name: orig.name,
            blueprint: orig.blueprint,
            goal: orig.goal,
            audience: orig.audience,
            section_sequence: orig.section_sequence,
            theme: orig.theme,
            slide_library: orig.slide_library,
            extra_metadata: orig.extra_metadata
          })
          .select()
          .single()
        if (insertError) throw insertError
        return new Response(JSON.stringify(rowToResponse(data)), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201
        })
      }

      if (segments.length === 2) {
        if (method === 'GET') {
          const { data, error } = await client
            .from('blueprints')
            .select('*')
            .eq('blueprint_id', id)
            .maybeSingle()
          if (error || !data) return new Response('Not Found', { 
            status: 404,
            headers: corsHeaders
          })
          if (!data.is_default && data.user_id !== userId) {
            return new Response('Not Found', { 
              status: 404,
              headers: corsHeaders
            })
          }
          return new Response(JSON.stringify(rowToResponse(data)), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        if (method === 'PUT') {
          const { data: existing, error } = await client
            .from('blueprints')
            .select('is_default')
            .eq('blueprint_id', id)
            .maybeSingle()
          if (error || !existing) return new Response('Not Found', { 
            status: 404,
            headers: corsHeaders
          })
          if (existing.is_default) return new Response('Forbidden', { 
            status: 403,
            headers: corsHeaders
          })
          const body = await req.json()
          const parsedData = parseBlueprintData(body.data)
          const { error: upError } = await client
            .from('blueprints')
            .update({
              name: body.name,
              blueprint: parsedData.blueprint,
              goal: parsedData.goal,
              audience: parsedData.audience,
              section_sequence: parsedData.section_sequence,
              theme: parsedData.theme,
              slide_library: parsedData.slide_library,
              extra_metadata: parsedData.extra_metadata,
              updated_at: new Date().toISOString()
            })
            .eq('blueprint_id', id)
            .eq('user_id', userId)
          if (upError) throw upError
          return new Response(null, { 
            status: 200,
            headers: corsHeaders
          })
        }

        if (method === 'DELETE') {
          const { data: existing, error } = await client
            .from('blueprints')
            .select('is_default, user_id')
            .eq('blueprint_id', id)
            .maybeSingle()
          if (error || !existing) return new Response('Not Found', { 
            status: 404,
            headers: corsHeaders
          })
          if (existing.is_default) return new Response('Forbidden', { 
            status: 403,
            headers: corsHeaders
          })
          if (existing.user_id !== userId) return new Response('Not Found', {
            status: 404,
            headers: corsHeaders
          })
          const { error: delError } = await client
            .from('blueprints')
            .delete()
            .eq('blueprint_id', id)
          if (delError) throw delError
          return new Response(null, { 
            status: 204,
            headers: corsHeaders
          })
        }
      }
    }

    return new Response('Not found', { 
      status: 404,
      headers: corsHeaders
    })
  } catch (err) {
    console.error('Blueprint handler error:', err)
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders
    })
  }
}

Deno.serve(handleRequest)

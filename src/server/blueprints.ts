import { createClient } from '@supabase/supabase-js'
import type { Database } from '../integrations/supabase/types'
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './config'

// Map incoming JSON data to table columns and extras
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
    extra_metadata,
    blueprint: data || {},
  }
}

function rowToResponse(
  row: Database['public']['Tables']['blueprints']['Row'],
) {
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
    extra_metadata,
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
      ...(extra_metadata as Record<string, unknown>),
    },
  }
}

export async function handleRequest(req: Request): Promise<Response> {
  const { method, url } = req
  const parsed = new URL(url)
  const auth = req.headers.get('Authorization') || ''
  const client = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: auth } },
  })
  const { data: { user } } = await client.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const path = parsed.pathname.replace(/\/+/g, '/').replace(/(^\/|\/$)/g, '')
  const segments = path.split('/')

  try {
    if (segments[0] !== 'blueprints') {
      return new Response('Not found', { status: 404 })
    }

    // /blueprints
    if (segments.length === 1) {
      if (method === 'GET') {
        const includeDefaults = parsed.searchParams.get('includeDefaults') === 'true'
        const query = client.from('blueprints').select('*')
        if (includeDefaults) {
          query.or(`is_default.eq.true,user_id.eq.${user.id}`)
        } else {
          query.eq('user_id', user.id)
        }
        const themeFilter = parsed.searchParams.get('theme')
        if (themeFilter) {
          query.eq('theme', themeFilter)
        }
        const { data, error } = await query
        if (error) throw error
        return new Response(
          JSON.stringify(data.map(rowToResponse)),
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      if (method === 'POST') {
        const body = await req.json()
        const parsed = parseBlueprintData(body.data)
        const { data, error } = await client
          .from('blueprints')
          .insert({
            user_id: user.id,
            name: body.name,
            blueprint: parsed.blueprint,
            goal: parsed.goal,
            audience: parsed.audience,
            section_sequence: parsed.section_sequence,
            theme: parsed.theme,
            slide_library: parsed.slide_library,
            extra_metadata: parsed.extra_metadata as Database['public']['Tables']['blueprints']['Insert']['extra_metadata'],
          })
          .select()
          .single()
        if (error) throw error
        return new Response(JSON.stringify(rowToResponse(data)), {
          headers: { 'Content-Type': 'application/json' },
          status: 201,
        })
      }
    }

    // /blueprints/{id} or /blueprints/{id}/clone
    if (segments.length >= 2) {
      const id = segments[1]
      if (segments.length === 3 && segments[2] === 'clone' && method === 'POST') {
        // clone default blueprint
        const { data: orig, error } = await client
          .from('blueprints')
          .select('*')
          .eq('blueprint_id', id)
          .single()
        if (error) return new Response('Not Found', { status: 404 })
        if (!orig.is_default) return new Response('Not Found', { status: 404 })
        const { data, error: insertError } = await client
          .from('blueprints')
          .insert({
            user_id: user.id,
            name: orig.name,
            blueprint: orig.blueprint,
            goal: orig.goal,
            audience: orig.audience,
            section_sequence: orig.section_sequence,
            theme: orig.theme,
            slide_library: orig.slide_library,
            extra_metadata: orig.extra_metadata as Database['public']['Tables']['blueprints']['Insert']['extra_metadata'],
          })
          .select()
          .single()
        if (insertError) throw insertError
        return new Response(JSON.stringify(rowToResponse(data)), {
          headers: { 'Content-Type': 'application/json' },
          status: 201,
        })
      }

      if (segments.length === 2) {
        if (method === 'GET') {
          const { data, error } = await client
            .from('blueprints')
            .select('*')
            .eq('blueprint_id', id)
            .maybeSingle()
          if (error || !data) return new Response('Not Found', { status: 404 })
          if (!data.is_default && data.user_id !== user.id) {
            return new Response('Not Found', { status: 404 })
          }
          return new Response(JSON.stringify(rowToResponse(data)), {
            headers: { 'Content-Type': 'application/json' },
          })
        }

        if (method === 'PUT') {
          const { data: existing, error } = await client
            .from('blueprints')
            .select('is_default')
            .eq('blueprint_id', id)
            .maybeSingle()
          if (error || !existing) return new Response('Not Found', { status: 404 })
          if (existing.is_default) return new Response('Forbidden', { status: 403 })
          const body = await req.json()
          const parsed = parseBlueprintData(body.data)
          const { error: upError } = await client
            .from('blueprints')
            .update({
              name: body.name,
              blueprint: parsed.blueprint,
              goal: parsed.goal,
              audience: parsed.audience,
              section_sequence: parsed.section_sequence,
              theme: parsed.theme,
              slide_library: parsed.slide_library,
              extra_metadata: parsed.extra_metadata as Database['public']['Tables']['blueprints']['Update']['extra_metadata'],
              updated_at: new Date().toISOString(),
            })
            .eq('blueprint_id', id)
            .eq('user_id', user.id)
          if (upError) throw upError
          return new Response(null, { status: 200 })
        }

        if (method === 'DELETE') {
          const { data: existing, error } = await client
            .from('blueprints')
            .select('is_default, user_id')
            .eq('blueprint_id', id)
            .maybeSingle()
          if (error || !existing) return new Response('Not Found', { status: 404 })
          if (existing.is_default) return new Response('Forbidden', { status: 403 })
          if (existing.user_id !== user.id) return new Response('Not Found', { status: 404 })
          const { error: delError } = await client
            .from('blueprints')
            .delete()
            .eq('blueprint_id', id)
          if (delError) throw delError
          return new Response(null, { status: 204 })
        }
      }
    }

    return new Response('Not found', { status: 404 })
  } catch (err) {
    console.error('Blueprint handler error:', err)
    return new Response('Internal server error', { status: 500 })
  }
}

export default { handleRequest }

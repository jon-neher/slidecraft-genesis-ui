import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database, Json } from '../integrations/supabase/types'
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './config'
import supabase from './supabaseClient'

export async function createBlueprint(
  user_id: string,
  blueprint: Json,
  sb: SupabaseClient<Database> = supabase,
): Promise<{ blueprint_id: string }> {
  const { data, error } = await sb
    .from('deck_blueprints')
    .insert({ user_id, blueprint })
    .select('blueprint_id')
    .single()
  if (error || !data) throw new Error(error?.message || 'Insert failed')
  return { blueprint_id: data.blueprint_id }
}

export async function getBlueprint(
  user_id: string,
  id: string,
  sb: SupabaseClient<Database> = supabase,
) {
  const { data, error } = await sb
    .from('deck_blueprints')
    .select('blueprint_id, blueprint, created_at, updated_at')
    .eq('blueprint_id', id)
    .eq('user_id', user_id)
    .maybeSingle()
  if (error || !data) return null
  return data
}

export async function updateBlueprint(
  user_id: string,
  id: string,
  blueprint: Json,
  sb: SupabaseClient<Database> = supabase,
) {
  const { error } = await sb
    .from('deck_blueprints')
    .update({ blueprint, updated_at: new Date().toISOString() })
    .eq('blueprint_id', id)
    .eq('user_id', user_id)
  if (error) throw new Error(error.message)
}

export async function deleteBlueprint(
  user_id: string,
  id: string,
  sb: SupabaseClient<Database> = supabase,
) {
  const { error } = await sb
    .from('deck_blueprints')
    .delete()
    .eq('blueprint_id', id)
    .eq('user_id', user_id)
  if (error) throw new Error(error.message)
}

export async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const auth = req.headers.get('Authorization') || ''
  const client = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: auth } },
  })
  const { data: { user } } = await client.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const id = url.pathname.split('/').pop() || ''

  try {
    if (req.method === 'POST' && url.pathname.endsWith('/blueprints')) {
      const body = await req.json()
      const result = await createBlueprint(user.id, body, client)
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
        status: 201,
      })
    }

    if (req.method === 'GET') {
      const blueprint = await getBlueprint(user.id, id, client)
      if (!blueprint) return new Response('Not found', { status: 404 })
      return new Response(JSON.stringify(blueprint), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'PUT') {
      const body = await req.json()
      await updateBlueprint(user.id, id, body, client)
      return new Response(null, { status: 204 })
    }

    if (req.method === 'DELETE') {
      await deleteBlueprint(user.id, id, client)
      return new Response(null, { status: 204 })
    }

    return new Response('Not found', { status: 404 })
  } catch (err) {
    console.error('blueprint handler error:', err)
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}

export default {
  createBlueprint,
  getBlueprint,
  updateBlueprint,
  deleteBlueprint,
  handleRequest,
}

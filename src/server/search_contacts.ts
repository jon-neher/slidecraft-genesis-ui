import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../integrations/supabase/types'

import {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
} from './config'

import { searchContacts as hubspotSearch } from '../integrations/hubspot/client'

export interface ContactRecord {
  id: string
  properties: Record<string, any>
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export async function searchLocal(
  portal_id: string,
  q: string,
  limit: number,
  sb: SupabaseClient<Database> = supabase,
): Promise<ContactRecord[]> {
  const { data } = await sb
    .from('hubspot_contacts_cache')
    .select('*')
    .eq('portal_id', portal_id)
    .textSearch('search_vector', q, { config: 'simple' })
    .limit(limit)

  return (data as ContactRecord[]) || []
}

async function searchRemote(
  portal_id: string,
  q: string,
  limit: number,
  sb: SupabaseClient<Database> = supabase,
  fetchFn: typeof fetch = fetch,
): Promise<ContactRecord[]> {
  const rows = await hubspotSearch(portal_id, q, limit, sb, fetchFn)

  const now = new Date().toISOString()
  if (rows.length) {
    await sb
      .from('hubspot_contacts_cache')
      .upsert(rows.map(r => ({ portal_id, id: r.id, properties: r.properties, updated_at: now })))
  }
  return rows.slice(0, limit)
}

export async function searchContacts(
  portal_id: string,
  q: string,
  limit: number,
  sb: SupabaseClient<Database> = supabase,
  fetchFn: typeof fetch = fetch,
): Promise<ContactRecord[]> {
  const local = await searchLocal(portal_id, q, limit, sb)
  const seen = new Set(local.map(r => r.id))
  let results = [...local]
  if (results.length < 5) {
    const remote = await searchRemote(portal_id, q, limit, sb, fetchFn)
    for (const r of remote) {
      if (!seen.has(r.id)) {
        results.push(r)
        seen.add(r.id)
      }
      if (results.length >= limit) break
    }
  }
  return results.slice(0, limit)
}

export async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const q = url.searchParams.get('q') || ''
  const limit = parseInt(url.searchParams.get('limit') || '10', 10)

  const auth = req.headers.get('Authorization') || ''
  const client = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: { headers: { Authorization: auth } },
  })
  const {
    data: { user },
  } = await client.auth.getUser()
  if (!user) return new Response('Unauthorized', { status: 401 })

  const results = await searchContacts(user.id, q, limit, client)
  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  })
}

export default { searchContacts, handleRequest }

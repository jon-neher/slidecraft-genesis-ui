import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../integrations/supabase/types'
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './config'

export function getSupabaseClient(
  authHeader?: string,
): SupabaseClient<Database> {
  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    ...(authHeader ? { global: { headers: { Authorization: authHeader } } } : {}),
  })
}

export default getSupabaseClient

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../integrations/supabase/types'
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './config'

export function getSupabaseClient(auth?: string) {
  const options = auth ? { global: { headers: { Authorization: auth } } } : undefined
  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, options)
}

const supabase = getSupabaseClient()

export default supabase

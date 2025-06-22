import { createClient } from '@supabase/supabase-js'
import type { Database } from '../integrations/supabase/types'
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from './config'

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

export default supabase

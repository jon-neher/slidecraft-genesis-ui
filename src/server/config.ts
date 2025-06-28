// Centralized environment configuration for both Node and Deno runtimes

const maybeDeno = (globalThis as unknown as {
  Deno?: { env: { toObject(): Record<string, string> } }
}).Deno;

const env: Record<string, string | undefined> =
  typeof maybeDeno !== 'undefined'
    ? maybeDeno.env.toObject()
    : process.env;

export const HUBSPOT_CLIENT_ID = env.HUBSPOT_CLIENT_ID ?? '';
export const HUBSPOT_CLIENT_SECRET = env.HUBSPOT_CLIENT_SECRET ?? '';
export const HUBSPOT_APP_SECRET = env.HUBSPOT_APP_SECRET ?? '';
export const SUPABASE_URL = env.SUPABASE_URL ?? '';
export const SUPABASE_SERVICE_ROLE_KEY =
  env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SERVICE_KEY ?? '';

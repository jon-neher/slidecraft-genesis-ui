
import { createClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/clerk-react';

const supabaseUrl = 'https://igspkppkbqbbxffhdqlq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlnc3BrcHBrYnFiYnhmZmhkcWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMDEyNjUsImV4cCI6MjA2NTg3NzI2NX0.ilzySO3FegN_Ry21cBngROOasL_mZbNkF3OMMneCPFk';

export function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function createAuthenticatedSupabaseClient(session: any) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${session?.getToken ? session.getToken() : session?.access_token}`,
      },
    },
  });
}

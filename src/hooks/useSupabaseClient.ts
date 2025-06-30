
import { createClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/clerk-react';
import { useMemo } from 'react';
import type { Database } from '@/integrations/supabase/types';

// Build-safe constants
const SUPABASE_URL = "https://igspkppkbqbbxffhdqlq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlnc3BrcHBrYnFiYnhmZmhkcWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMDEyNjUsImV4cCI6MjA2NTg3NzI2NX0.ilzySO3FegN_Ry21cBngROOasL_mZbNkF3OMMneCPFk";

export const useSupabaseClient = () => {
  const { session } = useSession();

  const supabase = useMemo(() => {
    // Build-safe client creation
    try {
      return createClient<Database>(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY,
        {
          accessToken: () => session?.getToken(),
          auth: {
            persistSession: false,
          },
        }
      );
    } catch (error) {
      console.warn('Failed to create Supabase client:', error);
      // Return a minimal client for build environments
      return null as any;
    }
  }, [session]);

  return supabase;
};

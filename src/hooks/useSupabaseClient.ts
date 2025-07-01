
import { useMemo } from 'react';
import { useSession } from '@clerk/clerk-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://igspkppkbqbbxffhdqlq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlnc3BrcHBrYnFiYnhmZmhkcWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMDEyNjUsImV4cCI6MjA2NTg3NzI2NX0.ilzySO3FegN_Ry21cBngROOasL_mZbNkF3OMMneCPFk';

export const useSupabaseClient = () => {
  const { session } = useSession();

  const supabase = useMemo(() => {
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: session?.getToken ? {
          Authorization: `Bearer ${session.getToken()}`,
        } : {},
      },
    });
  }, [session]);

  return supabase;
};

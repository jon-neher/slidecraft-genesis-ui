import { useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://igspkppkbqbbxffhdqlq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlnc3BrcHBrYnFiYnhmZmhkcWxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMDEyNjUsImV4cCI6MjA2NTg3NzI2NX0.ilzySO3FegN_Ry21cBngROOasL_mZbNkF3OMMneCPFk';

export const useSupabaseClient = () => {
  const { getToken } = useAuth();

  const supabase = useMemo(() => {
    const accessTokenFn = async () => {
      try {
        const token = await getToken();
        console.log('🔍 [useSupabaseClient] Retrieved Clerk token:', {
          tokenExists: !!token,
          tokenType: typeof token,
          tokenLength: token?.length,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'null'
        });
        return token;
      } catch (error) {
        console.error('❌ [useSupabaseClient] Error getting Clerk token:', error);
        return null;
      }
    };

    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
      global: {
        headers: {
          'x-client-info': 'lovable-app',
        },
      },
      accessToken: accessTokenFn,
    });
  }, [getToken]);

  return supabase;
};

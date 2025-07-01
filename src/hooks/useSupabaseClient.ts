import { useMemo } from "react";
import { useSession } from "@clerk/clerk-react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const useSupabaseClient = () => {
  const { session } = useSession();

  const supabase = useMemo(() => {
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: session?.getToken
          ? {
              Authorization: `Bearer ${session.getToken()}`,
            }
          : {},
      },
    });
  }, [session]);

  return supabase;
};

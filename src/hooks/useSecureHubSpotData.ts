
import { useSupabaseClient } from './useSupabaseClient';
import { useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import type { ContactRecord } from '@/server/search_contacts';

export const useSecureHubSpotData = () => {
  const supabase = useSupabaseClient();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchContacts = async (query: string, limit: number = 10): Promise<ContactRecord[]> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    setError(null);

    try {
      const endpoint = `search_contacts?q=${encodeURIComponent(query)}&limit=${limit}`;
      const { data, error: functionError } = await supabase.functions.invoke(endpoint);

      if (functionError) {
        throw functionError;
      }

      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      console.error('Secure HubSpot search error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    searchContacts,
    loading,
    error,
  };
};

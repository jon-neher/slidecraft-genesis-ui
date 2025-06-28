import { useState, useEffect } from 'react';
import { useSupabaseClient } from './useSupabaseClient';

export interface DeckSummary {
  id: string;
  prompt: string;
  created_at: string;
}

export const useDecks = () => {
  const supabase = useSupabaseClient();
  const [decks, setDecks] = useState<DeckSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('decks')
        .select('id, prompt, created_at')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setDecks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching decks:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSlides = async (deckId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('decks')
        .select('slide_json')
        .eq('id', deckId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return data?.slide_json ?? null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching deck slides:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  return {
    decks,
    loading,
    error,
    refetch: fetchDecks,
    getSlides,
  };
};

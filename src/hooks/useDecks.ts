
import { useState, useEffect } from 'react';
import { useSupabaseClient } from './useSupabaseClient';

export interface DeckSummary {
  id: string;
  title: string;
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
        .from('presentations')
        .select('presentation_id, title, created_at')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Map presentations to DeckSummary format
      const mappedDecks = (data || []).map(presentation => ({
        id: presentation.presentation_id,
        title: presentation.title,
        created_at: presentation.created_at
      }));

      setDecks(mappedDecks);
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

      // Get slide generations for this presentation
      const { data, error: fetchError } = await supabase
        .from('slide_generations')
        .select('parsed_content')
        .eq('presentation_id', deckId)
        .order('slide_index');

      if (fetchError) {
        throw fetchError;
      }

      return data ? data.map(slide => slide.parsed_content) : null;
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

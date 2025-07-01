
import { useState, useEffect, useCallback } from 'react';
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

  const fetchDecks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('presentations_generated')
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
  }, [supabase]);

  const getSlides = useCallback(async (deckId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Get latest slide revision for this presentation
      const { data: latest, error: fetchError } = await supabase
        .from('presentations_revisions')
        .select('slides, version')
        .eq('presentation_id', deckId)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (latest) {
        return latest.slides;
      }

      const { data: v1 } = await supabase
        .from('presentations_revisions')
        .select('slides')
        .eq('presentation_id', deckId)
        .eq('version', 1)
        .maybeSingle();

      return v1?.slides ?? null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching deck slides:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  return {
    decks,
    loading,
    error,
    refetch: fetchDecks,
    getSlides,
  };
};


import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSupabaseClient } from './useSupabaseClient';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type SlideGeneration = Tables<'slide_generations'>;
type SlideGenerationInsert = TablesInsert<'slide_generations'>;
type SlideGenerationUpdate = TablesUpdate<'slide_generations'>;

export const useSlideGenerations = (presentationId?: string) => {
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const [generations, setGenerations] = useState<SlideGeneration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGenerations = useCallback(async () => {
    if (!user || !presentationId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('slide_generations')
        .select('*')
        .eq('presentation_id', presentationId)
        .order('slide_index');

      if (fetchError) {
        throw fetchError;
      }

      setGenerations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching slide generations:', err);
    } finally {
      setLoading(false);
    }
  }, [user, presentationId, supabase]);

  const createGeneration = async (generationData: SlideGenerationInsert) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: createError } = await supabase
        .from('slide_generations')
        .insert(generationData)
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      setGenerations(prev => 
        [...prev, data].sort((a, b) => a.slide_index - b.slide_index)
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating slide generation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGeneration = async (generationId: string, updates: SlideGenerationUpdate) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('slide_generations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('generation_id', generationId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setGenerations(prev => 
        prev.map(g => g.generation_id === generationId ? data : g)
          .sort((a, b) => a.slide_index - b.slide_index)
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating slide generation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && presentationId) {
      fetchGenerations();
    } else {
      setGenerations([]);
    }
  }, [user, presentationId, fetchGenerations]);

  return {
    generations,
    loading,
    error,
    createGeneration,
    updateGeneration,
    refetch: fetchGenerations
  };
};

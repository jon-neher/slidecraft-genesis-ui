
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSupabaseClient } from './useSupabaseClient';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Presentation = Tables<'presentations_generated'>;
type PresentationInsert = TablesInsert<'presentations_generated'>;
type PresentationUpdate = TablesUpdate<'presentations_generated'>;

export const usePresentations = () => {
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPresentations = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('presentations_generated')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setPresentations(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching presentations:', err);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  const createPresentation = async (presentationData: Omit<PresentationInsert, 'user_id'>) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: createError } = await supabase
        .from('presentations_generated')
        .insert({
          user_id: user.id,
          ...presentationData
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      setPresentations(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating presentation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePresentation = async (presentationId: string, updates: PresentationUpdate) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('presentations_generated')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('presentation_id', presentationId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setPresentations(prev => 
        prev.map(p => p.presentation_id === presentationId ? data : p)
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating presentation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePresentation = async (presentationId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('presentations_generated')
        .delete()
        .eq('presentation_id', presentationId);

      if (deleteError) {
        throw deleteError;
      }

      setPresentations(prev => 
        prev.filter(p => p.presentation_id !== presentationId)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting presentation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPresentations();
    } else {
      setPresentations([]);
    }
  }, [user, fetchPresentations]);

  return {
    presentations,
    loading,
    error,
    createPresentation,
    updatePresentation,
    deletePresentation,
    refetch: fetchPresentations
  };
};

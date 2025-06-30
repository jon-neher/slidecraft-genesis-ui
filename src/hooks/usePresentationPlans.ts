
import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSupabaseClient } from './useSupabaseClient';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type PresentationPlan = Tables<'presentation_plans'>;
type PresentationPlanInsert = TablesInsert<'presentation_plans'>;
type PresentationPlanUpdate = TablesUpdate<'presentation_plans'>;

export const usePresentationPlans = (presentationId?: string) => {
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const [plans, setPlans] = useState<PresentationPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    if (!user || !presentationId) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('presentation_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (presentationId) {
        query = query.eq('presentation_id', presentationId);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setPlans(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching presentation plans:', err);
    } finally {
      setLoading(false);
    }
  }, [user, presentationId, supabase]);

  const createPlan = async (planData: PresentationPlanInsert) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: createError } = await supabase
        .from('presentation_plans')
        .insert(planData)
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      setPlans(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating presentation plan:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = async (planId: string, updates: PresentationPlanUpdate) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('presentation_plans')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('plan_id', planId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setPlans(prev => 
        prev.map(p => p.plan_id === planId ? data : p)
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating presentation plan:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && presentationId) {
      fetchPlans();
    } else {
      setPlans([]);
    }
  }, [user, presentationId, fetchPlans]);

  return {
    plans,
    loading,
    error,
    createPlan,
    updatePlan,
    refetch: fetchPlans
  };
};

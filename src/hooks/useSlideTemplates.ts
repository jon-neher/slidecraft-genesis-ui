
import { useState, useEffect } from 'react';
import { useSupabaseClient } from './useSupabaseClient';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type SlideTemplate = Tables<'slide_templates'>;
type SlideTemplateInsert = TablesInsert<'slide_templates'>;
type SlideTemplateUpdate = TablesUpdate<'slide_templates'>;

export const useSlideTemplates = () => {
  const supabase = useSupabaseClient();
  const [templates, setTemplates] = useState<SlideTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('slide_templates')
        .select('*')
        .order('name');

      if (fetchError) {
        throw fetchError;
      }

      setTemplates(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching slide templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTemplate = async (templateData: SlideTemplateInsert) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: createError } = await supabase
        .from('slide_templates')
        .insert(templateData)
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      setTemplates(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating slide template:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTemplate = async (templateId: string, updates: SlideTemplateUpdate) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('slide_templates')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('template_id', templateId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setTemplates(prev => 
        prev.map(t => t.template_id === templateId ? data : t)
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating slide template:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('slide_templates')
        .delete()
        .eq('template_id', templateId);

      if (deleteError) {
        throw deleteError;
      }

      setTemplates(prev => prev.filter(t => t.template_id !== templateId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting slide template:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refetch: fetchTemplates
  };
};

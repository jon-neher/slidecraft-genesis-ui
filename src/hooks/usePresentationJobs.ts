import { useState, useEffect } from 'react';
import { useSupabaseClient } from '@/hooks/useSupabaseClient';
import { useAuth } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

export interface PresentationInput {
  input_id: string;
  user_id: string;
  title: string;
  description?: string;
  context?: any;
  template_preferences?: any;
  audience_info?: any;
  presentation_type?: string;
  slide_count_preference?: number;
  created_at: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface PresentationJob {
  job_id: string;
  input_id: string;
  presentation_id?: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  processing_steps?: any;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export const usePresentationJobs = () => {
  const [jobs, setJobs] = useState<PresentationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();
  const { getToken } = useAuth();
  const { toast } = useToast();

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('presentation_jobs')
        .select(`
          *,
          presentations_input (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching presentation jobs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch presentation jobs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createPresentationRequest = async (input: {
    title: string;
    description?: string;
    context?: any;
    template_preferences?: any;
    audience_info?: any;
    presentation_type?: string;
    slide_count_preference?: number;
  }) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Wait for authentication state to settle on first attempt
        if (attempt === 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        const token = await getToken();

        if (!token) {
          throw new Error('Failed to get authentication token');
        }

        // Validate token format (basic check)
        if (!token.includes('.')) {
          throw new Error('Invalid token format');
        }

        const { data, error } = await supabase.functions.invoke('process-presentation-request', {
          body: input,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (error) {
          // If it's an auth error and we have retries left, retry
          if (error.message?.includes('Unauthorized') && attempt < MAX_RETRIES) {
            console.log(`Auth error on attempt ${attempt}, retrying...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
            continue;
          }
          throw error;
        }

        toast({
          title: 'Success',
          description: 'Presentation generation started. You can track progress below.',
        });

        // Refresh jobs list
        fetchJobs();

        return data;
      } catch (error) {
        console.error(`Error creating presentation request (attempt ${attempt}):`, error);
        
        // If this is the last attempt or not an auth error, throw
        if (attempt === MAX_RETRIES || !error.message?.includes('Unauthorized')) {
          toast({
            title: 'Error',
            description: `Failed to start presentation generation: ${error.message}`,
            variant: 'destructive',
          });
          throw error;
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
      }
    }
  };

  const getJobStatus = async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from('presentation_jobs')
        .select('*')
        .eq('job_id', jobId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching job status:', error);
      return null;
    }
  };

  // Set up real-time subscription for job updates
  useEffect(() => {
    fetchJobs();

    const channel = supabase
      .channel('presentation-jobs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'presentation_jobs'
        },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    jobs,
    loading,
    fetchJobs,
    createPresentationRequest,
    getJobStatus,
  };
};
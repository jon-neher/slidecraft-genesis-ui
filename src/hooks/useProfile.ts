
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSupabaseClient } from './useSupabaseClient';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;
type ProfileInsert = TablesInsert<'profiles'>;
type ProfileUpdate = TablesUpdate<'profiles'>;

export const useProfile = () => {
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: Omit<ProfileInsert, 'id'>) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          ...profileData
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      setProfile(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: ProfileUpdate) => {
    if (!user || !profile) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setProfile(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    createProfile,
    updateProfile
  };
};

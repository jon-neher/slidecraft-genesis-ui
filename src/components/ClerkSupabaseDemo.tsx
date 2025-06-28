
import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSupabaseClient } from '@/hooks/useSupabaseClient';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getColorCombination } from '@/lib/color-validation';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

const ClerkSupabaseDemo = () => {
  const { user } = useUser();
  const supabase = useSupabaseClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const accent = getColorCombination('accent');
  const success = getColorCombination('success');

  const testSupabaseConnection = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('Testing Supabase connection with Clerk token...');
      
      // Test auth connection
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.log('Supabase auth error:', authError);
        return;
      }
      
      console.log('Supabase auth successful! User data:', authData);
      
      // Test profiles table query
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) {
        console.log('Profile query error:', profileError);
      } else {
        console.log('Profile data:', profileData);
        setProfile(profileData);
      }
      
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('Creating profile...');
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || null,
          first_name: user.firstName || null,
          last_name: user.lastName || null
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating profile:', error);
      } else {
        console.log('Profile created:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('Profile creation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="p-6 max-w-md mx-auto mt-8">
      <h3 className="text-lg font-semibold mb-4">Clerk + Supabase Integration</h3>
      <div className="space-y-2 text-sm mb-4">
        <p><strong>Clerk User ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
      </div>
      
      {profile && (
        <div className="bg-green-50 p-3 rounded mb-4">
          <p className="text-sm font-medium text-green-800">Profile Found:</p>
          <p className="text-xs text-green-600">
            Created: {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
      )}
      
      <div className="space-y-2">
        <Button
          onClick={testSupabaseConnection}
          disabled={loading}
          className={`w-full ${accent.background} ${accent.text} ${accent.hover}`}
        >
          {loading ? 'Testing...' : 'Test Connection & Load Profile'}
        </Button>
        
        {!profile && (
          <Button
            onClick={createProfile}
            disabled={loading}
            className={`w-full ${success.background} ${success.text} ${success.hover}`}
          >
            {loading ? 'Creating...' : 'Create Profile'}
          </Button>
        )}
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Check browser console for detailed connection results
      </p>
    </Card>
  );
};

export default ClerkSupabaseDemo;

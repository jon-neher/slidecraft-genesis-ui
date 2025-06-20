
import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useSupabaseClient } from '@/hooks/useSupabaseClient';
import { Card } from '@/components/ui/card';

const ClerkSupabaseDemo = () => {
  const { user } = useUser();
  const supabase = useSupabaseClient();

  const testSupabaseConnection = async () => {
    try {
      console.log('Testing Supabase connection with Clerk token...');
      const { data, error } = await supabase.from('profiles').select('*').limit(1);
      
      if (error) {
        console.log('Supabase query error (expected if no profiles table):', error);
      } else {
        console.log('Supabase query successful:', data);
      }
      
      console.log('User from Clerk:', {
        id: user?.id,
        email: user?.primaryEmailAddress?.emailAddress,
        firstName: user?.firstName,
        lastName: user?.lastName
      });
    } catch (error) {
      console.error('Connection test failed:', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="p-6 max-w-md mx-auto mt-8">
      <h3 className="text-lg font-semibold mb-4">Clerk + Supabase Integration</h3>
      <div className="space-y-2 text-sm">
        <p><strong>Clerk User ID:</strong> {user.id}</p>
        <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
      </div>
      <button 
        onClick={testSupabaseConnection}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Supabase Connection
      </button>
      <p className="text-xs text-gray-500 mt-2">
        Check browser console for connection test results
      </p>
    </Card>
  );
};

export default ClerkSupabaseDemo;

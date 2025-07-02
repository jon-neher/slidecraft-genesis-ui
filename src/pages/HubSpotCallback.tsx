import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSupabaseClient } from '@/hooks/useSupabaseClient';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const HubSpotCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const { user } = useUser();
  const { toast } = useToast();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing HubSpot connection...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`HubSpot OAuth error: ${error}`);
        toast({
          title: 'Connection Failed',
          description: `HubSpot authorization failed: ${error}`,
          variant: 'destructive',
        });
        setTimeout(() => navigate('/integrations'), 3000);
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Missing authorization code or state parameter');
        toast({
          title: 'Connection Failed',
          description: 'Invalid callback parameters',
          variant: 'destructive',
        });
        setTimeout(() => navigate('/integrations'), 3000);
        return;
      }

      if (!user) {
        setStatus('error');
        setMessage('User not authenticated');
        setTimeout(() => navigate('/integrations'), 3000);
        return;
      }

      try {
        // Verify state parameter
        const { data: stateData, error: stateError } = await supabase
          .from('hubspot_oauth_states')
          .select('user_id')
          .eq('state', state)
          .eq('user_id', user.id)
          .maybeSingle();

        if (stateError || !stateData) {
          throw new Error('Invalid state parameter');
        }

        // Exchange code for tokens via edge function
        const { data: tokenData, error: tokenError } = await supabase.functions.invoke('hubspot_oauth_callback', {
          body: { code, state }
        });

        if (tokenError) {
          throw new Error(tokenError.message || 'Token exchange failed');
        }

        // Clean up state
        await supabase
          .from('hubspot_oauth_states')
          .delete()
          .eq('state', state);

        setStatus('success');
        setMessage('HubSpot connected successfully!');
        toast({
          title: 'Connected!',
          description: 'HubSpot has been successfully connected to your account.',
        });

        setTimeout(() => navigate('/integrations'), 2000);
      } catch (error) {
        console.error('HubSpot callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Connection failed');
        toast({
          title: 'Connection Failed',
          description: 'Failed to complete HubSpot connection. Please try again.',
          variant: 'destructive',
        });
        setTimeout(() => navigate('/integrations'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, supabase, user, toast]);

  return (
    <div className="min-h-screen bg-ice-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-electric-indigo/10 flex items-center justify-center">
            {status === 'processing' && <Loader2 className="w-6 h-6 text-electric-indigo animate-spin" />}
            {status === 'success' && <CheckCircle className="w-6 h-6 text-green-600" />}
            {status === 'error' && <AlertCircle className="w-6 h-6 text-red-600" />}
          </div>
          <CardTitle className="text-slate-gray">
            {status === 'processing' && 'Connecting HubSpot'}
            {status === 'success' && 'Connection Successful'}
            {status === 'error' && 'Connection Failed'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-600">
            {status === 'processing' && 'Please wait while we complete the setup...'}
            {status === 'success' && 'Redirecting you back to integrations...'}
            {status === 'error' && 'Redirecting you back to try again...'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HubSpotCallback;
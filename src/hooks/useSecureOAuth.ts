import { useSupabaseClient } from './useSupabaseClient';
import { useState } from 'react';

// Generate cryptographically secure random state for OAuth
function generateSecureState(): string {
  const array = new Uint8Array(32); // 256 bits of entropy
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export const useSecureOAuth = () => {
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiateHubSpotOAuth = async (userId: string): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      // Generate secure state parameter
      const state = generateSecureState();
      
      // Store state with expiration in database
      const { error: stateError } = await supabase
        .from('hubspot_oauth_states')
        .insert({
          state,
          user_id: userId,
          expires_at: new Date(Date.now() + 3600000).toISOString(), // 1 hour expiry
        });

      if (stateError) {
        throw new Error(`Failed to store OAuth state: ${stateError.message}`);
      }

      // Clean up expired states while we're at it
      await supabase.rpc('cleanup_expired_oauth_states');

      // Get HubSpot client ID
      const { data: clientData, error: clientError } = await supabase.functions.invoke('hubspot_client_id');
      
      if (clientError || !clientData?.client_id) {
        throw new Error('Failed to get HubSpot client configuration');
      }

      // Build OAuth URL with secure parameters
      const oauthUrl = new URL('https://app.hubspot.com/oauth/authorize');
      oauthUrl.searchParams.set('client_id', clientData.client_id);
      oauthUrl.searchParams.set('redirect_uri', `${window.location.origin}/hubspot/callback`);
      oauthUrl.searchParams.set('scope', 'crm.objects.contacts.read notes.write');
      oauthUrl.searchParams.set('state', state);
      oauthUrl.searchParams.set('response_type', 'code');

      return oauthUrl.toString();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OAuth initiation failed';
      setError(errorMessage);
      console.error('Secure OAuth error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    initiateHubSpotOAuth,
    loading,
    error,
  };
};
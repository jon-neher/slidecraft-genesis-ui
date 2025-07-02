import { useState, useEffect } from 'react';
import { useSupabaseClient } from './useSupabaseClient';
import { useUser } from '@clerk/clerk-react';
import { useToast } from './use-toast';

export type ConnectionStatus = 'checking' | 'connected' | 'disconnected';

export const useHubSpotConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');
  const { toast } = useToast();
  const supabase = useSupabaseClient();
  const { user } = useUser();

  const checkConnectionStatus = async () => {
    // Build-safe check
    if (!user || !supabase || typeof window === 'undefined') {
      setConnectionStatus('disconnected');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('hubspot_tokens')
        .select('access_token, expires_at')
        .eq('portal_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking HubSpot connection:', error);
        setConnectionStatus('disconnected');
        return;
      }

      if (data && data.access_token) {
        // Check if token is still valid
        const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
        const isExpired = expiresAt && expiresAt.getTime() <= Date.now();
        
        setIsConnected(!isExpired);
        setConnectionStatus(!isExpired ? 'connected' : 'disconnected');
      } else {
        setIsConnected(false);
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Error checking HubSpot connection:', error);
      setConnectionStatus('disconnected');
    }
  };

  const handleConnect = async () => {
    // Build-safe check
    if (!user || typeof window === 'undefined') {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to connect HubSpot.',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      // Generate a cryptographically secure state parameter using Web Crypto API
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      const state = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');

      // Persist state mapping for validation on callback
      const { error: stateError } = await supabase
        .from('hubspot_oauth_states')
        .insert({
          state,
          user_id: user.id,
        });

      if (stateError) {
        throw new Error('Failed to initialize OAuth state');
      }
      
      // Get HubSpot client ID from edge function
      const { data: clientData, error: clientError } = await supabase.functions.invoke('hubspot_client_id');
      
      if (clientError || !clientData?.client_id) {
        throw new Error('Failed to get HubSpot client configuration');
      }

      // Construct HubSpot OAuth URL with proper security parameters
      const hubspotAuthUrl = new URL('https://app.hubspot.com/oauth/authorize');
      hubspotAuthUrl.searchParams.set('client_id', clientData.client_id);
      hubspotAuthUrl.searchParams.set('scope', 'crm.objects.contacts.write oauth crm.objects.companies.read crm.objects.deals.read crm.objects.leads.read crm.objects.leads.write crm.objects.contacts.read');
      hubspotAuthUrl.searchParams.set('redirect_uri', `${window.location.origin}/hubspot/callback`);
      hubspotAuthUrl.searchParams.set('state', state);
      hubspotAuthUrl.searchParams.set('response_type', 'code');
      
      // Redirect to HubSpot OAuth
      window.location.href = hubspotAuthUrl.toString();
    } catch (error) {
      console.error('Error initiating HubSpot connection:', error);
      toast({
        title: 'Connection Error',
        description: error instanceof Error ? error.message : 'Failed to initiate HubSpot connection. Please try again.',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user || !supabase) return;

    try {
      const { error } = await supabase
        .from('hubspot_tokens')
        .delete()
        .eq('portal_id', user.id);

      if (error) {
        throw error;
      }

      setIsConnected(false);
      setConnectionStatus('disconnected');
      toast({
        title: 'Disconnected',
        description: 'HubSpot has been disconnected from your account.',
      });
    } catch (error) {
      console.error('Error disconnecting HubSpot:', error);
      toast({
        title: 'Error',
        description: 'Failed to disconnect HubSpot. Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    checkConnectionStatus();
  }, [user, supabase]);

  return {
    isConnected,
    isConnecting,
    connectionStatus,
    handleConnect,
    handleDisconnect,
    checkConnectionStatus,
  };
};
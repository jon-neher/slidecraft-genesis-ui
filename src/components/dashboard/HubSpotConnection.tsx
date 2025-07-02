
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Settings, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseClient } from '@/hooks/useSupabaseClient';
import { useUser } from '@clerk/clerk-react';

const HubSpotConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const { toast } = useToast();
  const supabase = useSupabaseClient();
  const { user } = useUser();

  // Check connection status on component mount
  useEffect(() => {
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

    checkConnectionStatus();
  }, [user, supabase]);

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
      hubspotAuthUrl.searchParams.set('scope', 'crm.objects.contacts.read notes.write');
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

  const displayStatus = connectionStatus === 'checking' ? isConnected : connectionStatus === 'connected';

  return (
    <Card className="w-full bg-white border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-electric-indigo rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-ice-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-slate-gray">HubSpot</CardTitle>
            <CardDescription className="text-gray-600">Connect your CRM data</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {connectionStatus === 'checking' ? (
            <Badge variant="secondary">
              <div className="w-3 h-3 mr-1 animate-spin rounded-full border border-gray-400 border-t-transparent" />
              Checking...
            </Badge>
          ) : displayStatus ? (
            <Badge variant="success">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="secondary">
              <AlertCircle className="w-3 h-3 mr-1" />
              Not Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          {displayStatus 
            ? 'Your HubSpot account is connected. You can now use contact data in your presentations.'
            : 'Connect your HubSpot account to automatically pull contact and company data into your presentations.'
          }
        </p>
        
        <div className="flex items-center gap-2 flex-wrap">
          {displayStatus ? (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-gray-200 text-slate-gray hover:bg-gray-50">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-slate-gray">Manage HubSpot Connection</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Manage your HubSpot integration settings
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white">
                      <div>
                        <p className="font-medium text-slate-gray">Connection Status</p>
                        <p className="text-sm text-gray-600">Active and syncing</p>
                      </div>
                      <Badge variant="success">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={handleDisconnect}
                      className="w-full bg-red-500 text-ice-white hover:bg-red-500/90"
                    >
                      Disconnect HubSpot
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button size="sm" variant="ghost" className="text-slate-gray hover:bg-gray-100">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open HubSpot
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleConnect}
              disabled={isConnecting || connectionStatus === 'checking'}
              className="bg-electric-indigo text-ice-white hover:bg-electric-indigo/90 touch-target"
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-ice-white border-t-transparent" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Connect HubSpot
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HubSpotConnection;

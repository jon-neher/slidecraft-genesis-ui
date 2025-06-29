
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Settings, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HubSpotConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Generate a unique state parameter for OAuth security
      const state = crypto.randomUUID();
      
      // Store state in localStorage for validation after redirect
      localStorage.setItem('hubspot_oauth_state', state);
      
      // Fetch the client id from the Supabase edge function
      const idRes = await fetch('/api/hubspot_client_id');
      if (!idRes.ok) {
        throw new Error('Failed to load HubSpot client id');
      }
      const { client_id } = await idRes.json();
      if (!client_id) {
        throw new Error('Missing HubSpot client id');
      }

      // Construct HubSpot OAuth URL
      const hubspotAuthUrl = new URL('https://app.hubspot.com/oauth/authorize');
      hubspotAuthUrl.searchParams.set('client_id', client_id);
      hubspotAuthUrl.searchParams.set('scope', 'contacts');
      hubspotAuthUrl.searchParams.set('redirect_uri', `${window.location.origin}/api/hubspot_oauth_callback`);
      hubspotAuthUrl.searchParams.set('state', state);
      
      // Redirect to HubSpot OAuth
      window.location.href = hubspotAuthUrl.toString();
    } catch (error) {
      console.error('Error initiating HubSpot connection:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to initiate HubSpot connection. Please try again.',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: 'Disconnected',
      description: 'HubSpot has been disconnected from your account.',
    });
  };

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
          {isConnected ? (
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
          {isConnected 
            ? 'Your HubSpot account is connected. You can now use contact data in your presentations.'
            : 'Connect your HubSpot account to automatically pull contact and company data into your presentations.'
          }
        </p>
        
        <div className="flex items-center gap-2 flex-wrap">
          {isConnected ? (
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
              disabled={isConnecting}
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

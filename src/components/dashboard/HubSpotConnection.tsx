
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
      
      // Construct HubSpot OAuth URL
      const hubspotAuthUrl = new URL('https://app.hubspot.com/oauth/authorize');
      const clientId = import.meta.env.VITE_HUBSPOT_CLIENT_ID;
      if (!clientId) {
        throw new Error('Missing VITE_HUBSPOT_CLIENT_ID env');
      }
      hubspotAuthUrl.searchParams.set('client_id', clientId);
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
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">HubSpot</CardTitle>
            <CardDescription>Connect your CRM data</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <Badge variant="default" className="bg-neon-mint text-slate-gray">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-slate-gray/60">
              <AlertCircle className="w-3 h-3 mr-1" />
              Not Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-gray/70">
          {isConnected 
            ? 'Your HubSpot account is connected. You can now use contact data in your presentations.'
            : 'Connect your HubSpot account to automatically pull contact and company data into your presentations.'
          }
        </p>
        
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Manage HubSpot Connection</DialogTitle>
                    <DialogDescription>
                      Manage your HubSpot integration settings
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Connection Status</p>
                        <p className="text-sm text-muted-foreground">Active and syncing</p>
                      </div>
                      <Badge variant="default" className="bg-neon-mint text-slate-gray">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={handleDisconnect}
                      className="w-full"
                    >
                      Disconnect HubSpot
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button size="sm" variant="ghost">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open HubSpot
              </Button>
            </>
          ) : (
            <Button 
              onClick={handleConnect}
              disabled={isConnecting}
              className="bg-electric-indigo hover:bg-electric-indigo/90"
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
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

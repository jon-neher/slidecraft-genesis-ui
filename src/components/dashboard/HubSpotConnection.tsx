import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { useHubSpotConnection } from '@/hooks/useHubSpotConnection';
import ConnectionStatusBadge from './hubspot/ConnectionStatusBadge';
import ConnectionActions from './hubspot/ConnectionActions';

const HubSpotConnection = () => {
  const {
    isConnected,
    isConnecting,
    connectionStatus,
    handleConnect,
    handleDisconnect,
  } = useHubSpotConnection();

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
          <ConnectionStatusBadge
            connectionStatus={connectionStatus}
            isConnected={isConnected}
          />
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
          <ConnectionActions
            isConnected={isConnected}
            isConnecting={isConnecting}
            connectionStatus={connectionStatus}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HubSpotConnection;
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { ConnectionStatus } from '@/hooks/useHubSpotConnection';
import ManageConnectionDialog from './ManageConnectionDialog';

interface ConnectionActionsProps {
  isConnected: boolean;
  isConnecting: boolean;
  connectionStatus: ConnectionStatus;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ConnectionActions: React.FC<ConnectionActionsProps> = ({
  isConnected,
  isConnecting,
  connectionStatus,
  onConnect,
  onDisconnect
}) => {
  const displayStatus = connectionStatus === 'checking' ? isConnected : connectionStatus === 'connected';

  if (displayStatus) {
    return (
      <>
        <ManageConnectionDialog onDisconnect={onDisconnect} />
        <Button size="sm" variant="ghost" className="text-slate-gray hover:bg-gray-100">
          <ExternalLink className="w-4 h-4 mr-2" />
          Open HubSpot
        </Button>
      </>
    );
  }

  return (
    <Button 
      onClick={onConnect}
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
  );
};

export default ConnectionActions;
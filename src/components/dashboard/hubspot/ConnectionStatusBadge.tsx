import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { ConnectionStatus } from '@/hooks/useHubSpotConnection';

interface ConnectionStatusBadgeProps {
  connectionStatus: ConnectionStatus;
  isConnected: boolean;
}

const ConnectionStatusBadge: React.FC<ConnectionStatusBadgeProps> = ({
  connectionStatus,
  isConnected
}) => {
  const displayStatus = connectionStatus === 'checking' ? isConnected : connectionStatus === 'connected';

  if (connectionStatus === 'checking') {
    return (
      <Badge variant="secondary">
        <div className="w-3 h-3 mr-1 animate-spin rounded-full border border-gray-400 border-t-transparent" />
        Checking...
      </Badge>
    );
  }

  if (displayStatus) {
    return (
      <Badge variant="success">
        <CheckCircle className="w-3 h-3 mr-1" />
        Connected
      </Badge>
    );
  }

  return (
    <Badge variant="secondary">
      <AlertCircle className="w-3 h-3 mr-1" />
      Not Connected
    </Badge>
  );
};

export default ConnectionStatusBadge;
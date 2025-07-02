import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Settings, CheckCircle } from 'lucide-react';

interface ManageConnectionDialogProps {
  onDisconnect: () => void;
}

const ManageConnectionDialog: React.FC<ManageConnectionDialogProps> = ({ onDisconnect }) => {
  return (
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
            onClick={onDisconnect}
            className="w-full bg-red-500 text-ice-white hover:bg-red-500/90"
          >
            Disconnect HubSpot
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageConnectionDialog;
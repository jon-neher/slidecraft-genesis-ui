
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plug } from 'lucide-react';
import HubSpotConnection from './HubSpotConnection';

const IntegrationsPanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-gray mb-2">Integrations</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Connect your tools to automatically pull data into your presentations
        </p>
      </div>
      
      <div className="grid gap-4">
        <HubSpotConnection />
        
        {/* Placeholder for future integrations */}
        <Card className="border-dashed border-gray-300 bg-white">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <Plug className="w-8 h-8 text-gray-400 mb-3" />
            <CardTitle className="text-lg text-gray-600 mb-2">More Integrations Coming Soon</CardTitle>
            <CardDescription className="text-gray-500">
              We're working on adding more CRM and data source integrations
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntegrationsPanel;

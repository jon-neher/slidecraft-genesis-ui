import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, BarChart3 } from 'lucide-react';

const EngagementChart = () => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-gray mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Engagement Over Time
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Chart visualization coming soon</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementChart;
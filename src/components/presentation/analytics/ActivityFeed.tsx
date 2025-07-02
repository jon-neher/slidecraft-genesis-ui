import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Eye, Share, Edit } from 'lucide-react';

interface ActivityFeedProps {
  lastViewed: string;
}

const ActivityFeed = ({ lastViewed }: ActivityFeedProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-slate-gray mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Eye className="w-4 h-4 text-electric-indigo" />
            <span className="text-sm text-slate-gray">Last viewed {lastViewed}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Share className="w-4 h-4 text-neon-mint" />
            <span className="text-sm text-slate-gray">Shared 3 times this week</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Edit className="w-4 h-4 text-soft-coral" />
            <span className="text-sm text-slate-gray">Last edited 2 days ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
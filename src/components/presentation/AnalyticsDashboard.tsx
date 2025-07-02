import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Download, Share, Zap } from 'lucide-react';
import MetricsGrid from './analytics/MetricsGrid';
import EngagementChart from './analytics/EngagementChart';
import ActivityFeed from './analytics/ActivityFeed';

interface PresentationAnalytics {
  views: number;
  avgTimeSpent: string;
  completionRate: number;
  shares: number;
  lastViewed: string;
}

interface AnalyticsDashboardProps {
  presentationId: string;
  analytics: PresentationAnalytics;
  onClose: () => void;
}

const AnalyticsDashboard = ({ presentationId, analytics, onClose }: AnalyticsDashboardProps) => {

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-electric-indigo/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-electric-indigo" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-gray">Presentation Analytics</h2>
                <p className="text-sm text-slate-gray/70">Performance insights and engagement metrics</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="p-6">
          <MetricsGrid analytics={analytics} />
          <EngagementChart />
          <ActivityFeed lastViewed={analytics.lastViewed} />
        </div>

        {/* Actions */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Zap className="w-3 h-3 mr-1" />
                Live Analytics
              </Badge>
              <span className="text-xs text-slate-gray/70">Updates in real-time</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
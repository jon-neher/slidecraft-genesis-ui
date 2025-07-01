import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Edit, 
  Share, 
  Download, 
  Eye, 
  Calendar, 
  BarChart3,
  Users,
  Clock,
  Zap,
  TrendingUp
} from 'lucide-react';

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
  const metrics = [
    {
      label: 'Total Views',
      value: analytics.views.toLocaleString(),
      icon: Eye,
      color: 'text-electric-indigo',
      bgColor: 'bg-electric-indigo/10'
    },
    {
      label: 'Avg. Time Spent',
      value: analytics.avgTimeSpent,
      icon: Clock,
      color: 'text-neon-mint',
      bgColor: 'bg-neon-mint/10'
    },
    {
      label: 'Completion Rate',
      value: `${analytics.completionRate}%`,
      icon: TrendingUp,
      color: 'text-soft-coral',
      bgColor: 'bg-soft-coral/10'
    },
    {
      label: 'Shares',
      value: analytics.shares.toString(),
      icon: Users,
      color: 'text-slate-gray',
      bgColor: 'bg-slate-gray/10'
    }
  ];

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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <metric.icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-gray mb-1">{metric.value}</h3>
                    <p className="text-sm text-slate-gray/70">{metric.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Engagement Chart Placeholder */}
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

          {/* Recent Activity */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-gray mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Eye className="w-4 h-4 text-electric-indigo" />
                  <span className="text-sm text-slate-gray">Last viewed {analytics.lastViewed}</span>
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
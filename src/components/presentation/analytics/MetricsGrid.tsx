import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Clock, TrendingUp, Users } from 'lucide-react';

interface PresentationAnalytics {
  views: number;
  avgTimeSpent: string;
  completionRate: number;
  shares: number;
}

interface MetricsGridProps {
  analytics: PresentationAnalytics;
}

const MetricsGrid = ({ analytics }: MetricsGridProps) => {
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
  );
};

export default MetricsGrid;
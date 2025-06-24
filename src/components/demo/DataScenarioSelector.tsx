
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, BarChart3, Play } from 'lucide-react';
import { DataScenario } from './types';

const scenarios: DataScenario[] = [
  {
    id: 'sales-report',
    title: 'Q4 Sales Report',
    description: 'Transform quarterly sales data into executive presentation',
    icon: 'TrendingUp',
    category: 'Sales',
    chartType: 'bar',
    sampleData: [
      { month: 'Oct', revenue: 245000, target: 220000 },
      { month: 'Nov', revenue: 289000, target: 250000 },
      { month: 'Dec', revenue: 324000, target: 280000 }
    ],
    insights: [
      'Revenue exceeded targets by 15% in Q4',
      'December showed strongest growth at 31%',
      'Customer acquisition increased 22% quarter-over-quarter'
    ],
    templates: [{
      id: 'executive-blue',
      name: 'Executive Blue',
      primaryColor: '#2563eb',
      secondaryColor: '#3b82f6',
      slides: []
    }]
  },
  {
    id: 'marketing-analytics',
    title: 'Marketing Performance',
    description: 'Campaign analytics with ROI insights and recommendations',
    icon: 'Users',
    category: 'Marketing',
    chartType: 'line',
    sampleData: [
      { week: 'Week 1', impressions: 125000, clicks: 3400, conversions: 89 },
      { week: 'Week 2', impressions: 142000, clicks: 4100, conversions: 112 },
      { week: 'Week 3', impressions: 158000, clicks: 4650, conversions: 134 },
      { week: 'Week 4', impressions: 167000, clicks: 5200, conversions: 156 }
    ],
    insights: [
      'Click-through rate improved 34% over 4 weeks',
      'Cost per acquisition decreased by $23',
      'Social media channels driving 67% of conversions'
    ],
    templates: [{
      id: 'modern-green',
      name: 'Modern Green',
      primaryColor: '#10b981',
      secondaryColor: '#34d399',
      slides: []
    }]
  },
  {
    id: 'financial-summary',
    title: 'Financial Overview',
    description: 'Budget analysis with variance reporting and projections',
    icon: 'DollarSign',
    category: 'Finance',
    chartType: 'area',
    sampleData: [
      { category: 'Revenue', actual: 2450000, budget: 2200000, variance: 11.4 },
      { category: 'Expenses', actual: 1890000, budget: 2000000, variance: -5.5 },
      { category: 'Profit', actual: 560000, budget: 200000, variance: 180 }
    ],
    insights: [
      'Revenue exceeded budget by 11.4%',
      'Operating expenses 5.5% under budget',
      'Net profit margin improved to 22.9%'
    ],
    templates: [{
      id: 'professional-purple',
      name: 'Professional Purple',
      primaryColor: '#7c3aed',
      secondaryColor: '#a855f7',
      slides: []
    }]
  }
];

const iconMap = {
  TrendingUp,
  Users,
  DollarSign,
  BarChart3
};

interface DataScenarioSelectorProps {
  onSelectScenario: (scenario: DataScenario) => void;
}

const DataScenarioSelector = ({ onSelectScenario }: DataScenarioSelectorProps) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-6 lg:mb-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-slate-gray mb-2">
          Choose Your Data Scenario
        </h3>
        <p className="text-sm sm:text-base text-slate-gray/70">
          Select a sample dataset to see how Threadline transforms it into a presentation
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {scenarios.map((scenario, index) => {
          const IconComponent = iconMap[scenario.icon as keyof typeof iconMap];
          
          return (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group touch-target">
                <CardHeader className="text-center pb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 bg-gradient-to-br from-electric-indigo/10 to-neon-mint/10 rounded-xl flex items-center justify-center">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-electric-indigo" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">{scenario.title}</CardTitle>
                  <div className="inline-block px-2 py-1 bg-slate-50 text-slate-gray/70 text-xs rounded-full">
                    {scenario.category}
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-slate-gray/70 mb-4 lg:mb-6">
                    {scenario.description}
                  </p>
                  <Button 
                    onClick={() => onSelectScenario(scenario)}
                    className="w-full bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white group-hover:scale-105 transition-transform touch-target"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Try This Dataset
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-6 lg:mt-8">
        <p className="text-xs sm:text-sm text-slate-gray/60">
          💡 Each demo uses real data patterns from actual business scenarios
        </p>
      </div>
    </div>
  );
};

export default DataScenarioSelector;

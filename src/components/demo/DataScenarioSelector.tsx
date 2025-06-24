import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, BarChart3, Play } from 'lucide-react';
import { DataScenario } from './types';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [selectedScenarioId, setSelectedScenarioId] = useState(scenarios[0].id);
  
  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];
  const IconComponent = iconMap[selectedScenario.icon as keyof typeof iconMap];

  if (isMobile) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-slate-gray mb-2">
            Choose Your Data Scenario
          </h3>
          <p className="text-sm text-slate-gray/70">
            Select a sample dataset to see how Threadline transforms it
          </p>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="flex flex-col space-y-2 mb-6">
          {scenarios.map((scenario) => {
            const TabIcon = iconMap[scenario.icon as keyof typeof iconMap];
            return (
              <button
                key={scenario.id}
                onClick={() => setSelectedScenarioId(scenario.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all touch-target ${
                  selectedScenarioId === scenario.id
                    ? 'bg-electric-indigo/10 border-electric-indigo/30 text-electric-indigo'
                    : 'bg-white border-slate-gray/10 text-slate-gray hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-electric-indigo/10 to-neon-mint/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TabIcon className="w-4 h-4" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-medium text-sm">{scenario.title}</div>
                  <div className="text-xs opacity-70">{scenario.category}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Scenario Details */}
        <motion.div
          key={selectedScenarioId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-gradient-to-br from-slate-50 to-ice-white rounded-xl p-4 border border-slate-gray/10"
        >
          <div className="text-center mb-4">
            <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-electric-indigo/10 to-neon-mint/10 rounded-xl flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-electric-indigo" />
            </div>
            <h4 className="font-semibold text-slate-gray mb-1">{selectedScenario.title}</h4>
            <p className="text-sm text-slate-gray/70 mb-3">{selectedScenario.description}</p>
          </div>
          
          <Button 
            onClick={() => onSelectScenario(selectedScenario)}
            className="w-full bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white touch-target"
          >
            <Play className="w-4 h-4 mr-2" />
            Try This Dataset
          </Button>
        </motion.div>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-gray/60">
            💡 Each demo uses real data patterns from actual business scenarios
          </p>
        </div>
      </div>
    );
  }

  // Desktop layout (unchanged)
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

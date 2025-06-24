
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { CheckCircle, TrendingUp, Award, Target } from 'lucide-react';
import { DataScenario } from './types';

interface Slide {
  id: string;
  type: 'title' | 'chart' | 'insights' | 'summary';
  title: string;
  content?: string;
  chartData?: any[];
  insights?: string[];
}

interface SlideRendererProps {
  slide: Slide;
  scenario: DataScenario;
}

const SlideRenderer = ({ slide, scenario }: SlideRendererProps) => {
  const renderChart = () => {
    if (!slide.chartData) return null;

    const commonProps = {
      data: slide.chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (scenario.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#3A3D4D" fontSize={12} />
              <YAxis stroke="#3A3D4D" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FAFAFB', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="revenue" fill="#5A2EFF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#30F2B3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#3A3D4D" fontSize={12} />
              <YAxis stroke="#3A3D4D" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FAFAFB', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Line type="monotone" dataKey="conversions" stroke="#30F2B3" strokeWidth={3} dot={{ fill: '#30F2B3', strokeWidth: 2, r: 6 }} />
              <Line type="monotone" dataKey="clicks" stroke="#5A2EFF" strokeWidth={2} dot={{ fill: '#5A2EFF', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" stroke="#3A3D4D" fontSize={12} />
              <YAxis stroke="#3A3D4D" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FAFAFB', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Area type="monotone" dataKey="actual" stackId="1" stroke="#5A2EFF" fill="#5A2EFF" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  // Generate scenario-specific summary content and metrics
  const getSummaryContent = () => {
    switch (scenario.category) {
      case 'Sales':
        return {
          content: 'Q4 performance exceeded expectations with strong revenue growth and improved conversion rates across all channels.',
          metrics: [
            { value: '+24%', label: 'Revenue Growth' },
            { value: '89%', label: 'Target Achievement' },
            { value: '3.2x', label: 'ROI Improvement' }
          ]
        };
      case 'Marketing':
        return {
          content: 'Campaign optimization resulted in significant improvements in customer acquisition and engagement metrics.',
          metrics: [
            { value: '+34%', label: 'CTR Improvement' },
            { value: '67%', label: 'Social Conversions' },
            { value: '$23', label: 'CPA Reduction' }
          ]
        };
      case 'Finance':
        return {
          content: 'Strong financial performance with revenue exceeding budget and improved operational efficiency.',
          metrics: [
            { value: '+11%', label: 'Budget Variance' },
            { value: '23%', label: 'Profit Margin' },
            { value: '-5%', label: 'Cost Reduction' }
          ]
        };
      default:
        return {
          content: 'Data analysis reveals positive trends and actionable insights for strategic decision-making.',
          metrics: [
            { value: '+15%', label: 'Growth' },
            { value: '92%', label: 'Accuracy' },
            { value: '5min', label: 'Time Saved' }
          ]
        };
    }
  };

  switch (slide.type) {
    case 'title':
      return (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-electric-indigo/5 to-neon-mint/5 p-6 sm:p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.h1 
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-gray mb-4 lg:mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {slide.title}
            </motion.h1>
            <motion.p 
              className="text-sm sm:text-base lg:text-xl text-slate-gray/70 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {slide.content}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="mt-6 lg:mt-8 inline-block px-3 py-2 lg:px-4 lg:py-2 bg-electric-indigo/10 text-electric-indigo rounded-full text-xs sm:text-sm font-medium"
            >
              {scenario.category} Analysis
            </motion.div>
          </motion.div>
        </div>
      );

    case 'chart':
      return (
        <div className="h-full p-6 sm:p-8 lg:p-12 bg-ice-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-gray mb-6 lg:mb-8 text-center">
              {slide.title}
            </h2>
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="w-full max-w-4xl"
              >
                {renderChart()}
              </motion.div>
            </div>
          </motion.div>
        </div>
      );

    case 'insights':
      return (
        <div className="h-full p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-slate-50 to-ice-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col justify-center"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-gray mb-8 lg:mb-12 text-center">
              {slide.title}
            </h2>
            <div className="grid gap-4 lg:gap-6 max-w-3xl mx-auto">
              {scenario.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-3 lg:gap-4 p-4 lg:p-6 bg-ice-white rounded-xl shadow-sm border border-slate-gray/10"
                >
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-neon-mint/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-neon-mint" />
                  </div>
                  <p className="text-slate-gray text-sm sm:text-base lg:text-lg leading-relaxed">
                    {insight}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      );

    case 'summary':
      const summaryData = getSummaryContent();
      return (
        <div className="h-full p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-electric-indigo/5 to-neon-mint/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col justify-center text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-12 h-12 lg:w-16 lg:h-16 bg-electric-indigo/10 rounded-full flex items-center justify-center mx-auto mb-6 lg:mb-8"
            >
              <Award className="w-6 h-6 lg:w-8 lg:h-8 text-electric-indigo" />
            </motion.div>
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-gray mb-4 lg:mb-6">
              {slide.title}
            </h2>
            
            <motion.p 
              className="text-sm sm:text-base lg:text-xl text-slate-gray/70 max-w-2xl mx-auto mb-6 lg:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {summaryData.content}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8"
            >
              {summaryData.metrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-electric-indigo">{metric.value}</div>
                  <div className="text-xs lg:text-sm text-slate-gray/60">{metric.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      );

    default:
      return <div>Unknown slide type</div>;
  }
};

export default SlideRenderer;

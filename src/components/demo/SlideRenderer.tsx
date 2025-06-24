
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }} />
              <Line type="monotone" dataKey="clicks" stroke="#4f46e5" strokeWidth={2} dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Area type="monotone" dataKey="actual" stackId="1" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  switch (slide.type) {
    case 'title':
      return (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-electric-indigo/5 to-neon-mint/5 p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-slate-gray mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {slide.title}
            </motion.h1>
            <motion.p 
              className="text-xl text-slate-gray/70 max-w-2xl"
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
              className="mt-8 inline-block px-4 py-2 bg-electric-indigo/10 text-electric-indigo rounded-full text-sm font-medium"
            >
              {scenario.category} Analysis
            </motion.div>
          </motion.div>
        </div>
      );

    case 'chart':
      return (
        <div className="h-full p-12 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col"
          >
            <h2 className="text-3xl font-semibold text-slate-gray mb-8 text-center">
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
        <div className="h-full p-12 bg-gradient-to-br from-slate-50 to-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col justify-center"
          >
            <h2 className="text-3xl font-semibold text-slate-gray mb-12 text-center">
              {slide.title}
            </h2>
            <div className="grid gap-6 max-w-3xl mx-auto">
              {scenario.insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100"
                >
                  <div className="w-8 h-8 bg-neon-mint/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-neon-mint" />
                  </div>
                  <p className="text-slate-gray text-lg leading-relaxed">
                    {insight}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      );

    case 'summary':
      return (
        <div className="h-full p-12 bg-gradient-to-br from-electric-indigo/5 to-purple-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col justify-center text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 bg-electric-indigo/10 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Award className="w-8 h-8 text-electric-indigo" />
            </motion.div>
            
            <h2 className="text-3xl font-semibold text-slate-gray mb-6">
              {slide.title}
            </h2>
            
            <motion.p 
              className="text-xl text-slate-gray/70 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {slide.content}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-8"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-electric-indigo">+15%</div>
                <div className="text-sm text-slate-gray/60">Growth</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-mint">92%</div>
                <div className="text-sm text-slate-gray/60">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">5min</div>
                <div className="text-sm text-slate-gray/60">Time Saved</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      );

    default:
      return <div>Unknown slide type</div>;
  }
};

export default SlideRenderer;


import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { DataScenario } from '../types';
import { getSummaryContent } from './summaryData';

interface SummarySlideProps {
  title: string;
  scenario: DataScenario;
}

const SummarySlide = ({ title, scenario }: SummarySlideProps) => {
  const summaryData = getSummaryContent(scenario);

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
          {title}
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
};

export default SummarySlide;

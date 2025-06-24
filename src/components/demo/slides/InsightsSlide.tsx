
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { DataScenario } from '../types';

interface InsightsSlideProps {
  title: string;
  scenario: DataScenario;
}

const InsightsSlide = ({ title, scenario }: InsightsSlideProps) => {
  return (
    <div className="h-full p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-slate-50 to-ice-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex flex-col justify-center"
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-gray mb-8 lg:mb-12 text-center">
          {title}
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
};

export default InsightsSlide;


import React from 'react';
import { motion } from 'framer-motion';
import { DataScenario } from '../types';
import { renderChart } from './chartRenderers';

interface ChartSlideProps {
  title: string;
  chartData?: any[];
  scenario: DataScenario;
}

const ChartSlide = ({ title, chartData, scenario }: ChartSlideProps) => {
  return (
    <div className="h-full p-6 sm:p-8 lg:p-12 bg-ice-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex flex-col"
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-gray mb-6 lg:mb-8 text-center">
          {title}
        </h2>
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-4xl"
          >
            {chartData && renderChart({ chartData, scenario })}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChartSlide;

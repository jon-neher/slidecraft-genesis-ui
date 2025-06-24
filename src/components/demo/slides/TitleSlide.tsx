
import React from 'react';
import { motion } from 'framer-motion';
import { DataScenario } from '../types';

interface TitleSlideProps {
  title: string;
  content?: string;
  scenario: DataScenario;
}

const TitleSlide = ({ title, content, scenario }: TitleSlideProps) => {
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
          {title}
        </motion.h1>
        <motion.p 
          className="text-sm sm:text-base lg:text-xl text-slate-gray/70 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {content}
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
};

export default TitleSlide;

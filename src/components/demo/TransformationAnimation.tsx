
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Brain, Palette, FileText, CheckCircle } from 'lucide-react';
import { DataScenario, ProcessingStep } from './types';

const processingSteps: ProcessingStep[] = [
  {
    id: 'analyze',
    title: 'Analyzing Data',
    description: 'Reading and understanding your dataset structure',
    duration: 1000
  },
  {
    id: 'insights',
    title: 'Generating Insights',
    description: 'AI identifying key trends and patterns',
    duration: 1200
  },
  {
    id: 'design',
    title: 'Designing Layout',
    description: 'Creating optimal slide structure and flow',
    duration: 1000
  },
  {
    id: 'brand',
    title: 'Applying Branding',
    description: 'Finalizing colors, fonts, and visual elements',
    duration: 800
  }
];

const stepIcons = {
  analyze: Database,
  insights: Brain,
  design: Palette,
  brand: FileText
};

interface TransformationAnimationProps {
  scenario: DataScenario;
}

const TransformationAnimation = ({ scenario }: TransformationAnimationProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    const processSteps = async () => {
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStepIndex(i);
        
        await new Promise(resolve => 
          setTimeout(resolve, processingSteps[i].duration)
        );
        
        setCompletedSteps(prev => [...prev, processingSteps[i].id]);
      }
    };

    processSteps();
  }, []);

  return (
    <div className="p-6 sm:p-8 lg:p-12 text-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 lg:mb-12"
      >
        <h3 className="text-xl sm:text-2xl font-semibold text-slate-gray mb-2">
          Creating Your Presentation
        </h3>
        <p className="text-sm sm:text-base text-slate-gray/70 px-4">
          Processing "{scenario.title}" with AI-powered intelligence
        </p>
      </motion.div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Progress Line - Hidden on mobile, shown on desktop */}
          <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
            <motion.div
              className="h-full bg-electric-indigo"
              initial={{ width: '0%' }}
              animate={{ 
                width: `${((currentStepIndex + 1) / processingSteps.length) * 100}%` 
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-4">
            {processingSteps.map((step, index) => {
              const IconComponent = stepIcons[step.id as keyof typeof stepIcons];
              const isActive = index === currentStepIndex;
              const isCompleted = completedSteps.includes(step.id);
              
              return (
                <motion.div
                  key={step.id}
                  className="relative text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Step Icon */}
                  <motion.div
                    className={`
                      w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 rounded-full flex items-center justify-center
                      ${isActive ? 'bg-electric-indigo text-ice-white scale-110' : 
                        isCompleted ? 'bg-neon-mint text-ice-white' : 'bg-gray-200 text-slate-gray/60'}
                    `}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      backgroundColor: isActive ? '#5A2EFF' : 
                                     isCompleted ? '#30F2B3' : '#e5e7eb'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="icon"
                          animate={isActive ? { 
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          } : {}}
                          transition={isActive ? { 
                            duration: 1, 
                            repeat: Infinity,
                            repeatType: 'reverse'
                          } : {}}
                        >
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Step Info */}
                  <motion.div
                    animate={{
                      opacity: isActive ? 1 : 0.6,
                      y: isActive ? -2 : 0
                    }}
                  >
                    <h4 className="text-xs sm:text-sm font-medium text-slate-gray mb-1">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-gray/60 hidden sm:block">
                      {step.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Processing Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 lg:mt-12 p-4 bg-gradient-to-r from-electric-indigo/5 to-neon-mint/5 rounded-xl"
        >
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-sm">
            <div className="text-center">
              <div className="font-semibold text-electric-indigo">
                {scenario.sampleData.length}
              </div>
              <div className="text-slate-gray/60 text-xs">Data Points</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-electric-indigo">
                {scenario.insights.length}
              </div>
              <div className="text-slate-gray/60 text-xs">Key Insights</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-electric-indigo">5</div>
              <div className="text-slate-gray/60 text-xs">Slides Generated</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TransformationAnimation;

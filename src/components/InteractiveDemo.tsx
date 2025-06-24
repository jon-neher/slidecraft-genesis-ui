
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Download, RefreshCw, ArrowRight } from 'lucide-react';
import DataScenarioSelector from './demo/DataScenarioSelector';
import TransformationAnimation from './demo/TransformationAnimation';
import PresentationPreview from './demo/PresentationPreview';
import { DataScenario } from './demo/types';

const InteractiveDemo = () => {
  const [currentStep, setCurrentStep] = useState<'select' | 'processing' | 'preview'>('select');
  const [selectedScenario, setSelectedScenario] = useState<DataScenario | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartDemo = (scenario: DataScenario) => {
    setSelectedScenario(scenario);
    setCurrentStep('processing');
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep('preview');
    }, 4000);
  };

  const handleRestart = () => {
    setCurrentStep('select');
    setSelectedScenario(null);
    setIsProcessing(false);
  };

  return (
    <section className="section-padding bg-gradient-to-br from-ice-white to-slate-50">
      <div className="container mx-auto container-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <motion.h2 
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-gray mb-4 lg:mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              See Threadline in Action
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-slate-gray/70 max-w-3xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Experience how Threadline transforms your data into stunning presentations in seconds
            </motion.p>
          </div>

          {/* Demo Container */}
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl lg:rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <AnimatePresence mode="wait">
                {currentStep === 'select' && (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DataScenarioSelector onSelectScenario={handleStartDemo} />
                  </motion.div>
                )}

                {currentStep === 'processing' && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TransformationAnimation scenario={selectedScenario!} />
                  </motion.div>
                )}

                {currentStep === 'preview' && selectedScenario && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PresentationPreview 
                      scenario={selectedScenario}
                      onRestart={handleRestart}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Stats */}
          {currentStep === 'select' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-6 lg:mt-8 text-xs sm:text-sm text-slate-gray/60 px-4"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-mint rounded-full animate-pulse" />
                <span>12,453 presentations generated</span>
              </div>
              <div className="hidden sm:block w-1 h-4 bg-slate-gray/20" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-electric-indigo rounded-full animate-pulse" />
                <span>Average time: 8 seconds</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveDemo;


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';
import { SignedIn, SignedOut, SignUpButton } from '@clerk/clerk-react';
import { DataScenario } from './types';
import SlideRenderer from './SlideRenderer';

interface PresentationPreviewProps {
  scenario: DataScenario;
  onRestart: () => void;
}

const PresentationPreview = ({ scenario, onRestart }: PresentationPreviewProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Generate slides based on scenario
  const slides = [
    {
      id: '1',
      type: 'title' as const,
      title: scenario.title,
      content: `Comprehensive analysis and insights from ${scenario.category.toLowerCase()} data`
    },
    {
      id: '2',
      type: 'chart' as const,
      title: 'Key Metrics Overview',
      chartData: scenario.sampleData
    },
    {
      id: '3',
      type: 'insights' as const,
      title: 'Strategic Insights',
      insights: scenario.insights
    },
    {
      id: '4',
      type: 'summary' as const,
      title: 'Executive Summary',
      content: 'Data-driven recommendations for continued growth and optimization'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleDownload = () => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '/sample-presentation.pdf';
    link.download = `${scenario.title.replace(/\s+/g, '-').toLowerCase()}-presentation.pdf`;
    link.click();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 gap-4">
        <div>
          <h3 className="text-lg sm:text-2xl font-semibold text-slate-gray mb-1">
            Your Presentation is Ready! 🎉
          </h3>
          <p className="text-sm sm:text-base text-slate-gray/70">
            Navigate through your AI-generated slides
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={onRestart} 
            className="flex-1 sm:flex-none touch-target border-slate-gray/20 text-slate-gray hover:bg-slate-gray/5"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Try Another</span>
            <span className="sm:hidden">Restart</span>
          </Button>
          <Button 
            onClick={handleDownload} 
            className="flex-1 sm:flex-none bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white touch-target"
          >
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Download PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="touch-target border-slate-gray/20 text-slate-gray hover:bg-slate-gray/5 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors touch-target ${
                index === currentSlide 
                  ? 'bg-electric-indigo' 
                  : 'bg-slate-gray/30 hover:bg-slate-gray/50'
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="touch-target border-slate-gray/20 text-slate-gray hover:bg-slate-gray/5 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Slide Preview */}
      <Card className="bg-ice-white shadow-lg rounded-xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] max-w-5xl mx-auto border-slate-gray/10">
        <CardContent className="p-0 h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <SlideRenderer 
                slide={slides[currentSlide]} 
                scenario={scenario}
              />
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Slide Counter */}
      <div className="text-center mt-3 lg:mt-4 text-xs sm:text-sm text-slate-gray/60">
        Slide {currentSlide + 1} of {slides.length}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-6 lg:mt-8 p-4 sm:p-6 bg-gradient-to-r from-electric-indigo/5 to-neon-mint/5 rounded-xl border border-slate-gray/10"
      >
        <h4 className="text-base sm:text-lg font-semibold text-slate-gray mb-2">
          Ready to create unlimited presentations?
        </h4>
        <p className="text-sm sm:text-base text-slate-gray/70 mb-4">
          Join thousands of professionals already using Threadline
        </p>
        <SignedOut>
          <SignUpButton mode="modal">
            <Button className="bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white touch-target">
              Join the Waitlist
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center justify-center gap-2 text-slate-gray">
            <CheckCircle className="w-5 h-5 text-neon-mint" />
            You're on the list!
          </div>
        </SignedIn>
      </motion.div>
    </div>
  );
};

export default PresentationPreview;

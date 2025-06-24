
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Download, RefreshCw, ExternalLink } from 'lucide-react';
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
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold text-slate-gray mb-1">
            Your Presentation is Ready! 🎉
          </h3>
          <p className="text-slate-gray/70">
            Navigate through your AI-generated slides
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onRestart}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Another
          </Button>
          <Button onClick={handleDownload} className="btn-primary">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Slide Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide 
                  ? 'bg-electric-indigo' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Slide Preview */}
      <Card className="bg-white shadow-lg rounded-xl overflow-hidden aspect-[16/9] max-w-4xl mx-auto">
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
      <div className="text-center mt-4 text-sm text-slate-gray/60">
        Slide {currentSlide + 1} of {slides.length}
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8 p-6 bg-gradient-to-r from-electric-indigo/5 to-neon-mint/5 rounded-xl"
      >
        <h4 className="text-lg font-semibold text-slate-gray mb-2">
          Ready to create unlimited presentations?
        </h4>
        <p className="text-slate-gray/70 mb-4">
          Join thousands of professionals already using Threadline
        </p>
        <Button className="btn-primary">
          Join the Waitlist
          <ExternalLink className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};

export default PresentationPreview;

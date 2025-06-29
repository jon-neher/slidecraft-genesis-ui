
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { DataScenario } from './types';
import SlideRenderer from './SlideRenderer';
import { generateSlides } from './utils/slideGenerator';
import { usePptxGeneration } from './hooks/usePptxGeneration';
import PresentationHeader from './components/PresentationHeader';
import SlideNavigation from './components/SlideNavigation';
import PresentationCallToAction from './components/PresentationCallToAction';

interface PresentationPreviewProps {
  scenario: DataScenario;
  onRestart: () => void;
}

const PresentationPreview = ({ scenario, onRestart }: PresentationPreviewProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { generatePptx, isGenerating } = usePptxGeneration();
  
  // Generate slides based on scenario
  const slides = generateSlides(scenario);

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

  const handleDownloadPptx = async () => {
    // Convert slides to BasicSlide format for PPTX generation
    const basicSlides = slides.map(slide => ({
      title: slide.title,
      bullets: slide.insights || [],
      images: []
    }));
    
    await generatePptx(scenario, basicSlides);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <PresentationHeader
        scenario={scenario}
        onRestart={onRestart}
        onDownloadPdf={handleDownload}
        onDownloadPptx={handleDownloadPptx}
        isGeneratingPptx={isGenerating}
      />

      {/* Slide Navigation */}
      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onPrevSlide={prevSlide}
        onNextSlide={nextSlide}
        onSlideSelect={setCurrentSlide}
      />

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
      <PresentationCallToAction />
    </div>
  );
};

export default PresentationPreview;

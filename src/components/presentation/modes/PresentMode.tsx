import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slide } from '@/components/SlideDeck';

interface PresentModeProps {
  slides: Slide[];
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  onExit: () => void;
}

const PresentMode = ({ slides, currentSlide, setCurrentSlide, onExit }: PresentModeProps) => {
  return (
    <div className="h-screen bg-black text-white relative">
      <button
        onClick={onExit}
        className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded"
      >
        Exit Fullscreen
      </button>
      
      <div className="h-full flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-6xl bg-white text-black rounded-lg p-12"
          >
            <h1 className="text-4xl font-bold text-slate-gray mb-8">
              {slides[currentSlide]?.title}
            </h1>
            {slides[currentSlide]?.bullets.map((bullet, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="text-xl text-slate-gray/80 mb-4"
              >
                • {bullet}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Presentation Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-lg p-2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentSlide(Math.max(currentSlide - 1, 0))}
          disabled={currentSlide === 0}
          className="text-white hover:bg-white/20"
        >
          Previous
        </Button>
        <span className="text-white px-3">
          {currentSlide + 1} / {slides.length}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentSlide(Math.min(currentSlide + 1, slides.length - 1))}
          disabled={currentSlide === slides.length - 1}
          className="text-white hover:bg-white/20"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default PresentMode;
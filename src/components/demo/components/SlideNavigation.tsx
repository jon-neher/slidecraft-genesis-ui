
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onSlideSelect: (index: number) => void;
}

const SlideNavigation = ({ 
  currentSlide, 
  totalSlides, 
  onPrevSlide, 
  onNextSlide, 
  onSlideSelect 
}: SlideNavigationProps) => {
  return (
    <div className="flex items-center justify-between mb-4 lg:mb-6">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevSlide}
        disabled={currentSlide === 0}
        className="touch-target border-slate-gray/20 text-slate-gray hover:bg-slate-gray/5 disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <div className="flex gap-2">
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            onClick={() => onSlideSelect(index)}
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
        onClick={onNextSlide}
        disabled={currentSlide === totalSlides - 1}
        className="touch-target border-slate-gray/20 text-slate-gray hover:bg-slate-gray/5 disabled:opacity-50"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SlideNavigation;

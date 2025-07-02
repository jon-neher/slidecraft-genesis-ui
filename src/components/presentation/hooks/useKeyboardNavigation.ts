import React from 'react';

interface UseKeyboardNavigationProps {
  mode: string;
  slidesLength: number;
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  onModeChange?: (mode: string) => void;
}

export const useKeyboardNavigation = ({
  mode,
  slidesLength,
  currentSlide,
  setCurrentSlide,
  onModeChange
}: UseKeyboardNavigationProps) => {
  const handleKeyPress = React.useCallback((event: KeyboardEvent) => {
    if (mode !== 'present') return;
    
    switch (event.key) {
      case 'ArrowRight':
      case ' ':
        setCurrentSlide(Math.min(currentSlide + 1, slidesLength - 1));
        break;
      case 'ArrowLeft':
        setCurrentSlide(Math.max(currentSlide - 1, 0));
        break;
      case 'Escape':
        onModeChange?.('view');
        break;
    }
  }, [mode, slidesLength, currentSlide, setCurrentSlide, onModeChange]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
};
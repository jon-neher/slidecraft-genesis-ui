import { useState } from 'react';
import { PresentationMode } from '../types';

export const usePresentationState = (initialMode: PresentationMode = 'view') => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideData, setSlideData] = useState<any>(null);
  const [mode, setMode] = useState<PresentationMode>(initialMode);

  return {
    currentSlide,
    setCurrentSlide,
    slideData,
    setSlideData,
    mode,
    setMode
  };
};
import React, { useState } from 'react';
import { Slide } from '@/components/SlideDeck';
import { useSupabaseClient } from '@/hooks/useSupabaseClient';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { usePresentationActions } from './hooks/usePresentationActions';
import { convertPuckToSlides } from './utils/slideDataConverter';
import PresentMode from './modes/PresentMode';
import EditMode from './modes/EditMode';
import ViewMode from './modes/ViewMode';
import OverviewMode from './modes/OverviewMode';

export type PresentationMode = 'view' | 'edit' | 'present' | 'overview';

interface EnhancedSlideDeckProps {
  slides: Slide[];
  presentationId: string;
  mode?: PresentationMode;
  onModeChange?: (mode: PresentationMode) => void;
  onSave?: (data: any) => void;
}

/**
 * Enhanced presentation system with multiple viewing modes
 */
const EnhancedSlideDeck = ({ 
  slides, 
  presentationId, 
  mode = 'view', 
  onModeChange, 
  onSave 
}: EnhancedSlideDeckProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideData, setSlideData] = useState<any>(null);
  const supabase = useSupabaseClient();

  // Use custom hooks
  useKeyboardNavigation({
    mode,
    slidesLength: slides.length,
    currentSlide,
    setCurrentSlide,
    onModeChange
  });

  const { handleDuplicateSlide, handleDeleteSlide, handleExportPDF } = usePresentationActions(presentationId);

  if (mode === 'edit') {
    return (
      <EditMode 
        slideData={slideData} 
        onSave={onSave} 
        onModeChange={onModeChange} 
      />
    );
  }

  if (mode === 'present') {
    return (
      <PresentMode
        slides={slides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        onExit={() => onModeChange?.('view')}
      />
    );
  }

  if (mode === 'overview') {
    return (
      <OverviewMode
        slides={slides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        onModeChange={onModeChange}
        onDuplicateSlide={handleDuplicateSlide}
        onDeleteSlide={handleDeleteSlide}
      />
    );
  }

  // Default view mode
  return (
    <ViewMode
      slides={slides}
      currentSlide={currentSlide}
      onModeChange={onModeChange}
      onExportPDF={handleExportPDF}
    />
  );
};

export default EnhancedSlideDeck;
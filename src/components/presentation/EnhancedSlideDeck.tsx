/**
 * ENHANCED SLIDE DECK SYSTEM
 * 
 * This is the core presentation component that orchestrates multiple viewing modes.
 * 
 * ARCHITECTURE:
 * - Uses modular mode components (PresentMode, EditMode, ViewMode, OverviewMode)
 * - Integrates with Puck.js for drag-and-drop editing (MIT licensed - commercial safe)
 * - Manages state through custom hooks for reusability
 * - Supports keyboard navigation and presentation controls
 * 
 * IMPORTANT NOTES FOR AI AGENTS:
 * 1. DO NOT inline the mode logic back into this component - keep it modular
 * 2. All modes are in separate files under ./modes/ directory
 * 3. State management is handled by custom hooks in ./hooks/ directory
 * 4. Utility functions are in ./utils/ directory
 * 5. This component should only handle mode routing, not individual mode logic
 * 
 * BREAKING CHANGE PREVENTION:
 * - Maintain the PresentationMode type exports
 * - Keep the modular file structure
 * - Preserve the props interface exactly as defined
 * - Don't merge mode components back into this file
 */
import React from 'react';
import { Slide } from '@/components/SlideDeck';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { usePresentationActions } from './hooks/usePresentationActions';
import { usePresentationState } from './hooks/usePresentationState';
import { PresentationMode } from './types';
import PresentMode from './modes/PresentMode';
import EditMode from './modes/EditMode';
import ViewMode from './modes/ViewMode';
import OverviewMode from './modes/OverviewMode';

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
  mode: initialMode = 'view', 
  onModeChange, 
  onSave 
}: EnhancedSlideDeckProps) => {
  const {
    currentSlide,
    setCurrentSlide,
    slideData,
    mode: internalMode
  } = usePresentationState(initialMode);

  // Use external mode if provided, otherwise use internal
  const currentMode = onModeChange ? initialMode : internalMode;

  // Use custom hooks
  useKeyboardNavigation({
    mode: currentMode,
    slidesLength: slides.length,
    currentSlide,
    setCurrentSlide,
    onModeChange
  });

  const { handleDuplicateSlide, handleDeleteSlide, handleExportPDF } = usePresentationActions(presentationId);

  if (currentMode === 'edit') {
    return (
      <EditMode 
        slideData={slideData} 
        onSave={onSave} 
        onModeChange={onModeChange} 
      />
    );
  }

  if (currentMode === 'present') {
    return (
      <PresentMode
        slides={slides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        onExit={() => onModeChange?.('view')}
      />
    );
  }

  if (currentMode === 'overview') {
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
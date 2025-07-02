/**
 * PRESENTATION CONTROLLER
 * 
 * High-level controller that manages presentation state and mode switching.
 * This component provides a clean API for consuming presentations.
 * 
 * IMPORTANT FOR AI AGENTS:
 * - This is the recommended entry point for using presentations
 * - It handles mode state management internally
 * - Use this instead of EnhancedSlideDeck directly in most cases
 * - Maintains separation between state management and presentation logic
 */
import React from 'react';
import { Slide } from '@/components/SlideDeck';
import { PresentationMode } from './types';
import EnhancedSlideDeck from './EnhancedSlideDeck';

interface PresentationControllerProps {
  slides: Slide[];
  presentationId: string;
  initialMode?: PresentationMode;
  onSave?: (data: any) => void;
}

/**
 * High-level controller for presentation functionality
 * Manages mode switching and data persistence
 */
const PresentationController = ({ 
  slides, 
  presentationId, 
  initialMode = 'view',
  onSave 
}: PresentationControllerProps) => {
  const [mode, setMode] = React.useState<PresentationMode>(initialMode);

  const handleModeChange = (newMode: PresentationMode) => {
    setMode(newMode);
  };

  return (
    <EnhancedSlideDeck
      slides={slides}
      presentationId={presentationId}
      mode={mode}
      onModeChange={handleModeChange}
      onSave={onSave}
    />
  );
};

export default PresentationController;
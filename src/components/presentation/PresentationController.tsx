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
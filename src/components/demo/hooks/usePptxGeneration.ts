
import { useState } from 'react';
import { useSupabaseClient } from '@/hooks/useSupabaseClient';
import { DataScenario } from '../types';
import type { SlideImage } from '@/components/SlideDeck';

interface BasicSlide {
  title: string;
  bullets?: string[];
  images?: SlideImage[];
}

export const usePptxGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabaseClient();

  const generatePptx = async (scenario: DataScenario, slides: BasicSlide[]) => {
    try {
      setIsGenerating(true);
      setError(null);

      // Simple placeholder - PPTX generation disabled for publishing compatibility
      // Create a simple JSON export instead
      const jsonData = JSON.stringify(slides, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });

      const deckId = scenario.id;

      await supabase.storage.from('pptx').upload(`${deckId}.json`, blob, {
        contentType: 'application/json',
      });
    } catch (error) {
      console.error('Error generating PPTX:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate PPTX');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePptx,
    isGenerating,
    error
  };
};

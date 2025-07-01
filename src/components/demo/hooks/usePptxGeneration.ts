
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
      
      // Create download link for the JSON file
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${scenario.id}.json`;
      link.click();
      URL.revokeObjectURL(url);
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

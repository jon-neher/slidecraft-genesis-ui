
import { useState } from 'react';
import PptxGenJS from 'pptxgenjs';
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
  const supabase = useSupabaseClient();

  const generatePptx = async (scenario: DataScenario, slides: BasicSlide[]) => {
    try {
      setIsGenerating(true);
      const pptx = new PptxGenJS();

      slides.forEach((s) => {
        const slide = pptx.addSlide();
        slide.addText(s.title, { x: 0.5, y: 0.5, fontSize: 24 });
        s.bullets?.forEach((b, i) => {
          slide.addText(b, { x: 0.5, y: 1 + i * 0.5, fontSize: 16, bullet: true });
        });
        s.images?.forEach((img) => {
          slide.addImage({ path: img.src, x: img.x, y: img.y, w: img.w, h: img.h });
        });
      });

      // Generate the PPTX file as ArrayBuffer using the correct WriteProps format
      const arrayBuffer = await pptx.write({ outputType: 'arraybuffer' }) as ArrayBuffer;
      const blob = new Blob([arrayBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      });

      const deckId = scenario.id;

      await supabase.storage.from('pptx').upload(`${deckId}.pptx`, blob, {
        contentType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      });
    } catch (error) {
      console.error('Error generating PPTX:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generatePptx,
    isGenerating
  };
};

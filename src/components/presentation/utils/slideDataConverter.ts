/**
 * SLIDE DATA CONVERTER UTILITIES
 * 
 * Critical conversion functions between Puck editor data and presentation formats.
 * 
 * IMPORTANT FOR AI AGENTS:
 * - This is the bridge between Puck's component data and our Slide interface
 * - Changes here affect both the editor and presentation rendering
 * - Must maintain compatibility with both data formats
 * - Test thoroughly when modifying conversion logic
 * 
 * DATA FLOW:
 * Puck Components -> convertPuckToSlides() -> Slide[] -> SlideDeck rendering
 */
import { Slide } from '@/components/SlideDeck';

/**
 * Convert Puck data to Slide format
 * Critical function for data consistency between editor and presentation
 */
export const convertPuckToSlides = (puckData: any): Slide[] => {
  if (!puckData?.content) return [];
  
  return puckData.content.map((item: any, index: number) => {
    let title = `Slide ${index + 1}`;
    let bullets: string[] = [];
    let images: any[] = [];

    // Extract data based on component type
    if (item.type === 'SlideTitle') {
      title = item.props?.text || title;
    } else if (item.type === 'SlideText') {
      title = item.props?.text?.substring(0, 50) + '...' || title;
    } else if (item.type === 'SlideBullets') {
      bullets = item.props?.items?.map((i: any) => i.text) || [];
      title = bullets[0]?.substring(0, 50) + '...' || title;
    } else if (item.type === 'SlideImage') {
      images = [{
        src: item.props?.src || '/placeholder.svg',
        x: 0, y: 0, w: 100, h: 100
      }];
      title = item.props?.alt || title;
    }

    return { title, bullets, images };
  });
};
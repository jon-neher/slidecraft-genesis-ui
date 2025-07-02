import { Slide } from '@/components/SlideDeck';

/**
 * Convert Puck data to Slide format
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
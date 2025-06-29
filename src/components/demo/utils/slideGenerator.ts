
import { DataScenario, ChartData } from '../types';

export interface GeneratedSlide {
  id: string;
  type: 'title' | 'chart' | 'insights' | 'summary';
  title: string;
  content?: string;
  chartData?: ChartData;
  insights?: string[];
}

export const generateSlides = (scenario: DataScenario): GeneratedSlide[] => {
  return [
    {
      id: '1',
      type: 'title' as const,
      title: scenario.title,
      content: `Comprehensive analysis and insights from ${scenario.category.toLowerCase()} data`
    },
    {
      id: '2',
      type: 'chart' as const,
      title: 'Key Metrics Overview',
      chartData: scenario.sampleData
    },
    {
      id: '3',
      type: 'insights' as const,
      title: 'Strategic Insights',
      insights: scenario.insights
    },
    {
      id: '4',
      type: 'summary' as const,
      title: 'Executive Summary',
      content: 'Data-driven recommendations for continued growth and optimization'
    }
  ];
};

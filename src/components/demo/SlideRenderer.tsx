
import React from 'react';
import { DataScenario, ChartData } from './types';
import TitleSlide from './slides/TitleSlide';
import ChartSlide from './slides/ChartSlide';
import InsightsSlide from './slides/InsightsSlide';
import SummarySlide from './slides/SummarySlide';

interface Slide {
  id: string;
  type: 'title' | 'chart' | 'insights' | 'summary';
  title: string;
  content?: string;
  chartData?: ChartData;
  insights?: string[];
}

interface SlideRendererProps {
  slide: Slide;
  scenario: DataScenario;
}

const SlideRenderer = ({ slide, scenario }: SlideRendererProps) => {
  switch (slide.type) {
    case 'title':
      return (
        <TitleSlide 
          title={slide.title} 
          content={slide.content} 
          scenario={scenario} 
        />
      );

    case 'chart':
      return (
        <ChartSlide 
          title={slide.title} 
          chartData={slide.chartData} 
          scenario={scenario} 
        />
      );

    case 'insights':
      return (
        <InsightsSlide 
          title={slide.title} 
          scenario={scenario} 
        />
      );

    case 'summary':
      return (
        <SummarySlide 
          title={slide.title} 
          scenario={scenario} 
        />
      );

    default:
      return <div>Unknown slide type</div>;
  }
};

export default SlideRenderer;

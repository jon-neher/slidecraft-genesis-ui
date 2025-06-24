
export interface DataScenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  sampleData: any[];
  chartType: 'bar' | 'line' | 'pie' | 'area';
  insights: string[];
  templates: PresentationTemplate[];
}

export interface PresentationTemplate {
  id: string;
  name: string;
  slides: Slide[];
  primaryColor: string;
  secondaryColor: string;
}

export interface Slide {
  id: string;
  type: 'title' | 'chart' | 'insights' | 'summary';
  title: string;
  content?: string;
  chartData?: any[];
  insights?: string[];
}

export interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  duration: number;
}

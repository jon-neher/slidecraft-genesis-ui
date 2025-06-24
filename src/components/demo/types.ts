
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
  dataSource?: DataSource;
}

export interface DataSource {
  name: string;
  type: string;
  description: string;
  recordCount: number;
  lastUpdated: string;
  fields: DataField[];
}

export interface DataField {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  description: string;
  sampleValue: any;
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


import { DataScenario } from '../types';

interface SummaryMetric {
  value: string;
  label: string;
}

interface SummaryData {
  content: string;
  metrics: SummaryMetric[];
}

export const getSummaryContent = (scenario: DataScenario): SummaryData => {
  switch (scenario.category) {
    case 'Sales':
      return {
        content: 'Q4 performance exceeded expectations with strong revenue growth and improved conversion rates across all channels.',
        metrics: [
          { value: '+24%', label: 'Revenue Growth' },
          { value: '89%', label: 'Target Achievement' },
          { value: '3.2x', label: 'ROI Improvement' }
        ]
      };
    case 'Marketing':
      return {
        content: 'Campaign optimization resulted in significant improvements in customer acquisition and engagement metrics.',
        metrics: [
          { value: '+34%', label: 'CTR Improvement' },
          { value: '67%', label: 'Social Conversions' },
          { value: '$23', label: 'CPA Reduction' }
        ]
      };
    case 'Finance':
      return {
        content: 'Strong financial performance with revenue exceeding budget and improved operational efficiency.',
        metrics: [
          { value: '+11%', label: 'Budget Variance' },
          { value: '23%', label: 'Profit Margin' },
          { value: '-5%', label: 'Cost Reduction' }
        ]
      };
    default:
      return {
        content: 'Data analysis reveals positive trends and actionable insights for strategic decision-making.',
        metrics: [
          { value: '+15%', label: 'Growth' },
          { value: '92%', label: 'Accuracy' },
          { value: '5min', label: 'Time Saved' }
        ]
      };
  }
};

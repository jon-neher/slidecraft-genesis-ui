
export interface Entity {
  id: string;
  name: string;
  type: 'company' | 'contact';
  avatar: string;
  stats?: Array<{ label: string; value: string }>;
  recentDecks?: Array<{ id: string; name: string; date: string }>;
}

export interface DeckType {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
}

export interface Activity {
  id: string;
  action: string;
  time: string;
  type: 'generation' | 'update' | 'share';
}

export interface Tip {
  id: string;
  title: string;
  content: string;
}

export const mockEntities: Entity[] = [
  { id: '1', name: 'Acme Corp', type: 'company', avatar: '/placeholder.svg' },
  { id: '2', name: 'TechStart Inc', type: 'company', avatar: '/placeholder.svg' },
  { id: '3', name: 'John Smith', type: 'contact', avatar: '/placeholder.svg' },
  { id: '4', name: 'Sarah Johnson', type: 'contact', avatar: '/placeholder.svg' },
];

export const mockSelectedEntity: Entity = {
  id: '1',
  name: 'Acme Corp',
  type: 'company',
  avatar: '/placeholder.svg',
  stats: [
    { label: 'Revenue', value: '$2.4M' },
    { label: 'Employees', value: '150' },
    { label: 'Industry', value: 'Technology' },
  ],
  recentDecks: [
    { id: '1', name: 'Q4 Review', date: '2 days ago' },
    { id: '2', name: 'Product Launch', date: '1 week ago' },
    { id: '3', name: 'Investor Pitch', date: '2 weeks ago' },
  ]
};

export const mockDeckTypes: DeckType[] = [
  { id: '1', name: 'Sales Pitch', description: 'Compelling presentations for prospects', thumbnail: '/placeholder.svg', category: 'Sales' },
  { id: '2', name: 'Investor Deck', description: 'Funding and investment presentations', thumbnail: '/placeholder.svg', category: 'Finance' },
  { id: '3', name: 'Product Launch', description: 'Showcase new products and features', thumbnail: '/placeholder.svg', category: 'Marketing' },
  { id: '4', name: 'Quarterly Review', description: 'Business performance summaries', thumbnail: '/placeholder.svg', category: 'Business' },
  { id: '5', name: 'Team Training', description: 'Educational and onboarding content', thumbnail: '/placeholder.svg', category: 'HR' },
  { id: '6', name: 'Client Report', description: 'Project updates and deliverables', thumbnail: '/placeholder.svg', category: 'Operations' },
];

export const mockActivity: Activity[] = [
  { id: '1', action: 'Generated Sales Pitch for Acme Corp', time: '2 minutes ago', type: 'generation' },
  { id: '2', action: 'Updated Investor Deck template', time: '1 hour ago', type: 'update' },
  { id: '3', action: 'Shared Q4 Review with team', time: '3 hours ago', type: 'share' },
];

export const mockTips: Tip[] = [
  { id: '1', title: 'Pro Tip: Use Data Storytelling', content: 'Structure your deck to tell a compelling story with your data points.' },
  { id: '2', title: 'Quick Win: Consistent Branding', content: 'Ensure all slides follow your company brand guidelines for professional impact.' },
  { id: '3', title: 'Best Practice: Less is More', content: 'Limit each slide to one key message for maximum audience retention.' },
];

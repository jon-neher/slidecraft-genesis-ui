import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, Users, TrendingUp } from 'lucide-react';

interface SlideTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  slides: number;
}

const slideTemplates: SlideTemplate[] = [
  {
    id: 'business-pitch',
    name: 'Business Pitch',
    description: 'Professional pitch deck for business presentations',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    category: 'Business',
    slides: 12
  },
  {
    id: 'product-demo',
    name: 'Product Demo',
    description: 'Showcase your product features and benefits',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
    category: 'Product',
    slides: 8
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Present data insights and analytics',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    category: 'Analytics',
    slides: 15
  },
  {
    id: 'team-meeting',
    name: 'Team Meeting',
    description: 'Weekly team updates and progress reports',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
    category: 'Meeting',
    slides: 6
  },
  {
    id: 'project-status',
    name: 'Project Status',
    description: 'Track project milestones and deliverables',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    category: 'Project',
    slides: 10
  },
  {
    id: 'quarterly-review',
    name: 'Quarterly Review',
    description: 'Comprehensive quarterly business review',
    thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
    category: 'Business',
    slides: 20
  }
];

interface SlideTemplateGalleryProps {
  onSelectTemplate: (template: SlideTemplate) => void;
}

const SlideTemplateGallery = ({ onSelectTemplate }: SlideTemplateGalleryProps) => {
  const categories = [...new Set(slideTemplates.map(t => t.category))];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-gray mb-2">Choose a Template</h2>
        <p className="text-slate-gray/70">Start with a professionally designed template or create from scratch</p>
      </div>

      {/* Quick Start Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-electric-indigo border-2 bg-electric-indigo/5">
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 text-electric-indigo mx-auto mb-2" />
            <h3 className="font-semibold text-slate-gray mb-1">Blank Presentation</h3>
            <p className="text-sm text-slate-gray/70 mb-3">Start from scratch with a blank canvas</p>
            <Button onClick={() => onSelectTemplate({
              id: 'blank',
              name: 'Blank Presentation',
              description: 'Start from scratch',
              thumbnail: '',
              category: 'Custom',
              slides: 1
            })} className="w-full">
              Create Blank
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-neon-mint mx-auto mb-2" />
            <h3 className="font-semibold text-slate-gray mb-1">Quick Start</h3>
            <p className="text-sm text-slate-gray/70 mb-3">5-slide template for quick presentations</p>
            <Button variant="outline" onClick={() => onSelectTemplate(slideTemplates[0])} className="w-full">
              Quick Start
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-soft-coral mx-auto mb-2" />
            <h3 className="font-semibold text-slate-gray mb-1">AI Generated</h3>
            <p className="text-sm text-slate-gray/70 mb-3">Let AI create slides from your content</p>
            <Button variant="outline" className="w-full">
              Generate with AI
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Template Categories */}
      {categories.map(category => (
        <div key={category} className="mb-8">
          <h3 className="text-lg font-semibold text-slate-gray mb-4 flex items-center">
            {category === 'Business' && <Users className="w-5 h-5 mr-2" />}
            {category === 'Product' && <FileText className="w-5 h-5 mr-2" />}
            {category === 'Analytics' && <TrendingUp className="w-5 h-5 mr-2" />}
            {category === 'Meeting' && <Clock className="w-5 h-5 mr-2" />}
            {category === 'Project' && <FileText className="w-5 h-5 mr-2" />}
            {category} Templates
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {slideTemplates
              .filter(template => template.category === category)
              .map(template => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => onSelectTemplate(template)}
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-gray">{template.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {template.slides} slides
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-gray/70 mb-3">{template.description}</p>
                    <Button className="w-full" size="sm">
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SlideTemplateGallery;
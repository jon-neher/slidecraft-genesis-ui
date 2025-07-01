import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Palette, Type, Layout, Sparkles } from 'lucide-react';

interface SlideTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  background: string;
  preview: string;
}

const slideThemes: SlideTheme[] = [
  {
    id: 'electric',
    name: 'Electric',
    primary: 'hsl(var(--electric-indigo))',
    secondary: 'hsl(var(--neon-mint))',
    background: 'hsl(var(--ice-white))',
    preview: 'bg-gradient-to-br from-electric-indigo/10 to-neon-mint/10'
  },
  {
    id: 'professional',
    name: 'Professional',
    primary: 'hsl(var(--slate-gray))',
    secondary: 'hsl(var(--ice-white))',
    background: 'white',
    preview: 'bg-gradient-to-br from-gray-100 to-gray-50'
  },
  {
    id: 'modern',
    name: 'Modern',
    primary: 'hsl(var(--electric-indigo))',
    secondary: 'hsl(var(--soft-coral))',
    background: 'hsl(var(--ice-white))',
    preview: 'bg-gradient-to-br from-electric-indigo/10 to-soft-coral/10'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    primary: 'black',
    secondary: 'hsl(var(--neon-mint))',
    background: 'white',
    preview: 'bg-gradient-to-br from-gray-50 to-white'
  }
];

interface SlideThemeCustomizerProps {
  currentTheme?: SlideTheme;
  onThemeChange: (theme: SlideTheme) => void;
  onClose: () => void;
}

const SlideThemeCustomizer = ({ currentTheme, onThemeChange, onClose }: SlideThemeCustomizerProps) => {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme || slideThemes[0]);
  const [customizations, setCustomizations] = useState({
    fontSize: 'medium',
    fontFamily: 'Inter',
    spacing: 'comfortable',
    borderRadius: 'medium'
  });

  const handleApplyTheme = () => {
    onThemeChange(selectedTheme);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-gray flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Customize Theme
            </h2>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Theme Selection */}
          <div>
            <h3 className="text-lg font-semibold text-slate-gray mb-4 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Choose Theme
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {slideThemes.map(theme => (
                <Card
                  key={theme.id}
                  className={`cursor-pointer transition-all ${
                    selectedTheme.id === theme.id ? 'ring-2 ring-electric-indigo' : ''
                  }`}
                  onClick={() => setSelectedTheme(theme)}
                >
                  <CardContent className="p-3">
                    <div className={`h-16 rounded-md mb-2 ${theme.preview}`}></div>
                    <h4 className="font-medium text-slate-gray text-sm">{theme.name}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Typography */}
            <h4 className="font-semibold text-slate-gray mb-3 flex items-center">
              <Type className="w-4 h-4 mr-2" />
              Typography
            </h4>
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-gray mb-1">Font Family</label>
                <Select value={customizations.fontFamily} onValueChange={(value) => 
                  setCustomizations(prev => ({ ...prev, fontFamily: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Helvetica">Helvetica</SelectItem>
                    <SelectItem value="Georgia">Georgia</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-gray mb-1">Font Size</label>
                <Select value={customizations.fontSize} onValueChange={(value) => 
                  setCustomizations(prev => ({ ...prev, fontSize: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Layout */}
            <h4 className="font-semibold text-slate-gray mb-3 flex items-center">
              <Layout className="w-4 h-4 mr-2" />
              Layout
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-gray mb-1">Spacing</label>
                <Select value={customizations.spacing} onValueChange={(value) => 
                  setCustomizations(prev => ({ ...prev, spacing: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-gray mb-1">Border Radius</label>
                <Select value={customizations.borderRadius} onValueChange={(value) => 
                  setCustomizations(prev => ({ ...prev, borderRadius: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h3 className="text-lg font-semibold text-slate-gray mb-4">Preview</h3>
            <Card className="aspect-[16/9] overflow-hidden">
              <div 
                className={`h-full p-6 ${selectedTheme.preview}`}
                style={{
                  fontFamily: customizations.fontFamily,
                  fontSize: customizations.fontSize === 'small' ? '14px' : customizations.fontSize === 'large' ? '18px' : '16px'
                }}
              >
                <h1 className="text-2xl font-bold text-slate-gray mb-4">Sample Slide Title</h1>
                <div className="space-y-2 text-slate-gray/80">
                  <p>• This is how your content will look</p>
                  <p>• With the selected theme and customizations</p>
                  <p>• Typography and spacing adjustments applied</p>
                </div>
                <div className="mt-6">
                  <Badge style={{ backgroundColor: selectedTheme.primary, color: 'white' }}>
                    Primary Color
                  </Badge>
                  <Badge 
                    className="ml-2" 
                    style={{ backgroundColor: selectedTheme.secondary, color: 'black' }}
                  >
                    Secondary Color
                  </Badge>
                </div>
              </div>
            </Card>

            <div className="mt-6 space-y-3">
              <h4 className="font-semibold text-slate-gray">Theme Details</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="block text-slate-gray/60">Primary</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: selectedTheme.primary }}
                    ></div>
                    <code className="text-xs">{selectedTheme.primary}</code>
                  </div>
                </div>
                <div>
                  <span className="block text-slate-gray/60">Secondary</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: selectedTheme.secondary }}
                    ></div>
                    <code className="text-xs">{selectedTheme.secondary}</code>
                  </div>
                </div>
                <div>
                  <span className="block text-slate-gray/60">Background</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border" 
                      style={{ backgroundColor: selectedTheme.background }}
                    ></div>
                    <code className="text-xs">{selectedTheme.background}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              Save as Custom Theme
            </Button>
            <Button onClick={handleApplyTheme}>
              Apply Theme
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SlideThemeCustomizer;
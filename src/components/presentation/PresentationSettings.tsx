import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  Type, 
  Layout, 
  Zap, 
  Users, 
  Lock,
  Globe,
  Eye,
  EyeOff,
  Link,
  Download,
  Trash2,
  Archive
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface PresentationSettingsProps {
  presentationId: string;
  currentSettings: any;
  onSave: (settings: any) => void;
  onClose: () => void;
}

const PresentationSettings = ({ presentationId, currentSettings, onSave, onClose }: PresentationSettingsProps) => {
  const [settings, setSettings] = useState({
    title: currentSettings?.title || '',
    description: currentSettings?.description || '',
    isPublic: currentSettings?.isPublic || false,
    allowComments: currentSettings?.allowComments || true,
    autoPlay: currentSettings?.autoPlay || false,
    showControls: currentSettings?.showControls || true,
    transitionSpeed: currentSettings?.transitionSpeed || 'medium',
    theme: currentSettings?.theme || 'electric',
    password: currentSettings?.password || '',
    collaborators: currentSettings?.collaborators || [],
    ...currentSettings
  });

  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'sharing', label: 'Sharing', icon: Users },
    { id: 'advanced', label: 'Advanced', icon: Zap }
  ];

  const handleSave = () => {
    onSave(settings);
    toast.success('Settings saved successfully');
    onClose();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">
                Presentation Title
              </label>
              <Input
                value={settings.title}
                onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter presentation title..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">
                Description
              </label>
              <Input
                value={settings.description}
                onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description..."
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-gray">Auto-play slides</h4>
                  <p className="text-sm text-slate-gray/70">Automatically advance slides during presentation</p>
                </div>
                <Switch
                  checked={settings.autoPlay}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoPlay: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-gray">Show navigation controls</h4>
                  <p className="text-sm text-slate-gray/70">Display previous/next buttons during presentation</p>
                </div>
                <Switch
                  checked={settings.showControls}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showControls: checked }))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">
                Transition Speed
              </label>
              <Select value={settings.transitionSpeed} onValueChange={(value) => 
                setSettings(prev => ({ ...prev, transitionSpeed: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-gray mb-3">
                Theme
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['electric', 'professional', 'modern', 'minimal'].map(theme => (
                  <Card
                    key={theme}
                    className={`cursor-pointer transition-all ${
                      settings.theme === theme ? 'ring-2 ring-electric-indigo' : ''
                    }`}
                    onClick={() => setSettings(prev => ({ ...prev, theme }))}
                  >
                    <CardContent className="p-3">
                      <div className={`h-12 rounded mb-2 ${
                        theme === 'electric' ? 'bg-gradient-to-br from-electric-indigo/10 to-neon-mint/10' :
                        theme === 'professional' ? 'bg-gradient-to-br from-gray-100 to-gray-50' :
                        theme === 'modern' ? 'bg-gradient-to-br from-blue-100 to-purple-100' :
                        'bg-gradient-to-br from-gray-50 to-white'
                      }`}></div>
                      <h4 className="font-medium text-slate-gray text-sm capitalize">{theme}</h4>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium text-slate-gray mb-3 flex items-center">
                <Type className="w-4 h-4 mr-2" />
                Typography
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-gray mb-1">Font Family</label>
                  <Select value="Inter">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'sharing':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-gray flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Public presentation
                  </h4>
                  <p className="text-sm text-slate-gray/70">Anyone with the link can view this presentation</p>
                </div>
                <Switch
                  checked={settings.isPublic}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, isPublic: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-gray">Allow comments</h4>
                  <p className="text-sm text-slate-gray/70">Viewers can leave feedback and comments</p>
                </div>
                <Switch
                  checked={settings.allowComments}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowComments: checked }))}
                />
              </div>
            </div>

            <Separator />

            <div>
              <label className="block text-sm font-medium text-slate-gray mb-2">
                Password Protection (Optional)
              </label>
              <Input
                type="password"
                value={settings.password}
                onChange={(e) => setSettings(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password to protect presentation..."
              />
              <p className="text-xs text-slate-gray/60 mt-1">
                Leave empty for no password protection
              </p>
            </div>

            <div>
              <h4 className="font-medium text-slate-gray mb-3">Sharing Links</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Eye className="w-4 h-4 text-slate-gray" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-gray">View Link</p>
                    <code className="text-xs text-slate-gray/70">
                      {window.location.origin}/view/{presentationId}
                    </code>
                  </div>
                  <Button size="sm" variant="outline">
                    <Link className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Lock className="w-4 h-4 text-slate-gray" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-gray">Present Link</p>
                    <code className="text-xs text-slate-gray/70">
                      {window.location.origin}/present/{presentationId}
                    </code>
                  </div>
                  <Button size="sm" variant="outline">
                    <Link className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-6">
            <Card className="border-soft-coral/20 bg-soft-coral/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-soft-coral flex items-center">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-soft-coral/20 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-gray">Archive presentation</h4>
                    <p className="text-sm text-slate-gray/70">Move this presentation to archive</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-soft-coral/20 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-gray">Delete presentation</h4>
                    <p className="text-sm text-slate-gray/70">Permanently delete this presentation</p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div>
              <h4 className="font-medium text-slate-gray mb-3">Export Options</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export as PDF
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export as PowerPoint
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export as Images
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-gray">Presentation Settings</h2>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div className="flex h-[70vh]">
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-electric-indigo text-white'
                      : 'text-slate-gray hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
          <Badge variant="secondary">
            <Zap className="w-3 h-3 mr-1" />
            Auto-save enabled
          </Badge>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PresentationSettings;

import React, { useState } from 'react';
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { usePresentations } from '@/hooks/usePresentations';
import { useSlideTemplates } from '@/hooks/useSlideTemplates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const PresentationManager = () => {
  const { presentations, loading, createPresentation } = usePresentations();
  const { templates } = useSlideTemplates();
  const { toast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    context: ''
  });

  const handleCreatePresentation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let contextJson = null;
      if (formData.context.trim()) {
        try {
          contextJson = JSON.parse(formData.context);
        } catch {
          // If not valid JSON, store as plain text in a simple object
          contextJson = { description: formData.context };
        }
      }

      await createPresentation({
        title: formData.title,
        context: contextJson
      });

      toast({
        title: 'Success',
        description: 'Presentation created successfully',
      });

      setFormData({ title: '', context: '' });
      setIsCreateOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create presentation',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 animate-spin" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'in_progress':
        return 'default';
      case 'complete':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading presentations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Presentations</h2>
          <p className="text-muted-foreground">
            Manage your AI-powered presentation projects
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Presentation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Presentation</DialogTitle>
              <DialogDescription>
                Start a new AI-powered presentation project
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePresentation} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter presentation title"
                  required
                />
              </div>
              <div>
                <Label htmlFor="context">Context (Optional)</Label>
                <Textarea
                  id="context"
                  value={formData.context}
                  onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                  placeholder="Enter context or JSON data for the presentation"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Presentation</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {presentations.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No presentations yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first AI-powered presentation to get started
            </p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Presentation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {presentations.map((presentation) => (
            <Card key={presentation.presentation_id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{presentation.title}</CardTitle>
                  <Badge variant={getStatusColor(presentation.generation_status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(presentation.generation_status)}
                      {presentation.generation_status}
                    </div>
                  </Badge>
                </div>
                <CardDescription>
                  Created {new Date(presentation.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {presentation.context && (
                  <div className="text-sm text-muted-foreground">
                    <p className="line-clamp-2">
                      {typeof presentation.context === 'object' 
                        ? JSON.stringify(presentation.context, null, 2).slice(0, 100) + '...'
                        : String(presentation.context).slice(0, 100) + '...'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {templates.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Available Templates ({templates.length})</h3>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.template_id} className="p-3">
                <div className="font-medium">{template.name}</div>
                <div className="text-sm text-muted-foreground">
                  Updated {new Date(template.updated_at).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PresentationManager;

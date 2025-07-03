
import React, { useState } from 'react';
import { Plus, FileText, Clock, CheckCircle, AlertCircle, Play, Eye } from 'lucide-react';
import { usePresentations } from '@/hooks/usePresentations';
import { usePresentationJobs } from '@/hooks/usePresentationJobs';
import { useSlideTemplates } from '@/hooks/useSlideTemplates';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const PresentationManager = () => {
  const { presentations, loading } = usePresentations();
  const { jobs, createPresentationRequest } = usePresentationJobs();
  const { templates } = useSlideTemplates();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    presentation_type: '',
    slide_count_preference: undefined as number | undefined
  });

  const handleCreatePresentation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createPresentationRequest({
        title: formData.title,
        description: formData.description,
        presentation_type: formData.presentation_type,
        slide_count_preference: formData.slide_count_preference
      });

      setFormData({ 
        title: '', 
        description: '', 
        presentation_type: '',
        slide_count_preference: undefined
      });
      setIsCreateOpen(false);
    } catch (error) {
      console.error('Failed to create presentation:', error);
    }
  };

  const handleViewPresentation = (presentationId: string) => {
    navigate(`/view/${presentationId}?mode=view`);
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
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what you want in your presentation"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="presentation_type">Presentation Type</Label>
                <Select value={formData.presentation_type} onValueChange={(value) => setFormData(prev => ({ ...prev, presentation_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select presentation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Presentation</SelectItem>
                    <SelectItem value="marketing">Marketing Deck</SelectItem>
                    <SelectItem value="pitch">Pitch Deck</SelectItem>
                    <SelectItem value="report">Business Report</SelectItem>
                    <SelectItem value="training">Training Material</SelectItem>
                    <SelectItem value="general">General Presentation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="slide_count">Target Slide Count (Optional)</Label>
                <Input
                  id="slide_count"
                  type="number"
                  min="3"
                  max="20"
                  value={formData.slide_count_preference || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    slide_count_preference: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  placeholder="e.g., 10"
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

      {/* Active Jobs Section */}
      {jobs.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Processing Jobs</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Card key={job.job_id} className="border-l-4 border-l-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">Job #{job.job_id.slice(0, 8)}</CardTitle>
                    <Badge variant={getStatusColor(job.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(job.status)}
                        {job.status}
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {job.processing_steps && (
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Progress</span>
                        <span>{job.processing_steps.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${job.processing_steps.progress || 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Current: {job.processing_steps.current_step?.replace('_', ' ')}
                      </p>
                    </div>
                  )}
                  {job.presentation_id && (
                    <Button 
                      size="sm" 
                      className="mt-2 w-full"
                      onClick={() => handleViewPresentation(job.presentation_id!)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Presentation
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Presentations */}
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
            <Card key={presentation.presentation_id} className="hover:shadow-md transition-shadow">
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
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewPresentation(presentation.presentation_id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/view/${presentation.presentation_id}?mode=present`)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Present
                  </Button>
                </div>
                {presentation.context && (
                  <div className="text-sm text-muted-foreground mt-2">
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

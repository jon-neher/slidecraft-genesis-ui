
import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AnimatedContainer from '@/components/shared/AnimatedContainer';
import TouchCard from '@/components/ui/touch-card';
import PresentationFilterBar from './shared/PresentationFilterBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePresentations } from '@/hooks/usePresentations';
import { useSupabaseClient } from '@/hooks/useSupabaseClient';
import { useNavigate } from 'react-router-dom';
import { Eye, Play, Clock, CheckCircle, AlertCircle, FileText, Calendar } from 'lucide-react';
import { devLog } from '@/lib/dev-log';

const DeckGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Recent');
  const isMobile = useIsMobile();
  const { presentations, loading, error, refetch } = usePresentations();
  const supabase = useSupabaseClient();
  
  // Set up real-time subscription for presentation updates
  React.useEffect(() => {
    const channel = supabase
      .channel('presentation-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'presentations_generated'
        },
        () => {
          // Refetch presentations when any change occurs
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, supabase]);
  const navigate = useNavigate();

  const handlePresentationView = (presentationId: string) => {
    devLog('Viewing presentation:', presentationId);
    navigate(`/view/${presentationId}?mode=view`);
  };

  const handlePresentationPresent = (presentationId: string) => {
    devLog('Presenting presentation:', presentationId);
    navigate(`/view/${presentationId}?mode=present`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Filter and sort presentations
  const filteredPresentations = presentations.filter(presentation =>
    presentation.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPresentations = [...filteredPresentations].sort((a, b) => {
    switch (sortBy) {
      case 'Recent':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'Title':
        return a.title.localeCompare(b.title);
      case 'Status':
        return a.generation_status.localeCompare(b.generation_status);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  if (loading) {
    return (
      <div className="space-y-4 lg:space-y-6">
      <PresentationFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Loading your presentations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 lg:space-y-6">
        <PresentationFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <p className="text-red-600">Error loading presentations: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (sortedPresentations.length === 0) {
    return (
      <div className="space-y-4 lg:space-y-6">
        <PresentationFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <div className="flex items-center justify-center py-12">
          <div className="text-center max-w-md">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No presentations yet</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? `No presentations found for "${searchTerm}"`
                : "Create your first AI-powered presentation to get started"
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => navigate('/new-deck')}>
                Create Your First Presentation
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <PresentationFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <AnimatedContainer className={`mobile-grid gap-4 lg:gap-6`}>
        {sortedPresentations.map((presentation) => (
          <TouchCard
            key={presentation.presentation_id}
            onTap={() => handlePresentationView(presentation.presentation_id)}
            className="group cursor-pointer bg-white border border-border shadow-sm hover:shadow-md transition-all duration-200"
            data-tl-presentation-selected={presentation.presentation_id}
          >
            <CardContent className="p-0">
              {/* Thumbnail/Preview Area */}
              <div className={`aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-t-xl flex items-center justify-center relative ${isMobile ? 'py-8' : ''}`}>
                {presentation.thumbnail_url ? (
                  <img
                    src={presentation.thumbnail_url}
                    alt={presentation.title}
                    className="w-full h-full object-cover rounded-t-xl"
                  />
                ) : (
                  <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <span className={`text-white font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
                      {presentation.title.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                )}
                
                {/* Status indicator overlay */}
                <div className="absolute top-2 right-2">
                  <Badge className={`${getStatusColor(presentation.generation_status)} text-xs flex items-center gap-1`}>
                    {getStatusIcon(presentation.generation_status)}
                    {presentation.generation_status}
                  </Badge>
                </div>
              </div>
              
              {/* Content Area */}
              <div className={`bg-white ${isMobile ? 'p-3' : 'p-4'}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 ${isMobile ? 'text-sm' : ''}`}>
                    {presentation.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-1 mb-3 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {new Date(presentation.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePresentationView(presentation.presentation_id);
                    }}
                    className="flex-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  {presentation.generation_status === 'complete' && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePresentationPresent(presentation.presentation_id);
                      }}
                      className="flex-1"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Present
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </TouchCard>
        ))}
      </AnimatedContainer>
    </div>
  );
};

export default DeckGallery;

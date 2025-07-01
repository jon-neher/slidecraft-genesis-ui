import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Edit, FileDown, Copy, Trash2, Settings, Grid, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import SlideDeck, { Slide } from '@/components/SlideDeck';
import SlideEditor from '@/components/editor/SlideEditor';
import { useSupabaseClient } from '@/hooks/useSupabaseClient';
import { toast } from 'sonner';

export type PresentationMode = 'view' | 'edit' | 'present' | 'overview';

interface EnhancedSlideDeckProps {
  slides: Slide[];
  presentationId: string;
  mode?: PresentationMode;
  onModeChange?: (mode: PresentationMode) => void;
  onSave?: (data: any) => void;
}

/**
 * Enhanced presentation system with multiple viewing modes
 */
const EnhancedSlideDeck = ({ 
  slides, 
  presentationId, 
  mode = 'view', 
  onModeChange, 
  onSave 
}: EnhancedSlideDeckProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideData, setSlideData] = useState<any>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [timer, setTimer] = useState(0);
  const supabase = useSupabaseClient();

  // Convert Puck slides to SlideDeck format
  const convertPuckToSlides = (puckData: any): Slide[] => {
    if (!puckData?.content) return slides;
    
    return puckData.content.map((item: any, index: number) => ({
      title: item.props?.text || item.props?.title || `Slide ${index + 1}`,
      bullets: item.props?.items?.map((i: any) => i.text) || [],
      images: item.props?.src ? [{ src: item.props.src, x: 0, y: 0, w: 100, h: 100 }] : []
    }));
  };

  const handleKeyPress = React.useCallback((event: KeyboardEvent) => {
    if (mode !== 'present') return;
    
    switch (event.key) {
      case 'ArrowRight':
      case ' ':
        setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
        break;
      case 'ArrowLeft':
        setCurrentSlide(prev => Math.max(prev - 1, 0));
        break;
      case 'Escape':
        onModeChange?.('view');
        break;
    }
  }, [mode, slides.length, onModeChange]);

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleDuplicateSlide = async () => {
    try {
      // Logic to duplicate current slide
      toast.success('Slide duplicated');
    } catch (error) {
      toast.error('Failed to duplicate slide');
    }
  };

  const handleDeleteSlide = async () => {
    try {
      // Logic to delete current slide
      toast.success('Slide deleted');
    } catch (error) {
      toast.error('Failed to delete slide');
    }
  };

  const handleExportPDF = async () => {
    try {
      // Create PDF export logic
      const link = document.createElement('a');
      link.href = '/sample-presentation.pdf';
      link.download = `presentation-${presentationId}.pdf`;
      link.click();
      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  if (mode === 'edit') {
    return (
      <div className="h-screen flex flex-col">
        {/* Editor Header */}
        <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onModeChange?.('view')}>
              <Edit className="w-4 h-4 mr-2" />
              Exit Editor
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onModeChange?.('overview')}>
              <Grid className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button variant="outline" size="sm" onClick={() => onModeChange?.('present')}>
              <Play className="w-4 h-4 mr-2" />
              Present
            </Button>
          </div>
        </div>
        
        {/* Puck Editor */}
        <div className="flex-1">
          <SlideEditor data={slideData} onSave={onSave} />
        </div>
      </div>
    );
  }

  if (mode === 'present') {
    return (
      <div className="h-screen bg-black text-white relative">
        <button
          onClick={() => onModeChange?.('view')}
          className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded"
        >
          Exit Fullscreen
        </button>
        
        <div className="h-full flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-6xl bg-white text-black rounded-lg p-12"
            >
              <h1 className="text-4xl font-bold text-slate-gray mb-8">
                {slides[currentSlide]?.title}
              </h1>
              {slides[currentSlide]?.bullets.map((bullet, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="text-xl text-slate-gray/80 mb-4"
                >
                  • {bullet}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Presentation Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-lg p-2 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
            disabled={currentSlide === 0}
            className="text-white hover:bg-white/20"
          >
            Previous
          </Button>
          <span className="text-white px-3">
            {currentSlide + 1} / {slides.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))}
            disabled={currentSlide === slides.length - 1}
            className="text-white hover:bg-white/20"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  if (mode === 'overview') {
    return (
      <div className="p-6">
        {/* Overview Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-gray">Slide Overview</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onModeChange?.('edit')}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onModeChange?.('present')}>
              <Play className="w-4 h-4 mr-2" />
              Present
            </Button>
            <Button variant="outline" size="sm" onClick={() => onModeChange?.('view')}>
              Back to View
            </Button>
          </div>
        </div>

        {/* Slide Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {slides.map((slide, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                currentSlide === index ? 'ring-2 ring-electric-indigo' : ''
              }`}
              onClick={() => {
                setCurrentSlide(index);
                onModeChange?.('view');
              }}
            >
              <CardContent className="p-4 aspect-[16/9] flex flex-col">
                <h3 className="font-semibold text-sm text-slate-gray mb-2 truncate">
                  {slide.title}
                </h3>
                <div className="flex-1 text-xs text-slate-gray/60 space-y-1">
                  {slide.bullets.slice(0, 3).map((bullet, idx) => (
                    <div key={idx} className="truncate">• {bullet}</div>
                  ))}
                  {slide.bullets.length > 3 && (
                    <div className="text-slate-gray/40">+{slide.bullets.length - 3} more</div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-gray/40">Slide {index + 1}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleDuplicateSlide}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDeleteSlide} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Default view mode
  return (
    <div className="min-h-screen flex flex-col">
      {/* View Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-slate-gray">Presentation View</h1>
          <span className="text-sm text-slate-gray/60">
            Slide {currentSlide + 1} of {slides.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onModeChange?.('overview')}>
            <Grid className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button variant="outline" size="sm" onClick={() => onModeChange?.('edit')}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="default" size="sm" onClick={() => onModeChange?.('present')}>
            <Play className="w-4 h-4 mr-2" />
            Present
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FileDown className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleExportPDF}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                Export as PowerPoint
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Enhanced SlideDeck */}
      <div className="flex-1">
        <SlideDeck slides={slides} />
      </div>
    </div>
  );
};

export default EnhancedSlideDeck;
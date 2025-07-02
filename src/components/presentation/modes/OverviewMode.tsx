import React from 'react';
import { Edit, Play, Copy, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Slide } from '@/components/SlideDeck';

interface OverviewModeProps {
  slides: Slide[];
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  onModeChange?: (mode: string) => void;
  onDuplicateSlide?: () => void;
  onDeleteSlide?: () => void;
}

const OverviewMode = ({ 
  slides, 
  currentSlide, 
  setCurrentSlide, 
  onModeChange, 
  onDuplicateSlide, 
  onDeleteSlide 
}: OverviewModeProps) => {
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
                    <DropdownMenuItem onClick={onDuplicateSlide}>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onDeleteSlide} className="text-red-600">
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
};

export default OverviewMode;
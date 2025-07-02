import React from 'react';
import { Play, Edit, Grid, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import SlideDeck, { Slide } from '@/components/SlideDeck';

interface ViewModeProps {
  slides: Slide[];
  currentSlide: number;
  onModeChange?: (mode: string) => void;
  onExportPDF?: () => void;
}

const ViewMode = ({ slides, currentSlide, onModeChange, onExportPDF }: ViewModeProps) => {
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
              <DropdownMenuItem onClick={onExportPDF}>
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

export default ViewMode;
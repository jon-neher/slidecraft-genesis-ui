
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';
import { DataScenario } from '../types';

interface PresentationHeaderProps {
  scenario: DataScenario;
  onRestart: () => void;
  onDownloadPdf: () => void;
  onDownloadPptx: () => void;
  isGeneratingPptx?: boolean;
}

const PresentationHeader = ({ 
  scenario, 
  onRestart, 
  onDownloadPdf, 
  onDownloadPptx,
  isGeneratingPptx = false
}: PresentationHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 gap-4">
      <div>
        <h3 className="text-lg sm:text-2xl font-semibold text-slate-gray mb-1">
          Your Presentation is Ready! 🎉
        </h3>
        <p className="text-sm sm:text-base text-slate-gray/70">
          Navigate through your AI-generated slides
        </p>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          onClick={onRestart}
          className="flex-1 sm:flex-none touch-target border-slate-gray/20 text-slate-gray hover:bg-slate-gray/5"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Try Another</span>
          <span className="sm:hidden">Restart</span>
        </Button>
        <Button
          onClick={onDownloadPdf}
          className="flex-1 sm:flex-none bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white touch-target"
        >
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Download PDF</span>
          <span className="sm:hidden">PDF</span>
        </Button>
        <Button
          onClick={onDownloadPptx}
          disabled={isGeneratingPptx}
          className="flex-1 sm:flex-none bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white touch-target"
        >
          <Download className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">
            {isGeneratingPptx ? 'Generating...' : 'Download PPTX'}
          </span>
          <span className="sm:hidden">PPTX</span>
        </Button>
      </div>
    </div>
  );
};

export default PresentationHeader;

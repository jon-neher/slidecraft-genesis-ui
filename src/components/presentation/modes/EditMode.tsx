import React from 'react';
import { Edit, Grid, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SlideEditor from '@/components/editor/SlideEditor';

interface EditModeProps {
  slideData: any;
  onSave?: (data: any) => void;
  onModeChange?: (mode: string) => void;
}

const EditMode = ({ slideData, onSave, onModeChange }: EditModeProps) => {
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
};

export default EditMode;
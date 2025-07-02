/**
 * PUCK-BASED SLIDE EDITOR
 * 
 * This component integrates @measured/puck for drag-and-drop slide editing.
 * 
 * COMMERCIAL LICENSING NOTICE:
 * - Puck is MIT licensed - safe for commercial use
 * - Always verify license compatibility when updating Puck
 * - Current version: 0.19.1 (MIT)
 * 
 * INTEGRATION PATTERNS FOR AI AGENTS:
 * - The slideConfig in puckConfig.ts defines available components
 * - Data flows: Puck data -> slideDataConverter -> Slide format
 * - onSave callback handles persistence to Supabase
 * - Component registration happens in puckConfig.ts
 * 
 * DO NOT:
 * - Replace Puck with another editor without license review
 * - Modify the data flow without updating slideDataConverter
 * - Remove the slideConfig - it's required for Puck components
 */
import React from 'react';
import { Puck, Config } from '@measured/puck';
import { slideConfig } from './puckConfig';

interface SlideEditorProps {
  /** Initial slide data */
  data?: any;
  /** Callback when slide data changes */
  onSave?: (data: any) => void;
  /** Whether editor is in read-only mode */
  readOnly?: boolean;
}

/**
 * Puck-based slide editor component
 */
const SlideEditor = ({ data, onSave, readOnly = false }: SlideEditorProps) => {
  const handlePublish = (data: any) => {
    onSave?.(data);
  };

  return (
    <div className="h-full">
      <Puck
        config={slideConfig}
        data={data}
        onPublish={handlePublish}
        permissions={{
          publish: !readOnly,
          edit: !readOnly,
        }}
      />
    </div>
  );
};

export default SlideEditor;
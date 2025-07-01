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
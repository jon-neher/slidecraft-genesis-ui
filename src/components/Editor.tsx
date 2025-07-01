import React from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * Placeholder editor component. The Puck editor is not supported in this environment.
 */
const Editor = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-6 space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Slide Editor</h2>
        <p className="text-gray-600 mb-4">
          Editing presentation: {id}
        </p>
        <p className="text-sm text-gray-500">
          Visual editor will be available in a future update.
        </p>
      </div>
      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
        Coming Soon
      </Button>
    </div>
  );
};

export default Editor;

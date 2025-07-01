import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import SlideEditor from "@/components/editor/SlideEditor";
import { toast } from "sonner";

/**
 * Full-featured slide editor using Puck
 */
const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const supabase = useSupabaseClient();
  const [slideData, setSlideData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [presentation, setPresentation] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    
    const loadPresentation = async () => {
      try {
        // Load presentation details
        const { data: presentation } = await supabase
          .from("presentations_generated")
          .select("*")
          .eq("presentation_id", id)
          .single();

        if (presentation) {
          setPresentation(presentation);
          
          // Load latest revision
          const { data: revision } = await supabase
            .from("presentations_revisions")
            .select("slides")
            .eq("presentation_id", id)
            .order("version", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (revision?.slides) {
            setSlideData(revision.slides);
          } else {
            // Create default slide structure
            setSlideData({
              content: [],
              root: { background: 'bg-white' }
            });
          }
        }
      } catch (error) {
        console.error('Error loading presentation:', error);
        toast.error('Failed to load presentation');
      } finally {
        setLoading(false);
      }
    };

    loadPresentation();
  }, [id, supabase]);

  const handleSave = async (data: any) => {
    if (!id || !presentation) return;

    try {
      // Get current highest version
      const { data: latestRevision } = await supabase
        .from("presentations_revisions")
        .select("version")
        .eq("presentation_id", id)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextVersion = (latestRevision?.version || 0) + 1;

      // Save new revision
      const { error } = await supabase
        .from("presentations_revisions")
        .insert({
          presentation_id: id,
          slides: data,
          version: nextVersion,
          created_by: presentation.user_id
        });

      if (error) throw error;

      toast.success('Presentation saved successfully');
      setSlideData(data);
    } catch (error) {
      console.error('Error saving presentation:', error);
      toast.error('Failed to save presentation');
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-indigo mx-auto"></div>
          <p className="mt-2 text-slate-gray">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!presentation) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-gray mb-4">Presentation Not Found</h2>
          <p className="text-slate-gray/70">The presentation you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
      <SlideEditor
        data={slideData}
        onSave={handleSave}
      />
    </div>
  );
};

export default Editor;

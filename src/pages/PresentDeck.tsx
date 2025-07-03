import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import PresentationController from "@/components/presentation/PresentationController";
import { PresentationMode } from "@/components/presentation/types";
import { Slide } from "@/components/SlideDeck";
import { convertPuckToSlides } from "@/components/presentation/utils/slideDataConverter";
import { toast } from "sonner";

const PresentDeck = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const supabase = useSupabaseClient();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const initialModeParam = searchParams.get('mode') as PresentationMode | null;
  const [mode, setMode] = useState<PresentationMode>(initialModeParam || 'present');
  const [presentation, setPresentation] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchSlides = async () => {
      try {
        // Fetch presentation details
        const { data: presentationData } = await supabase
          .from("presentations_generated")
          .select("*")
          .eq("presentation_id", id)
          .single();

        if (!presentationData) {
          toast.error('Presentation not found');
          navigate('/dashboard');
          return;
        }

        setPresentation(presentationData);

        // Fetch latest revision
        const { data: revision } = await supabase
          .from("presentations_revisions")
          .select("slides")
          .eq("presentation_id", id)
          .order("version", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (revision?.slides) {
          // Convert Puck data to Slide format
          const puckData = revision.slides as any;
          const convertedSlides = convertPuckToSlides(puckData);
          setSlides(convertedSlides);
        } else {
          // Fallback to default slides
          setSlides([
            {
              title: "Welcome to Your Presentation",
              bullets: ["This is your first slide", "You can edit this in the editor"],
              images: []
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching slides:', error);
        toast.error('Failed to load presentation');
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, [id, supabase, navigate]);


  const handleSave = async (data: any) => {
    if (!id || !presentation) return;

    try {
      const { data: latestRevision } = await supabase
        .from("presentations_revisions")
        .select("version")
        .eq("presentation_id", id)
        .order("version", { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextVersion = (latestRevision?.version || 0) + 1;

      const { error } = await supabase
        .from("presentations_revisions")
        .insert({
          presentation_id: id,
          slides: data,
          version: nextVersion,
          created_by: presentation.user_id
        });

      if (error) throw error;

      // Update local slides
      const convertedSlides = convertPuckToSlides(data);
      setSlides(convertedSlides);
      
      toast.success('Presentation saved successfully');
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
          <p className="mt-2 text-slate-gray">Loading presentation...</p>
        </div>
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-gray mb-4">No Slides Found</h2>
          <p className="text-slate-gray/70">This presentation doesn't have any slides yet.</p>
        </div>
      </div>
    );
  }

  return (
    <PresentationController
      slides={slides}
      presentationId={id!}
      initialMode={mode}
      onSave={handleSave}
    />
  );
};

export default PresentDeck;
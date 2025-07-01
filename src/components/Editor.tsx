import React, { useEffect } from "react";
import { Editor as PuckEditor, useEditorState } from "@measured/puck";
import { useSupabaseClient } from "@/hooks/useSupabaseClient";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { Slide } from "./SlideDeck";

interface StoredSlides {
  slides: Slide[];
}

/**
 * Visual editor for building slide decks. Uses the Puck drag-and-drop editor
 * and persists changes to Supabase whenever the user clicks "Save".
 */
const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const supabase = useSupabaseClient();
  const [state, setState] = useEditorState<StoredSlides>({ slides: [] });

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const { data } = await supabase
        .from("presentations_revisions")
        .select("slides")
        .eq("presentation_id", id)
        .order("version", { ascending: false })
        .limit(1)
        .single();
      if (data?.slides) {
        setState({ slides: data.slides as Slide[] });
      }
    };
    load();
  }, [id, supabase, setState]);

  const save = async () => {
    if (!id) return;
    await supabase.from("presentations_revisions").insert({
      presentation_id: id,
      version: Date.now(),
      slides: state.slides,
      created_by: "ui",
    });
  };

  return (
    <div className="p-6 space-y-4">
      <PuckEditor value={state} onChange={setState} blocks={{}} />
      <Button
        className="bg-electric-indigo text-ice-white hover:bg-electric-indigo/90"
        onClick={save}
      >
        Save
      </Button>
    </div>
  );
};

export default Editor;

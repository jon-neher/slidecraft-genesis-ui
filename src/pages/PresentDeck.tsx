import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SlideDeck, { Slide } from "@/components/SlideDeck";
import { useSupabaseClient } from "@/hooks/useSupabaseClient";

const PresentDeck = () => {
  const { id } = useParams<{ id: string }>();
  const supabase = useSupabaseClient();
  const [slides, setSlides] = useState<Slide[] | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchSlides = async () => {
      const { data } = await supabase
        .from("presentations_revisions")
        .select("slides")
        .eq("presentation_id", id)
        .order("version", { ascending: false })
        .limit(1)
        .single();
      if (data?.slides) setSlides(data.slides as Slide[]);
    };
    fetchSlides();
  }, [id, supabase]);

  if (!slides) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return <SlideDeck slides={slides} />;
};

export default PresentDeck;

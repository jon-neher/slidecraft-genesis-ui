import type { Slide } from "@/components/SlideDeck";

/**
 * Simple export function placeholder - PPTX generation disabled for publishing compatibility.
 */
export const exportDeck = async (slides: Slide[], filename: string) => {
  // Create a simple JSON export instead of PPTX
  const jsonData = JSON.stringify(slides, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename.replace('.pptx', '.json');
  link.click();
};

import type { Slide } from "@/components/SlideDeck";

/**
 * Export slides to a PPTX file using PptxGenJS.
 */
export const exportDeck = async (slides: Slide[], filename: string) => {
  const { default: PptxGenJS } = await import("pptxgenjs");
  const pptx = new PptxGenJS();

  slides.forEach((s) => {
    const slide = pptx.addSlide();
    slide.addText(s.title, { x: 0.5, y: 0.5, fontSize: 24 });
    s.bullets.forEach((b, i) => {
      slide.addText(b, { x: 0.5, y: 1 + i * 0.5, fontSize: 16, bullet: true });
    });
    s.images.forEach((img) => {
      slide.addImage({ path: img.src, x: img.x, y: img.y, w: img.w, h: img.h });
    });
  });

  const arrayBuffer = (await pptx.write({
    outputType: "arraybuffer",
  })) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

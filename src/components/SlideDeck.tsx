import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Slide image positioning data */
export interface SlideImage {
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Basic slide structure */
export interface Slide {
  title: string;
  bullets: string[];
  images: SlideImage[];
}

interface SlideDeckProps {
  /** Slides to render */
  slides: Slide[];
}

/**
 * Simple presentation deck with navigation controls.
 */
const SlideDeck = ({ slides }: SlideDeckProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!slides.length) {
    return <div className="p-6 text-center">No slides available</div>;
  }

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Slide Content */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full bg-card rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-foreground">{slide.title}</h2>
          {slide.bullets.length > 0 && (
            <ul className="list-disc pl-6 space-y-3 text-lg text-muted-foreground mb-6">
              {slide.bullets.map((bullet, idx) => (
                <li key={idx}>{bullet}</li>
              ))}
            </ul>
          )}
          {slide.images.map((img, idx) => (
            <img
              key={idx}
              src={img.src}
              alt={`Slide image ${idx + 1}`}
              className="max-w-full h-auto rounded-lg"
              style={{
                position: "relative",
                width: `${Math.min(img.w * 100, 100)}%`,
                height: "auto",
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            {currentSlide + 1} of {slides.length}
          </span>
          
          <Button
            variant="outline"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SlideDeck;

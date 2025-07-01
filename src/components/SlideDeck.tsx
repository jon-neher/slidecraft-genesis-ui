import React, { Suspense, lazy, useEffect } from "react";

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

const SpectacleDeck = lazy(async () => {
  const spectacle = await import("spectacle");
  return { default: spectacle.Deck };
});

const SpectacleSlide = lazy(async () => {
  const spectacle = await import("spectacle");
  return { default: spectacle.Slide };
});

/**
 * Presentation deck using Spectacle for navigation and keyboard support.
 *
 * - Left/Right arrows and Space advance slides.
 * - Home/End keys jump to first/last slide.
 */
const SlideDeck = ({ slides }: SlideDeckProps) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const deck = document.querySelector("[data-spectacle-deck]") as any;
      if (!deck || !("slideIndex" in deck)) return;
      if (e.key === "Home") {
        deck.slideIndex = 0;
      }
      if (e.key === "End") {
        deck.slideIndex = slides.length - 1;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [slides.length]);

  return (
    <Suspense
      fallback={<div className="p-6 text-center">Loading presentation...</div>}
    >
      <SpectacleDeck>
        {slides.map((slide, i) => (
          <SpectacleSlide key={i}>
            <div className="p-6 bg-white text-slate-gray relative h-full">
              <h2 className="text-xl font-bold mb-4">{slide.title}</h2>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                {slide.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
              {slide.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.src}
                  alt="slide"
                  style={{
                    position: "absolute",
                    left: `${img.x * 100}%`,
                    top: `${img.y * 100}%`,
                    width: `${img.w * 100}%`,
                    height: `${img.h * 100}%`,
                  }}
                />
              ))}
            </div>
          </SpectacleSlide>
        ))}
      </SpectacleDeck>
    </Suspense>
  );
};

export default SlideDeck;

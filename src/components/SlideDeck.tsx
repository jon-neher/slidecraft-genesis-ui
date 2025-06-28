import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export interface SlideImage {
  src: string;
  x: number; // 0-1 fractional position
  y: number;
  w: number;
  h: number;
}

export interface Slide {
  title: string;
  bullets: string[];
  images: SlideImage[];
}

interface SlideDeckProps {
  slides: Slide[];
}

const SlideDeck = ({ slides }: SlideDeckProps) => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => Math.min(c + 1, slides.length - 1));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  const { title, bullets, images } = slides[current] ?? {} as Slide;

  return (
    <div className="space-y-4">
      <div className="relative bg-white p-6 rounded-lg border border-gray-200 slide">
        <h1 className="text-xl font-bold text-slate-gray mb-4">{title}</h1>
        <ul className="list-disc pl-5 text-slate-gray space-y-1 mb-4">
          {bullets.map((b, idx) => (
            <li key={idx}>{b}</li>
          ))}
        </ul>
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img.src}
            alt="slide image"
            style={{
              position: 'absolute',
              left: `${img.x * 100}%`,
              top: `${img.y * 100}%`,
              width: `${img.w * 100}%`,
              height: `${img.h * 100}%`,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={prev} disabled={current === 0}
          className="touch-target">
          Prev
        </Button>
        <Button onClick={next} disabled={current === slides.length - 1}
          className="touch-target">
          Next
        </Button>
      </div>
    </div>
  );
};

export default SlideDeck;

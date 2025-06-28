import React, { useEffect, useRef } from 'react'

declare global {
  interface Window {
    Reveal: {
      initialize: (options: unknown) => void
    }
    RevealPrintPDF: unknown
  }
}

export interface SlideImage {
  src: string
  x: number
  y: number
  w: number
  h: number
}

export interface Slide {
  title: string
  bullets: string[]
  images: SlideImage[]
}

interface SlideDeckProps {
  slides: Slide[]
}

const SlideDeck = ({ slides }: SlideDeckProps) => {
  const deckRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.Reveal || !window.RevealPrintPDF) return
    window.Reveal.initialize({
      plugins: [window.RevealPrintPDF],
      pdfSeparateFragments: true,
      pdfMaxPagesPerSlide: 1,
    })
  }, [])

  return (
    <div className="reveal" ref={deckRef}>
      <div className="slides">
        {slides.map((slide, i) => (
          <section key={i} className="p-6 bg-white text-slate-gray">
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
                  position: 'absolute',
                  left: `${img.x * 100}%`,
                  top: `${img.y * 100}%`,
                  width: `${img.w * 100}%`,
                  height: `${img.h * 100}%`,
                }}
              />
            ))}
          </section>
        ))}
      </div>
    </div>
  )
}

export default SlideDeck

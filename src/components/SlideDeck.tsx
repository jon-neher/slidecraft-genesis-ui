
import React, { useEffect, useRef, useState } from 'react'

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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!deckRef.current) return

    const loadReveal = async () => {
      try {
        setIsLoading(true)
        
        // Dynamic import to avoid build-time issues
        const [{ default: Reveal }] = await Promise.all([
          import('reveal.js'),
          import('reveal.js/dist/reveal.css'),
          import('reveal.js/dist/theme/black.css')
        ])

        const deck = new Reveal(deckRef.current!, {
          pdfSeparateFragments: true,
          pdfMaxPagesPerSlide: 1,
        })

        await deck.initialize()

        return () => {
          deck.destroy()
        }
      } catch (err) {
        console.error('Failed to load Reveal.js:', err)
        setError('Failed to load presentation library')
      } finally {
        setIsLoading(false)
      }
    }

    loadReveal()
  }, [])

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-indigo mx-auto"></div>
        <p className="mt-2 text-slate-gray">Loading presentation...</p>
      </div>
    )
  }

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

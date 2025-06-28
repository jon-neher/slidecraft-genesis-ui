import React from 'react'
import SlideDeck, { Slide } from '@/components/SlideDeck'

const slides: Slide[] = [
  {
    title: 'Welcome',
    bullets: ['Introduce Reveal.js integration', 'Print-ready slides'],
    images: [],
  },
  {
    title: 'Second Slide',
    bullets: ['Another point', 'More content'],
    images: [],
  },
]

const Slides = () => <SlideDeck slides={slides} />

export default Slides

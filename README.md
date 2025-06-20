# SlideCraft AI - Landing Page

A premium, responsive landing page for SlideCraft AI, an AI-powered presentation generation tool. Built with React, Framer Motion, and Tailwind CSS. **Threadline: Turn your data into decks that speak volumes.**

## 🚀 Features

- **High-End Look**: Bold headlines, modular layout sections, and generous white space
- **Smooth Animations**: Framer Motion interactions with the existing hero animation
- **Responsive Layout**: Mobile-first design that adapts cleanly across breakpoints
- **Performance Optimized**: Uses `will-change` and transform-only animations

## 🎨 Design System

### Colors
- **Electric Indigo** `#5A2EFF` – Primary brand, buttons
- **Slate Gray** `#3A3D4D` – Headings and body text
- **Ice White** `#FAFAFB` – Page backgrounds
- **Neon Mint** `#30F2B3` – Highlights and gradients
- **Soft Coral** `#FF6B6B` – Error states or contrast
- *Gradient:* Indigo → Mint for a tech-forward polish

### Typography
- **Primary Font**: Inter or Space Grotesk – modern and highly readable
- **Accent Font**: JetBrains Mono or IBM Plex Mono for code/data references
- **Weights**: 300, 400, 500, 600, 700, 800

### Animation Principles
- **Entrance**: Staggered fade-up animations
- **Hover**: Subtle scale and rotation effects
- **Focus**: Pulsing borders and gentle scaling
- **Performance**: Transform-only animations with `will-change`

## 🌟 Brand Guidelines

### Design Principles
- Data-first layouts with clear hierarchy
- Modular sections that can expand or collapse like slides
- Motion guides attention without distracting
- Slide-native metaphors and subtle hero animation

### Iconography & UI Elements
- Rounded, geometric icons reminiscent of Material Symbols
- Simple metaphors: threads, slides, data nodes, spark
- Soft shadows and layering for depth without noise

### Brand Personality
- Intelligent yet approachable
- Sleek, modern, and trustworthy
- Slightly playful while remaining professional

### Brand Voice
- Confident and conversational
- Active voice with short sentences
- Avoid jargon and robotic language

### Brand Imagery
- Abstract illustrations of threads weaving data into slides
- Motion demos from raw spreadsheet to polished deck
- Collages of diverse presentation styles (tech, sales, academic)

## 🧩 Components

### ModernHero
- Typewriter effect headline animation
- Simulated Lottie-style slide assembly
- Email capture with shake animation on invalid input
- Floating background particles

### ModernFeatures
- Three feature cards with staggered entrance
- Icon pop animations on hover
- Gradient backgrounds per feature

### ModernTestimonials
- Animated counters that trigger on scroll
- Infinite marquee logo rail
- Trust indicators and social proof

### ModernCTA
- Newsletter subscription with focus animations
- Social icons with rotation on hover
- Pulsing border effects on form focus

## 🛠 Animation Details

### Framer Motion Configuration
```jsx
// Staggered children animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

// Individual card animation
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};
```

### Performance Optimizations
- Uses `whileInView` with `viewport={{ once: true }}` for scroll-triggered animations
- Transform-only animations for 60fps performance
- `will-change` CSS property for optimized rendering
- Efficient counter animations with controlled intervals

## 📁 Project Structure

```
src/
├── components/
│   ├── ModernHero.tsx       # Main hero with waitlist form
│   ├── ModernFeatures.tsx   # Feature cards with staggered animation
│   ├── ModernTestimonials.tsx # Testimonials and social proof
│   ├── ModernCTA.tsx        # Final call-to-action section
│   └── Footer.tsx           # Newsletter and social links
├── pages/
│   └── Index.tsx            # Main landing page assembly
└── index.css                # Custom theme and animation styles
```

## 🎯 Customization Guide

### Customizing Hero Content
Edit `ModernHero.tsx` to tweak the hero text or integrate your preferred animation.

### Adding Real Logos
Update the `testimonials` array in `ModernTestimonials.tsx`:

```jsx
const testimonials = [
  {
    name: "Sarah Chen",
    role: "VP of Marketing",
    company: "TechFlow",
    avatar: "SC",
    content: "Threadline transformed how our team creates presentations.",
    rating: 5
  },
  // Add your own testimonials
];
```

### Customizing Colors
Modify the theme in `tailwind.config.ts`:

```js
colors: {
  indigo: {
    500: '#5A2EFF',
    // ... other shades
  },
  mint: {
    400: '#30F2B3',
    // ... other shades
  }
}
```

### Animation Tweaking
Adjust timing and easing in component props:

```jsx
// Slower, bouncier animation
transition={{ 
  duration: 1.2, 
  ease: "backOut",
  type: "spring",
  stiffness: 100
}}
```

## 📱 Mobile Responsiveness

- Grid layouts automatically stack on mobile
- Text sizes scale down appropriately
- Touch-friendly button sizes (min 44px)
- Reduced animation intensity on mobile for performance

## 🔧 Installation & Setup

1. Install dependencies:
```bash
npm install framer-motion
```

2. Update fonts in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

3. The components are ready to use with the existing shadcn/ui setup.

## 🎪 Animation Showcase

- **Typewriter Effect**: Letter-by-letter headline reveal
- **Staggered Cards**: Sequential feature card entrance
- **Animated Counters**: Number counting on scroll trigger
- **Infinite Marquee**: Seamless logo carousel
- **Micro-interactions**: Hover states, focus effects, and button feedback
- **Particle System**: Floating background elements

## 🚀 Performance Notes

- All animations use `transform` and `opacity` only
- Leverages hardware acceleration with `will-change`
- Scroll-triggered animations use `once: true` to prevent re-triggering
- Efficient counter animations with proper cleanup
- CSS-based marquee for smooth logo scrolling

This landing page showcases modern web animation techniques while maintaining excellent performance and accessibility standards.

# SlideCraft AI - Landing Page

A premium, responsive landing page for SlideCraft AI, an AI-powered presentation generation tool. Built with React, Framer Motion, and Tailwind CSS.

## 🚀 Features

- **Premium Design**: Dark navy theme with gold accents and subtle gradients
- **Smooth Animations**: Framer Motion powered interactions and micro-animations
- **Responsive Layout**: Mobile-first design that works on all devices
- **Performance Optimized**: Uses `will-change` and transform-only animations

## 🎨 Design System

### Colors
- **Primary Background**: Navy (#020617 to #1e293b gradient)
- **Accent Color**: Gold (#fbbf24 to #d97706 gradient)
- **Text**: High contrast white/gray scale
- **Cards**: Semi-transparent with backdrop blur

### Typography
- **Display Font**: Montserrat (headlines)
- **Body Font**: Inter (content)
- **Weights**: 300, 400, 500, 600, 700, 800

### Animation Principles
- **Entrance**: Staggered fade-up animations
- **Hover**: Subtle scale and rotation effects
- **Focus**: Pulsing borders and gentle scaling
- **Performance**: Transform-only animations with `will-change`

## 🧩 Components

### HeroSection
- Typewriter effect headline animation
- Simulated Lottie-style slide assembly
- Email capture with shake animation on invalid input
- Floating background particles

### FeaturesSection
- Three feature cards with staggered entrance
- Icon pop animations on hover
- Gradient backgrounds per feature

### MetricsSection
- Animated counters that trigger on scroll
- Infinite marquee logo rail
- Trust indicators and social proof

### Footer
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
│   ├── HeroSection.tsx      # Main hero with typewriter effect
│   ├── FeaturesSection.tsx  # Feature cards with staggered animation
│   ├── MetricsSection.tsx   # Animated counters and logo marquee
│   └── Footer.tsx           # Newsletter and social links
├── pages/
│   └── Index.tsx            # Main landing page assembly
└── index.css                # Custom theme and animation styles
```

## 🎯 Customization Guide

### Replacing Lottie Animation
Replace the simulated slide assembly in `HeroSection.tsx`:

```jsx
// Replace this section with actual Lottie Player
<motion.div className="mb-12">
  <Player
    autoplay
    loop
    src="/path/to/your/lottie.json"
    style={{ height: '300px', width: '400px' }}
  />
</motion.div>
```

### Adding Real Logos
Update the `partnerLogos` array in `MetricsSection.tsx`:

```jsx
const partnerLogos = [
  { name: "Microsoft", logo: "/logos/microsoft.svg" },
  { name: "Google", logo: "/logos/google.svg" },
  // Add your actual partner logos
];
```

### Customizing Colors
Modify the theme in `tailwind.config.ts`:

```js
colors: {
  navy: {
    950: '#your-custom-dark',
    // ... other shades
  },
  gold: {
    400: '#your-custom-gold',
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

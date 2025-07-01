# Threadline Web App

Threadline is an AI-powered presentation builder. This repository contains both the marketing site and the signed‑in dashboard, along with the Supabase/HubSpot integration code. The UI is built with React, Vite and Tailwind CSS using the shadcn/ui component library. The project targets **Node.js 20** or newer and this is enforced via the `engines` field in `package.json`, so ensure that version is installed locally.

## 🚀 Features

- **Modern Landing Page** with hero animations and waitlist forms
- **Dashboard** for browsing deck templates and viewing recent activity
- **Supabase & HubSpot integration** powering OAuth and contact search
- **Smooth Animations** using Framer Motion
- **Performance Optimized** with transform-only animations
- **Responsive Layout** that adapts cleanly across breakpoints
- **Spectacle Slide Runtime** with full keyboard navigation
- **Drag-and-drop Editor** powered by Puck

## 🎨 Design System

### Colors

- **Electric Indigo** `#5A2EFF` – Primary brand, buttons
- **Slate Gray** `#3A3D4D` – Headings and body text
- **Ice White** `#FAFAFB` – Page backgrounds
- **Neon Mint** `#30F2B3` – Highlights and gradients
- **Soft Coral** `#FF6B6B` – Error states or contrast
- _Gradient:_ Indigo → Mint for a tech-forward polish

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
- Clerk waitlist form with shake validation
- Threading animation weaving between slides
- Floating background particles and trust indicators

### ModernFeatures

- Four feature cards with staggered entrance
- Icon pop animations on hover
- Gradient backgrounds on each card

### ModernTestimonials

- Testimonial cards featuring star ratings
- Smooth entrance animations

### ModernCTA

- Clerk sign-up / sign-in for early access
- Social icons with rotation on hover
- Pulsing border effects on form focus

### Footer

- Newsletter form for updates
- Social links for major platforms
- Company information in the footer bar

### Dashboard

- Left navigation with team switcher
- Context pane and activity feed
- Deck gallery with animated cards

## 🛠 Animation Details

### Framer Motion Configuration

```ts
// src/lib/variants.ts
export const containerVariants = {
  /* ... */
};
export const itemVariants = {
  /* ... */
};
export const cardVariants = {
  /* ... */
};

// Import these in your components
import { containerVariants, itemVariants, cardVariants } from "@/lib/variants";
```

### Performance Optimizations

- Uses `whileInView` with `viewport={{ once: true }}` for scroll-triggered animations
- Transform-only animations for 60fps performance
- `will-change` CSS property for optimized rendering

## 📁 Project Structure

```
src/
├── components/
│   ├── ModernHero.tsx       # Landing page hero
│   ├── ModernFeatures.tsx   # Feature highlights
│   ├── ModernTestimonials.tsx # Social proof section
│   ├── ModernCTA.tsx        # Final call-to-action
│   ├── Footer.tsx           # Newsletter and social links
│   └── dashboard/           # Signed‑in dashboard components
├── pages/
│   ├── Index.tsx            # Marketing landing page
│   └── Dashboard.tsx        # Main application interface
├── server/                  # HubSpot handlers and utilities
└── index.css                # Custom theme and animation styles
supabase/
├── functions/               # Edge functions for production
└── migrations/              # Database schema
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
    rating: 5,
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

Ensure **Node.js 20** or newer is installed to match the CI environment. The requirement is enforced via the `engines` field.

1. Install dependencies:

```bash
npm install
```

2. Run tests with **Jest**:

```bash
npm test
```

3. Start the Vite dev server:

```bash
npm run dev
```

4. Update fonts in `index.html`:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700;800&display=swap"
  rel="stylesheet"
/>
```

5. The components are ready to use with the existing shadcn/ui setup.

### Environment Variables

Create a `.env` file in the project root and provide the following variables:

```bash
VITE_SUPABASE_URL=<your Supabase project URL>
VITE_SUPABASE_ANON_KEY=<your Supabase anon key>
```

## 🎪 Animation Showcase

- **Typewriter Effect**: Letter-by-letter headline reveal
- **Staggered Cards**: Sequential feature card entrance
- **Micro-interactions**: Hover states, focus effects, and button feedback
- **Particle System**: Floating background elements

## 🚀 Performance Notes

- All animations use `transform` and `opacity` only
- Leverages hardware acceleration with `will-change`
- Scroll-triggered animations use `once: true` to prevent re-triggering
- Clean React hooks to avoid memory leaks

This landing page showcases modern web animation techniques while maintaining excellent performance and accessibility standards.

## HubSpot Configuration

Create a `.env` file in the project root and provide the following variables:

```bash
HUBSPOT_CLIENT_SECRET=<your HubSpot secret>
HUBSPOT_APP_SECRET=<webhook signature secret>
SUPABASE_URL=<your Supabase project URL>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
```

Store the client id for the edge functions using Supabase secrets:

```bash
supabase secrets set HUBSPOT_CLIENT_ID=<your HubSpot OAuth id>
```

The React dashboard fetches the client id from the `hubspot_client_id` edge function before initiating OAuth. Server code reads all variables via `src/server/config.ts`.

## Supabase CLI Setup

1. Log in and initialize your project:

   ```bash
   supabase login
   supabase init
   ```

2. Store your OpenAI key for the slide generator:

   ```bash
   supabase secrets set OPENAI_API_KEY=YOUR_KEY
   ```

3. Deploy the edge function:
   ```bash
   supabase functions deploy generate-slides
   ```

## Front End Development

```bash
npm install && npm run dev
```

### Workflow

Generate → Preview → Edit → Download PPTX

## API Documentation

See `docs/openapi.yaml` for the HubSpot integration endpoints and `docs/SECURITY_CHECKLIST.md` for security requirements.

See `docs/INTEGRATION_STRUCTURE.md` for an overview of the integration architecture.

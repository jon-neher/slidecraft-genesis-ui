# Slidecraft - AI-Powered Presentation Builder

Slidecraft is an AI-powered presentation builder with HubSpot integration. This repository contains the marketing site, dashboard, and Supabase/HubSpot integration code. Built with React, Vite, Tailwind CSS, and shadcn/ui components for modern web development.

## 🚀 Lovable Publishing & Hosting

### What Can Be Published with Lovable

Lovable provides **static hosting** optimized for React applications built with Vite. The platform supports:

✅ **Supported Project Types:**
- React applications with Vite bundler
- Static Single Page Applications (SPAs)
- Client-side routing with React Router
- Supabase backend integration
- Edge Functions for serverless backend logic
- Authentication with Clerk or Supabase Auth
- Static assets (images, fonts, CSS, JS)

❌ **Not Supported:**
- Node.js server applications
- Server-Side Rendering (SSR) frameworks like Next.js
- Express servers or custom backends
- WebSocket servers
- Traditional multi-page applications requiring server routing

### Vite Configuration Requirements

⚠️ **CRITICAL**: Your Vite configuration must include `server: { port: 8080 }` for Lovable compatibility.

For successful publishing with Lovable, your Vite configuration must be compatible with static hosting:

```typescript
// vite.config.ts - Compatible configuration
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 8080,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    minify: mode === "production" ? "esbuild" : false,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "auth-vendor": ["@clerk/clerk-react"],
          "db-vendor": ["@supabase/supabase-js"],
        },
      },
    },
  },
}));
```

### Lovable Hosting Features

**✨ Static Hosting Benefits:**
- **Global CDN**: Fast content delivery worldwide
- **HTTPS by default**: Automatic SSL certificates
- **Custom domains**: Connect your own domain
- **Automatic deployments**: Deploy on code changes
- **Environment variables**: Secure config management
- **Preview URLs**: Shareable staging environments

**🔧 Technical Specifications:**
- **Build System**: Vite with esbuild
- **Asset Optimization**: Automatic compression and minification
- **Caching**: Intelligent cache headers for optimal performance
- **Routing**: Client-side routing with fallback to index.html
- **File Size Limits**: Reasonable limits for static assets

### Environment Variables & Configuration

**Important**: Lovable doesn't use traditional `.env` files. Instead:

1. **Public variables**: Hard-code public URLs and keys directly in code
2. **Secrets**: Use Supabase Edge Functions for server-side operations
3. **Configuration**: Store sensitive config in Supabase secrets

```typescript
// ✅ Correct - Direct configuration
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-public-anon-key';

// ❌ Incorrect - Environment variables not supported
const supabaseUrl = process.env.VITE_SUPABASE_URL;
```

### Backend Integration Requirements

For full-stack functionality, use Supabase integration:

1. **Database**: PostgreSQL with Row Level Security
2. **Authentication**: Supabase Auth or Clerk integration
3. **API**: Edge Functions for server-side logic
4. **Storage**: Supabase Storage for file uploads
5. **Real-time**: WebSocket connections through Supabase

### Publishing Checklist

Before publishing your Lovable project:

- [ ] **Build succeeds**: `npm run build` completes without errors
- [ ] **No Node.js dependencies**: Remove server-specific packages
- [ ] **Client-side routing**: All routes work with React Router
- [ ] **Static assets**: Images and fonts properly imported
- [ ] **API calls**: All backend logic moved to Edge Functions
- [ ] **Environment cleanup**: No `.env` file dependencies
- [ ] **TypeScript errors**: All type errors resolved
- [ ] **Bundle size**: Optimized with code splitting

### Common Publishing Issues

**🚫 Build Failures:**
- **Missing dependencies**: Ensure all imports are available
- **TypeScript errors**: Fix all type checking issues
- **Asset imports**: Use ES6 imports for images and assets
- **Circular dependencies**: Remove circular import chains

**🚫 Runtime Errors:**
- **Environment variables**: Replace with direct configuration
- **Server dependencies**: Move to Edge Functions
- **File system access**: Not available in browser environment
- **Process.env**: Not available in production builds

### Performance Optimization

**📊 Bundle Optimization:**
```typescript
// Manual chunk splitting for better caching
rollupOptions: {
  output: {
    manualChunks: {
      "react-vendor": ["react", "react-dom"],
      "auth-vendor": ["@clerk/clerk-react"],
      "db-vendor": ["@supabase/supabase-js"],
      "ui-vendor": ["@radix-ui/*"],
    },
  },
},
```

**🎯 Asset Optimization:**
- **Images**: Use WebP format, optimize sizes
- **Fonts**: Subset fonts, use font-display: swap
- **CSS**: Critical CSS inlining
- **JavaScript**: Tree shaking and dead code elimination

- **Advanced Slide Editor**: Drag-and-drop presentation builder with Puck.js (MIT licensed)
- **Multi-Mode Presentations**: View, Edit, Present, and Overview modes
- **Template System**: Professional slide templates and themes
- **Analytics Dashboard**: Presentation engagement tracking
- **Version Control**: Automatic slide revision history

## Presentation System

This application features a sophisticated slide presentation system with the following capabilities:

### Core Features
- **Drag-and-Drop Editor**: Built with Puck.js for visual slide creation
- **Multiple Viewing Modes**:
  - **View Mode**: Standard presentation viewing
  - **Edit Mode**: Visual drag-and-drop editor
  - **Present Mode**: Fullscreen presentation with keyboard controls
  - **Overview Mode**: Grid view of all slides
- **Template Gallery**: Professional slide templates and themes
- **Analytics**: Presentation engagement and performance metrics
- **Version Control**: Automatic revision history with Supabase

### Technical Architecture
- **Frontend**: React + TypeScript + Tailwind CSS
- **Editor**: Puck.js (MIT licensed - commercial safe)
- **Database**: Supabase with row-level security
- **State Management**: Custom hooks and modular components
- **Animations**: Framer Motion for smooth transitions

### Key Technologies
- React 18 with TypeScript
- Puck.js for drag-and-drop editing
- Supabase for backend and authentication
- Tailwind CSS for styling
- Framer Motion for animations
- Shadcn/ui components
- **Performance Optimized** with transform-only animations
- **Responsive Layout** that adapts cleanly across breakpoints
- **Security Hardened** with comprehensive input validation and audit logging

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

## 🔧 Development Setup

### Prerequisites

- **Node.js 20+**: Required for development and CI
- **npm**: Package manager
- **Git**: Version control

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd slidecraft
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Build for production:**
```bash
npm run build
```

4. **Preview production build:**
```bash
npm run preview
```

### Supabase Integration Setup

1. **Initialize Supabase project:**
```bash
npx supabase login
npx supabase init
```

2. **Configure secrets:**
```bash
npx supabase secrets set OPENAI_API_KEY=your_key
npx supabase secrets set HUBSPOT_CLIENT_ID=your_id
npx supabase secrets set HUBSPOT_CLIENT_SECRET=your_secret
```

3. **Deploy Edge Functions:**
```bash
npx supabase functions deploy
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard-specific components
│   └── demo/            # Demo and presentation components
├── hooks/               # Custom React hooks
├── integrations/        # External service integrations
│   ├── supabase/        # Supabase client and types
│   └── hubspot/         # HubSpot API integration
├── lib/                 # Utility functions and helpers
├── pages/               # Page components
├── styles/              # CSS and styling
└── main.tsx             # Application entry point

supabase/
├── functions/           # Edge Functions
├── migrations/          # Database migrations
└── config.toml          # Supabase configuration
```

## 🔒 Security Implementation

This project implements comprehensive security measures:

- **Authentication**: JWT verification for all sensitive operations
- **Input Validation**: Enhanced validation with XSS and SQL injection protection
- **Rate Limiting**: Per-user and per-endpoint rate limiting
- **Audit Logging**: Security event tracking and monitoring
- **OAuth Security**: Secure state generation with 32-byte entropy
- **RLS Policies**: Row-level security for data isolation

See `docs/SECURITY_IMPLEMENTATION.md` for detailed security documentation.

## 🚀 Deployment with Lovable

### Publishing Process

1. **Prepare for publishing:**
   - Ensure build passes: `npm run build`
   - Test production build: `npm run preview`
   - Verify all functionality works offline-first

2. **Publish with Lovable:**
   - Click "Publish" button in Lovable interface
   - Automatic build and deployment process
   - Live URL provided immediately

3. **Custom Domain Setup:**
   - Access Project Settings in Lovable
   - Add your custom domain
   - Update DNS records as instructed
   - SSL certificate automatically provisioned

### Post-Deployment

- **Monitoring**: Check application performance and errors
- **Analytics**: Track user engagement and conversions
- **Updates**: Automatic redeployment on code changes
- **Scaling**: CDN handles traffic distribution automatically

## 📱 Mobile Responsiveness

- Grid layouts automatically stack on mobile
- Text sizes scale down appropriately
- Touch-friendly button sizes (min 44px)
- Reduced animation intensity on mobile for performance

## 🎯 Performance Optimizations

- **Code Splitting**: Vendor chunks for better caching
- **Image Optimization**: WebP format with lazy loading
- **Animation Performance**: Transform-only animations with hardware acceleration
- **Bundle Analysis**: Optimized chunk sizes and tree shaking
- **Critical CSS**: Inlined critical styles for faster rendering

## 🧪 Testing

Run the test suite:
```bash
npm test
```

For continuous testing during development:
```bash
npm run test:watch
```

## 📚 API Documentation

- **OpenAPI Spec**: `docs/openapi.yaml`
- **Integration Guide**: `docs/INTEGRATION_STRUCTURE.md`
- **Security Guide**: `docs/SECURITY_IMPLEMENTATION.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

**Built with Lovable** - The AI-powered development platform for modern web applications.
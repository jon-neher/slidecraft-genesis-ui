
# AI Agent Guidelines for Lovable Projects

## Lovable Platform Capabilities & Constraints

### 🚀 What Lovable Supports

**✅ Fully Supported Project Types:**
- **React Applications**: Built with Vite bundler
- **Single Page Applications (SPAs)**: Client-side routing with React Router
- **Static Hosting**: Global CDN with automatic HTTPS
- **Supabase Integration**: Full-stack capabilities via Edge Functions
- **Authentication**: Clerk or Supabase Auth integration
- **Database Operations**: PostgreSQL with Row Level Security
- **File Storage**: Supabase Storage for user uploads
- **Real-time Features**: WebSocket connections through Supabase
- **Custom Domains**: Professional hosting with SSL

**❌ Not Supported:**
- **Server-Side Rendering (SSR)**: Next.js, Nuxt, etc.
- **Node.js Servers**: Express, Fastify, custom backends
- **Traditional Multi-Page Apps**: Server-side routing
- **WebSocket Servers**: Direct server implementations
- **Docker Containers**: Custom runtime environments

### 🛠 Vite Configuration Requirements

⚠️ **CRITICAL**: All Lovable projects MUST include `server: { port: 8080 }` in their Vite configuration.

For successful Lovable publishing, projects must use compatible Vite configurations:

```typescript
// ✅ Compatible Vite Config
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 8080,
  },
  resolve: {
    alias: { "@": "/src" }
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

### 🔧 Environment & Configuration

**Critical**: Lovable doesn't use traditional environment variables (.env files):

```typescript
// ✅ Correct - Direct configuration
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-public-anon-key';

// ❌ Incorrect - Environment variables not supported
const supabaseUrl = process.env.VITE_SUPABASE_URL;
```

**Configuration Best Practices:**
- **Public URLs/Keys**: Hard-code directly in source
- **Secrets**: Store in Supabase Edge Function environment
- **API Keys**: Use Supabase secrets management
- **Config Objects**: Create typed configuration modules

## Color System Guidelines for AI Agents

### Brand Color Specifications

**Primary Brand Colors:**
- **Electric Indigo**: `#5A2EFF` - Primary brand color for CTAs, accents
- **Slate Gray**: `#3A3D4D` - Primary text color, dark elements  
- **Ice White**: `#FAFAFB` - Primary background, light text
- **Neon Mint**: `#30F2B3` - Success states, positive accents
- **Soft Coral**: `#FF6B6B` - Error states, warnings

### Color Usage Rules

#### ✅ DO Use These Colors
```css
/* Backgrounds */
bg-ice-white, bg-white, bg-electric-indigo, bg-neon-mint, bg-gray-50

/* Text Colors */  
text-slate-gray, text-electric-indigo, text-ice-white, text-gray-600

/* Borders */
border-gray-200, border-electric-indigo, border-neon-mint
```

#### ❌ NEVER Use These Colors
```css
/* Forbidden Colors */
bg-yellow-*, text-yellow-*, border-yellow-*
bg-orange-*, text-orange-*, border-orange-*  
bg-amber-*, text-amber-*, border-amber-*
bg-lime-*, text-lime-*, border-lime-*
```

### Component Color Standards

**Buttons:**
- **Primary**: `bg-electric-indigo text-ice-white hover:bg-electric-indigo/90`
- **Secondary**: `bg-white text-slate-gray border border-gray-200 hover:bg-gray-50`
- **Success**: `bg-neon-mint text-slate-gray hover:bg-neon-mint/90`
- **Destructive**: `bg-red-500 text-ice-white hover:bg-red-500/90`

**Cards & Containers:**
- **Default**: `bg-white border border-gray-200`
- **Elevated**: `bg-white shadow-lg border border-gray-100`
- **Muted**: `bg-gray-50 border border-gray-200`

**Text Hierarchy:**
- **Primary**: `text-slate-gray` (headings, important content)
- **Secondary**: `text-gray-600` (body text, descriptions)
- **Muted**: `text-gray-500` (captions, metadata)
- **Accent**: `text-electric-indigo` (links, highlights)

## Publishing Requirements & Checklist

### Pre-Publishing Validation

**Build Requirements:**
- [ ] `npm run build` completes without errors
- [ ] No TypeScript compilation errors
- [ ] All imports resolve correctly
- [ ] Bundle size optimized with code splitting

**Static Hosting Compatibility:**
- [ ] No Node.js server dependencies
- [ ] Client-side routing configured properly
- [ ] Static assets use ES6 imports
- [ ] No file system access in browser code

**Lovable-Specific Requirements:**
- [ ] No `.env` file dependencies
- [ ] Direct configuration instead of environment variables
- [ ] Supabase integration for backend operations
- [ ] Compatible Vite configuration

### Common Publishing Failures & Solutions

**🚫 Build Failures:**

1. **Missing Dependencies**
   ```bash
   # Solution: Install missing packages
   npm install missing-package
   ```

2. **TypeScript Errors**
   ```typescript
   // Fix: Add proper type annotations
   const data: UserData = await fetchUser();
   ```

3. **Circular Dependencies**
   ```typescript
   // Fix: Restructure imports to avoid cycles
   // Use barrel exports or dependency injection
   ```

**🚫 Runtime Errors:**

1. **Environment Variable Issues**
   ```typescript
   // ❌ Wrong
   const apiUrl = process.env.VITE_API_URL;
   
   // ✅ Correct
   const apiUrl = 'https://api.yourapp.com';
   ```

2. **Server Dependencies**
   ```typescript
   // ❌ Wrong - Server-side code in browser
   import fs from 'fs';
   
   // ✅ Correct - Move to Edge Functions
   const { data } = await supabase.functions.invoke('file-handler');
   ```

### Performance Optimization Guidelines

**Bundle Optimization:**
```typescript
// Implement manual chunk splitting
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

**Asset Optimization:**
- **Images**: Use WebP format, implement lazy loading
- **Fonts**: Subset fonts, use `font-display: swap`
- **CSS**: Critical CSS inlining for above-fold content
- **JavaScript**: Tree shaking and dead code elimination

## Backend Integration with Supabase

### Edge Functions Development

**Function Structure:**
```typescript
// ✅ Correct Edge Function template
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Function logic here
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```

**Security Requirements:**
- Always validate inputs with comprehensive patterns
- Implement rate limiting for public endpoints
- Use Row Level Security (RLS) for data access
- Log security events for audit trails
- Sanitize user content to prevent XSS

### Database Design Patterns

**RLS Policy Structure:**
```sql
-- User-scoped data access
CREATE POLICY "Users can access their own data"
ON public.user_data
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

**Security Definer Functions:**
```sql
-- Avoid RLS recursion with security definer functions
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;
```

## Development Best Practices

### Code Organization

**Component Structure:**
```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Feature-specific components
│   └── shared/          # Reusable components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── pages/               # Page components
└── integrations/        # External service integrations
```

**Hook Patterns:**
```typescript
// ✅ Good - Focused, reusable hook
export const useUserData = () => {
  const { user } = useUser();
  const supabase = useSupabaseClient();
  
  return useQuery({
    queryKey: ['user-data', user?.id],
    queryFn: () => fetchUserData(user.id),
    enabled: !!user,
  });
};
```

### Error Handling

**Client-Side Error Boundaries:**
```typescript
// Implement error boundaries for robust UX
<ErrorBoundary fallback={<ErrorFallback />}>
  <UserDashboard />
</ErrorBoundary>
```

**API Error Handling:**
```typescript
// Consistent error handling pattern
try {
  const { data, error } = await supabase
    .from('table')
    .select('*');
    
  if (error) throw error;
  return data;
} catch (error) {
  console.error('Operation failed:', error);
  toast.error('Something went wrong');
  throw error;
}
```

## Quality Assurance

### Pre-Implementation Checklist
- [ ] All colors use approved brand palette
- [ ] No forbidden colors (yellow, orange, amber, lime)
- [ ] Proper contrast ratios maintained
- [ ] Responsive design implemented
- [ ] Performance optimizations applied

### Testing Requirements
```bash
# Run comprehensive test suite
npm test

# Check for linting issues
npm run lint

# Build verification
npm run build && npm run preview
```

### Common Violations to Avoid
1. **System Color Fallbacks**: Never rely on CSS variable fallbacks
2. **Non-Brand Colors**: Avoid colors outside brand palette
3. **Poor Contrast**: Ensure text readability on all backgrounds
4. **Inconsistent Hover States**: Use consistent brand-aligned hover patterns
5. **Environment Dependencies**: Remove all .env file usage

## Emergency Reference

### Quick Fixes for Common Issues

**Color Issues:**
```css
/* Replace yellow/orange with brand colors */
.text-yellow-500 → .text-slate-gray
.bg-orange-500 → .bg-electric-indigo
.border-amber-500 → .border-gray-200
```

**Build Issues:**
```typescript
// Replace environment variables
process.env.VITE_API_URL → 'https://api.yourapp.com'
import.meta.env.VITE_KEY → 'your-actual-key'
```

**Publishing Blockers:**
1. Remove all Node.js server code
2. Move backend logic to Edge Functions
3. Replace .env with direct configuration
4. Fix TypeScript errors completely
5. Optimize bundle with code splitting

---

**Remember**: Lovable provides powerful static hosting with full-stack capabilities through Supabase. Focus on client-side React applications with Edge Functions for backend logic, and always use the approved brand color palette for consistent, professional results.

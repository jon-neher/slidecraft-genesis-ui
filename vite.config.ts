
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize build for production - using default esbuild minifier
    minify: mode === 'production' ? 'esbuild' : false,
    sourcemap: false,
    // Increase chunk size warning limit for heavy dependencies
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Let Vite handle chunking automatically for better optimization
        manualChunks: (id) => {
          // Only chunk the most essential libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react';
            }
            if (id.includes('@clerk/clerk-react')) {
              return 'clerk';
            }
            if (id.includes('@supabase/supabase-js')) {
              return 'supabase';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query';
            }
            // Let heavy libraries like reveal.js and pptxgenjs be dynamically loaded
            return 'vendor';
          }
        }
      }
    },
  },
  define: {
    // Ensure environment variables are properly defined
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  // Optimize dependencies that might cause issues
  optimizeDeps: {
    exclude: ['reveal.js', 'pptxgenjs'], // Exclude heavy dependencies from optimization
    include: ['@clerk/clerk-react', '@supabase/supabase-js', '@tanstack/react-query']
  }
}));

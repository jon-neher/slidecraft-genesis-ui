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
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: mode === "production" ? "esbuild" : false,
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "auth-vendor": ["@clerk/clerk-react"],
          "db-vendor": ["@supabase/supabase-js"],
          "query-vendor": ["@tanstack/react-query"],
        },
      },
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
  optimizeDeps: {
    include: [
      "@clerk/clerk-react",
      "@supabase/supabase-js",
      "@tanstack/react-query",
    ],
  },
}));

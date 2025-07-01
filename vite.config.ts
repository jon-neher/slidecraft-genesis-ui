import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
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

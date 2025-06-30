
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Build-safe environment variable handling
const getPublishableKey = () => {
  // Check for Vite environment variable first
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CLERK_PUBLISHABLE_KEY) {
    return import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  }
  
  // Fallback for different build environments
  if (typeof process !== 'undefined' && process.env?.VITE_CLERK_PUBLISHABLE_KEY) {
    return process.env.VITE_CLERK_PUBLISHABLE_KEY;
  }
  
  // Default fallback key for development/testing
  return "pk_test_aWRlYWwtbGlvbi0zOS5jbGVyay5hY2NvdW50cy5kZXYk";
};

const PUBLISHABLE_KEY = getPublishableKey();

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

// Build-safe root element access
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <App />
  </ClerkProvider>
);

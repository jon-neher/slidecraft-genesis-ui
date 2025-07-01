import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Slides from "./pages/Slides";
import PresentDeck from "./pages/PresentDeck";
import EditDeck from "./pages/EditDeck";
import NewDeckFlow from "./pages/NewDeckFlow";
import BlueprintWizard from "./pages/BlueprintWizard";
import NotFound from "./pages/NotFound";
import PublishErrorBoundary from "./components/PublishErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry during builds/publishing
        if (typeof window === "undefined") return false;
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <PublishErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/slides" element={<Slides />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/present/:id" element={<PresentDeck />} />
            <Route path="/edit/:id" element={<EditDeck />} />
            <Route path="/view/:id" element={<PresentDeck />} />
            <Route path="/new-deck" element={<NewDeckFlow />} />
            <Route path="/new-blueprint" element={<BlueprintWizard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </PublishErrorBoundary>
);

export default App;

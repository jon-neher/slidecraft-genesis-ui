
import React from 'react';
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from '@clerk/clerk-react';
import { Plus } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import LeftNav from '@/components/dashboard/LeftNav';
import QuickSelectHeader from '@/components/dashboard/QuickSelectHeader';
import ContextPane from '@/components/dashboard/ContextPane';
import DeckGallery from '@/components/dashboard/DeckGallery';
import ActivityPanel from '@/components/dashboard/ActivityPanel';
import IntegrationsPanel from '@/components/dashboard/IntegrationsPanel';
import DeckList from '@/components/dashboard/DeckList';
import FloatingActionButton from '@/components/ui/floating-action-button';
import ErrorBoundary from '@/components/ErrorBoundary';

const Dashboard = () => {
  const { isSignedIn } = useAuth();
  
  // Development mode bypass - check if we're in Lovable preview environment
  const isDevelopment = window.location.hostname.includes('lovableproject.com') || 
                       window.location.hostname === 'localhost';

  console.log('Dashboard - isDevelopment:', isDevelopment, 'hostname:', window.location.hostname);

  const handleNewDeck = () => {
    console.log('Creating new deck');
    // Add new deck creation logic here
  };

  const DashboardContent = () => (
    <div className="min-h-screen bg-ice-white">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <ErrorBoundary fallback={<div className="w-64 bg-gray-100 p-4">Navigation Error</div>}>
            <LeftNav />
          </ErrorBoundary>
          
          <SidebarInset className="flex-1">
            <ErrorBoundary fallback={<div className="h-16 bg-gray-100 p-4">Header Error</div>}>
              <QuickSelectHeader />
            </ErrorBoundary>
            
            <div className="flex-1 p-6 space-y-6 bg-background">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 mobile-stack">
                  <ErrorBoundary fallback={<div className="p-4 bg-gray-100">Context Error</div>}>
                    <ContextPane />
                  </ErrorBoundary>
                  <ErrorBoundary fallback={<div className="p-4 bg-gray-100">Gallery Error</div>}>
                    <DeckGallery />
                  </ErrorBoundary>
                </div>
                
                <div className="lg:w-80 w-full space-y-6">
                  <ErrorBoundary fallback={<div className="p-4 bg-gray-100">Activity Error</div>}>
                    <ActivityPanel />
                  </ErrorBoundary>
                  <ErrorBoundary fallback={<div className="p-4 bg-gray-100">Integration Error</div>}>
                    <IntegrationsPanel />
                  </ErrorBoundary>
                  <ErrorBoundary fallback={<div className="p-4 bg-gray-100">Decks Error</div>}>
                    <DeckList />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
        
        {/* Floating Action Button for mobile */}
        <FloatingActionButton
          icon={<Plus className="w-6 h-6" />}
          onClick={handleNewDeck}
        >
          New Deck
        </FloatingActionButton>
      </SidebarProvider>
    </div>
  );

  // In development mode, bypass authentication
  if (isDevelopment) {
    console.log('Dashboard - Rendering in development mode');
    return <DashboardContent />;
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <DashboardContent />
      </SignedIn>
    </>
  );
};

export default Dashboard;

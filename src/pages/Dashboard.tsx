
import React from 'react';
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from '@clerk/clerk-react';
import { Plus } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import LeftNav from '@/components/dashboard/LeftNav';
import QuickSelectHeader from '@/components/dashboard/QuickSelectHeader';
import ContextPane from '@/components/dashboard/ContextPane';
import DeckGallery from '@/components/dashboard/DeckGallery';
import ActivityPanel from '@/components/dashboard/ActivityPanel';
import IntegrationsPanel from '@/components/dashboard/IntegrationsPanel';
import FloatingActionButton from '@/components/ui/floating-action-button';

const Dashboard = () => {
  const { isSignedIn } = useAuth();
  
  // Development mode bypass - check if we're in Lovable preview environment
  const isDevelopment = window.location.hostname.includes('lovableproject.com') || 
                       window.location.hostname === 'localhost';

  const handleNewDeck = () => {
    console.log('Creating new deck');
    // Add new deck creation logic here
  };

  // In development mode, bypass authentication
  if (isDevelopment) {
    return (
      <div className="min-h-screen bg-ice-white safe-area-top safe-area-bottom">
        <SidebarProvider>
          <div className="flex w-full min-h-screen">
            <LeftNav />
            <main className="flex-1 flex flex-col w-full">
              <QuickSelectHeader />
              <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 mobile-padding">
                <div className="flex-1 mobile-stack">
                  <ContextPane />
                  <DeckGallery />
                </div>
                <div className="lg:w-80 w-full space-y-6">
                  <ActivityPanel />
                  <IntegrationsPanel />
                </div>
              </div>
            </main>
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
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-ice-white safe-area-top safe-area-bottom">
          <SidebarProvider>
            <div className="flex w-full min-h-screen">
              <LeftNav />
              <main className="flex-1 flex flex-col w-full">
                <QuickSelectHeader />
                <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 mobile-padding">
                  <div className="flex-1 mobile-stack">
                    <ContextPane />
                    <DeckGallery />
                  </div>
                  <div className="lg:w-80 w-full space-y-6">
                    <ActivityPanel />
                    <IntegrationsPanel />
                  </div>
                </div>
              </main>
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
      </SignedIn>
    </>
  );
};

export default Dashboard;

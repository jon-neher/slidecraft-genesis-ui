
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, useAuth } from '@clerk/clerk-react';
import { Plus } from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import LeftNav from '@/components/dashboard/LeftNav';
import QuickSelectHeader from '@/components/dashboard/QuickSelectHeader';
import ContextPane from '@/components/dashboard/ContextPane';
import DeckGallery from '@/components/dashboard/DeckGallery';
import ActivityPanel from '@/components/dashboard/ActivityPanel';
import FloatingActionButton from '@/components/ui/floating-action-button';
import ErrorBoundary from '@/components/ErrorBoundary';
import { devLog } from '@/lib/dev-log';

const Dashboard = () => {
  const { isSignedIn } = useAuth();
  
  // Check for build/static environments where window isn't available
  const isStaticBuild = typeof window === 'undefined';

  devLog(
    'Dashboard - isStaticBuild:',
    isStaticBuild,
    'hostname:',
    typeof window !== 'undefined' ? window.location.hostname : 'server'
  );

  const navigate = useNavigate();

  const handleNewDeck = () => {
    if (typeof window !== 'undefined') {
      navigate('/new-deck');
    }
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
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
        
        {/* Floating Action Button for mobile - only render in browser */}
        {typeof window !== 'undefined' && (
          <FloatingActionButton
            icon={<Plus className="w-6 h-6" />}
            onClick={handleNewDeck}
          >
            New Deck
          </FloatingActionButton>
        )}
      </SidebarProvider>
    </div>
  );

  // During static builds, bypass authentication and avoid Clerk components
  if (isStaticBuild) {
    devLog('Dashboard - Rendering in static build mode');
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

import React from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import LeftNav from '@/components/dashboard/LeftNav';
import QuickSelectHeader from '@/components/dashboard/QuickSelectHeader';
import ErrorBoundary from '@/components/ErrorBoundary';
import IntegrationsPanel from '@/components/dashboard/IntegrationsPanel';

const IntegrationsContent = () => (
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

          <div className="p-6 bg-background">
            <div className="max-w-3xl mx-auto space-y-6">
              <IntegrationsPanel />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  </div>
);

const Integrations = () => (
  <>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
    <SignedIn>
      <IntegrationsContent />
    </SignedIn>
  </>
);

export default Integrations;

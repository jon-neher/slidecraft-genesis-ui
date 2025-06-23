
import React from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import LeftNav from '@/components/dashboard/LeftNav';
import QuickSelectHeader from '@/components/dashboard/QuickSelectHeader';
import ContextPane from '@/components/dashboard/ContextPane';
import DeckGallery from '@/components/dashboard/DeckGallery';
import ActivityPanel from '@/components/dashboard/ActivityPanel';

const Dashboard = () => {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-ice-white">
          <SidebarProvider>
            <div className="flex w-full min-h-screen">
              <LeftNav />
              <main className="flex-1 flex flex-col w-full">
                <QuickSelectHeader />
                <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 lg:p-6">
                  <div className="flex-1 flex flex-col gap-6">
                    <ContextPane />
                    <DeckGallery />
                  </div>
                  <div className="lg:w-auto w-full">
                    <ActivityPanel />
                  </div>
                </div>
              </main>
            </div>
          </SidebarProvider>
        </div>
      </SignedIn>
    </>
  );
};

export default Dashboard;

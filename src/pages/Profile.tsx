import React from 'react';
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserProfile,
} from '@clerk/clerk-react';
import { brandColors } from '@/lib/color-validation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import QuickSelectHeader from '@/components/dashboard/QuickSelectHeader';
import LeftNav from '@/components/dashboard/LeftNav';
import ErrorBoundary from '@/components/ErrorBoundary';

const ProfileContent = () => {

  return (
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

            <div className="flex flex-col items-center p-6 bg-background">
              <UserProfile
                routing="virtual"
                appearance={{
                  variables: {
                    colorPrimary: brandColors['electric-indigo'],
                    colorBackground: brandColors['ice-white'],
                    colorText: brandColors['slate-gray'],
                    colorTextSecondary: brandColors['gray-600'],
                    fontFamily: 'Inter, sans-serif',
                  },
                  elements: {
                    card: 'bg-white border border-gray-200',
                    headerTitle: 'text-slate-gray',
                    navbar: 'border-b border-gray-200',
                    navbarButton:
                      'text-gray-600 data-[active=true]:bg-electric-indigo data-[active=true]:text-ice-white',
                  },
                }}
              />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

const Profile = () => (
  <>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
    <SignedIn>
      <ProfileContent />
    </SignedIn>
  </>
);

export default Profile;

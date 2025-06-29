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

const ProfileContent = () => (
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

          <div className="flex justify-center p-6 bg-background">
            <UserProfile
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
                },
              }}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  </div>
);

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

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

            <div className="flex justify-center p-6 bg-ice-white min-h-screen">
              <div className="w-full max-w-4xl">
                {/* 
                  TODO: Revisit this implementation with Clerk SDK for more advanced customization
                  - Custom tab implementation with better control
                  - Seamless integration with app design system
                  - Better mobile responsiveness
                  - Custom profile sections
                */}
                <UserProfile
                  routing="path"
                  path="/profile"
                  appearance={{
                    variables: {
                      // Use our brand colors
                      colorPrimary: brandColors['electric-indigo'],
                      colorBackground: brandColors['ice-white'],
                      colorText: brandColors['slate-gray'],
                      colorTextSecondary: brandColors['gray-600'],
                      fontFamily: 'Inter, sans-serif',
                      borderRadius: '8px',
                    },
                    elements: {
                      // Basic styling to match our design system
                      rootBox: 'w-full max-w-4xl mx-auto',
                      card: 'bg-white border border-gray-200 rounded-lg shadow-sm',
                      headerTitle: 'text-slate-gray font-semibold',
                      headerSubtitle: 'text-gray-600',
                      navbar: 'bg-white border-b border-gray-200',
                      navbarButton: 'text-slate-gray hover:text-electric-indigo',
                      navbarButtonActive: 'text-electric-indigo border-b-2 border-electric-indigo',
                      profileSectionPrimaryButton: 'bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white',
                      formButtonPrimary: 'bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white',
                      formFieldInput: 'border-gray-200 focus:border-electric-indigo focus:ring-electric-indigo/20',
                      dividerLine: 'bg-gray-200',
                    },
                  }}
                />
              </div>
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

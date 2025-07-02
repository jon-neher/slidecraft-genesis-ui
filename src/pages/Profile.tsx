import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const navItems = [
  { label: 'Account', value: 'account' },
  { label: 'Security', value: 'security' }
];

const ProfileContent = () => {
  const [activeTab, setActiveTab] = React.useState('account');

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
              <Tabs
                value={activeTab}
                onValueChange={(val) => setActiveTab(val)}
                className="w-full max-w-xl"
              >
                <TabsList className="mb-6 bg-white border border-gray-200">
                  {navItems.map((item) => (
                    <TabsTrigger
                      key={item.value}
                      value={item.value}
                      className="text-slate-gray data-[state=active]:bg-electric-indigo data-[state=active]:text-ice-white"
                    >
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

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
                    navbar: 'hidden',
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

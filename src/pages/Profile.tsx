import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserProfile,
} from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { brandColors } from '@/lib/color-validation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import QuickSelectHeader from '@/components/dashboard/QuickSelectHeader';
import LeftNav from '@/components/dashboard/LeftNav';
import ErrorBoundary from '@/components/ErrorBoundary';
import UserProfileCard from '@/components/auth/UserProfileCard';

const navItems = [
  { label: 'Account', value: 'account' },
  { label: 'Security', value: 'security' }
];

const ProfileContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = location.pathname.includes('security') ? 'security' : 'account';

  React.useEffect(() => {
    if (location.pathname === '/profile') {
      navigate('/profile/account', { replace: true });
    }
  }, [location.pathname, navigate]);

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

            <div className="flex flex-col p-6 bg-ice-white min-h-screen">
              {/* Profile Header */}
              <div className="mb-8">
                <UserProfileCard />
              </div>

              {/* Custom Tab Implementation */}
              <Tabs
                value={activeTab}
                onValueChange={(val) => navigate(`/profile/${val}`)}
                className="w-full max-w-4xl mx-auto"
              >
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-white border border-gray-200 rounded-lg h-12">
                  {navItems.map((item) => (
                    <TabsTrigger
                      key={item.value}
                      value={item.value}
                      className="text-slate-gray font-medium data-[state=active]:bg-electric-indigo data-[state=active]:text-ice-white rounded-md transition-all duration-200"
                    >
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Account Tab Content */}
                <TabsContent value="account" className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-slate-gray">Account Settings</h3>
                      <p className="text-sm text-gray-600 mt-1">Manage your account information and preferences</p>
                    </div>
                    <div className="p-6">
                      <UserProfile
                        routing="hash"
                        appearance={{
                          variables: {
                            colorPrimary: brandColors['electric-indigo'],
                            colorBackground: brandColors['ice-white'],
                            colorText: brandColors['slate-gray'],
                            colorTextSecondary: brandColors['gray-600'],
                            fontFamily: 'Inter, sans-serif',
                            borderRadius: '8px',
                          },
                          elements: {
                            rootBox: 'shadow-none bg-transparent p-0 w-full',
                            card: 'shadow-none bg-transparent border-none p-0 w-full',
                            headerTitle: 'text-slate-gray text-xl font-semibold',
                            headerSubtitle: 'text-gray-600',
                            navbar: 'hidden',
                            navbarMobileMenuButton: 'hidden',
                            profileSectionPrimaryButton: 'bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white',
                            formButtonPrimary: 'bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white',
                            formFieldInput: 'border-gray-200 focus:border-electric-indigo focus:ring-electric-indigo/20',
                            dividerLine: 'bg-gray-200',
                          },
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Security Tab Content */}
                <TabsContent value="security" className="space-y-6">
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-slate-gray">Security Settings</h3>
                      <p className="text-sm text-gray-600 mt-1">Manage your password, two-factor authentication, and security preferences</p>
                    </div>
                    <div className="p-6">
                      <UserProfile
                        routing="hash"
                        appearance={{
                          variables: {
                            colorPrimary: brandColors['electric-indigo'],
                            colorBackground: brandColors['ice-white'],
                            colorText: brandColors['slate-gray'],
                            colorTextSecondary: brandColors['gray-600'],
                            fontFamily: 'Inter, sans-serif',
                            borderRadius: '8px',
                          },
                          elements: {
                            rootBox: 'shadow-none bg-transparent p-0 w-full',
                            card: 'shadow-none bg-transparent border-none p-0 w-full',
                            headerTitle: 'text-slate-gray text-xl font-semibold',
                            headerSubtitle: 'text-gray-600',
                            navbar: 'hidden',
                            navbarMobileMenuButton: 'hidden',
                            profileSectionPrimaryButton: 'bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white',
                            formButtonPrimary: 'bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white',
                            formFieldInput: 'border-gray-200 focus:border-electric-indigo focus:ring-electric-indigo/20',
                            dividerLine: 'bg-gray-200',
                          },
                        }}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
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

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
  
  console.log('Profile activeTab:', activeTab, 'pathname:', location.pathname);

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
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-white border border-gray-200 rounded-lg h-12 p-1">
                  {navItems.map((item) => (
                    <TabsTrigger
                      key={item.value}
                      value={item.value}
                      className="text-slate-gray font-medium data-[state=active]:bg-electric-indigo data-[state=active]:text-ice-white rounded-md transition-all duration-200 h-10"
                    >
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Single UserProfile with controlled routing */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
                  <UserProfile
                    routing="path"
                    path="/profile"
                    appearance={{
                      variables: {
                        colorPrimary: brandColors['electric-indigo'],
                        colorBackground: '#FFFFFF',
                        colorText: brandColors['slate-gray'],
                        colorTextSecondary: brandColors['gray-600'],
                        fontFamily: 'Inter, sans-serif',
                        borderRadius: '12px',
                      },
                      elements: {
                        rootBox: 'w-full h-full min-h-[600px]',
                        card: 'shadow-none bg-white border-none w-full h-full rounded-none min-h-[600px]',
                        headerTitle: 'hidden',
                        headerSubtitle: 'hidden', 
                        navbar: `bg-white border-b border-gray-100 p-4`,
                        navbarMobileMenuButton: 'hidden',
                        navbarButton: `text-slate-gray hover:text-electric-indigo hover:bg-electric-indigo/5 rounded-lg px-3 py-2 font-medium transition-colors`,
                        navbarButtonActive: `text-electric-indigo bg-electric-indigo/10 rounded-lg px-3 py-2 font-medium`,
                        profileSectionPrimaryButton: 'bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white border-0 rounded-lg font-medium px-4 py-2',
                        formButtonPrimary: 'bg-electric-indigo hover:bg-electric-indigo/90 text-ice-white border-0 rounded-lg font-medium px-4 py-2',
                        formFieldInput: 'border-gray-200 focus:border-electric-indigo focus:ring-2 focus:ring-electric-indigo/20 rounded-lg bg-white',
                        dividerLine: 'bg-gray-100',
                        profileSection: 'p-6 w-full',
                        profileSectionTitle: 'text-lg font-semibold text-slate-gray mb-4',
                        profileSectionContent: 'space-y-4 w-full',
                        accordionTriggerButton: 'hover:bg-gray-50 rounded-lg w-full',
                        pageScrollBox: 'w-full h-full',
                      },
                    }}
                  />
                </div>
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


import React from 'react';
import { SignedIn, SignedOut, RedirectToSignIn, UserProfile } from '@clerk/clerk-react';
import BrandSafeContainer from '@/components/ui/brand-safe-container';

const Profile = () => (
  <>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
    <SignedIn>
      <BrandSafeContainer className="min-h-screen bg-ice-white flex justify-center py-10">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <UserProfile />
        </div>
      </BrandSafeContainer>
    </SignedIn>
  </>
);

export default Profile;

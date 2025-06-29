import React from 'react';
import { SignedIn, SignedOut, RedirectToSignIn, UserProfile } from '@clerk/clerk-react';

const Profile = () => (
  <>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
    <SignedIn>
      <div className="min-h-screen bg-ice-white flex justify-center py-10">
        <UserProfile />
      </div>
    </SignedIn>
  </>
);

export default Profile;

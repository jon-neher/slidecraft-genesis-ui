
import React, { useEffect } from 'react';
import { SignedIn, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import ModernHero from '@/components/ModernHero';
import InteractiveDemo from '@/components/InteractiveDemo';
import ModernFeatures from '@/components/ModernFeatures';
import ModernCTA from '@/components/ModernCTA';
import ClerkSupabaseDemo from '@/components/ClerkSupabaseDemo';

const Index = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  // Redirect signed-in users to dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard');
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Show loading state while checking auth
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-ice-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the home page if user is signed in (they'll be redirected)
  if (isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-ice-white">
      <ModernHero />
      <SignedIn>
        <ClerkSupabaseDemo />
      </SignedIn>
      <InteractiveDemo />
      <ModernFeatures />
      <ModernCTA />
    </div>
  );
};

export default Index;

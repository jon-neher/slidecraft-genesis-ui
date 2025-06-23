
import React from 'react';
import { SignedIn } from '@clerk/clerk-react';
import ModernHero from '@/components/ModernHero';
import ModernFeatures from '@/components/ModernFeatures';
import ModernCTA from '@/components/ModernCTA';
import ClerkSupabaseDemo from '@/components/ClerkSupabaseDemo';

const Index = () => {
  return (
    <div className="min-h-screen bg-ice-white">
      <ModernHero />
      <SignedIn>
        <ClerkSupabaseDemo />
      </SignedIn>
      <ModernFeatures />
      <ModernCTA />
    </div>
  );
};

export default Index;


import React from 'react';
import { SignedIn } from '@clerk/clerk-react';
import UnifiedHero from '@/components/UnifiedHero';
import ModernFeatures from '@/components/ModernFeatures';
import ModernTestimonials from '@/components/ModernTestimonials';
import ModernCTA from '@/components/ModernCTA';
import ClerkSupabaseDemo from '@/components/ClerkSupabaseDemo';

const Index = () => {
  return (
    <div className="min-h-screen bg-ice-white">
      <UnifiedHero />
      <SignedIn>
        <ClerkSupabaseDemo />
      </SignedIn>
      <ModernFeatures />
      <ModernTestimonials />
      <ModernCTA />
    </div>
  );
};

export default Index;

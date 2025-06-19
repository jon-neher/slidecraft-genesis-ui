
import React from 'react';
import ModernHero from '@/components/ModernHero';
import ModernFeatures from '@/components/ModernFeatures';
import ModernTestimonials from '@/components/ModernTestimonials';
import ModernCTA from '@/components/ModernCTA';

const Index = () => {
  return (
    <div className="min-h-screen bg-ice-white">
      <ModernHero />
      <ModernFeatures />
      <ModernTestimonials />
      <ModernCTA />
    </div>
  );
};

export default Index;

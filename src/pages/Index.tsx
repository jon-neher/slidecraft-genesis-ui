
import React from 'react';
import ModernHero from '@/components/ModernHero';
import InteractiveDemo from '@/components/InteractiveDemo';
import ModernFeatures from '@/components/ModernFeatures';
import ModernCTA from '@/components/ModernCTA';

const Index = () => {
  return (
    <div className="min-h-screen bg-ice-white">
      <ModernHero />
      <InteractiveDemo />
      <ModernFeatures />
      <ModernCTA />
    </div>
  );
};

export default Index;

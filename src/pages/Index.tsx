
import React from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import WaitlistSection from '@/components/WaitlistSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <WaitlistSection />
      <Footer />
    </div>
  );
};

export default Index;

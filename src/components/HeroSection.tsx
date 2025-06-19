
import React from 'react';
import { motion } from 'framer-motion';
import ThreadingAnimation from './ThreadingAnimation';
import TypewriterHeadline from './TypewriterHeadline';
import EmailWaitlistForm from './EmailWaitlistForm';
import BackgroundElements from './BackgroundElements';

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-16 sm:px-6">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Threading Animation */}
      <ThreadingAnimation />
      
      {/* Animated background elements - reduced complexity */}
      <BackgroundElements />

      <div className="container mx-auto text-center relative z-10 max-w-4xl">
        <div className="max-w-4xl mx-auto">
          {/* Brand name with animation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 sm:mb-8"
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-gold-400 mb-4">
              Threadline
            </h3>
          </motion.div>

          {/* Main headline with typewriter effect */}
          <TypewriterHeadline />

          {/* Subline with staggered fade-in */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Thread together your data, ideas, and insights into compelling presentations with AI
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.6 }}
            className="text-sm sm:text-base md:text-lg text-gold-400 mb-8 sm:mb-12 font-semibold px-4"
          >
            Be the first to experience the future of presentation creation
          </motion.p>

          {/* CTA Form */}
          <EmailWaitlistForm />

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4, duration: 0.6 }}
            className="mt-6 sm:mt-8 text-xs sm:text-sm text-slate-400 px-4"
          >
            ✨ No spam, just early access • 🚀 Launching in 2024
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

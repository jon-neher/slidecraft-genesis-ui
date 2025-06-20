
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import ThreadingAnimation from './ThreadingAnimation';
import ClerkWaitlistForm from './ClerkWaitlistForm';
import { Button } from './ui/button';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      duration: 0.6
    }
  }
};

const UnifiedHero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-ice-white">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-subtle" />
      
      {/* Threading Animation */}
      <ThreadingAnimation />

      <motion.div 
        className="container mx-auto text-center relative z-10 px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-5xl mx-auto">
          {/* Brand mark */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 card-modern-enhanced px-4 py-2">
              <Sparkles className="w-4 h-4 text-electric-indigo" />
              <span className="text-sm font-medium text-slate-gray">Threadline</span>
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1 
            variants={itemVariants}
            className="heading-xl mb-6"
          >
            Turn your data into{' '}
            <span className="gradient-text">decks that speak volumes</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="body-lg mb-12 max-w-2xl mx-auto"
          >
            Thread together your data, ideas, and insights into compelling presentations with AI-powered design intelligence.
          </motion.p>

          {/* Clerk Waitlist Form */}
          <motion.div 
            variants={itemVariants}
            className="mb-12"
          >
            <ClerkWaitlistForm />
          </motion.div>

          {/* Secondary CTA */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-center mb-16"
          >
            <Button variant="outline" className="btn-outline-modern">
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={itemVariants}
            className="text-sm text-slate-gray/60"
          >
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <span className="flex items-center gap-2">
                🚀 Launching Q1 2024
              </span>
              <span className="hidden sm:block">•</span>
              <span className="flex items-center gap-2">
                ✨ No spam, just early access
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default UnifiedHero;

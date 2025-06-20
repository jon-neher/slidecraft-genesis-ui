import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import ThreadingAnimation from './ThreadingAnimation';
import ClerkWaitlistForm from './ClerkWaitlistForm';
import { Button } from './ui/button';

const ModernHero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30
    },
    visible: { 
      opacity: 1, 
      y: 0
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-ice-white">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Threading Animation - keeping the existing one */}
      <ThreadingAnimation />

      <motion.div 
        className="container mx-auto text-center relative z-10 container-padding"
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
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200">
              <Sparkles className="w-4 h-4 text-electric-indigo" />
              <span className="text-sm font-medium text-slate-gray">Threadline</span>
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1 
            variants={itemVariants}
            className="display-xl text-slate-gray mb-6 leading-tight"
          >
            Turn your data into{' '}
            <span className="text-gradient">decks that speak volumes</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-slate-gray/70 mb-12 max-w-2xl mx-auto leading-relaxed"
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
            <Button variant="outline" className="btn-secondary">
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
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ModernHero;


import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import ThreadingAnimation from './ThreadingAnimation';
import ClerkWaitlistForm from './ClerkWaitlistForm';
import { Button } from './ui/button';
import { containerVariants, itemVariants } from '../lib/variants';

const ModernHero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
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
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-gray/70 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-200 dark:border-border">
              <Sparkles className="w-4 h-4 text-electric-indigo" />
              <span className="text-sm font-medium text-foreground">Threadline</span>
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.h1 
            variants={itemVariants}
            className="display-xl text-foreground mb-6 leading-tight"
          >
            Turn your data into{' '}
            <span className="text-gradient">decks that speak volumes</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
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
        </div>
      </motion.div>
    </section>
  );
};

export default ModernHero;

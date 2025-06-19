
import React from 'react';
import { motion } from 'framer-motion';
import ThreadingAnimation from './ThreadingAnimation';
import TypewriterHeadline from './TypewriterHeadline';
import EmailWaitlistForm from './EmailWaitlistForm';
import BackgroundElements from './BackgroundElements';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6
    }
  }
};

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-16 sm:px-6">
      {/* Background gradient overlay */}
      <motion.div 
        className="absolute inset-0 hero-gradient"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />
      
      {/* Threading Animation */}
      <ThreadingAnimation />
      
      {/* Animated background elements - reduced complexity */}
      <BackgroundElements />

      <motion.div 
        className="container mx-auto text-center relative z-10 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto">
          {/* Brand name with animation */}
          <motion.div
            variants={itemVariants}
            className="mb-6 sm:mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.h3 
              className="text-lg sm:text-xl md:text-2xl font-display font-semibold text-gold-400 mb-4"
              initial={{ letterSpacing: "0.1em" }}
              animate={{ letterSpacing: "0.05em" }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Threadline
            </motion.h3>
          </motion.div>

          {/* Main headline with typewriter effect */}
          <motion.div variants={itemVariants}>
            <TypewriterHeadline />
          </motion.div>

          {/* Subline with staggered fade-in */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-300 mb-3 sm:mb-4 max-w-3xl mx-auto leading-relaxed px-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Thread together your data, ideas, and insights into compelling presentations with AI
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-gold-400 mb-8 sm:mb-12 font-semibold px-4"
            initial={{ opacity: 0, rotateX: -20 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Be the first to experience the future of presentation creation
          </motion.p>

          {/* CTA Form */}
          <motion.div variants={itemVariants}>
            <EmailWaitlistForm />
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-6 sm:mt-8 text-xs sm:text-sm text-slate-400 px-4"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              ✨ No spam, just early access •{" "}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.2, duration: 0.5 }}
            >
              🚀 Launching in 2024
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

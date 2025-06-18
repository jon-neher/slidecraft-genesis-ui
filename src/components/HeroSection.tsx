
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HeroSection = () => {
  const [email, setEmail] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [displayText, setDisplayText] = useState('');
  
  const mainHeadline = "The Future of Presentations";

  useEffect(() => {
    // Typewriter effect for headline
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(mainHeadline.slice(0, index));
      index++;
      if (index > mainHeadline.length) {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    console.log('Email submitted to waitlist:', email);
    setIsSubmitted(true);
    // Handle successful submission
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gold-400/20 rounded-full"
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Lottie placeholder - simulated with animated cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-12"
          >
            <div className="relative w-64 h-48 mx-auto mb-8">
              {/* Simulated slide assembly animation */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 card-gradient rounded-lg border"
                  animate={{
                    x: [100, 0],
                    y: [50, i * 10],
                    opacity: [0, 1],
                    rotate: [15, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeOut"
                  }}
                >
                  <div className="p-4 h-full flex flex-col justify-between">
                    <div className="h-2 bg-gold-400/60 rounded mb-2" />
                    <div className="space-y-1">
                      <div className="h-1 bg-slate-400/40 rounded w-3/4" />
                      <div className="h-1 bg-slate-400/40 rounded w-1/2" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main headline with typewriter effect */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-5xl md:text-7xl font-display font-bold mb-6"
          >
            <span className="text-gradient typewriter">{displayText}</span>
            <br />
            <span className="text-3xl md:text-4xl text-slate-300 font-normal">is Coming Soon</span>
          </motion.h1>

          {/* Subline with staggered fade-in */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.6 }}
            className="text-xl md:text-2xl text-slate-300 mb-4 max-w-2xl mx-auto"
          >
            AI-powered, data-driven presentations that adapt to your brand
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.6 }}
            className="text-lg text-gold-400 mb-12 font-semibold"
          >
            Join the exclusive waitlist for early access
          </motion.p>

          {/* CTA Form */}
          {!isSubmitted ? (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.4, duration: 0.6 }}
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email for early access"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-navy-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-gold-400 transition-colors"
              />
              <motion.div
                animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  className="gold-gradient text-navy-950 font-semibold px-8 py-3 hover:scale-105 transition-transform duration-200"
                >
                  Join Waitlist
                </Button>
              </motion.div>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-2xl text-gold-400 mb-2">🎉 You're on the list!</div>
              <p className="text-slate-300">We'll notify you when SlideCraft AI launches</p>
            </motion.div>
          )}

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4, duration: 0.6 }}
            className="mt-8 text-sm text-slate-400"
          >
            ✨ No spam, just early access • 🚀 Launching in 2024
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

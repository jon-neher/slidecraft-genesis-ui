
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
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Animated background elements - threading theme */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-20 bg-gold-400/10 origin-center"
            animate={{
              scaleY: [0, 1, 0],
              opacity: [0, 0.6, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto text-center relative z-10 max-w-5xl">
        <div className="max-w-4xl mx-auto">
          {/* Brand Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="w-20 h-20 mx-auto mb-6 gold-gradient rounded-xl flex items-center justify-center shadow-2xl">
              <span className="text-navy-950 font-bold text-2xl">TL</span>
            </div>
            <h3 className="text-xl md:text-2xl font-display font-semibold text-gold-400 mb-4">
              Threadline
            </h3>
          </motion.div>

          {/* Main headline with typewriter effect */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-tight"
          >
            <span className="text-gradient typewriter">{displayText}</span>
            <br />
            <span className="text-2xl sm:text-3xl md:text-4xl text-slate-300 font-normal">is Coming Soon</span>
          </motion.h1>

          {/* Subline with staggered fade-in */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.6 }}
            className="text-lg sm:text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Thread together your data, ideas, and insights into compelling presentations with AI
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.2, duration: 0.6 }}
            className="text-base sm:text-lg text-gold-400 mb-12 font-semibold px-4"
          >
            Be the first to experience the future of presentation creation
          </motion.p>

          {/* CTA Form */}
          {!isSubmitted ? (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.4, duration: 0.6 }}
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto px-4"
            >
              <Input
                type="email"
                placeholder="Enter your email for early access"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-navy-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-gold-400 transition-colors h-12 text-base"
              />
              <motion.div
                animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  className="gold-gradient text-navy-950 font-semibold px-8 py-3 h-12 text-base hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
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
              className="text-center px-4"
            >
              <div className="text-xl sm:text-2xl text-gold-400 mb-2">🎉 You're on the list!</div>
              <p className="text-slate-300 text-base sm:text-lg">We'll notify you when Threadline launches</p>
            </motion.div>
          )}

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4, duration: 0.6 }}
            className="mt-8 text-sm text-slate-400 px-4"
          >
            ✨ No spam, just early access • 🚀 Launching in 2024
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

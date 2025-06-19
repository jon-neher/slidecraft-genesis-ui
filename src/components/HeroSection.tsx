
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// General threading animation component
const ThreadingAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full opacity-30 sm:opacity-40"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Data points scattered across the canvas */}
        {[
          { cx: 120, cy: 80, delay: 0.5, size: 2 },
          { cx: 680, cy: 120, delay: 0.8, size: 3 },
          { cx: 200, cy: 200, delay: 1.1, size: 2.5 },
          { cx: 600, cy: 180, delay: 1.4, size: 2 },
          { cx: 150, cy: 350, delay: 1.7, size: 3 },
          { cx: 500, cy: 300, delay: 2.0, size: 2.5 },
          { cx: 750, cy: 400, delay: 2.3, size: 2 },
          { cx: 100, cy: 480, delay: 2.6, size: 2.5 },
          { cx: 400, cy: 450, delay: 2.9, size: 3 },
          { cx: 650, cy: 500, delay: 3.2, size: 2 },
          { cx: 300, cy: 100, delay: 1.0, size: 2 },
          { cx: 450, cy: 250, delay: 1.8, size: 2.5 }
        ].map((point, index) => (
          <motion.circle
            key={index}
            cx={point.cx}
            cy={point.cy}
            r={point.size}
            fill="#fbbf24"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 1.2, 1],
              opacity: [0, 1, 0.8, 0.6] 
            }}
            transition={{ 
              delay: point.delay, 
              duration: 1.2,
              repeat: Infinity,
              repeatDelay: 8,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Threading lines connecting data points */}
        <motion.path
          d="M 120 80 Q 200 140 300 100"
          stroke="#fbbf24"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.5, duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M 300 100 Q 400 150 500 300"
          stroke="#fbbf24"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2.2, duration: 2.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M 200 200 Q 350 250 450 250"
          stroke="#fbbf24"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2.8, duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M 450 250 Q 550 200 650 500"
          stroke="#fbbf24"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 3.5, duration: 2.8, ease: "easeInOut" }}
        />
        <motion.path
          d="M 150 350 Q 300 400 400 450"
          stroke="#fbbf24"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 4, duration: 2.2, ease: "easeInOut" }}
        />
        <motion.path
          d="M 500 300 Q 600 350 750 400"
          stroke="#fbbf24"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 4.5, duration: 2.5, ease: "easeInOut" }}
        />
        
        {/* Presentation elements forming from connections */}
        <motion.rect
          x="180"
          y="180"
          width="60"
          height="40"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.5"
          rx="4"
          opacity="0.7"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ delay: 5, duration: 1 }}
        />
        <motion.rect
          x="420"
          y="230"
          width="80"
          height="50"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.5"
          rx="4"
          opacity="0.7"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ delay: 5.5, duration: 1 }}
        />
        <motion.rect
          x="130"
          y="430"
          width="70"
          height="45"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.5"
          rx="4"
          opacity="0.7"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ delay: 6, duration: 1 }}
        />
        
        {/* Smaller presentation elements (charts/data visualizations) */}
        <motion.circle
          cx="220"
          cy="200"
          r="8"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1"
          opacity="0.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 5.2, duration: 0.8 }}
        />
        <motion.rect
          x="450"
          y="245"
          width="20"
          height="15"
          fill="#fbbf24"
          opacity="0.3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 5.7, duration: 0.6 }}
        />
        <motion.rect
          x="475"
          y="250"
          width="15"
          height="20"
          fill="#fbbf24"
          opacity="0.4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 5.9, duration: 0.6 }}
        />
        
        {/* Continuous flowing lines for atmosphere */}
        <motion.path
          d="M 0 300 Q 200 280 400 300 Q 600 320 800 300"
          stroke="#fbbf24"
          strokeWidth="0.5"
          fill="none"
          opacity="0.3"
          animate={{ 
            d: [
              "M 0 300 Q 200 280 400 300 Q 600 320 800 300",
              "M 0 300 Q 200 320 400 300 Q 600 280 800 300",
              "M 0 300 Q 200 280 400 300 Q 600 320 800 300"
            ]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

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
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-16 sm:px-6">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 hero-gradient" />
      
      {/* Threading Animation */}
      <ThreadingAnimation />
      
      {/* Animated background elements - reduced complexity */}
      <div className="absolute inset-0 hidden sm:block">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-12 md:h-16 bg-gold-400/5 origin-center"
            animate={{
              scaleY: [0, 1, 0],
              opacity: [0, 0.3, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

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
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-4 sm:mb-6 leading-tight px-2"
          >
            <span className="text-gradient typewriter text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold block mb-2 sm:mb-4">
              {displayText}
            </span>
            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-300 font-normal block">
              is Coming Soon
            </span>
          </motion.h1>

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
          {!isSubmitted ? (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.4, duration: 0.6 }}
              onSubmit={handleEmailSubmit}
              className="flex flex-col gap-3 sm:gap-4 max-w-md mx-auto px-4"
            >
              <Input
                type="email"
                placeholder="Enter your email for early access"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-navy-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-gold-400 transition-colors h-11 sm:h-12 text-sm sm:text-base"
              />
              <motion.div
                animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  className="gold-gradient text-navy-950 font-semibold px-6 sm:px-8 py-3 h-11 sm:h-12 text-sm sm:text-base hover:scale-105 transition-transform duration-200 w-full"
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
              <div className="text-lg sm:text-xl md:text-2xl text-gold-400 mb-2">🎉 You're on the list!</div>
              <p className="text-slate-300 text-sm sm:text-base md:text-lg">We'll notify you when Threadline launches</p>
            </motion.div>
          )}

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

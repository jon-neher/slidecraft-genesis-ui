
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const formVariants = {
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
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      duration: 0.6
    }
  }
};

const successVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    rotateY: -20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotateY: 0
  }
};

const EmailWaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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

  if (isSubmitted) {
    return (
      <motion.div
        variants={successVariants}
        initial="hidden"
        animate="visible"
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          duration: 0.8
        }}
        className="text-center px-4"
      >
        <motion.div
          className="text-lg sm:text-xl md:text-2xl text-neon-mint mb-2"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 0.6,
            repeat: 1
          }}
        >
          🎉 You're on the list!
        </motion.div>
        <motion.p 
          className="text-slate-300 text-sm sm:text-base md:text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          We'll notify you when Threadline launches
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible"
      onSubmit={handleEmailSubmit}
      className="flex flex-col gap-3 sm:gap-4 max-w-md mx-auto px-4"
    >
      <motion.div
        animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileFocus={{ scale: 1.02 }}
      >
        <Input
          type="email"
          placeholder="Enter your email for early access"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`bg-navy-800/50 border-slate-600 text-white placeholder:text-slate-400 transition-all duration-300 h-11 sm:h-12 text-sm sm:text-base ${
            isFocused ? 'border-neon-mint shadow-lg shadow-neon-mint/20' : ''
          }`}
        />
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          type="submit"
          className="electric-gradient text-navy-950 font-semibold px-6 sm:px-8 py-3 h-11 sm:h-12 text-sm sm:text-base w-full relative overflow-hidden group"
        >
          <motion.span
            className="relative z-10"
            initial={{ y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Join Waitlist
          </motion.span>
          
          {/* Animated background effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-electric-indigo to-neon-mint opacity-0 group-hover:opacity-100"
            initial={{ x: "-100%" }}
            whileHover={{ x: "0%" }}
            transition={{ duration: 0.3 }}
          />
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default EmailWaitlistForm;

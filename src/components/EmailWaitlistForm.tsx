
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EmailWaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        <div className="text-lg sm:text-xl md:text-2xl text-gold-400 mb-2">🎉 You're on the list!</div>
        <p className="text-slate-300 text-sm sm:text-base md:text-lg">We'll notify you when Threadline launches</p>
      </motion.div>
    );
  }

  return (
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
  );
};

export default EmailWaitlistForm;

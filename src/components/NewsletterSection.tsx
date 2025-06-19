
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    console.log('Newsletter subscription:', email);
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <div className="mb-12 sm:mb-16">
      <motion.h3 
        className="text-2xl sm:text-3xl font-display font-bold mb-4"
        initial={{ opacity: 0, rotateX: -15 }}
        whileInView={{ opacity: 1, rotateX: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        Stay <span className="text-gradient">Connected</span>
      </motion.h3>
      <motion.p 
        className="text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
      >
        Get exclusive updates on Threadline's development progress, early access opportunities, and launch announcements.
      </motion.p>
      
      {!isSubscribed ? (
        <motion.form 
          onSubmit={handleSubmit} 
          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="flex-1"
            animate={isFocused ? {
              scale: 1.02,
            } : {}}
            transition={{ duration: 0.2 }}
          >
            <Input
              type="email"
              placeholder="Get launch updates"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={`bg-navy-800/50 border-slate-600 text-white placeholder:text-slate-400 transition-all duration-300 h-12 text-base ${
                isFocused ? 'border-gold-400 shadow-lg shadow-gold-400/20' : ''
              }`}
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="submit"
              className="gold-gradient text-navy-950 font-semibold px-6 h-12 relative overflow-hidden group"
            >
              <span className="relative z-10">Subscribe</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gold-500 to-gold-600 opacity-0 group-hover:opacity-100"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </Button>
          </motion.div>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-gold-400 font-semibold text-base sm:text-lg"
          transition={{ type: "spring", stiffness: 200 }}
        >
          ✓ You'll be the first to know when we launch!
        </motion.div>
      )}
    </div>
  );
};

export default NewsletterSection;

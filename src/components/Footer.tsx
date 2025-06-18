
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Twitter, Bell } from 'lucide-react';

const Footer = () => {
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

  const socialIcons = [
    { icon: Mail, href: '#', label: 'Email Updates' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Bell, href: '#', label: 'Notifications' }
  ];

  return (
    <footer className="py-20 px-6 border-t border-slate-800">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-3xl font-display font-bold mb-4">
              Stay in the <span className="text-gradient">Loop</span>
            </h3>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Get exclusive updates on our development progress, early access opportunities, and launch announcements.
            </p>
            
            {!isSubscribed ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
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
                    className={`bg-navy-800/50 border-slate-600 text-white placeholder:text-slate-400 transition-all duration-300 ${
                      isFocused ? 'border-gold-400 animate-pulse-border' : ''
                    }`}
                  />
                </motion.div>
                <Button
                  type="submit"
                  className="gold-gradient text-navy-950 font-semibold px-6 hover:scale-105 transition-transform duration-200"
                >
                  Subscribe
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-gold-400 font-semibold"
              >
                ✓ You'll be the first to know when we launch!
              </motion.div>
            )}
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center space-x-6 mb-12"
          >
            {socialIcons.map((social, index) => {
              const IconComponent = social.icon;
              
              return (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ 
                    rotate: 15,
                    scale: 1.1
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-12 h-12 card-gradient rounded-full flex items-center justify-center hover:border-gold-400 transition-colors duration-300"
                  aria-label={social.label}
                >
                  <IconComponent className="w-5 h-5 text-gold-400" />
                </motion.a>
              );
            })}
          </motion.div>

          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="border-t border-slate-800 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center">
                  <span className="text-navy-950 font-bold text-sm">SC</span>
                </div>
                <span className="font-display font-bold text-xl">SlideCraft AI</span>
              </div>
              
              <nav className="flex space-x-8 text-sm">
                <a href="#" className="text-slate-400 hover:text-gold-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-slate-400 hover:text-gold-400 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-slate-400 hover:text-gold-400 transition-colors">
                  Contact
                </a>
              </nav>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-800 text-slate-500 text-sm">
              <p>&copy; 2024 SlideCraft AI. All rights reserved.</p>
              <p className="mt-2">
                Building the future of AI-powered presentations. Coming soon.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

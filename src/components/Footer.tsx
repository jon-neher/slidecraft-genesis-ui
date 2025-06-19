import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Twitter, Bell } from 'lucide-react';

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
      damping: 15
    }
  }
};

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
    <footer className="py-16 sm:py-20 px-4 sm:px-6 border-t border-slate-800">
      <div className="container mx-auto">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Newsletter Section */}
          <motion.div
            variants={itemVariants}
            className="mb-12 sm:mb-16"
          >
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
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center space-x-4 sm:space-x-6 mb-10 sm:mb-12"
          >
            {socialIcons.map((social, index) => {
              const IconComponent = social.icon;
              
              return (
                <motion.a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 sm:w-12 sm:h-12 card-gradient rounded-full flex items-center justify-center group"
                  whileHover={{ 
                    rotate: 15,
                    scale: 1.2,
                    borderColor: "rgb(251 191 36)"
                  }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  aria-label={social.label}
                  initial={{ opacity: 0, y: 20, rotate: -10 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0, 
                    rotate: 0,
                    transition: { delay: index * 0.1 }
                  }}
                  viewport={{ once: true }}
                >
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 group-hover:text-gold-300 transition-colors" />
                </motion.a>
              );
            })}
          </motion.div>

          {/* Company Info */}
          <motion.div
            variants={itemVariants}
            className="border-t border-slate-800 pt-6 sm:pt-8"
          >
            <motion.div 
              className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="w-8 h-8 gold-gradient rounded-lg flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-navy-950 font-bold text-sm">TL</span>
                </motion.div>
                <span className="font-display font-bold text-lg sm:text-xl">Threadline</span>
              </motion.div>
              
              <nav className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm">
                {['Privacy Policy', 'Terms of Service', 'Contact'].map((item, index) => (
                  <motion.a 
                    key={item}
                    href="#" 
                    className="text-slate-400 hover:text-gold-400 transition-colors relative"
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: 0.5 + index * 0.1 }
                    }}
                    viewport={{ once: true }}
                  >
                    {item}
                    <motion.div
                      className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-400"
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
              </nav>
            </motion.div>
            
            <motion.div 
              className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-800 text-slate-500 text-xs sm:text-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p>&copy; 2024 Threadline. All rights reserved.</p>
              <motion.p 
                className="mt-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                viewport={{ once: true }}
              >
                Threading together the future of AI-powered presentations.
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

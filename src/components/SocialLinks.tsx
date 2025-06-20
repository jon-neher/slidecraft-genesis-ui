
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Twitter, Bell } from 'lucide-react';

const SocialLinks = () => {
  const socialIcons = [
    { icon: Mail, href: '#', label: 'Email Updates' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Bell, href: '#', label: 'Notifications' }
  ];

  return (
    <div className="flex justify-center space-x-4 sm:space-x-6 mb-10 sm:mb-12">
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
            borderColor: "#30F2B3"
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
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-neon-mint group-hover:text-neon-mint/80 transition-colors" />
          </motion.a>
        );
      })}
    </div>
  );
};

export default SocialLinks;

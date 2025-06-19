
import React from 'react';
import { motion } from 'framer-motion';
import NewsletterSection from './NewsletterSection';
import SocialLinks from './SocialLinks';
import CompanyInfo from './CompanyInfo';

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
    scale: 1
  }
};

const Footer = () => {
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
          <motion.div
            variants={itemVariants}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            <NewsletterSection />
          </motion.div>

          <motion.div
            variants={itemVariants}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            <SocialLinks />
          </motion.div>

          <motion.div
            variants={itemVariants}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
          >
            <CompanyInfo />
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;


import React from 'react';
import { motion } from 'framer-motion';
import NewsletterSection from './NewsletterSection';
import SocialLinks from './SocialLinks';
import CompanyInfo from './CompanyInfo';
import { containerVariants, itemVariants } from '../lib/variants';



const Footer = () => {
  return (
    <footer className="py-16 sm:py-20 px-4 sm:px-6 border-t border-border">
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

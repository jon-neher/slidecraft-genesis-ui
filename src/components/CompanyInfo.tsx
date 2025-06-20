
import React from 'react';
import { motion } from 'framer-motion';

const CompanyInfo = () => {
  return (
    <div className="border-t border-slate-800 pt-6 sm:pt-8">
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
    </div>
  );
};

export default CompanyInfo;

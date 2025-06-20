
import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const socialProof = [
  { label: "Professionals Waiting", description: "Join professionals already excited about Threadline" },
  { label: "Beta Testers Selected", description: "Limited spots available for our closed beta program" },
  { label: "Companies Interested", description: "Enterprise teams ready to transform their presentations" },
  { label: "Innovation Focus", description: "Building the next generation of presentation tools" }
];

// Sample company logos interested in the product
const interestedCompanies = [
  { name: "TechCorp", logo: "TC" },
  { name: "DataFlow", logo: "DF" },
  { name: "CloudSync", logo: "CS" },
  { name: "InnovateLab", logo: "IL" },
  { name: "DigitalEdge", logo: "DE" },
  { name: "FutureWorks", logo: "FW" },
  { name: "SmartSolutions", logo: "SS" },
  { name: "NextGen", logo: "NG" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9,
    rotateX: -10
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    rotateX: 0
  }
};

const progressVariants = {
  hidden: { width: 0, opacity: 0 },
  visible: { 
    width: "68%", 
    opacity: 1
  }
};

const WaitlistSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
      <div className="container mx-auto">
        {/* Social Proof */}
        <motion.div
          ref={ref}
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-12 sm:mb-16 px-4"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ 
              duration: 0.8, 
              type: "spring", 
              stiffness: 100 
            }}
            viewport={{ once: true }}
          >
            Building Something <span className="text-gradient">Revolutionary</span>
          </motion.h2>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto mb-12 sm:mb-16"
            variants={containerVariants}
          >
            {socialProof.map((item, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="card-gradient rounded-xl p-4 sm:p-6 text-center group cursor-pointer"
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5
                }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  duration: 0.6
                }}
              >
                <motion.div 
                  className="text-lg sm:text-xl font-display font-bold text-gradient mb-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {item.label}
                </motion.div>
                <motion.div 
                  className="text-slate-300 text-xs sm:text-sm leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {item.description}
                </motion.div>
                
                {/* Hover effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-gold-400/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Waitlist Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.5, 
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
            viewport={{ once: true }}
            className="card-gradient rounded-xl p-6 sm:p-8 max-w-2xl mx-auto mb-12 sm:mb-16 group"
            whileHover={{ scale: 1.02, rotateX: 2 }}
          >
            <motion.h3 
              className="text-lg sm:text-xl font-display font-semibold mb-4"
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.05em" }}
              transition={{ delay: 0.7, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Early Access Program
            </motion.h3>
            <div className="w-full bg-slate-700 rounded-full h-2 sm:h-3 mb-4 overflow-hidden">
              <motion.div
                variants={progressVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="gold-gradient h-2 sm:h-3 rounded-full relative"
                transition={{
                  duration: 2,
                  ease: "easeOut",
                  delay: 0.5
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 2
                  }}
                />
              </motion.div>
            </div>
            <motion.p 
              className="text-slate-300 text-xs sm:text-sm leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Limited beta spots filling up fast. Join now for priority access to Threadline.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Interested Companies Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden"
        >
          <motion.div 
            className="text-center mb-6 sm:mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-slate-400 text-xs sm:text-sm uppercase tracking-wider">
              Companies Showing Interest
            </p>
          </motion.div>
          
          <motion.div 
            className="flex space-x-4 sm:space-x-6 lg:space-x-8 animate-marquee"
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            {/* First set of logos */}
            {interestedCompanies.map((company, index) => (
              <motion.div
                key={`first-${index}`}
                className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 card-gradient rounded-xl flex items-center justify-center opacity-70"
                whileHover={{ 
                  scale: 1.2, 
                  opacity: 1,
                  rotate: 5,
                  transition: {
                    type: "spring",
                    stiffness: 300
                  }
                }}
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ 
                  opacity: 0.7, 
                  scale: 1, 
                  rotate: 0,
                  transition: {
                    delay: 1 + index * 0.1,
                    duration: 0.5
                  }
                }}
              >
                <span className="text-gold-400 font-display font-bold text-sm sm:text-base lg:text-lg">
                  {company.logo}
                </span>
              </motion.div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {interestedCompanies.map((company, index) => (
              <motion.div
                key={`second-${index}`}
                className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 card-gradient rounded-xl flex items-center justify-center opacity-70"
                whileHover={{ 
                  scale: 1.2, 
                  opacity: 1,
                  rotate: 5,
                  transition: {
                    type: "spring",
                    stiffness: 300
                  }
                }}
              >
                <span className="text-gold-400 font-display font-bold text-sm sm:text-base lg:text-lg">
                  {company.logo}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WaitlistSection;

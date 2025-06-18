
import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const socialProof = [
  { label: "Professionals Waiting", description: "Join thousands of professionals already on our waitlist" },
  { label: "Beta Testers Selected", description: "Limited spots available for our closed beta program" },
  { label: "Companies Interested", description: "Enterprise teams ready to transform their presentations" },
  { label: "Average Interest Score", description: "Based on early feedback and market research" }
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

const WaitlistSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        {/* Social Proof */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-16">
            Building Something <span className="text-gradient">Revolutionary</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {socialProof.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                className="card-gradient rounded-xl p-6 text-center"
              >
                <div className="text-xl font-display font-bold text-gradient mb-2">
                  {item.label}
                </div>
                <div className="text-slate-300 text-sm">
                  {item.description}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Waitlist Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="card-gradient rounded-xl p-8 max-w-2xl mx-auto mb-16"
          >
            <h3 className="text-xl font-display font-semibold mb-4">
              Early Access Program
            </h3>
            <div className="w-full bg-slate-700 rounded-full h-3 mb-4">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "68%" }}
                transition={{ delay: 0.8, duration: 1.5 }}
                viewport={{ once: true }}
                className="gold-gradient h-3 rounded-full"
              />
            </div>
            <p className="text-slate-300 text-sm">
              Limited beta spots filling up fast. Join now for priority access.
            </p>
          </motion.div>
        </motion.div>

        {/* Interested Companies Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden"
        >
          <div className="text-center mb-8">
            <p className="text-slate-400 text-sm uppercase tracking-wider">
              Companies Showing Interest
            </p>
          </div>
          
          <div className="flex space-x-8 animate-marquee">
            {/* First set of logos */}
            {interestedCompanies.map((company, index) => (
              <motion.div
                key={`first-${index}`}
                whileHover={{ scale: 1.1 }}
                className="flex-shrink-0 w-24 h-24 card-gradient rounded-xl flex items-center justify-center opacity-70"
              >
                <span className="text-gold-400 font-display font-bold text-lg">
                  {company.logo}
                </span>
              </motion.div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {interestedCompanies.map((company, index) => (
              <motion.div
                key={`second-${index}`}
                whileHover={{ scale: 1.1 }}
                className="flex-shrink-0 w-24 h-24 card-gradient rounded-xl flex items-center justify-center opacity-70"
              >
                <span className="text-gold-400 font-display font-bold text-lg">
                  {company.logo}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WaitlistSection;

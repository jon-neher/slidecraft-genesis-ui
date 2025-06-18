
import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const metrics = [
  { label: "Decks Generated", value: 15000, suffix: "K+" },
  { label: "Time Saved", value: 250, suffix: "K+ Hours" },
  { label: "Companies Trust Us", value: 500, suffix: "+" },
  { label: "Average Rating", value: 4.9, suffix: "/5.0" }
];

const CounterAnimation = ({ 
  target, 
  suffix, 
  isVisible 
}: { 
  target: number; 
  suffix: string; 
  isVisible: boolean; 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target, isVisible]);

  return (
    <span>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

// Sample partner logos data
const partnerLogos = [
  { name: "TechCorp", logo: "TC" },
  { name: "DataFlow", logo: "DF" },
  { name: "CloudSync", logo: "CS" },
  { name: "InnovateLab", logo: "IL" },
  { name: "DigitalEdge", logo: "DE" },
  { name: "FutureWorks", logo: "FW" },
  { name: "SmartSolutions", logo: "SS" },
  { name: "NextGen", logo: "NG" }
];

const MetricsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        {/* Metrics */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-16">
            Trusted by <span className="text-gradient">Teams Worldwide</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {metrics.map((metric, index) => (
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
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-display font-bold text-gradient mb-2">
                  <CounterAnimation 
                    target={metric.value} 
                    suffix={metric.suffix}
                    isVisible={isInView}
                  />
                </div>
                <div className="text-slate-300 text-sm md:text-base">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Partner Logos Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="relative overflow-hidden"
        >
          <div className="text-center mb-8">
            <p className="text-slate-400 text-sm uppercase tracking-wider">
              Trusted by Leading Companies
            </p>
          </div>
          
          <div className="flex space-x-8 animate-marquee">
            {/* First set of logos */}
            {partnerLogos.map((partner, index) => (
              <motion.div
                key={`first-${index}`}
                whileHover={{ scale: 1.1 }}
                className="flex-shrink-0 w-24 h-24 card-gradient rounded-xl flex items-center justify-center"
              >
                <span className="text-gold-400 font-display font-bold text-lg">
                  {partner.logo}
                </span>
              </motion.div>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {partnerLogos.map((partner, index) => (
              <motion.div
                key={`second-${index}`}
                whileHover={{ scale: 1.1 }}
                className="flex-shrink-0 w-24 h-24 card-gradient rounded-xl flex items-center justify-center"
              >
                <span className="text-gold-400 font-display font-bold text-lg">
                  {partner.logo}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MetricsSection;

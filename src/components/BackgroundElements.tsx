
import React from 'react';
import { motion } from 'framer-motion';

const BackgroundElements = () => {
  return (
    <div className="absolute inset-0 hidden sm:block">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-12 md:h-16 bg-neon-mint/5 origin-center"
          animate={{
            scaleY: [0, 1, 0],
            opacity: [0, 0.3, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundElements;

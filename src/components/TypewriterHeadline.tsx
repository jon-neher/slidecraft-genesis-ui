
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypewriterHeadline = () => {
  const [displayText, setDisplayText] = useState('');
  const mainHeadline = "The Future of Presentations";

  useEffect(() => {
    // Typewriter effect for headline
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(mainHeadline.slice(0, index));
      index++;
      if (index > mainHeadline.length) {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.h1
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mb-4 sm:mb-6 leading-tight px-2"
    >
      <span className="text-gradient typewriter text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold block mb-2 sm:mb-4">
        {displayText}
      </span>
      <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-300 font-normal block">
        is Coming Soon
      </span>
    </motion.h1>
  );
};

export default TypewriterHeadline;

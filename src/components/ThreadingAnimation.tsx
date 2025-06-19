
import React from 'react';
import { motion } from 'framer-motion';

const ThreadingAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full opacity-30 sm:opacity-40"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Data points scattered across the canvas */}
        {[
          { cx: 120, cy: 80, delay: 0.5, size: 2 },
          { cx: 680, cy: 120, delay: 0.8, size: 3 },
          { cx: 200, cy: 200, delay: 1.1, size: 2.5 },
          { cx: 600, cy: 180, delay: 1.4, size: 2 },
          { cx: 150, cy: 350, delay: 1.7, size: 3 },
          { cx: 500, cy: 300, delay: 2.0, size: 2.5 },
          { cx: 750, cy: 400, delay: 2.3, size: 2 },
          { cx: 100, cy: 480, delay: 2.6, size: 2.5 },
          { cx: 400, cy: 450, delay: 2.9, size: 3 },
          { cx: 650, cy: 500, delay: 3.2, size: 2 },
          { cx: 300, cy: 100, delay: 1.0, size: 2 },
          { cx: 450, cy: 250, delay: 1.8, size: 2.5 }
        ].map((point, index) => (
          <motion.circle
            key={index}
            cx={point.cx}
            cy={point.cy}
            r={point.size}
            fill="#fbbf24"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1, 1.2, 1],
              opacity: [0, 1, 0.8, 0.6] 
            }}
            transition={{ 
              delay: point.delay, 
              duration: 1.2,
              repeat: Infinity,
              repeatDelay: 8,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Threading lines connecting data points */}
        <motion.path
          d="M 120 80 Q 200 140 300 100"
          stroke="#fbbf24"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.5, duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M 300 100 Q 400 150 500 300"
          stroke="#fbbf24"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2.2, duration: 2.5, ease: "easeInOut" }}
        />
        <motion.path
          d="M 200 200 Q 350 250 450 250"
          stroke="#fbbf24"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 2.8, duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M 450 250 Q 550 200 650 500"
          stroke="#fbbf24"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 3.5, duration: 2.8, ease: "easeInOut" }}
        />
        <motion.path
          d="M 150 350 Q 300 400 400 450"
          stroke="#fbbf24"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 4, duration: 2.2, ease: "easeInOut" }}
        />
        <motion.path
          d="M 500 300 Q 600 350 750 400"
          stroke="#fbbf24"
          strokeWidth="1"
          fill="none"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 4.5, duration: 2.5, ease: "easeInOut" }}
        />
        
        {/* Presentation elements forming from connections */}
        <motion.rect
          x="180"
          y="180"
          width="60"
          height="40"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.5"
          rx="4"
          opacity="0.7"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ delay: 5, duration: 1 }}
        />
        <motion.rect
          x="420"
          y="230"
          width="80"
          height="50"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.5"
          rx="4"
          opacity="0.7"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ delay: 5.5, duration: 1 }}
        />
        <motion.rect
          x="130"
          y="430"
          width="70"
          height="45"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.5"
          rx="4"
          opacity="0.7"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ delay: 6, duration: 1 }}
        />
        
        {/* Smaller presentation elements (charts/data visualizations) */}
        <motion.circle
          cx="220"
          cy="200"
          r="8"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1"
          opacity="0.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 5.2, duration: 0.8 }}
        />
        <motion.rect
          x="450"
          y="245"
          width="20"
          height="15"
          fill="#fbbf24"
          opacity="0.3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 5.7, duration: 0.6 }}
        />
        <motion.rect
          x="475"
          y="250"
          width="15"
          height="20"
          fill="#fbbf24"
          opacity="0.4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 5.9, duration: 0.6 }}
        />
        
        {/* Continuous flowing lines for atmosphere */}
        <motion.path
          d="M 0 300 Q 200 280 400 300 Q 600 320 800 300"
          stroke="#fbbf24"
          strokeWidth="0.5"
          fill="none"
          opacity="0.3"
          animate={{ 
            d: [
              "M 0 300 Q 200 280 400 300 Q 600 320 800 300",
              "M 0 300 Q 200 320 400 300 Q 600 280 800 300",
              "M 0 300 Q 200 280 400 300 Q 600 320 800 300"
            ]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default ThreadingAnimation;

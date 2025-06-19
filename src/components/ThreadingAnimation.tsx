
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
        {/* Data points with continuous pulsing animation */}
        {[
          { cx: 120, cy: 80, delay: 0, size: 2 },
          { cx: 680, cy: 120, delay: 0.8, size: 3 },
          { cx: 200, cy: 200, delay: 1.6, size: 2.5 },
          { cx: 600, cy: 180, delay: 2.4, size: 2 },
          { cx: 150, cy: 350, delay: 3.2, size: 3 },
          { cx: 500, cy: 300, delay: 4.0, size: 2.5 },
          { cx: 750, cy: 400, delay: 4.8, size: 2 },
          { cx: 100, cy: 480, delay: 5.6, size: 2.5 },
          { cx: 400, cy: 450, delay: 6.4, size: 3 },
          { cx: 650, cy: 500, delay: 7.2, size: 2 },
          { cx: 300, cy: 100, delay: 8.0, size: 2 },
          { cx: 450, cy: 250, delay: 8.8, size: 2.5 },
          // Additional data points for denser mesh
          { cx: 80, cy: 200, delay: 1.2, size: 2 },
          { cx: 350, cy: 80, delay: 2.0, size: 2.5 },
          { cx: 550, cy: 120, delay: 2.8, size: 2 },
          { cx: 720, cy: 200, delay: 3.6, size: 2.5 },
          { cx: 250, cy: 300, delay: 4.4, size: 2 },
          { cx: 700, cy: 300, delay: 5.2, size: 3 },
          { cx: 50, cy: 350, delay: 6.0, size: 2 },
          { cx: 350, cy: 380, delay: 6.8, size: 2.5 },
          { cx: 550, cy: 420, delay: 7.6, size: 2 },
          { cx: 180, cy: 520, delay: 8.4, size: 2.5 },
          { cx: 450, cy: 550, delay: 9.2, size: 2 },
          { cx: 750, cy: 550, delay: 10.0, size: 2.5 }
        ].map((point, index) => (
          <motion.circle
            key={index}
            cx={point.cx}
            cy={point.cy}
            r={point.size}
            fill="#fbbf24"
            animate={{ 
              scale: [1, 1.5, 1, 0.8, 1],
              opacity: [0.4, 0.8, 0.6, 0.3, 0.4] 
            }}
            transition={{ 
              delay: point.delay, 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Dense mesh of threading lines - horizontal connections */}
        <motion.path
          d="M 120 80 L 300 100 L 450 250 L 600 180 L 680 120"
          stroke="#fbbf24"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.5, 0.7, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M 200 200 L 350 80 L 550 120 L 720 200"
          stroke="#fbbf24"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.5, 0.7, 0]
          }}
          transition={{ 
            delay: 1,
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M 150 350 L 250 300 L 500 300 L 700 300"
          stroke="#fbbf24"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.5, 0.7, 0]
          }}
          transition={{ 
            delay: 2,
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M 100 480 L 180 520 L 350 380 L 550 420 L 650 500"
          stroke="#fbbf24"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.5, 0.7, 0]
          }}
          transition={{ 
            delay: 3,
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Vertical threading lines */}
        <motion.path
          d="M 120 80 L 80 200 L 150 350 L 100 480"
          stroke="#fbbf24"
          strokeWidth="0.7"
          fill="none"
          opacity="0.4"
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.4, 0.6, 0]
          }}
          transition={{ 
            delay: 1.5,
            duration: 9, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M 200 200 L 250 300 L 350 380 L 400 450"
          stroke="#fbbf24"
          strokeWidth="0.7"
          fill="none"
          opacity="0.4"
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.4, 0.6, 0]
          }}
          transition={{ 
            delay: 2.5,
            duration: 9, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M 600 180 L 550 420 L 450 550"
          stroke="#fbbf24"
          strokeWidth="0.7"
          fill="none"
          opacity="0.4"
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.4, 0.6, 0]
          }}
          transition={{ 
            delay: 3.5,
            duration: 9, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M 680 120 L 720 200 L 700 300 L 750 400 L 750 550"
          stroke="#fbbf24"
          strokeWidth="0.7"
          fill="none"
          opacity="0.4"
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.4, 0.6, 0]
          }}
          transition={{ 
            delay: 4.5,
            duration: 9, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Diagonal cross-connections */}
        <motion.path
          d="M 300 100 L 200 200 L 150 350"
          stroke="#fbbf24"
          strokeWidth="0.6"
          fill="none"
          opacity="0.3"
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.3, 0.5, 0]
          }}
          transition={{ 
            delay: 0.5,
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M 680 120 L 500 300 L 400 450"
          stroke="#fbbf24"
          strokeWidth="0.6"
          fill="none"
          opacity="0.3"
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.3, 0.5, 0]
          }}
          transition={{ 
            delay: 1.8,
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M 350 80 L 450 250 L 650 500"
          stroke="#fbbf24"
          strokeWidth="0.6"
          fill="none"
          opacity="0.3"
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.3, 0.5, 0]
          }}
          transition={{ 
            delay: 3.2,
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M 120 80 L 450 250 L 750 400"
          stroke="#fbbf24"
          strokeWidth="0.6"
          fill="none"
          opacity="0.3"
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.3, 0.5, 0]
          }}
          transition={{ 
            delay: 4.7,
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Additional interconnected mesh lines */}
        <motion.path
          d="M 80 200 L 350 380 L 720 200"
          stroke="#fbbf24"
          strokeWidth="0.5"
          fill="none"
          opacity="0.25"
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.25, 0.4, 0]
          }}
          transition={{ 
            delay: 2.2,
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M 250 300 L 600 180 L 180 520"
          stroke="#fbbf24"
          strokeWidth="0.5"
          fill="none"
          opacity="0.25"
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.25, 0.4, 0]
          }}
          transition={{ 
            delay: 3.8,
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M 550 120 L 350 380 L 450 550"
          stroke="#fbbf24"
          strokeWidth="0.5"
          fill="none"
          opacity="0.25"
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.25, 0.4, 0]
          }}
          transition={{ 
            delay: 5.3,
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M 50 350 L 500 300 L 750 550"
          stroke="#fbbf24"
          strokeWidth="0.5"
          fill="none"
          opacity="0.25"
          animate={{ 
            pathLength: [0, 1, 1, 0],
            opacity: [0, 0.25, 0.4, 0]
          }}
          transition={{ 
            delay: 6.1,
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Presentation elements with continuous scaling */}
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
          animate={{ 
            scale: [0.8, 1, 1.1, 1, 0.8],
            opacity: [0.3, 0.7, 0.9, 0.7, 0.3]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
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
          animate={{ 
            scale: [0.8, 1, 1.1, 1, 0.8],
            opacity: [0.3, 0.7, 0.9, 0.7, 0.3]
          }}
          transition={{ 
            delay: 2,
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
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
          animate={{ 
            scale: [0.8, 1, 1.1, 1, 0.8],
            opacity: [0.3, 0.7, 0.9, 0.7, 0.3]
          }}
          transition={{ 
            delay: 4,
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Smaller presentation elements with rotation */}
        <motion.circle
          cx="220"
          cy="200"
          r="8"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1"
          opacity="0.5"
          animate={{ 
            scale: [0.5, 1, 1.2, 1, 0.5],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.rect
          x="450"
          y="245"
          width="20"
          height="15"
          fill="#fbbf24"
          opacity="0.3"
          animate={{ 
            scaleY: [0.5, 1, 1.5, 1, 0.5],
            opacity: [0.2, 0.5, 0.8, 0.5, 0.2]
          }}
          transition={{ 
            delay: 1,
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.rect
          x="475"
          y="250"
          width="15"
          height="20"
          fill="#fbbf24"
          opacity="0.4"
          animate={{ 
            scaleY: [0.3, 1, 1.8, 1, 0.3],
            opacity: [0.2, 0.6, 0.9, 0.6, 0.2]
          }}
          transition={{ 
            delay: 2.5,
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Multiple flowing atmospheric lines */}
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
              "M 0 300 Q 200 290 400 310 Q 600 300 800 290",
              "M 0 300 Q 200 280 400 300 Q 600 320 800 300"
            ],
            opacity: [0.2, 0.4, 0.6, 0.4, 0.2]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M 0 200 Q 300 180 600 200 Q 700 220 800 200"
          stroke="#fbbf24"
          strokeWidth="0.3"
          fill="none"
          opacity="0.2"
          animate={{ 
            d: [
              "M 0 200 Q 300 180 600 200 Q 700 220 800 200",
              "M 0 200 Q 300 220 600 200 Q 700 180 800 200",
              "M 0 200 Q 300 200 600 180 Q 700 200 800 220",
              "M 0 200 Q 300 180 600 200 Q 700 220 800 200"
            ],
            opacity: [0.1, 0.3, 0.5, 0.3, 0.1]
          }}
          transition={{ 
            delay: 4,
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut"
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


import React from 'react';
import { motion } from 'framer-motion';
import { containerVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  variants?: object;
}

const AnimatedContainer = ({ 
  children, 
  className,
  variants = containerVariants
}: AnimatedContainerProps) => {
  return (
    <motion.div
      className={cn("grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6", className)}
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;

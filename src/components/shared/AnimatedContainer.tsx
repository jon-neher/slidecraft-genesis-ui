
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { containerVariants } from '@/lib/variants';
import { cn } from '@/lib/utils';

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}

const AnimatedContainer = ({ 
  children, 
  className,
  variants = containerVariants
}: AnimatedContainerProps) => {
  return (
    <motion.div
      className={cn(
        "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 bg-background",
        className
      )}
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;


import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { itemVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  whileHover?: object;
  onClick?: () => void;
  dataAttribute?: string;
}

const AnimatedCard = ({ 
  children, 
  className, 
  whileHover = { scale: 1.04, rotate: 1 },
  onClick,
  dataAttribute
}: AnimatedCardProps) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{
        ...whileHover,
        transition: { duration: 0.2 }
      }}
      className="will-change-transform"
      {...(dataAttribute && { [dataAttribute]: true })}
    >
      <Card 
        className={cn(
          "card-modern border-gray-200 hover:shadow-lg hover:border-electric-indigo/30 cursor-pointer transition-all duration-200 group bg-white",
          className
        )}
        onClick={onClick}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;

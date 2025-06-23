
import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'gray' | 'transparent';
  children: React.ReactNode;
}

const BackgroundContainer = ({ 
  variant = 'white', 
  className, 
  children, 
  ...props 
}: BackgroundContainerProps) => {
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    transparent: 'bg-transparent'
  };

  return (
    <div
      className={cn(
        backgroundClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default BackgroundContainer;

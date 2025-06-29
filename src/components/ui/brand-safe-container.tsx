
import React from 'react';
import { cn } from '@/lib/utils';
import { SAFE_BACKGROUNDS } from '@/lib/color-audit';

interface BrandSafeContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof SAFE_BACKGROUNDS;
  children: React.ReactNode;
  enforceBackground?: boolean;
}

const BrandSafeContainer = ({ 
  variant = 'primary', 
  className, 
  children, 
  enforceBackground = true,
  ...props 
}: BrandSafeContainerProps) => {
  // Always ensure a safe background is applied
  const safeBackground = SAFE_BACKGROUNDS[variant];
  
  // Log warning if trying to override with potentially unsafe colors
  if (className && className.includes('bg-') && !className.includes('bg-white') && !className.includes('bg-gray') && !className.includes('bg-ice-white') && !className.includes('bg-electric-indigo')) {
    console.warn('⚠️ Potentially unsafe background override:', className);
  }

  return (
    <div
      className={cn(
        enforceBackground ? safeBackground : '',
        'text-slate-gray', // Ensure safe text color
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default BrandSafeContainer;

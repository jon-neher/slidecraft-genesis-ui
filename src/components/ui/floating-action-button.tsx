
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const FloatingActionButton = ({ 
  icon, 
  onClick, 
  className,
  children 
}: FloatingActionButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg",
        "bg-electric-indigo hover:bg-electric-indigo/90 text-white",
        "transition-all duration-200 hover:scale-105 active:scale-95",
        "md:hidden", // Only show on mobile
        className
      )}
      size="icon"
    >
      {icon}
      {children && <span className="sr-only">{children}</span>}
    </Button>
  );
};

export default FloatingActionButton;

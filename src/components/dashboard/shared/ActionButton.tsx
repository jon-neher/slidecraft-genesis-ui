
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  shortcut?: string;
  icon?: React.ReactNode;
  className?: string;
}

const ActionButton = ({ 
  children, 
  disabled = false, 
  onClick, 
  shortcut, 
  icon,
  className 
}: ActionButtonProps) => {
  return (
    <Button 
      className={cn(
        `h-12 px-6 gap-2 transition-all duration-200`,
        disabled 
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
          : 'bg-electric-indigo hover:bg-electric-indigo/90 text-white',
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
      {children}
      {shortcut && (
        <span className="text-xs opacity-70 ml-1">{shortcut}</span>
      )}
    </Button>
  );
};

export default ActionButton;

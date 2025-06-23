
import React from 'react';
import { Card, CardProps } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TouchCardProps extends CardProps {
  onTap?: () => void;
  onLongPress?: () => void;
  children: React.ReactNode;
}

const TouchCard = ({ 
  onTap, 
  onLongPress, 
  className, 
  children, 
  ...props 
}: TouchCardProps) => {
  const [pressTimer, setPressTimer] = React.useState<NodeJS.Timeout | null>(null);

  const handleTouchStart = () => {
    if (onLongPress) {
      const timer = setTimeout(() => {
        onLongPress();
      }, 500); // 500ms for long press
      setPressTimer(timer);
    }
  };

  const handleTouchEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleClick = () => {
    if (onTap) {
      onTap();
    }
  };

  return (
    <Card
      className={cn(
        "touch-manipulation select-none",
        "transition-all duration-150",
        "active:scale-[0.98] active:shadow-sm",
        onTap && "cursor-pointer hover:shadow-md",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Card>
  );
};

export default TouchCard;


import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useTouchGestures } from '@/hooks/use-touch-gestures';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const MobileDrawer = ({ open, onClose, title, children }: MobileDrawerProps) => {
  const swipeRef = useTouchGestures({
    onSwipeDown: onClose
  });

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, onClose]);

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent 
        ref={swipeRef}
        className="bg-white border-t border-gray-200"
        aria-labelledby={title ? "drawer-title" : undefined}
      >
        {title && (
          <DrawerHeader className="flex items-center justify-between p-4 border-b border-gray-200">
            <DrawerTitle id="drawer-title" className="text-lg font-semibold">
              {title}
            </DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </Button>
          </DrawerHeader>
        )}
        <div className="p-4">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileDrawer;

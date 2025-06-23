
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Menu } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import ActionButton from './shared/ActionButton';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { headerVariants } from '@/lib/animations';
import { useIsMobile } from '@/hooks/use-mobile';

const QuickSelectHeader = () => {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <motion.header 
      className="border-b border-gray-200 bg-white p-4 lg:p-6"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <div className="flex items-center gap-2 lg:gap-4">
        <SidebarTrigger className="lg:hidden" />
        
        <div className="flex-1">
          <SearchInput
            placeholder={isMobile ? "Search..." : "Search companies or contacts..."}
            showKeyboardShortcut={!isMobile}
            onFocus={() => setSearchOpen(true)}
            data-tl-search-focus
            className="h-10 lg:h-12"
          />
        </div>
        
        {isMobile ? (
          <ActionButton
            disabled={!selectedEntity}
            icon={<Plus className="w-5 h-5" />}
            className="px-3 h-10 text-sm"
          >
            New
          </ActionButton>
        ) : (
          <ActionButton
            disabled={!selectedEntity}
            icon={<Plus className="w-5 h-5" />}
            shortcut="⌘N"
          >
            New Deck
          </ActionButton>
        )}
      </div>
    </motion.header>
  );
};

export default QuickSelectHeader;

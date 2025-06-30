
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Menu } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import ActionButton from './shared/ActionButton';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { headerVariants } from '@/lib/variants';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import ProfileMenu from '@/components/auth/ProfileMenu';

const QuickSelectHeader = () => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useIsMobile();
  const { openMobile } = useSidebar();

  return (
    <motion.header 
      className="sticky top-0 z-40 border-b border-sidebar-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 lg:p-6"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <div className="flex items-center gap-2 lg:gap-4">
        {isMobile && (
          <SidebarTrigger className="h-10 w-10">
            <Menu className="w-5 h-5" />
          </SidebarTrigger>
        )}
        
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
            icon={<Plus className="w-5 h-5" />}
            className="px-3 h-10 text-sm"
            onClick={() => navigate('/new-deck')}
          >
            New
          </ActionButton>
        ) : (
          <ActionButton
            icon={<Plus className="w-5 h-5" />}
            shortcut="⌘N"
            onClick={() => navigate('/new-deck')}
          >
            New Deck
          </ActionButton>
        )}

        <ProfileMenu />
      </div>
    </motion.header>
  );
};

export default QuickSelectHeader;

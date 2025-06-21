
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { SearchInput } from '@/components/ui/search-input';
import ActionButton from './shared/ActionButton';
import { headerVariants } from '@/lib/animations';

const QuickSelectHeader = () => {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <motion.header 
      className="border-b border-gray-200 bg-white p-6"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <div className="flex items-center gap-4">
        <SearchInput
          placeholder="Search companies or contacts..."
          showKeyboardShortcut={true}
          onFocus={() => setSearchOpen(true)}
          data-tl-search-focus
        />
        
        <ActionButton
          disabled={!selectedEntity}
          icon={<Plus className="w-5 h-5" />}
          shortcut="⌘N"
        >
          New Deck
        </ActionButton>
      </div>
    </motion.header>
  );
};

export default QuickSelectHeader;

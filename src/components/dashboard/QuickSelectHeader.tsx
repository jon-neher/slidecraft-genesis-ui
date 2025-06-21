import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';

const mockEntities = [
  { id: '1', name: 'Acme Corp', type: 'company', avatar: '/placeholder.svg' },
  { id: '2', name: 'TechStart Inc', type: 'company', avatar: '/placeholder.svg' },
  { id: '3', name: 'John Smith', type: 'contact', avatar: '/placeholder.svg' },
  { id: '4', name: 'Sarah Johnson', type: 'contact', avatar: '/placeholder.svg' },
];

const QuickSelectHeader = () => {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <motion.header 
      className="border-b border-gray-200 bg-white p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4">
        <SearchInput
          placeholder="Search companies or contacts..."
          showKeyboardShortcut={true}
          onFocus={() => setSearchOpen(true)}
          data-tl-search-focus
        />
        
        <Button 
          className={`h-12 px-6 gap-2 transition-all duration-200 ${
            selectedEntity 
              ? 'bg-electric-indigo hover:bg-electric-indigo/90 text-white' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!selectedEntity}
        >
          <Plus className="w-5 h-5" />
          New Deck
          <span className="text-xs opacity-70 ml-1">⌘N</span>
        </Button>
      </div>
    </motion.header>
  );
};

export default QuickSelectHeader;

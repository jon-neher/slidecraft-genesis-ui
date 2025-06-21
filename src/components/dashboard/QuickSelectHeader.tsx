
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search companies or contacts..."
            className="pl-10 h-12 text-base border-gray-200 focus:border-electric-indigo focus:ring-electric-indigo"
            onFocus={() => setSearchOpen(true)}
            data-tl-search-focus
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
        
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

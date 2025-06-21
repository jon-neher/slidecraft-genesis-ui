
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTeam: string;
  sortBy: string;
  onTeamClick?: () => void;
  onSortClick?: () => void;
  onGridClick?: () => void;
}

const FilterBar = ({
  searchTerm,
  onSearchChange,
  selectedTeam,
  sortBy,
  onTeamClick,
  onSortClick,
  onGridClick
}: FilterBarProps) => {
  return (
    <motion.div 
      className="flex items-center gap-4 flex-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <SearchInput
        placeholder="Search deck types..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="min-w-64"
      />
      
      <Button 
        variant="outline" 
        className="gap-2 h-10 border-gray-200 bg-white text-slate-gray hover:bg-electric-indigo/5 hover:border-electric-indigo hover:text-electric-indigo transition-colors"
        onClick={onTeamClick}
      >
        Team: {selectedTeam}
        <ChevronDown className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="outline" 
        className="gap-2 h-10 border-gray-200 bg-white text-slate-gray hover:bg-electric-indigo/5 hover:border-electric-indigo hover:text-electric-indigo transition-colors"
        onClick={onSortClick}
      >
        Sort: {sortBy}
        <ChevronDown className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-10 border-gray-200 bg-white text-slate-gray hover:bg-electric-indigo/5 hover:border-electric-indigo hover:text-electric-indigo transition-colors"
        onClick={onGridClick}
      >
        <Grid className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default FilterBar;

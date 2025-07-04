import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Grid, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PresentationFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onGridClick?: () => void;
}

const sortOptions = [
  { value: 'Recent', label: 'Most Recent' },
  { value: 'Title', label: 'Title (A-Z)' },
  { value: 'Status', label: 'Status' },
];

const PresentationFilterBar = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onGridClick
}: PresentationFilterBarProps) => {
  return (
    <motion.div 
      className="flex items-center gap-4 flex-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <SearchInput
        placeholder="Search presentations..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="min-w-64"
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="gap-2 h-10 border-border bg-background text-foreground hover:bg-muted transition-colors"
          >
            <SortAsc className="w-4 h-4" />
            Sort: {sortOptions.find(option => option.value === sortBy)?.label || sortBy}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {sortOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={sortBy === option.value ? 'bg-muted' : ''}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {onGridClick && (
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10 border-border bg-background text-foreground hover:bg-muted transition-colors"
          onClick={onGridClick}
        >
          <Grid className="w-4 h-4" />
        </Button>
      )}
    </motion.div>
  );
};

export default PresentationFilterBar;
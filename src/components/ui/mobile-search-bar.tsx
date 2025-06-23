
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileSearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const MobileSearchBar = ({ 
  placeholder = "Search...", 
  onSearch,
  className 
}: MobileSearchBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch?.(query);
    setIsExpanded(false);
  };

  const handleClear = () => {
    setQuery('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsExpanded(true)}
        className={cn("md:hidden", className)}
      >
        <Search className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 flex-1 md:hidden", className)}>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
        autoFocus
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Button variant="ghost" size="icon" onClick={handleClear}>
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default MobileSearchBar;

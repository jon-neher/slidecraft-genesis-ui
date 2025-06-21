import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Grid } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/search-input';

const mockDeckTypes = [
  { id: '1', name: 'Sales Pitch', description: 'Compelling presentations for prospects', thumbnail: '/placeholder.svg', category: 'Sales' },
  { id: '2', name: 'Investor Deck', description: 'Funding and investment presentations', thumbnail: '/placeholder.svg', category: 'Finance' },
  { id: '3', name: 'Product Launch', description: 'Showcase new products and features', thumbnail: '/placeholder.svg', category: 'Marketing' },
  { id: '4', name: 'Quarterly Review', description: 'Business performance summaries', thumbnail: '/placeholder.svg', category: 'Business' },
  { id: '5', name: 'Team Training', description: 'Educational and onboarding content', thumbnail: '/placeholder.svg', category: 'HR' },
  { id: '6', name: 'Client Report', description: 'Project updates and deliverables', thumbnail: '/placeholder.svg', category: 'Operations' },
];

const DeckGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [sortBy, setSortBy] = useState('Popular');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <motion.div 
        className="flex items-center gap-4 flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <SearchInput
          placeholder="Search deck types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="min-w-64"
        />
        
        <Button variant="outline" className="gap-2 h-10 border-gray-200 bg-white text-slate-gray hover:bg-gray-50 hover:border-electric-indigo hover:text-electric-indigo">
          Team: {selectedTeam}
          <ChevronDown className="w-4 h-4" />
        </Button>
        
        <Button variant="outline" className="gap-2 h-10 border-gray-200 bg-white text-slate-gray hover:bg-gray-50 hover:border-electric-indigo hover:text-electric-indigo">
          Sort: {sortBy}
          <ChevronDown className="w-4 h-4" />
        </Button>
        
        <Button variant="outline" size="icon" className="h-10 w-10 border-gray-200 bg-white text-slate-gray hover:bg-gray-50 hover:border-electric-indigo hover:text-electric-indigo">
          <Grid className="w-4 h-4" />
        </Button>
      </motion.div>

      {/* Deck Type Grid */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {mockDeckTypes.map((deckType) => (
          <motion.div
            key={deckType.id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.04, 
              rotate: 1,
              transition: { duration: 0.2 }
            }}
            className="will-change-transform"
            data-tl-deck-template-selected={deckType.id}
          >
            <Card className="card-modern border-gray-200 hover:shadow-lg cursor-pointer transition-all duration-200 group bg-white">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-electric-indigo/10 to-neon-mint/10 rounded-t-xl flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-electric-indigo to-neon-mint rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <span className="text-white font-semibold text-lg">
                      {deckType.name.split(' ').map(word => word[0]).join('')}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-gray group-hover:text-electric-indigo transition-colors">
                      {deckType.name}
                    </h3>
                    <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                      {deckType.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{deckType.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DeckGallery;

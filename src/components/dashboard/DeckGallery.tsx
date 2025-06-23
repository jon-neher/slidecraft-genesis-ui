
import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import AnimatedContainer from '@/components/shared/AnimatedContainer';
import TouchCard from '@/components/ui/touch-card';
import FilterBar from './shared/FilterBar';
import { mockDeckTypes } from '@/data/mockData';
import { useIsMobile } from '@/hooks/use-mobile';

const DeckGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [sortBy, setSortBy] = useState('Popular');
  const isMobile = useIsMobile();

  const handleDeckSelect = (deckId: string) => {
    console.log('Selected deck:', deckId);
    // Add deck selection logic here
  };

  const handleDeckLongPress = (deckId: string) => {
    console.log('Long pressed deck:', deckId);
    // Add context menu or actions for long press
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTeam={selectedTeam}
        sortBy={sortBy}
      />

      <AnimatedContainer className={`mobile-grid gap-4 lg:gap-6`}>
        {mockDeckTypes.map((deckType) => (
          <TouchCard
            key={deckType.id}
            onTap={() => handleDeckSelect(deckType.id)}
            onLongPress={() => handleDeckLongPress(deckType.id)}
            className="group cursor-pointer bg-white border border-gray-200 shadow-sm"
            data-tl-deck-template-selected={deckType.id}
          >
            <CardContent className="p-0">
              <div className={`aspect-video bg-gradient-to-br from-electric-indigo/10 to-neon-mint/10 rounded-t-xl flex items-center justify-center ${isMobile ? 'py-8' : ''}`}>
                <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} bg-gradient-to-br from-electric-indigo to-neon-mint rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                  <span className={`text-white font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
                    {deckType.name.split(' ').map(word => word[0]).join('')}
                  </span>
                </div>
              </div>
              
              <div className={`mobile-padding bg-white ${isMobile ? 'p-3' : 'p-4'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`font-semibold text-slate-gray group-hover:text-electric-indigo transition-colors ${isMobile ? 'text-sm' : ''}`}>
                    {deckType.name}
                  </h3>
                  <span className={`px-2 py-1 bg-gray-100 text-gray-600 rounded-full ${isMobile ? 'text-xs' : 'text-xs'}`}>
                    {deckType.category}
                  </span>
                </div>
                <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>{deckType.description}</p>
              </div>
            </CardContent>
          </TouchCard>
        ))}
      </AnimatedContainer>
    </div>
  );
};

export default DeckGallery;

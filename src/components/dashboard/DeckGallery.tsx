
import React, { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import AnimatedCard from '@/components/shared/AnimatedCard';
import AnimatedContainer from '@/components/shared/AnimatedContainer';
import FilterBar from './shared/FilterBar';
import { mockDeckTypes } from '@/data/mockData';

const DeckGallery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [sortBy, setSortBy] = useState('Popular');

  return (
    <div className="space-y-6">
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTeam={selectedTeam}
        sortBy={sortBy}
      />

      <AnimatedContainer>
        {mockDeckTypes.map((deckType) => (
          <AnimatedCard
            key={deckType.id}
            dataAttribute={`data-tl-deck-template-selected=${deckType.id}`}
          >
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
          </AnimatedCard>
        ))}
      </AnimatedContainer>
    </div>
  );
};

export default DeckGallery;

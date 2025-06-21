
import React from 'react';
import { Building, User, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Entity } from '@/data/mockData';

interface EntitySelectorProps {
  entity: Entity;
  onEditClick?: () => void;
}

const EntitySelector = ({ entity, onEditClick }: EntitySelectorProps) => {
  const IconComponent = entity.type === 'company' ? Building : User;

  return (
    <div className="flex items-start gap-4">
      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-electric-indigo to-neon-mint flex items-center justify-center">
        <IconComponent className="w-8 h-8 text-white" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-lg font-semibold text-slate-gray">{entity.name}</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-electric-indigo hover:bg-electric-indigo/10 hover:text-electric-indigo transition-colors"
            onClick={onEditClick}
          >
            <Edit className="w-4 h-4 mr-1" />
            Change
          </Button>
        </div>
        
        {entity.stats && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            {entity.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-sm text-gray-500">{stat.label}</div>
                <div className="font-medium text-slate-gray">{stat.value}</div>
              </div>
            ))}
          </div>
        )}
        
        {entity.recentDecks && (
          <div>
            <h3 className="text-sm font-medium text-slate-gray mb-2">Recent Decks</h3>
            <div className="flex gap-2 flex-wrap">
              {entity.recentDecks.map((deck) => (
                <div
                  key={deck.id}
                  className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 hover:bg-electric-indigo/10 hover:text-electric-indigo cursor-pointer transition-colors"
                >
                  {deck.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntitySelector;

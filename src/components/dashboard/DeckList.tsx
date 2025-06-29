
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useDecks } from '@/hooks/useDecks';

const DeckList = () => {
  const { decks, loading } = useDecks();

  return (
    <Card className="border-gray-200 bg-white">
      <CardContent className="p-4 space-y-2">
        <h2 className="font-semibold text-slate-gray">Past Decks</h2>
        {loading && <p className="text-sm text-gray-600">Loading...</p>}
        {!loading && decks.length === 0 && (
          <p className="text-sm text-gray-600">No decks found</p>
        )}
        <ul className="space-y-1">
          {decks.map((deck) => (
            <li key={deck.id} className="text-sm text-slate-gray">
              {deck.title}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default DeckList;

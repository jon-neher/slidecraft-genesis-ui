
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDecks } from '@/hooks/useDecks';
import { exportDeck } from '@/lib/exportDeck';
import { convertPuckToSlides } from '@/components/presentation/utils/slideDataConverter';
import { toast } from '@/components/ui/use-toast';

const DeckList = () => {
  const navigate = useNavigate();
  const { decks, loading, getSlides } = useDecks();

  const handleView = (id: string) => {
    navigate(`/view/${id}?mode=view`);
  };

  const handleEdit = (id: string) => {
    navigate(`/view/${id}?mode=edit`);
  };

  const handleDownload = async (id: string, title: string) => {
    const slideData = await getSlides(id);
    if (!slideData) {
      toast({
        title: 'Download Failed',
        description: 'Unable to fetch slides for this deck.',
        variant: 'destructive'
      });
      return;
    }

    const slides = convertPuckToSlides(slideData);
    await exportDeck(slides, `${title}.pptx`);
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardContent className="p-4 space-y-2">
        <h2 className="font-semibold text-slate-gray">Past Decks</h2>
        {loading && <p className="text-sm text-gray-600">Loading...</p>}
        {!loading && decks.length === 0 && (
          <p className="text-sm text-gray-600">No decks found</p>
        )}
        <ul className="space-y-2">
          {decks.map((deck) => (
            <li key={deck.id} className="flex items-center justify-between">
              <span className="text-sm text-slate-gray">{deck.title}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="View deck"
                  onClick={() => handleView(deck.id)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Edit deck"
                  onClick={() => handleEdit(deck.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Download deck"
                  onClick={() => handleDownload(deck.id, deck.title)}
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default DeckList;

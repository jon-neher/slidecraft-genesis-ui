import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSlideTemplates } from '@/hooks/useSlideTemplates';
import { usePresentations } from '@/hooks/usePresentations';
import { useSlideGenerations } from '@/hooks/useSlideGenerations';
import { useSecureHubSpotData } from '@/hooks/useSecureHubSpotData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SearchInput } from '@/components/ui/search-input';
import type { Json } from '@/integrations/supabase/types';

interface ContactResult {
  id: string;
  properties: { [key: string]: Json };
}

const NewDeckFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactResult | null>(null);
  const [contactQuery, setContactQuery] = useState('');
  const [context, setContext] = useState('');
  const [title, setTitle] = useState('');

  const { templates } = useSlideTemplates();
  const { createPresentation } = usePresentations();
  const { createGeneration } = useSlideGenerations();
  const { searchContacts } = useSecureHubSpotData();
  const [contactResults, setContactResults] = useState<ContactResult[]>([]);

  const handleSearch = async () => {
    const results = await searchContacts(contactQuery, 5);
    setContactResults(results);
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || !selectedContact) return;
    const presentation = await createPresentation({ title, context: { contact: selectedContact, notes: context } });
    await createGeneration({
      presentation_id: presentation.presentation_id,
      template_id: selectedTemplate,
      slide_index: 1,
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-ice-white p-6 space-y-6">
      {step === 0 && (
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Select a Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {templates.map(t => (
              <Button
                key={t.template_id}
                variant={selectedTemplate === t.template_id ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setSelectedTemplate(t.template_id)}
              >
                {t.name}
              </Button>
            ))}
            <div className="flex justify-end pt-4">
              <Button disabled={!selectedTemplate} onClick={() => setStep(1)}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Choose a Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <SearchInput
                value={contactQuery}
                onChange={e => setContactQuery(e.target.value)}
                placeholder="Search HubSpot contacts"
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
            <ul className="space-y-2">
              {contactResults.map(c => (
                <li key={c.id}>
                  <Button
                    variant={selectedContact?.id === c.id ? 'default' : 'outline'}
                    className="w-full justify-start"
                    onClick={() => setSelectedContact(c)}
                  >
                    {c.properties?.firstname as string} {c.properties?.lastname as string}
                  </Button>
                </li>
              ))}
            </ul>
            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button disabled={!selectedContact} onClick={() => setStep(2)}>
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Additional Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Presentation title"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <textarea
              className="w-full h-32 border border-gray-200 rounded-md p-2"
              placeholder="Context or notes"
              value={context}
              onChange={e => setContext(e.target.value)}
            />
            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button disabled={!selectedTemplate || !selectedContact || !title} onClick={handleGenerate}>
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewDeckFlow;



import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Search, FileText, User, Building } from 'lucide-react';
import { useSecureHubSpotData } from '@/hooks/useSecureHubSpotData';
import { useIntegrationConnection } from '@/hooks/useIntegrationConnection';
import { usePresentations } from '@/hooks/usePresentations';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import type { ContactRecord } from '@/integrations/hubspot/types';

const NewDeckFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createPresentation } = usePresentations();
  const { isConnected: hubspotConnected } = useIntegrationConnection('hubspot');
  const { searchContacts, loading: hubspotLoading, error: hubspotError } = useSecureHubSpotData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ContactRecord[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);
  const [notes, setNotes] = useState('');
  const [deckType, setDeckType] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { uploadFile, uploading } = useFileUpload();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const results = await searchContacts(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: 'Search Failed',
        description: 'Unable to search contacts. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateDeck = async () => {
    if (!title) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a title.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const contactData = selectedContact
        ? {
            id: selectedContact.id,
            properties: selectedContact.properties,
            createdAt: selectedContact.createdAt,
            updatedAt: selectedContact.updatedAt,
            archived: selectedContact.archived
          }
        : null;

      const uploadedUrl = file ? await uploadFile(file) : null;
      const contextData = {
        contact: contactData,
        notes,
        deckType,
        fileUrl: uploadedUrl
      };

      await createPresentation({
        title,
        context: contextData
      });

      toast({
        title: 'Success',
        description: 'Deck creation started. You can track progress in your dashboard.',
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create deck:', error);
      toast({
        title: 'Creation Failed',
        description: 'Unable to create deck. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Deck</h1>
        <p className="text-muted-foreground">
          {hubspotConnected
            ? 'Search for a contact and create a personalized presentation deck'
            : 'Create a personalized presentation deck'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Search */}
        {hubspotConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Contact
            </CardTitle>
            <CardDescription>
              Search for a contact from your HubSpot CRM
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search by name, email, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={hubspotLoading}>
                Search
              </Button>
            </div>

            {hubspotError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {hubspotError}
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-2">
                <Label>Search Results</Label>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {searchResults.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedContact?.id === contact.id
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-start gap-3">
                        <User className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">
                            {contact.properties.firstname || contact.properties.lastname
                              ? `${contact.properties.firstname || ''} ${contact.properties.lastname || ''}`.trim()
                              : 'No name'}
                          </p>
                          {contact.properties.email && (
                            <p className="text-xs text-muted-foreground">{contact.properties.email}</p>
                          )}
                          {contact.properties.company && (
                            <div className="flex items-center gap-1 mt-1">
                              <Building className="h-3 w-3" />
                              <p className="text-xs text-muted-foreground">{contact.properties.company}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        )}

        {/* Deck Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Deck Configuration
            </CardTitle>
            <CardDescription>
              Configure your presentation details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Deck Title</Label>
              <Input
                id="title"
                placeholder="Enter deck title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="deck-type">Deck Type</Label>
              <Select value={deckType} onValueChange={setDeckType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select deck type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Presentation</SelectItem>
                  <SelectItem value="demo">Product Demo</SelectItem>
                  <SelectItem value="proposal">Business Proposal</SelectItem>
                  <SelectItem value="follow-up">Follow-up Presentation</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any specific requirements or context..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="reference-file">Reference File</Label>
              <Input
                id="reference-file"
                type="file"
                accept=".txt,.pdf,.doc,.docx,.md,.rtf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>

            <Separator />

            <Button
              onClick={handleCreateDeck}
              className="w-full"
              disabled={!title || uploading || (hubspotConnected && !selectedContact)}
            >
              {uploading ? 'Uploading...' : 'Create Deck'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Selected Contact Summary */}
      {selectedContact && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Selected Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 mt-1" />
              <div>
                <p className="font-medium">
                  {selectedContact.properties.firstname || selectedContact.properties.lastname
                    ? `${selectedContact.properties.firstname || ''} ${selectedContact.properties.lastname || ''}`.trim()
                    : 'No name'}
                </p>
                {selectedContact.properties.email && (
                  <p className="text-sm text-muted-foreground">{selectedContact.properties.email}</p>
                )}
                {selectedContact.properties.company && (
                  <p className="text-sm text-muted-foreground">{selectedContact.properties.company}</p>
                )}
                {selectedContact.properties.jobtitle && (
                  <p className="text-sm text-muted-foreground">{selectedContact.properties.jobtitle}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewDeckFlow;

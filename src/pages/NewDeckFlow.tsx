import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { usePresentations } from '@/hooks/usePresentations';
import { useSecureHubSpotData } from '@/hooks/useSecureHubSpotData';
import type { ContactResult } from '@/integrations/hubspot/client';

interface FormData {
  title: string;
  audience: string;
  goals: string;
  selectedContact: ContactResult | null;
  notes: string;
}

const NewDeckFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createPresentation } = usePresentations();
  const { contacts, loading: contactsLoading } = useSecureHubSpotData();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    audience: '',
    goals: '',
    selectedContact: null,
    notes: ''
  });

  const handleCreatePresentation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert ContactResult to a serializable format for JSON storage
      const contextData = formData.selectedContact && formData.notes ? {
        contact: {
          id: formData.selectedContact.id,
          firstname: formData.selectedContact.properties?.firstname || '',
          lastname: formData.selectedContact.properties?.lastname || '',
          email: formData.selectedContact.properties?.email || '',
          company: formData.selectedContact.properties?.company || '',
          // Add other relevant properties as simple strings/numbers
        },
        notes: formData.notes,
        audience: formData.audience,
        goals: formData.goals
      } : {
        audience: formData.audience,
        goals: formData.goals
      };

      await createPresentation({
        title: formData.title,
        context: contextData
      });

      toast({
        title: 'Success',
        description: 'Deck creation started successfully',
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create deck',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">Create New Deck</h1>
              <p className="text-muted-foreground">
                Let's gather some information to create your personalized presentation
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Deck Details</CardTitle>
                <CardDescription>
                  Provide basic information about your presentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePresentation} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Presentation Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter your presentation title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="audience">Target Audience</Label>
                    <Input
                      id="audience"
                      value={formData.audience}
                      onChange={(e) => setFormData(prev => ({ ...prev, audience: e.target.value }))}
                      placeholder="Who is this presentation for?"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="goals">Goals & Objectives</Label>
                    <Textarea
                      id="goals"
                      value={formData.goals}
                      onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                      placeholder="What do you want to achieve with this presentation?"
                      rows={3}
                      required
                    />
                  </div>

                  {contacts && contacts.length > 0 && (
                    <>
                      <div>
                        <Label htmlFor="contact">Select Contact (Optional)</Label>
                        <Select onValueChange={(value) => {
                          const contact = contacts.find(c => c.id === value);
                          setFormData(prev => ({ ...prev, selectedContact: contact || null }));
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a contact to personalize for" />
                          </SelectTrigger>
                          <SelectContent>
                            {contacts.map((contact) => (
                              <SelectItem key={contact.id} value={contact.id}>
                                {contact.properties?.firstname} {contact.properties?.lastname} 
                                {contact.properties?.email && ` (${contact.properties.email})`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {formData.selectedContact && (
                        <div>
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Textarea
                            id="notes"
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Any specific points you'd like to address for this contact?"
                            rows={3}
                          />
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Create Deck
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {contactsLoading && (
              <Card>
                <CardContent className="text-center py-8">
                  <p>Loading contacts...</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SignedIn>
    </>
  );
};

export default NewDeckFlow;

import { useState } from 'react';
import { useSecureHubSpotData } from './useSecureHubSpotData';
import type { ContactRecord } from '@/integrations/hubspot/types';

export const useNewDeckForm = () => {
  const {
    searchContacts: secureSearchContacts,
    loading: hubspotLoading,
    error: hubspotError,
  } = useSecureHubSpotData();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ContactRecord[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);
  const [notes, setNotes] = useState('');
  const [deckType, setDeckType] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const searchContacts = async (query: string) => {
    if (!query.trim()) return;
    const results = await secureSearchContacts(query);
    setSearchResults(results);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedContact,
    setSelectedContact,
    notes,
    setNotes,
    deckType,
    setDeckType,
    title,
    setTitle,
    file,
    setFile,
    searchContacts,
    hubspotLoading,
    hubspotError,
  };
};

import { useMutation } from '@tanstack/react-query';

export interface SectionSuggestPayload {
  goal: string;
  audience: string;
  creative: boolean;
}

export interface SectionSuggestResponse {
  sections: string[];
}

async function suggestSections(payload: SectionSuggestPayload): Promise<SectionSuggestResponse> {
  const res = await fetch('https://igspkppkbqbbxffhdqlq.supabase.co/functions/v1/sections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to generate suggestions');
  }
  return res.json();
}

export function useSectionSuggestions() {
  return useMutation({
    mutationFn: suggestSections,
  });
}

import { useQuery } from '@tanstack/react-query';

export interface Blueprint {
  blueprint_id: string;
  name: string;
  is_default: boolean;
  data: { section_sequence?: { value: string[] } };
}

async function fetchCatalog(): Promise<Blueprint[]> {
  const res = await fetch('https://igspkppkbqbbxffhdqlq.supabase.co/functions/v1/blueprints?includeDefaults=true');
  if (!res.ok) {
    throw new Error('Failed to load catalog');
  }
  return res.json();
}

export function useBlueprintCatalog(enabled = true) {
  return useQuery({
    queryKey: ['blueprintCatalog'],
    queryFn: fetchCatalog,
    enabled,
  });
}

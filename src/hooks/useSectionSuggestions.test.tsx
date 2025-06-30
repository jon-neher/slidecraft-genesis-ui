import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSectionSuggestions } from './useSectionSuggestions';

const wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

describe('useSectionSuggestions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns sections from mutation', async () => {
    const sections = ['a', 'b'];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ sections }) }) as unknown as typeof fetch
    );

    const { result } = renderHook(() => useSectionSuggestions(), { wrapper });
    const data = await result.current.mutateAsync({ goal: 'g', audience: 'a', creative: false });
    expect(data.sections).toEqual(sections);
  });
});

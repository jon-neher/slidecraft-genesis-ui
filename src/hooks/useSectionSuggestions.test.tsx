import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { useSectionSuggestions } from './useSectionSuggestions';

const wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
);

describe('useSectionSuggestions', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('returns sections from mutation', async () => {
    const sections = ['a', 'b'];
    jest.spyOn(global, 'fetch').mockResolvedValue(
      { ok: true, json: async () => ({ sections }) } as unknown as Response
    );

    const { result } = renderHook(() => useSectionSuggestions(), { wrapper });
    const data = await result.current.mutateAsync({ goal: 'g', audience: 'a', creative: false });
    expect(data.sections).toEqual(sections);
  });
});

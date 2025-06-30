
/** @jest-environment jsdom */

import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { useSectionSuggestions } from './useSectionSuggestions';
import React from 'react';

const wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
  <QueryClientProvider client={new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })}>{children}</QueryClientProvider>
);

describe('useSectionSuggestions', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns sections from mutation', async () => {
    const sections = ['a', 'b'];
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ sections }),
    });

    const { result } = renderHook(() => useSectionSuggestions(), { wrapper });
    const data = await result.current.mutateAsync({ goal: 'g', audience: 'a', creative: false });
    expect(data.sections).toEqual(sections);
  });
});

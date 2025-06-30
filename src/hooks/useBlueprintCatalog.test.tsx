
/** @jest-environment jsdom */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { useBlueprintCatalog } from './useBlueprintCatalog';
import React from 'react';

describe('useBlueprintCatalog', () => {
  let queryClient: QueryClient;
  
  const wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    
    // Mock fetch globally
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches blueprint catalog', async () => {
    const mockCatalog = [{ blueprint_id: '1', name: 'A', is_default: true, data: {} }];
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCatalog,
    });

    const { result } = renderHook(() => useBlueprintCatalog(true), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockCatalog));
  });
});

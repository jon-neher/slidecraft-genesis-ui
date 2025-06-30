/** @jest-environment jsdom */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { useBlueprintCatalog } from './useBlueprintCatalog';

describe('useBlueprintCatalog', () => {
  const fetchMock = jest.fn();
  beforeAll(() => {
    if (typeof global.fetch === 'undefined') {
      Object.defineProperty(global, 'fetch', {
        value: globalThis.fetch as typeof fetch,
        writable: true,
        configurable: true,
      });
    }
  });
  const wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    jest.restoreAllMocks();
    (global as unknown as { fetch: typeof fetch }).fetch = fetchMock as unknown as typeof fetch;
  });

  it('fetches blueprint catalog', async () => {
    const mockCatalog = [{ blueprint_id: '1', name: 'A', is_default: true, data: {} }];
    fetchMock.mockResolvedValueOnce(
      { ok: true, json: async () => mockCatalog } as unknown as Response
    );

    const { result } = renderHook(() => useBlueprintCatalog(true), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockCatalog));
  });
});

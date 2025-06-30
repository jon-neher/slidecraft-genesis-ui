import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { useBlueprintCatalog } from './useBlueprintCatalog';

describe('useBlueprintCatalog', () => {
  const wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches blueprint catalog', async () => {
    const mockCatalog = [{ blueprint_id: '1', name: 'A', is_default: true, data: {} }];
    jest.spyOn(global, 'fetch').mockResolvedValue(
      { ok: true, json: async () => mockCatalog } as unknown as Response
    );

    const { result } = renderHook(() => useBlueprintCatalog(true), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockCatalog));
  });
});

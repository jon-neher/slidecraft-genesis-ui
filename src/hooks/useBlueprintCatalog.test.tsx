import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBlueprintCatalog } from './useBlueprintCatalog';

describe('useBlueprintCatalog', () => {
  const wrapper: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches blueprint catalog', async () => {
    const mockCatalog = [{ blueprint_id: '1', name: 'A', is_default: true, data: {} }];
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => mockCatalog }) as unknown as typeof fetch
    );

    const { result } = renderHook(() => useBlueprintCatalog(true), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual(mockCatalog));
  });
});

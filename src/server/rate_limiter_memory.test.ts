import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import RateLimiterMemorySingleton, { RateLimiterMemory } from './rate_limiter_memory';

function collect(times: number[], start: number) {
  return () => times.push(Date.now() - start);
}

describe('RateLimiterMemory', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('blocks after burst and recovers', async () => {
    const limiter = new RateLimiterMemory(100, 10_000);
    const times: number[] = [];
    const start = Date.now();

    const promises = Array.from({ length: 150 }, () =>
      limiter.take('p1').then(collect(times, start))
    );

    await vi.runAllTicks();
    expect(times.length).toBe(100);

    vi.advanceTimersByTime(10_000);
    await vi.runAllTicks();
    await Promise.all(promises);

    expect(times.length).toBe(150);
    expect(Math.min(...times.slice(100))).toBeGreaterThanOrEqual(10_000);
  });
});

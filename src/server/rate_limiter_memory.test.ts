import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import RateLimiterMemorySingleton, { RateLimiterMemory } from './rate_limiter_memory';

function collect(times: number[], start: number) {
  return () => times.push(Date.now() - start);
}

describe('RateLimiterMemory', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('blocks after burst and recovers', async () => {
    const limiter = new RateLimiterMemory(100, 10_000);
    const times: number[] = [];
    const start = Date.now();

    const promises = Array.from({ length: 150 }, () =>
      limiter.take('p1').then(collect(times, start))
    );

    await jest.runAllTicks();
    expect(times.length).toBe(100);

    jest.advanceTimersByTime(10_000);
    await jest.runAllTicks();
    await Promise.all(promises);

    expect(times.length).toBe(150);
    expect(Math.min(...times.slice(100))).toBeGreaterThanOrEqual(10_000);
  });
});

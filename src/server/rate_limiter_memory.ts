export interface BucketState {
  tokens: number
  resetAt: number
}

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export class RateLimiterMemory {
  private buckets: Map<string, BucketState> = new Map()

  constructor(private maxBurst = 100, private windowMs = 10_000) {}

  private getState(id: string): BucketState {
    const now = Date.now();
    let state = this.buckets.get(id);
    if (!state) {
      state = { tokens: this.maxBurst, resetAt: now + this.windowMs };
      this.buckets.set(id, state);
    }
    if (now >= state.resetAt) {
      state.tokens = this.maxBurst;
      state.resetAt = now + this.windowMs;
    }
    return state;
  }

  async take(id: string, cost = 1): Promise<void> {
    const now = Date.now();
    const state = this.getState(id);
    if (state.tokens >= cost) {
      state.tokens -= cost;
      return;
    }
    await delay(state.resetAt - now);
    return this.take(id, cost);
  }
}
const portalLimiters = new Map<string, RateLimiterMemory>()

export function getLimiter(
  id: string,
  maxBurst = 100,
  windowMs = 10_000
) {
  if (!portalLimiters.has(id)) {
    portalLimiters.set(id, new RateLimiterMemory(maxBurst, windowMs))
  }
  return portalLimiters.get(id)!
}

const rateLimiterMemory = getLimiter('default', 4, 1_000)
export default rateLimiterMemory

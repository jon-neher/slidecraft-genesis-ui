
// Browser-compatible rate limiter using localStorage
class BrowserRateLimiter {
  private key: string;
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 10000) {
    this.key = 'hubspot_rate_limit';
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async take(): Promise<boolean> {
    if (typeof window === 'undefined') {
      // Server-side or build time - allow request
      return true;
    }

    try {
      const now = Date.now();
      const stored = localStorage.getItem(this.key);
      let requests: number[] = stored ? JSON.parse(stored) : [];

      // Remove old requests outside the window
      requests = requests.filter(time => now - time < this.windowMs);

      if (requests.length >= this.maxRequests) {
        return false;
      }

      // Add current request
      requests.push(now);
      localStorage.setItem(this.key, JSON.stringify(requests));

      return true;
    } catch (error) {
      console.warn('Rate limiter error:', error);
      // If localStorage fails, allow the request
      return true;
    }
  }
}

const rateLimiter = new BrowserRateLimiter();
export default rateLimiter;

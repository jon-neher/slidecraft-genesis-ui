
import { RateLimiterMemory } from './rate_limiter_memory'

export class EnhancedRateLimiter {
  private static instances: Map<string, RateLimiterMemory> = new Map();

  static getInstance(key: string, points: number = 10, duration: number = 60000): RateLimiterMemory {
    if (!this.instances.has(key)) {
      this.instances.set(key, new RateLimiterMemory(points, duration));
    }
    return this.instances.get(key)!;
  }

  // Different rate limits for different operations
  static getAuthLimiter(): RateLimiterMemory {
    return this.getInstance('auth', 5, 900000); // 5 attempts per 15 minutes
  }

  static getSearchLimiter(): RateLimiterMemory {
    return this.getInstance('search', 30, 60000); // 30 searches per minute
  }

  static getAPILimiter(): RateLimiterMemory {
    return this.getInstance('api', 100, 60000); // 100 API calls per minute
  }

  static getHubSpotLimiter(): RateLimiterMemory {
    return this.getInstance('hubspot', 10, 60000); // 10 HubSpot calls per minute
  }

  static async checkRateLimit(
    limiterType: 'auth' | 'search' | 'api' | 'hubspot',
    key: string
  ): Promise<{ allowed: boolean; resetTime?: Date }> {
    try {
      let limiter: RateLimiterMemory;
      
      switch (limiterType) {
        case 'auth':
          limiter = this.getAuthLimiter();
          break;
        case 'search':
          limiter = this.getSearchLimiter();
          break;
        case 'api':
          limiter = this.getAPILimiter();
          break;
        case 'hubspot':
          limiter = this.getHubSpotLimiter();
          break;
        default:
          throw new Error('Invalid limiter type');
      }

      await limiter.take(key);
      return { allowed: true };
    } catch (error) {
      const resetTime = new Date(Date.now() + 60000); // Reset in 1 minute
      return { allowed: false, resetTime };
    }
  }
}

export default EnhancedRateLimiter;

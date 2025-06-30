
import { RateLimiterMemory } from '../../server/rate_limiter_memory'

const hubspotRateLimiter = new RateLimiterMemory(100, 1000)

export default hubspotRateLimiter
export { RateLimiterMemory }

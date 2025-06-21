import { RateLimiterMemory } from '../../server/rate_limiter_memory'

const hubspotRateLimiter = new RateLimiterMemory()

export default hubspotRateLimiter
export { RateLimiterMemory }


interface IRateLimiterMemory {
  take(key: string): Promise<void>
}

export class RateLimiterMemory implements IRateLimiterMemory {
  private requests: Map<string, number[]> = new Map()
  private maxRequests: number
  private windowMs: number

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  async take(key: string): Promise<void> {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...validRequests)
      const waitTime = this.windowMs - (now - oldestRequest)
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime))
        return this.take(key) // Retry after waiting
      }
    }
    
    validRequests.push(now)
    this.requests.set(key, validRequests)
  }
}

// Default instance
export default new RateLimiterMemory(100, 1000)

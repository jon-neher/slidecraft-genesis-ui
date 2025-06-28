import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// helper to import fresh module each time
async function loadConfig() {
  return await import('./config')
}

describe('config', () => {
  beforeEach(() => {
    vi.resetModules()
    delete (global as unknown as { Deno?: { env: { toObject(): Record<string, string> } } }).Deno
  })

  afterEach(() => {
    delete (global as unknown as { Deno?: { env: { toObject(): Record<string, string> } } }).Deno
  })

  it('reads values from process.env in Node', async () => {
    process.env.SUPABASE_URL = 'node-url'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'node-key'
    const cfg = await loadConfig()
    expect(cfg.SUPABASE_URL).toBe('node-url')
    expect(cfg.SUPABASE_SERVICE_ROLE_KEY).toBe('node-key')
  })

  it('prefers Deno.env when available', async () => {
    process.env.SUPABASE_URL = 'node-url'
    ;(global as unknown as { Deno?: { env: { toObject(): Record<string, string> } } }).Deno = {
      env: { toObject: () => ({ SUPABASE_URL: 'deno-url', SUPABASE_SERVICE_ROLE_KEY: 'deno-key' }) }
    }
    const cfg = await loadConfig()
    expect(cfg.SUPABASE_URL).toBe('deno-url')
    expect(cfg.SUPABASE_SERVICE_ROLE_KEY).toBe('deno-key')
  })
})

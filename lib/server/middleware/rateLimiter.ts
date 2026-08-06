import 'server-only'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Cleanup expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (now > entry.resetAt) {
        store.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

interface RateLimitOptions {
  windowMs: number
  limit: number
  message: string
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions,
): { allowed: boolean; message?: string; remaining: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + options.windowMs })
    return { allowed: true, remaining: options.limit - 1 }
  }

  entry.count++

  if (entry.count > options.limit) {
    return { allowed: false, message: options.message, remaining: 0 }
  }

  return { allowed: true, remaining: options.limit - entry.count }
}

export const GENERAL_LIMIT: RateLimitOptions = {
  windowMs: 60 * 1000,
  limit: 60,
  message: 'Terlalu banyak request. Silakan coba lagi nanti.',
}

export const LLM_LIMIT: RateLimitOptions = {
  windowMs: 60 * 1000,
  limit: 15,
  message: 'Batas request chat tercapai. Silakan tunggu sebentar.',
}

/**
 * Rate Limiting Module
 * Supports both in-memory (development) and Redis-backed (production) rate limiting.
 * Falls back to in-memory if Redis is not configured.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryStore.entries()) {
    if (entry.resetTime < now) {
      memoryStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for a given identifier.
 * Uses Redis in production if REDIS_URL is configured, otherwise falls back to in-memory.
 * @param identifier - Unique identifier (e.g., IP + route)
 * @param maxRequests - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 */
export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60 * 1000
): Promise<RateLimitResult> {
  // Try Redis first if configured
  if (process.env.REDIS_URL) {
    try {
      return await checkRedisRateLimit(identifier, maxRequests, windowMs);
    } catch {
      // Fall back to in-memory if Redis fails
    }
  }

  return checkMemoryRateLimit(identifier, maxRequests, windowMs);
}

/**
 * In-memory rate limiter (for development or fallback).
 */
function checkMemoryRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = memoryStore.get(identifier);

  if (!entry || entry.resetTime < now) {
    // New window
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
    };
    memoryStore.set(identifier, newEntry);
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: newEntry.resetTime,
    };
  }

  if (entry.count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  entry.count++;
  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - entry.count,
    reset: entry.resetTime,
  };
}

/**
 * Redis-backed rate limiter (for production).
 * Uses simple Redis INCR with expiry.
 */
async function checkRedisRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult> {
  // Dynamic import to avoid bundling Redis client in client-side code
  const { createClient } = await import("redis");

  const client = createClient({ url: process.env.REDIS_URL });
  if (!client.isOpen) {
    await client.connect();
  }

  const key = `ratelimit:${identifier}`;
  const now = Date.now();

  try {
    const current = await client.incr(key);

    if (current === 1) {
      // First request in window - set expiry
      await client.expire(key, Math.ceil(windowMs / 1000));
    }

    const ttl = await client.ttl(key);
    const resetTime = now + ttl * 1000;

    if (current > maxRequests) {
      return {
        success: false,
        limit: maxRequests,
        remaining: 0,
        reset: resetTime,
      };
    }

    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - current,
      reset: resetTime,
    };
  } finally {
    // Don't close the client - reuse connection
  }
}

/**
 * Get client IP from request.
 * Handles proxies and forwarded requests.
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  // Fallback - in production this should use the actual connection IP
  return "unknown";
}

/**
 * Legacy synchronous rate limiter for backward compatibility.
 * @deprecated Use checkRateLimit() instead for Redis support.
 */
export function checkRateLimitSync(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60 * 1000
): RateLimitResult {
  return checkMemoryRateLimit(identifier, maxRequests, windowMs);
}

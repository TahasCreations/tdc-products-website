/**
 * Rate Limiting Middleware
 * 
 * Features:
 * - Sliding window rate limiting
 * - Route-based limits
 * - IP + User + Route combination
 * - Standard headers: Retry-After, RateLimit-*
 * - Configurable via ENV variables
 * 
 * @module lib/middleware/rate-limit
 */

import { kv } from '../redis';

export type RateLimitConfig = {
  /** Requests per window */
  rpm: number;
  /** Window size in seconds (default: 60) */
  windowSec?: number;
  /** Custom key suffix (default: pathname) */
  key?: string;
  /** Skip rate limiting (for testing) */
  skip?: boolean;
};

/**
 * Rate limit middleware for Next.js API routes
 * 
 * @param req - Next.js Request object
 * @param cfg - Rate limit configuration
 * @returns Response if rate limited, null otherwise
 * 
 * @example
 * ```ts
 * // In API route
 * export async function GET(req: Request) {
 *   const rateLimited = await rateLimit(req, { 
 *     rpm: Number(process.env.RATE_SEARCH_RPM ?? 30) 
 *   });
 *   if (rateLimited) return rateLimited;
 *   
 *   // ... your logic
 * }
 * ```
 * 
 * @example
 * ```ts
 * // In middleware.ts
 * import { rateLimit } from './lib/middleware/rate-limit';
 * 
 * export async function middleware(req: Request) {
 *   const url = new URL(req.url);
 *   
 *   if (url.pathname.startsWith('/api/search')) {
 *     const r = await rateLimit(req, { 
 *       rpm: Number(process.env.RATE_SEARCH_RPM ?? 30) 
 *     });
 *     if (r) return r;
 *   }
 * }
 * ```
 */
export async function rateLimit(
  req: Request,
  cfg: RateLimitConfig
): Promise<Response | null> {
  // Skip if configured
  if (cfg.skip) return null;

  // Extract identifiers
  const ip = extractIP(req);
  const userId = extractUserId(req);
  const route = cfg.key || new URL(req.url).pathname;
  const windowSec = cfg.windowSec ?? 60;

  // Create bucket key: rl:{route}:{user}:{ip}:{window}
  const windowStart = Math.floor(Date.now() / 1000 / windowSec);
  const bucket = `rl:${route}:${userId}:${ip}:${windowStart}`;

  try {
    // Increment counter
    const count = await kv.incr(bucket);

    // Set expiry on first request
    if (count === 1) {
      await kv.expire(bucket, windowSec + 2);
    }

    const limit = cfg.rpm;
    const remaining = Math.max(0, limit - count);

    // Check if rate limited
    if (count > limit) {
      const retryAfter = windowSec; // Conservative estimate
      
      console.warn(
        `[rate-limit] Blocked: ${route} | IP: ${ip} | User: ${userId} | Count: ${count}/${limit}`
      );

      return new Response(
        JSON.stringify({
          error: 'rate_limited',
          message: 'Too many requests, please try again later',
          retryAfterSec: retryAfter,
          limit,
          remaining: 0,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfter),
            'RateLimit-Limit': String(limit),
            'RateLimit-Remaining': String(0),
            'RateLimit-Reset': String(windowStart + windowSec),
          },
        }
      );
    }

    // Log high usage (optional)
    if (remaining < limit * 0.2) {
      console.log(
        `[rate-limit] High usage: ${route} | IP: ${ip} | User: ${userId} | Remaining: ${remaining}/${limit}`
      );
    }

    return null; // Not rate limited
  } catch (error) {
    console.error('[rate-limit] Error:', error);
    // Fail open: allow request on error
    return null;
  }
}

/**
 * Extract IP address from request
 * Supports various proxy headers
 */
function extractIP(req: Request): string {
  // Try various headers in order of preference
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can be a comma-separated list
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = req.headers.get('x-real-ip');
  if (realIP) return realIP.trim();

  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP.trim();

  // Fallback
  return '0.0.0.0';
}

/**
 * Extract user ID from request
 * Looks for x-user-id header or falls back to 'anon'
 */
function extractUserId(req: Request): string {
  const userId = req.headers.get('x-user-id');
  return userId || 'anon';
}

/**
 * Preset rate limit configurations
 * Can be overridden by ENV variables
 */
export const RATE_LIMITS = {
  /** Default API rate limit */
  DEFAULT: {
    rpm: Number(process.env.RATE_DEFAULT_RPM ?? 100),
    windowSec: 60,
  },
  
  /** Search API rate limit */
  SEARCH: {
    rpm: Number(process.env.RATE_SEARCH_RPM ?? 30),
    windowSec: 60,
  },
  
  /** Authentication endpoints (stricter) */
  AUTH: {
    rpm: Number(process.env.RATE_AUTH_PER_5MIN ?? 5),
    windowSec: 300, // 5 minutes
  },
  
  /** Payment endpoints (very strict) */
  PAYMENT: {
    rpm: Number(process.env.RATE_PAYMENT_PER_HOUR ?? 10),
    windowSec: 3600, // 1 hour
  },
  
  /** Upload endpoints */
  UPLOAD: {
    rpm: Number(process.env.RATE_UPLOAD_PER_HOUR ?? 20),
    windowSec: 3600, // 1 hour
  },
  
  /** Admin endpoints (more lenient for internal use) */
  ADMIN: {
    rpm: Number(process.env.RATE_ADMIN_RPM ?? 200),
    windowSec: 60,
  },
} as const;

/**
 * Helper: Create rate limit response manually
 * Useful for custom rate limiting logic
 */
export function createRateLimitResponse(
  limit: number,
  retryAfter: number
): Response {
  return new Response(
    JSON.stringify({
      error: 'rate_limited',
      message: 'Too many requests, please try again later',
      retryAfterSec: retryAfter,
      limit,
      remaining: 0,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
        'RateLimit-Limit': String(limit),
        'RateLimit-Remaining': String(0),
      },
    }
  );
}

/**
 * Get current rate limit status for a key
 * Useful for debugging or displaying to users
 */
export async function getRateLimitStatus(
  req: Request,
  cfg: RateLimitConfig
): Promise<{
  limit: number;
  remaining: number;
  reset: number;
}> {
  const ip = extractIP(req);
  const userId = extractUserId(req);
  const route = cfg.key || new URL(req.url).pathname;
  const windowSec = cfg.windowSec ?? 60;
  const windowStart = Math.floor(Date.now() / 1000 / windowSec);
  const bucket = `rl:${route}:${userId}:${ip}:${windowStart}`;

  try {
    const count = await kv.get<number>(bucket) ?? 0;
    const limit = cfg.rpm;
    const remaining = Math.max(0, limit - count);
    const reset = windowStart + windowSec;

    return { limit, remaining, reset };
  } catch (error) {
    console.error('[rate-limit] Status check error:', error);
    return { limit: cfg.rpm, remaining: cfg.rpm, reset: 0 };
  }
}

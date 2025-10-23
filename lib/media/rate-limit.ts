import { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

export async function checkRateLimit(
  request: NextRequest,
  options: {
    limit: number;
    windowMs: number;
    keyPrefix?: string;
  }
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  const key = `${options.keyPrefix || 'default'}:${ip}`;
  const now = Date.now();

  // Clean up expired entries
  if (store[key] && store[key].resetAt < now) {
    delete store[key];
  }

  // Initialize or increment
  if (!store[key]) {
    store[key] = {
      count: 1,
      resetAt: now + options.windowMs
    };
    return {
      allowed: true,
      remaining: options.limit - 1,
      resetAt: store[key].resetAt
    };
  }

  store[key].count++;

  return {
    allowed: store[key].count <= options.limit,
    remaining: Math.max(0, options.limit - store[key].count),
    resetAt: store[key].resetAt
  };
}

export function getRateLimitConfig() {
  const writePerMin = parseInt(process.env.MEDIA_RATE_LIMIT_WRITE_PER_MIN || '30', 10);
  
  return {
    write: {
      limit: writePerMin,
      windowMs: 60 * 1000 // 1 minute
    },
    read: {
      limit: 100,
      windowMs: 60 * 1000 // 1 minute
    }
  };
}


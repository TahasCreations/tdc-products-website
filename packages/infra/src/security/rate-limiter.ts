import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { Redis } from 'ioredis';
import { env } from '@tdc/config';

// Redis store for rate limiting
class RedisStore {
  private redis: Redis;
  private prefix: string;

  constructor(redis: Redis, prefix: string = 'rate_limit:') {
    this.redis = redis;
    this.prefix = prefix;
  }

  async increment(key: string, windowMs: number): Promise<{ totalHits: number; resetTime: Date }> {
    const now = Date.now();
    const window = Math.floor(now / windowMs);
    const redisKey = `${this.prefix}${key}:${window}`;
    
    const totalHits = await this.redis.incr(redisKey);
    await this.redis.expire(redisKey, Math.ceil(windowMs / 1000));
    
    const resetTime = new Date((window + 1) * windowMs);
    return { totalHits, resetTime };
  }

  async decrement(key: string, windowMs: number): Promise<void> {
    const now = Date.now();
    const window = Math.floor(now / windowMs);
    const redisKey = `${this.prefix}${key}:${window}`;
    
    await this.redis.decr(redisKey);
  }

  async resetKey(key: string): Promise<void> {
    const pattern = `${this.prefix}${key}:*`;
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

// Rate limit configurations
export const rateLimitConfigs = {
  // General API rate limit
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Strict rate limit for sensitive endpoints
  strict: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    message: {
      error: 'Too many requests to sensitive endpoint, please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Auth endpoints rate limit
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth requests per windowMs
    message: {
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Upload endpoints rate limit
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 uploads per hour
    message: {
      error: 'Too many uploads, please try again later.',
      retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Search endpoints rate limit
  search: {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // limit each IP to 30 searches per minute
    message: {
      error: 'Too many search requests, please slow down.',
      retryAfter: '1 minute'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },
};

// Custom key generator for rate limiting
export const generateKey = (req: Request): string => {
  // Use IP address as base key
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  
  // Add user ID if authenticated
  const userId = (req as any).user?.id;
  if (userId) {
    return `user:${userId}`;
  }
  
  // Add API key if present
  const apiKey = req.headers['x-api-key'] as string;
  if (apiKey) {
    return `api:${apiKey}`;
  }
  
  return `ip:${ip}`;
};

// Rate limit handler
export const rateLimitHandler = (req: Request, res: Response, next: NextFunction) => {
  const key = generateKey(req);
  const config = rateLimitConfigs.general;
  
  // This would be implemented with Redis store
  // For now, we'll use the default in-memory store
  next();
};

// Create rate limiter middleware
export const createRateLimiter = (config: typeof rateLimitConfigs.general) => {
  return rateLimit({
    ...config,
    keyGenerator: generateKey,
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        error: config.message.error,
        retryAfter: config.message.retryAfter,
        timestamp: new Date().toISOString(),
      });
    },
    skip: (req: Request) => {
      // Skip rate limiting for health checks
      if (req.path === '/health') return true;
      
      // Skip rate limiting for internal requests
      if (req.headers['x-internal-request'] === 'true') return true;
      
      return false;
    },
  });
};

// WAF-like middleware for basic security
export const wafMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Block suspicious user agents
  const userAgent = req.headers['user-agent'] || '';
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /php/i,
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
    // Log suspicious activity
    console.warn(`[WAF] Suspicious user agent blocked: ${userAgent} from ${req.ip}`);
    return res.status(403).json({
      success: false,
      error: 'Access denied',
      timestamp: new Date().toISOString(),
    });
  }
  
  // Block requests with suspicious headers
  const suspiciousHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-cluster-client-ip',
  ];
  
  for (const header of suspiciousHeaders) {
    if (req.headers[header] && Array.isArray(req.headers[header])) {
      console.warn(`[WAF] Suspicious header detected: ${header} from ${req.ip}`);
      return res.status(403).json({
        success: false,
        error: 'Access denied',
        timestamp: new Date().toISOString(),
      });
    }
  }
  
  // Block requests with suspicious query parameters
  const suspiciousParams = [
    'union',
    'select',
    'insert',
    'update',
    'delete',
    'drop',
    'create',
    'alter',
    'exec',
    'execute',
    'script',
    'javascript',
    'vbscript',
    'onload',
    'onerror',
    'onclick',
  ];
  
  const queryString = req.url.toLowerCase();
  if (suspiciousParams.some(param => queryString.includes(param))) {
    console.warn(`[WAF] Suspicious query parameter detected from ${req.ip}`);
    return res.status(403).json({
      success: false,
      error: 'Access denied',
      timestamp: new Date().toISOString(),
    });
  }
  
  // Block requests with suspicious content types
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data') && req.headers['content-length'] && 
      parseInt(req.headers['content-length']) > 10 * 1024 * 1024) { // 10MB
    console.warn(`[WAF] Large file upload attempt from ${req.ip}`);
    return res.status(413).json({
      success: false,
      error: 'File too large',
      timestamp: new Date().toISOString(),
    });
  }
  
  next();
};

// IP whitelist middleware
export const ipWhitelistMiddleware = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    if (allowedIPs.includes(clientIP)) {
      next();
    } else {
      console.warn(`[WAF] IP not whitelisted: ${clientIP}`);
      res.status(403).json({
        success: false,
        error: 'Access denied',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

// Export rate limiters
export const generalRateLimiter = createRateLimiter(rateLimitConfigs.general);
export const strictRateLimiter = createRateLimiter(rateLimitConfigs.strict);
export const authRateLimiter = createRateLimiter(rateLimitConfigs.auth);
export const uploadRateLimiter = createRateLimiter(rateLimitConfigs.upload);
export const searchRateLimiter = createRateLimiter(rateLimitConfigs.search);


# Performans ve Güvenlik Önerileri

## 🚀 PERFORMANS OPTİMİZASYONLARI

### 1. **Caching Stratejisi**
```typescript
// packages/infrastructure/cache/redis-cache.service.ts
export class RedisCacheService {
  constructor(private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const cached = await this.redis.get(key)
    return cached ? JSON.parse(cached) : null
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value))
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern)
    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
  }
}

// Cache decorator
export function Cache(ttl: number = 3600, keyGenerator?: (...args: any[]) => string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyGenerator ? keyGenerator(...args) : `${propertyName}:${JSON.stringify(args)}`
      
      // Try cache first
      const cached = await cacheService.get(cacheKey)
      if (cached) return cached

      // Execute method
      const result = await method.apply(this, args)
      
      // Cache result
      await cacheService.set(cacheKey, result, ttl)
      
      return result
    }
  }
}

// Usage
export class ProductService {
  @Cache(1800) // 30 minutes
  async getProducts(categoryId?: string): Promise<Product[]> {
    // Database query
  }

  @Cache(3600, (id: string) => `product:${id}`)
  async getProductById(id: string): Promise<Product> {
    // Database query
  }
}
```

### 2. **Database Query Optimizasyonu**
```typescript
// packages/infrastructure/database/optimized-queries.ts
export class OptimizedProductQueries {
  constructor(private prisma: PrismaClient) {}

  // N+1 problem çözümü
  async getProductsWithCategories(tenantId: string, filters: ProductFilters) {
    return this.prisma.product.findMany({
      where: {
        tenantId,
        ...filters
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      // Pagination
      skip: filters.offset || 0,
      take: filters.limit || 20,
      // Index kullanımı için sıralama
      orderBy: [
        { isActive: 'desc' },
        { createdAt: 'desc' }
      ]
    })
  }

  // Bulk operations
  async bulkUpdateStock(updates: Array<{ id: string; quantity: number }>) {
    return this.prisma.$transaction(
      updates.map(update =>
        this.prisma.product.update({
          where: { id: update.id },
          data: { stockQuantity: update.quantity }
        })
      )
    )
  }

  // Aggregation queries
  async getProductStats(tenantId: string) {
    return this.prisma.product.aggregate({
      where: { tenantId },
      _count: {
        id: true
      },
      _sum: {
        stockQuantity: true
      },
      _avg: {
        price: true
      }
    })
  }
}
```

### 3. **CDN ve Static Asset Optimizasyonu**
```typescript
// packages/infrastructure/storage/cdn.service.ts
export class CDNService {
  constructor(private s3Client: S3Client) {}

  async uploadImage(file: Buffer, key: string): Promise<string> {
    // WebP conversion
    const webpBuffer = await sharp(file)
      .webp({ quality: 85 })
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .toBuffer()

    // Upload to S3
    await this.s3Client.putObject({
      Bucket: process.env.S3_BUCKET,
      Key: `images/${key}.webp`,
      Body: webpBuffer,
      ContentType: 'image/webp',
      CacheControl: 'max-age=31536000' // 1 year
    })

    return `https://cdn.tdcmarket.com/images/${key}.webp`
  }

  // Generate responsive images
  async generateResponsiveImages(file: Buffer, key: string) {
    const sizes = [320, 640, 768, 1024, 1200]
    const formats = ['webp', 'jpeg']

    const promises = sizes.flatMap(size =>
      formats.map(async format => {
        const buffer = await sharp(file)
          .resize(size, size, { fit: 'inside' })
          .toFormat(format as any, { quality: 85 })
          .toBuffer()

        await this.s3Client.putObject({
          Bucket: process.env.S3_BUCKET,
          Key: `images/${key}-${size}.${format}`,
          Body: buffer,
          ContentType: `image/${format}`,
          CacheControl: 'max-age=31536000'
        })
      })
    )

    await Promise.all(promises)
  }
}
```

## 🔒 GÜVENLİK ÖNERİLERİ

### 1. **Rate Limiting**
```typescript
// packages/application/middleware/rate-limit.middleware.ts
import { RateLimiterRedis } from 'rate-limiter-flexible'

export class RateLimitMiddleware {
  private rateLimiter: RateLimiterRedis

  constructor(redis: Redis) {
    this.rateLimiter = new RateLimiterRedis({
      storeClient: redis,
      keyPrefix: 'rl',
      points: 100, // Number of requests
      duration: 60, // Per 60 seconds
      blockDuration: 60, // Block for 60 seconds
    })
  }

  async checkLimit(identifier: string): Promise<boolean> {
    try {
      await this.rateLimiter.consume(identifier)
      return true
    } catch (rejRes) {
      return false
    }
  }
}

// API route protection
export async function withRateLimit(handler: NextApiHandler): Promise<NextApiHandler> {
  return async (req, res) => {
    const identifier = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const rateLimitMiddleware = new RateLimitMiddleware(redis)

    if (!(await rateLimitMiddleware.checkLimit(identifier as string))) {
      return res.status(429).json({ error: 'Too many requests' })
    }

    return handler(req, res)
  }
}
```

### 2. **Input Validation ve Sanitization**
```typescript
// packages/application/validation/schemas.ts
import { z } from 'zod'

export const ProductCreateSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Title contains invalid characters'),
  description: z.string()
    .max(5000, 'Description must be less than 5000 characters')
    .optional(),
  price: z.number()
    .positive('Price must be positive')
    .max(999999.99, 'Price too high'),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  stockQuantity: z.number()
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative')
    .max(99999, 'Stock too high')
})

export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  })
}
```

### 3. **Authentication ve Authorization**
```typescript
// packages/application/auth/jwt.service.ts
export class JWTService {
  private readonly secret: string
  private readonly expiresIn: string

  constructor() {
    this.secret = process.env.JWT_SECRET!
    this.expiresIn = process.env.JWT_EXPIRES_IN || '24h'
  }

  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn,
      issuer: 'tdc-market',
      audience: 'tdc-users'
    })
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.secret, {
        issuer: 'tdc-market',
        audience: 'tdc-users'
      }) as JWTPayload
    } catch (error) {
      throw new UnauthorizedError('Invalid token')
    }
  }

  generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    )
  }
}

// RBAC (Role-Based Access Control)
export class AuthorizationService {
  async checkPermission(
    userId: string,
    resource: string,
    action: string,
    tenantId?: string
  ): Promise<boolean> {
    const user = await this.userRepository.findById(userId)
    if (!user) return false

    // Super admin bypass
    if (user.role === 'SUPER_ADMIN') return true

    // Check tenant-specific permissions
    if (tenantId) {
      const userTenant = await this.userTenantRepository.findByUserAndTenant(userId, tenantId)
      if (!userTenant) return false
    }

    // Check role permissions
    const permissions = await this.getRolePermissions(user.role)
    return permissions.some(p => p.resource === resource && p.actions.includes(action))
  }
}
```

### 4. **Security Headers**
```typescript
// packages/application/middleware/security.middleware.ts
export function securityMiddleware(req: NextRequest, res: NextResponse) {
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // CSP Header
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.tdcmarket.com;"
  )

  return response
}
```

### 5. **Environment Variables Security**
```typescript
// packages/config/environment/validation.ts
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(20),
  S3_BUCKET: z.string().min(1),
  S3_REGION: z.string().min(1),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  PAYTR_MERCHANT_ID: z.string().min(1),
  PAYTR_MERCHANT_KEY: z.string().min(1),
  PAYTR_MERCHANT_SALT: z.string().min(1),
  PAYTR_API_URL: z.string().url(),
  SENTRY_DSN: z.string().url().optional(),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info')
})

export function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Invalid environment variables:', error)
    process.exit(1)
  }
}
```

## 📊 MONITORING VE OBSERVABILITY

### 1. **Application Metrics**
```typescript
// packages/infrastructure/monitoring/metrics.service.ts
import { register, Counter, Histogram, Gauge } from 'prom-client'

export class MetricsService {
  private httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code']
  })

  private httpRequestTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
  })

  private activeConnections = new Gauge({
    name: 'active_connections',
    help: 'Number of active connections'
  })

  constructor() {
    register.registerMetric(this.httpRequestDuration)
    register.registerMetric(this.httpRequestTotal)
    register.registerMetric(this.activeConnections)
  }

  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestDuration
      .labels(method, route, statusCode.toString())
      .observe(duration)
    
    this.httpRequestTotal
      .labels(method, route, statusCode.toString())
      .inc()
  }

  setActiveConnections(count: number) {
    this.activeConnections.set(count)
  }

  getMetrics(): string {
    return register.metrics()
  }
}
```

### 2. **Health Checks**
```typescript
// packages/application/health/health.service.ts
export class HealthService {
  constructor(
    private databaseService: DatabaseService,
    private cacheService: CacheService,
    private metricsService: MetricsService
  ) {}

  async getHealthStatus(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkCache(),
      this.checkExternalServices()
    ])

    const isHealthy = checks.every(check => check.status === 'fulfilled')

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      checks: {
        database: checks[0].status === 'fulfilled',
        cache: checks[1].status === 'fulfilled',
        external: checks[2].status === 'fulfilled'
      }
    }
  }

  private async checkDatabase(): Promise<void> {
    await this.databaseService.ping()
  }

  private async checkCache(): Promise<void> {
    await this.cacheService.ping()
  }

  private async checkExternalServices(): Promise<void> {
    // Check critical external services
    const services = [
      'https://api.paytr.com/health',
      'https://api.supabase.com/health'
    ]

    await Promise.all(
      services.map(url => fetch(url, { timeout: 5000 }))
    )
  }
}
```




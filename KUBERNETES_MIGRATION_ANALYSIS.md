# Kubernetes Migration Analysis

## ❌ Mevcut Sorunlar

### 1. **Dosya Yükleme Sorunları**
```typescript
// ❌ Sorunlu: Local file system kullanımı
const filePath = `./uploads/${filename}`
await fs.writeFile(filePath, buffer)

// ✅ Çözüm: Object Storage kullanımı
const fileUrl = await this.storageService.uploadFile(buffer, filename)
```

### 2. **Environment Variables**
```typescript
// ❌ Sorunlu: Hardcoded environment access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

// ✅ Çözüm: Configuration service
const config = this.configService.get('supabase.url')
```

### 3. **Database Connection**
```typescript
// ❌ Sorunlu: Direct Prisma client usage
import { prisma } from './lib/prisma'

// ✅ Çözüm: Dependency injection
constructor(private databaseService: DatabaseService) {}
```

## 🔧 Kubernetes Hazırlık Refactor'ları

### 1. Configuration Management
```typescript
// packages/config/environment/config.service.ts
export class ConfigService {
  private config: Record<string, any> = {}

  constructor() {
    this.loadConfig()
  }

  private loadConfig() {
    this.config = {
      database: {
        url: process.env.DATABASE_URL,
        maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10')
      },
      redis: {
        url: process.env.REDIS_URL,
        ttl: parseInt(process.env.REDIS_TTL || '3600')
      },
      storage: {
        type: process.env.STORAGE_TYPE || 'supabase',
        bucket: process.env.STORAGE_BUCKET
      }
    }
  }

  get(path: string): any {
    return this.getNestedValue(this.config, path)
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }
}
```

### 2. Health Check Endpoints
```typescript
// apps/api-gateway/src/health/health.controller.ts
export class HealthController {
  constructor(
    private databaseService: DatabaseService,
    private cacheService: CacheService,
    private configService: ConfigService
  ) {}

  async getHealth(): Promise<HealthStatus> {
    const checks = await Promise.allSettled([
      this.databaseService.ping(),
      this.cacheService.ping(),
      this.checkExternalServices()
    ])

    return {
      status: checks.every(check => check.status === 'fulfilled') ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: checks[0].status === 'fulfilled',
        cache: checks[1].status === 'fulfilled',
        external: checks[2].status === 'fulfilled'
      }
    }
  }
}
```

### 3. Graceful Shutdown
```typescript
// apps/api-gateway/src/app.ts
export class Application {
  private server: Server

  async start() {
    // Start server
    this.server = app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })

    // Graceful shutdown handlers
    process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => this.gracefulShutdown('SIGINT'))
  }

  private async gracefulShutdown(signal: string) {
    console.log(`Received ${signal}, shutting down gracefully`)
    
    // Stop accepting new connections
    this.server.close(() => {
      console.log('HTTP server closed')
    })

    // Close database connections
    await this.databaseService.disconnect()
    
    // Close cache connections
    await this.cacheService.disconnect()

    process.exit(0)
  }
}
```

## 🐳 Docker Optimizasyonları

### Multi-stage Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

USER nextjs
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Kubernetes Manifests
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tdc-api-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: tdc-api-gateway
  template:
    metadata:
      labels:
        app: tdc-api-gateway
    spec:
      containers:
      - name: api-gateway
        image: tdc/api-gateway:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: redis-config
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```




# Performance & Scalability Setup Guide

## 🎯 Genel Bakış

Bu döküman, TDC Market e-ticaret platformunun performans ve ölçeklenebilirlik katmanını açıklar. Sistem, Upstash Redis ile başlayıp ileride Google Cloud Memorystore'a geçiş için hazırlanmıştır.

## 📊 Mimari Diyagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client                               │
│                    (Browser / Mobile)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                       │
│                   (CDN + Edge Functions)                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js App (Middleware Layer)                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Rate Limiting (per route, IP, user)                │   │
│  │  - Auth: 5 req/5min                                 │   │
│  │  - Search: 30 req/min                               │   │
│  │  - Payment: 10 req/hour                             │   │
│  │  - Upload: 20 req/hour                              │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Routes Layer                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Cache Layer (SWR Pattern)                          │   │
│  │  - Fresh TTL: 2 min (configurable)                  │   │
│  │  - Stale TTL: 6 min (serve stale + revalidate)     │   │
│  │  - Hot-key limiter: 300 req/sec per key            │   │
│  │  - Distributed lock (cache stampede prevention)    │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Monitoring & Metrics                               │   │
│  │  - RED metrics (Requests, Errors, Duration)        │   │
│  │  - Structured logging                               │   │
│  │  - Health checks                                    │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌──────────────────┐              ┌──────────────────────┐
│  Upstash Redis   │              │   Cloud SQL          │
│  (REST API)      │              │   (PostgreSQL)       │
│                  │              │                      │
│  - Cache         │              │  - Products          │
│  - Rate Limits   │              │  - Users             │
│  - Sessions      │              │  - Orders            │
└──────────────────┘              │  - Transactions      │
                                  └──────────────────────┘
```

## 🚀 Özellikler

### 1. Redis Cache Layer (lib/redis.ts)

**Arayüz Tabanlı Tasarım:**
- `KV` interface ile sağlayıcı bağımsızlığı
- Upstash REST client ile başlangıç
- İleride ioredis (Memorystore) geçişi için hazır
- No-op fallback (Redis yoksa graceful degradation)
- Health check ve error handling

**Desteklenen Operasyonlar:**
```typescript
kv.get<T>(key)                    // Get value
kv.set(key, value, { ex: 60 })    // Set with TTL
kv.del(key | keys[])              // Delete
kv.incr(key)                      // Increment (rate limiting)
kv.expire(key, seconds)           // Set TTL
kv.exists(key)                    // Check existence
kv.keys(pattern)                  // Pattern search
kv.mget(...keys)                  // Multi-get
kv.zadd/zrange/...                // Sorted sets (trending)
```

### 2. API Cache Layer (lib/api-cache.ts)

**SWR (Stale-While-Revalidate) Pattern:**
```typescript
const data = await cached(
  'products:list:v1:p1',
  120,  // Fresh TTL: 2 minutes
  () => fetchFromDB(),
  {
    staleTtlSec: 360,      // Stale TTL: 6 minutes
    hotLimitPerSec: 300,   // Hot-key protection
    version: 'v1'          // Cache versioning
  }
);
```

**Akış:**
1. **Fresh Hit** (< 2 min): Anında cache'den dön
2. **Stale Hit** (2-6 min): Stale data dön + arka planda yenile
3. **Miss** (> 6 min): Senkron fetch + cache + dön

**Cache Stampede Prevention:**
- Distributed lock (SETNX emülasyonu)
- Tek process fetch yapar, diğerleri bekler
- Lock timeout: 5 saniye

**Hot-Key Protection:**
- Per-key rate limiting (örn: 300 req/sec)
- Aşırı yüklenme durumunda stale data servis et
- Thundering herd önleme

### 3. Rate Limiting (lib/middleware/rate-limit.ts)

**Sliding Window Algorithm:**
```typescript
await rateLimit(req, {
  rpm: 30,           // Requests per minute
  windowSec: 60,     // Window size
  key: '/api/search' // Custom key
});
```

**Route Bazlı Limitler:**
| Route | Limit | Window | Açıklama |
|-------|-------|--------|----------|
| `/api/auth/*` | 5 | 5 min | Login, register, reset |
| `/api/search` | 30 | 1 min | Search queries |
| `/api/payment` | 10 | 1 hour | Payment operations |
| `/api/upload` | 20 | 1 hour | File uploads |
| `/api/admin` | 200 | 1 min | Admin operations |
| `/api/*` (default) | 100 | 1 min | Other APIs |

**Response Headers:**
```
HTTP/1.1 429 Too Many Requests
Retry-After: 45
RateLimit-Limit: 30
RateLimit-Remaining: 0
RateLimit-Reset: 1678901234
```

### 4. Monitoring (lib/monitoring.ts)

**RED Metrics:**
```typescript
const result = await withMetric('db.products.list', async () => {
  return await prisma.product.findMany({ take: 24 });
});
// Logs: { name: 'db.products.list', ok: true, dur: 123.45 }
```

**Health Checks:**
```typescript
// Register
HealthCheck.register('redis', async () => {
  const ok = await redisHealthCheck();
  return { status: ok ? 'ok' : 'error', timestamp: ... };
});

// Run all
const status = await HealthCheck.getStatus();
// { status: 'healthy', checks: { redis: {...}, database: {...} } }
```

**Request Logger:**
```typescript
export async function GET(req: Request) {
  const logger = createRequestLogger(req);
  try {
    const data = await fetchData();
    logger.success({ itemCount: data.length });
    return Response.json(data);
  } catch (error) {
    logger.error(error);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

## 🔧 Kurulum

### 1. Upstash Redis Oluştur

```bash
# https://console.upstash.com/ adresine git
# Yeni Redis database oluştur
# REST API credentials'ı kopyala
```

### 2. Environment Variables

`.env.local` dosyasına ekle:

```bash
# === Redis (Upstash) ===
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

# Cache TTL (seconds)
CACHE_DEFAULT_TTL_SEC=120
CACHE_STALE_TTL_SEC=360
CACHE_SEARCH_TTL_SEC=60
CACHE_TREND_TTL_SEC=20

# Rate Limiting
RATE_DEFAULT_RPM=100
RATE_SEARCH_RPM=30
RATE_AUTH_PER_5MIN=5
RATE_PAYMENT_PER_HOUR=10
RATE_UPLOAD_PER_HOUR=20

# Monitoring (optional)
OTEL_EXPORTER_OTLP_ENDPOINT=https://your-otel-endpoint
OTEL_SERVICE_NAME=tdc-market
```

### 3. Test Bağlantı

```bash
npm run dev

# Başka bir terminalde:
curl http://localhost:3000/api/products?page=1
# İlk istek: DB'den fetch (yavaş)
# İkinci istek: Cache'den (hızlı)
```

## 📈 Invalidation Matrix

Cache invalidation kuralları:

### Product Update/Delete
```typescript
await invalidationMatrix.product.update(productId);
// Invalidates:
// - product:{id}
// - products:list:*
// - search:*
// - trending:*
```

### Category Update/Delete
```typescript
await invalidationMatrix.category.update(categoryId);
// Invalidates:
// - category:{id}
// - categories:list*
// - products:list:*
```

### User Update
```typescript
await invalidationMatrix.user.update(userId);
// Invalidates:
// - user:{id}
// - cart:{userId}
// - wishlist:{userId}
```

### Cart/Wishlist Update
```typescript
await invalidationMatrix.cart.update(userId);
await invalidationMatrix.wishlist.update(userId);
```

### Bulk Invalidation
```typescript
// Dikkatli kullan! Tüm cache'i temizler
await invalidationMatrix.clearAll();
```

## 🧪 Load Testing

### K6 (Recommended)

```bash
# Install
npm install -g k6

# Run test
npm run test:load-k6

# Custom test
k6 run --vus 50 --duration 30s tests/load-test.js
```

**Threshold'lar:**
```javascript
thresholds: {
  http_req_failed: ['rate<0.01'],    // < 1% errors
  http_req_duration: ['p(95)<200'],  // p95 < 200ms
  http_req_duration: ['p(99)<500'],  // p99 < 500ms
}
```

### Artillery

```bash
# Install
npm install -g artillery

# Run test
npm run test:load-artillery

# Report
artillery run --output report.json tests/load-test.yml
artillery report report.json
```

## 📊 Metrics & Monitoring

### Development

Tüm metrikler console'a JSON formatında loglanır:

```json
{
  "type": "metric",
  "name": "db.products.list",
  "ok": true,
  "dur": 123.45,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Production

OTEL endpoint'i configure edildiğinde otomatik export:

```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://your-collector:4318
OTEL_SERVICE_NAME=tdc-market
```

**Desteklenen Platformlar:**
- Google Cloud Monitoring
- Datadog
- New Relic
- Prometheus + Grafana
- AWS CloudWatch

## 🔄 Memorystore Migration Path

### Şu Anki Durum (Phase 1)
```
Next.js → Upstash Redis (REST) → Cloud SQL
```

### Gelecek (Phase 2)
```
Next.js → Cloud Run → Memorystore (Redis) → Cloud SQL
                ↓
         Serverless VPC Connector
```

### Migration Adımları

1. **Cloud Run + VPC Setup**
```bash
# Create VPC connector
gcloud compute networks vpc-access connectors create tdc-connector \
  --region=europe-west1 \
  --range=10.8.0.0/28

# Deploy to Cloud Run
gcloud run deploy tdc-market \
  --source . \
  --vpc-connector tdc-connector \
  --region europe-west1
```

2. **Memorystore Instance**
```bash
gcloud redis instances create tdc-redis \
  --size=1 \
  --region=europe-west1 \
  --redis-version=redis_6_x \
  --network=default
```

3. **Code Update (Single File!)**

`lib/redis.ts` içinde:

```typescript
// Upstash yerine ioredis kullan
import Redis from 'ioredis';

function ioredisKV(): KV {
  const client = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD,
  });
  
  return {
    async get<T>(key: string) {
      const val = await client.get(key);
      return val ? JSON.parse(val) : null;
    },
    async set<T>(key: string, value: T, opts) {
      const str = JSON.stringify(value);
      if (opts?.ex) {
        await client.setex(key, opts.ex, str);
      } else {
        await client.set(key, str);
      }
    },
    // ... diğer methodlar
  };
}

// Tek satır değişiklik:
export const kv: KV = ioredisKV(); // upstashKV() yerine
```

4. **Environment Variables**
```bash
# .env.production
REDIS_HOST=10.0.0.3  # Memorystore private IP
REDIS_PORT=6379
# UPSTASH_* artık kullanılmıyor
```

## 🎯 Performance Targets

### Latency
- **p50**: < 50ms (cache hit)
- **p95**: < 200ms (cache miss + DB)
- **p99**: < 500ms

### Cache Hit Rate
- **Target**: > 80%
- **Monitor**: `cache:hits` / `cache:total`

### Error Rate
- **Target**: < 0.1% (1 in 1000)
- **Alert**: > 1%

### Throughput
- **Current**: ~1000 req/sec (Vercel)
- **Target**: 10,000 req/sec (Cloud Run + Memorystore)

## 🔍 Troubleshooting

### Cache Miss Rate Yüksek

```typescript
// Cache stats kontrol et
import { getCacheStats } from '@/lib/api-cache';

const stats = await getCacheStats('products:*');
console.log(stats); // { totalKeys: 42, keys: [...] }
```

**Çözümler:**
- TTL'leri artır (CACHE_DEFAULT_TTL_SEC)
- Hot-key limiti azalt
- Invalidation matrix'i gözden geçir

### Rate Limit False Positives

```typescript
// Rate limit status kontrol et
import { getRateLimitStatus } from '@/lib/middleware/rate-limit';

const status = await getRateLimitStatus(req, { rpm: 30 });
console.log(status); // { limit: 30, remaining: 15, reset: 1678901234 }
```

**Çözümler:**
- RPM limitlerini artır (ENV)
- Window size'ı büyüt
- IP extraction'ı kontrol et (proxy headers)

### Slow Queries

```bash
# Metrics'leri filtrele
grep '"name":"db\.' logs.json | jq '.dur' | sort -n | tail -10
```

**Çözümler:**
- Database indexleri ekle (prisma/migrations/add_performance_indexes.sql)
- Query'leri optimize et (SELECT only needed fields)
- Cache TTL'leri artır

## 📚 Best Practices

### 1. Cache Key Naming
```typescript
// ✅ Good: Versioned, structured
'products:list:v1:p1:l24:celectronics'

// ❌ Bad: Unversioned, ambiguous
'products_1'
```

### 2. TTL Selection
```typescript
// Static data (categories, settings)
CACHE_TTL.VERY_LONG  // 20 minutes

// Dynamic data (products, prices)
CACHE_TTL.MEDIUM     // 2 minutes

// Real-time data (stock, trending)
CACHE_TTL.SHORT      // 1 minute

// Ultra-dynamic (search suggestions)
CACHE_TTL.TREND      // 20 seconds
```

### 3. Invalidation Strategy
```typescript
// ✅ Targeted invalidation
await invalidate(['products:list:v1:p1', 'products:list:v1:p2']);

// ⚠️ Pattern invalidation (use sparingly)
await invalidatePattern('products:list:*');

// ❌ Avoid in production
await invalidationMatrix.clearAll();
```

### 4. Error Handling
```typescript
// ✅ Graceful degradation
try {
  const cached = await kv.get('key');
  if (cached) return cached;
} catch (error) {
  console.error('Cache error:', error);
  // Fall through to DB
}
return await fetchFromDB();
```

## 🎓 Further Reading

- [Upstash Redis Docs](https://docs.upstash.com/redis)
- [SWR Pattern](https://web.dev/stale-while-revalidate/)
- [Cache Stampede](https://en.wikipedia.org/wiki/Cache_stampede)
- [Rate Limiting Algorithms](https://en.wikipedia.org/wiki/Rate_limiting)
- [OpenTelemetry](https://opentelemetry.io/)
- [Google Cloud Memorystore](https://cloud.google.com/memorystore/docs/redis)

## 📝 Changelog

### v1.0.0 (2024-01-15)
- ✅ Upstash Redis integration
- ✅ SWR cache layer
- ✅ Rate limiting middleware
- ✅ Monitoring & health checks
- ✅ Load testing setup
- ✅ Documentation

### Roadmap
- [ ] Memorystore migration
- [ ] OTEL exporter implementation
- [ ] Advanced cache warming
- [ ] Distributed tracing
- [ ] Auto-scaling based on metrics

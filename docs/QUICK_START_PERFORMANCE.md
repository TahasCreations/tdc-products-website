# 🚀 Quick Start: Performance & Scalability

## 5 Dakikada Başlangıç

### 1. Upstash Redis Oluştur (2 dakika)

1. https://console.upstash.com/ adresine git
2. "Create Database" → İsim gir → Region seç → Create
3. "REST API" sekmesinden URL ve TOKEN'ı kopyala

### 2. Environment Variables (1 dakika)

`.env.local` dosyasını oluştur:

```bash
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here

CACHE_DEFAULT_TTL_SEC=120
CACHE_STALE_TTL_SEC=360
RATE_DEFAULT_RPM=100
RATE_SEARCH_RPM=30
```

### 3. Test (2 dakika)

```bash
# Start dev server
npm run dev

# Test cache (başka terminalde)
curl http://localhost:3000/api/products?page=1
# İlk istek: ~200ms (DB)
# İkinci istek: ~20ms (Cache) ⚡

# Test rate limit
for i in {1..35}; do 
  curl http://localhost:3000/api/search?q=test
done
# 31. istekten sonra: 429 Too Many Requests 🛡️
```

### 4. Monitoring (Console'da)

```bash
# Metrics görüntüle
[metric] {"name":"db.products.list","ok":true,"dur":123.45}

# Cache hits
[redis] GET products:list:v1:p1 → HIT ✅

# Rate limits
[rate-limit] High usage: /api/search | Remaining: 5/30 ⚠️
```

## ✅ Başarılı!

Sistem artık:
- ⚡ **Cache** ile 10x daha hızlı
- 🛡️ **Rate limiting** ile korumalı
- 📊 **Monitoring** ile gözlemlenebilir

## 📚 Daha Fazla

- **Detaylı Rehber**: `docs/PERFORMANCE_SETUP.md`
- **Mimari**: ASCII diyagramlar ve açıklamalar
- **Troubleshooting**: Yaygın sorunlar ve çözümler
- **Migration**: Memorystore'a geçiş adımları

## 🎯 Sonraki Adımlar

1. **Daha fazla endpoint'e cache ekle**
   ```typescript
   // app/api/categories/route.ts
   import { cached } from '@/lib/api-cache';
   
   const data = await cached('categories:list:v1', 300, () => 
     prisma.category.findMany()
   );
   ```

2. **Custom rate limits**
   ```typescript
   // middleware.ts
   if (path.startsWith('/api/my-endpoint')) {
     await rateLimit(req, { rpm: 50, windowSec: 60 });
   }
   ```

3. **Cache invalidation**
   ```typescript
   // Ürün güncellendiğinde
   await invalidationMatrix.product.update(productId);
   ```

## 💡 Tips

- **Development**: Redis olmadan da çalışır (no-op fallback)
- **Production**: Upstash Free tier 10K komut/gün (yeterli başlangıç için)
- **Scaling**: Daha fazla trafik için Upstash Pro veya Memorystore

## 🆘 Sorun mu var?

```bash
# Redis bağlantısını test et
curl http://localhost:3000/api/products?page=1

# Console'da görmeli:
# [redis] Upstash credentials missing → .env.local'ı kontrol et
# [redis] GET error → Credentials yanlış
# [metric] {"ok":true} → Her şey çalışıyor! ✅
```

---

**Hızlı başlangıç tamamlandı! 🎉**

Detaylı bilgi için: `docs/PERFORMANCE_SETUP.md`

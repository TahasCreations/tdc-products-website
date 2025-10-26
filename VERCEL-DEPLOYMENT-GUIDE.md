# Vercel Deployment Rehberi

## 🚀 Hızlı Başlangıç

### 1. Vercel Hesabı ve Proje Kurulumu

1. [Vercel](https://vercel.com) hesabı oluşturun
2. GitHub repository'nizi Vercel'e bağlayın
3. Proje ayarlarını yapılandırın

### 2. Gerekli Environment Variables

Vercel Dashboard > Settings > Environment Variables bölümünden aşağıdaki değişkenleri ekleyin:

#### **Zorunlu Değişkenler**

```bash
# Database
DATABASE_URL="your_database_url"

# NextAuth
NEXTAUTH_SECRET="your_nextauth_secret_key"
NEXTAUTH_URL="https://your-domain.vercel.app"

# App URL
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

#### **Opsiyonel Değişkenler**

```bash
# Email (SendGrid)
SENDGRID_API_KEY="your_sendgrid_api_key"
EMAIL_FROM="noreply@yourdomain.com"

# Google Cloud (Eğer kullanıyorsanız)
GOOGLE_CLOUD_PROJECT_ID="your_project_id"
GCS_BUCKET_NAME="your_bucket_name"
GOOGLE_APPLICATION_CREDENTIALS_JSON="your_service_account_json"

# Redis (Upstash - Caching için)
UPSTASH_REDIS_REST_URL="your_redis_url"
UPSTASH_REDIS_REST_TOKEN="your_redis_token"

# Stripe (Ödeme sistemi)
STRIPE_SECRET_KEY="your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
```

### 3. Build Ayarları

Vercel Dashboard'da aşağıdaki ayarları yapın:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (otomatik)
- **Install Command**: `npm install`
- **Node.js Version**: 22.x

### 4. Deployment

#### Otomatik Deployment
- `main` branch'e push yaptığınızda otomatik olarak deploy edilir
- Pull request'ler için preview deployment oluşturulur

#### Manuel Deployment
```bash
# Vercel CLI ile deploy
npm i -g vercel
vercel login
vercel --prod
```

## 🔧 Önemli Notlar

### Client-Side Context Kullanan Sayfalar

Aşağıdaki sayfalar client-side context kullandığı için **dinamik olarak render edilir** (prerendering yapılmaz):

- `/cart` - CartProvider
- `/wishlist` - WishlistProvider
- `/search` - CartProvider & WishlistProvider
- `/checkout` - CartProvider
- `/profile` - SessionProvider
- `/blog` - Dinamik içerik
- `/blog/new` - Form sayfası

Bu sayfalar için build sırasında prerendering hataları **normaldir** ve beklenen davranıştır.

### Database Migration

Vercel'de database migration otomatik olarak çalışmaz. İlk deployment öncesi:

```bash
# Local'de migration'ları çalıştırın
npx prisma migrate deploy

# Veya production database'e bağlanarak
DATABASE_URL="your_production_db" npx prisma migrate deploy
```

### Image Optimization

Next.js Image Optimization Vercel'de otomatik olarak çalışır. Ancak external image'lar için `next.config.js`'de `remotePatterns` tanımlı olmalıdır.

## 🐛 Yaygın Sorunlar ve Çözümleri

### 1. "useCart must be used within a CartProvider" Hatası

**Sorun**: Sayfalar prerendering sırasında client context'e erişmeye çalışıyor.

**Çözüm**: Sayfanın başına `export const dynamic = 'force-dynamic';` eklenmiştir.

### 2. "Module not found" Hataları

**Sorun**: Path alias'ları doğru çözümlenmiyor.

**Çözüm**: `next.config.js`'de webpack alias'ları tanımlanmıştır.

### 3. Build Timeout

**Sorun**: Build 10 dakikadan uzun sürüyor.

**Çözüm**: 
- `typescript.ignoreBuildErrors: true` kullanılıyor
- `eslint.ignoreDuringBuilds: true` kullanılıyor
- Gereksiz dependencies kaldırılmalı

### 4. Environment Variables Eksik

**Sorun**: Runtime'da environment variable'lar undefined.

**Çözüm**: Vercel Dashboard'dan tüm environment variable'ları ekleyin ve redeploy yapın.

## 📊 Performance Monitoring

### Vercel Analytics

Vercel Analytics otomatik olarak etkindir:

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Speed Insights

```tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

## 🔐 Güvenlik

### Headers

`next.config.js`'de güvenlik header'ları tanımlanmıştır:

- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### Rate Limiting

API route'ları için rate limiting implementasyonu:

```typescript
// middleware.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});
```

## 📝 Deployment Checklist

- [ ] Tüm environment variables Vercel'de tanımlandı
- [ ] Database migration'ları production'da çalıştırıldı
- [ ] NEXTAUTH_URL production domain'e ayarlandı
- [ ] Email servisi (SendGrid) yapılandırıldı
- [ ] Stripe webhook URL'leri güncellendi
- [ ] Custom domain DNS ayarları yapıldı (varsa)
- [ ] SSL sertifikası aktif
- [ ] Analytics ve monitoring aktif
- [ ] Error tracking (Sentry vb.) kuruldu (opsiyonel)

## 🎯 İlk Deployment Sonrası

1. **Test Edin**:
   - Tüm sayfaların açıldığını kontrol edin
   - Ürün ekleme/silme işlemlerini test edin
   - Ödeme akışını test edin (test mode'da)
   - Email gönderimini test edin

2. **Monitoring Kurun**:
   - Vercel Analytics'i kontrol edin
   - Error rate'leri izleyin
   - Performance metrics'leri takip edin

3. **SEO Ayarları**:
   - `robots.txt` kontrol edin
   - `sitemap.xml` oluşturun
   - Meta tags'leri kontrol edin

## 🚨 Acil Durum

Eğer deployment başarısız olursa:

1. Vercel Dashboard > Deployments > Failed Deployment > Logs
2. Hata mesajını kontrol edin
3. Environment variables'ları kontrol edin
4. `vercel.json` ve `next.config.js` ayarlarını gözden geçirin
5. Gerekirse previous deployment'a rollback yapın

## 📞 Destek

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs

---

**Son Güncelleme**: 2025-10-26
**Next.js Version**: 14.2.33
**Node.js Version**: 22.x

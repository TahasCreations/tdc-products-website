# TDC Market - Vercel Deployment Rehberi

## 🚀 Vercel'e Dağıtım Adımları

### 1. Vercel Projesi Oluşturma

```bash
# Vercel CLI ile
npm i -g vercel
vercel login
vercel

# Veya Vercel Dashboard'dan
# https://vercel.com/dashboard
```

### 2. Environment Variables

Vercel Dashboard → Project → Settings → Environment Variables:

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/tdc_market?schema=public"

# NextAuth.js
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Database Kurulumu

#### Seçenek 1: Neon (Önerilen)
```bash
# Neon'da database oluştur
# https://neon.tech

# DATABASE_URL'i Vercel'e ekle
# postgresql://user:pass@ep-xxx.us-east-1.aws.neon.tech/tdc_market?sslmode=require
```

#### Seçenek 2: Railway
```bash
# Railway'de PostgreSQL oluştur
# https://railway.app

# DATABASE_URL'i Vercel'e ekle
# postgresql://postgres:pass@containers-us-west-xxx.railway.app:5432/railway
```

### 4. Migration ve Seed

```bash
# Vercel Build Command'a ekle (package.json)
"build": "prisma generate && prisma migrate deploy && next build"

# Veya Vercel Dashboard'da Build Command:
# npx prisma generate && npx prisma migrate deploy && next build
```

### 5. Runtime Konfigürasyonu

Tüm API route'ları Node.js runtime kullanmalı:

```typescript
// app/api/auth/[...nextauth]/route.ts
export const runtime = "nodejs";

// app/api/webhooks/payment/route.ts
export const runtime = "nodejs";
```

### 6. Google OAuth Kurulumu

1. Google Cloud Console → APIs & Services → Credentials
2. OAuth 2.0 Client ID oluştur
3. Authorized redirect URIs:
   - `https://your-domain.vercel.app/api/auth/callback/google`
4. Client ID ve Secret'i Vercel'e ekle

### 7. Build Settings

```json
{
  "buildCommand": "npx prisma generate && npx prisma migrate deploy && next build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

## 🔒 Güvenlik Kontrolleri

### 1. Satıcı Yetki Kontrolü

Tüm seller route'larında `requireSellerOwnership()` kullan:

```typescript
// Sadece kendi verilerine erişebilir
const user = await requireSellerOwnership(sellerId);
```

### 2. Database Güvenliği

```sql
-- RLS (Row Level Security) aktif et
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;

-- Satıcı sadece kendi ürünlerini görebilir
CREATE POLICY "seller_products" ON "Product"
  FOR ALL USING (seller_id = auth.uid());

-- Satıcı sadece kendi siparişlerini görebilir
CREATE POLICY "seller_orders" ON "OrderItem"
  FOR ALL USING (seller_id = auth.uid());
```

### 3. Webhook Güvenliği

```typescript
// Webhook imza doğrulaması
import crypto from 'crypto';

function verifyWebhookSignature(payload: string, signature: string, secret: string) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## 📊 Monitoring ve Logging

### 1. Sentry Kurulumu

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### 2. Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
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

## 🔄 Backup Stratejisi

### 1. Database Backup

```bash
# Günlük otomatik backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Vercel Cron Job ile
# vercel.json
{
  "crons": [
    {
      "path": "/api/backup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### 2. Media Backup

```typescript
// S3/Cloudinary entegrasyonu
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});
```

## 🚨 Hızlı Kontrol Listesi

- [ ] PostgreSQL database hazır
- [ ] DATABASE_URL Vercel'e eklendi
- [ ] Google OAuth credentials eklendi
- [ ] NEXTAUTH_SECRET güvenli key
- [ ] Prisma migration çalıştırıldı
- [ ] Seed data eklendi
- [ ] Runtime "nodejs" ayarlandı
- [ ] Webhook güvenliği aktif
- [ ] RLS politikaları eklendi
- [ ] Monitoring kuruldu
- [ ] Backup stratejisi hazır

## 🎯 Production Checklist

- [ ] SSL sertifikası aktif
- [ ] CDN yapılandırması
- [ ] Error tracking aktif
- [ ] Performance monitoring
- [ ] Security headers
- [ ] Rate limiting
- [ ] CORS ayarları
- [ ] Database connection pooling
- [ ] Cache stratejisi
- [ ] Log rotation

## 📞 Destek

Herhangi bir sorun için:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs

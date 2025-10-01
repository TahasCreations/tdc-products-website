# 🚀 TDC Market - Geliştirici Kılavuzu

## 📋 İçindekiler

1. [Proje Genel Bakış](#proje-genel-bakış)
2. [Teknoloji Stack](#teknoloji-stack)
3. [Kurulum](#kurulum)
4. [Proje Yapısı](#proje-yapısı)
5. [Geliştirme Rehberi](#geliştirme-rehberi)
6. [API Dokümantasyonu](#api-dokümantasyonu)
7. [Veritabanı Şeması](#veritabanı-şeması)
8. [Test Rehberi](#test-rehberi)
9. [Deployment](#deployment)
10. [Katkıda Bulunma](#katkıda-bulunma)

## 🎯 Proje Genel Bakış

TDC Market, modern web teknolojileri ile geliştirilmiş kapsamlı bir e-ticaret ve içerik yönetim platformudur. Platform, hem B2C e-ticaret hem de UGC (User Generated Content) blog modülü içeren hibrit bir yapıya sahiptir.

### Ana Özellikler

- 🛒 **E-ticaret Platformu** - Çok kategorili ürün yönetimi
- 📝 **UGC Blog Sistemi** - Kullanıcı tarafından oluşturulan içerik
- 🔧 **Kapsamlı Admin Paneli** - 6 modül, 50+ alt özellik
- 🤖 **AI Destekli Özellikler** - OpenAI entegrasyonu
- 📱 **PWA Desteği** - Mobil uygulama deneyimi
- 🌙 **Dark Mode** - Tema yönetimi
- 🔔 **Push Notifications** - Anlık bildirimler
- 📊 **Analytics** - Detaylı analitik ve raporlama

## 🛠 Teknoloji Stack

### Frontend
- **Next.js 14** - React framework (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Lottie React** - Animation player

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching layer

### External Services
- **Stripe** - Payment processing
- **SendGrid** - Email service
- **OpenAI** - AI services
- **Google Analytics** - Analytics
- **Vercel** - Hosting platform

### Development Tools
- **Playwright** - E2E testing
- **Jest** - Unit testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## 🚀 Kurulum

### Gereksinimler

- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- npm veya yarn

### Adım 1: Repository'yi Klonlayın

```bash
git clone https://github.com/your-username/tdc-market.git
cd tdc-market
```

### Adım 2: Bağımlılıkları Yükleyin

```bash
npm install
```

### Adım 3: Environment Variables

```bash
cp env.production.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tdc_market"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# SendGrid
SENDGRID_API_KEY="SG..."
SENDGRID_FROM_EMAIL="noreply@tdcmarket.com"

# OpenAI
OPENAI_API_KEY="sk-..."

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-..."
```

### Adım 4: Veritabanını Kurun

```bash
# Prisma migration'ları çalıştırın
npx prisma migrate dev

# Seed data'yı yükleyin
npx prisma db seed
```

### Adım 5: Development Server'ı Başlatın

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## 📁 Proje Yapısı

```
tdc-market/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin panel pages
│   │   ├── blog/              # Blog pages
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── admin/             # Admin components
│   │   ├── blog/              # Blog components
│   │   ├── home/              # Homepage components
│   │   └── ui/                # UI components
│   ├── contexts/              # React contexts
│   ├── lib/                   # Utility libraries
│   └── types/                 # TypeScript types
├── prisma/                    # Database schema
├── public/                    # Static assets
├── tests/                     # Test files
│   ├── e2e/                   # E2E tests
│   └── unit/                  # Unit tests
├── docs/                      # Documentation
└── scripts/                   # Build scripts
```

## 🔧 Geliştirme Rehberi

### Code Style

- **ESLint** ve **Prettier** kullanın
- **TypeScript** strict mode aktif
- **Conventional Commits** kullanın
- **Component-based** architecture

### Component Geliştirme

```typescript
// Component template
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ComponentProps {
  title: string;
  onAction?: () => void;
}

export default function Component({ title, onAction }: ComponentProps) {
  const [state, setState] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4"
    >
      <h2>{title}</h2>
      {/* Component content */}
    </motion.div>
  );
}
```

### API Route Geliştirme

```typescript
// API route template
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // API logic
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

### Database İşlemleri

```typescript
// Prisma kullanımı
import { prisma } from '@/lib/prisma';

export async function createUser(data: CreateUserData) {
  return await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      role: 'CUSTOMER',
    },
  });
}
```

## 📡 API Dokümantasyonu

### Authentication Endpoints

#### POST /api/auth/login
Kullanıcı girişi

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "role": "CUSTOMER"
  },
  "token": "jwt_token"
}
```

### Blog Endpoints

#### GET /api/blog
Blog yazılarını listele

**Query Parameters:**
- `topic` - Konu filtresi
- `sort` - Sıralama (trend, newest, popular)
- `page` - Sayfa numarası
- `limit` - Sayfa başına yazı sayısı

#### POST /api/blog
Yeni blog yazısı oluştur

**Request:**
```json
{
  "title": "Blog Post Title",
  "content": "Blog post content",
  "topicId": "topic_id",
  "tags": ["tag1", "tag2"]
}
```

### E-commerce Endpoints

#### GET /api/products
Ürünleri listele

#### POST /api/products
Yeni ürün oluştur

#### GET /api/orders
Siparişleri listele

#### POST /api/orders
Yeni sipariş oluştur

## 🗄 Veritabanı Şeması

### Ana Tablolar

#### Users
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'CUSTOMER',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Blog Posts
```sql
CREATE TABLE blog_posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content_json TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Products
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id TEXT NOT NULL,
  seller_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Test Rehberi

### E2E Testleri

```bash
# Playwright testlerini çalıştır
npm run test:e2e

# Belirli bir test dosyasını çalıştır
npx playwright test tests/e2e/homepage.spec.ts

# Test raporunu görüntüle
npx playwright show-report
```

### Unit Testleri

```bash
# Jest testlerini çalıştır
npm run test

# Coverage raporu
npm run test:coverage
```

### Test Yazma

```typescript
// E2E test örneği
import { test, expect } from '@playwright/test';

test('should load homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('TDC Market');
});
```

## 🚀 Deployment

### Vercel Deployment

1. **Vercel CLI ile:**
```bash
npm install -g vercel
vercel --prod
```

2. **GitHub Integration:**
- Repository'yi Vercel'e bağla
- Environment variables'ları ayarla
- Otomatik deployment aktif

### Environment Variables

Production için gerekli environment variables:

```env
DATABASE_URL="postgresql://..."
STRIPE_SECRET_KEY="sk_live_..."
SENDGRID_API_KEY="SG..."
OPENAI_API_KEY="sk-..."
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-..."
```

### Database Migration

```bash
# Production migration
npx prisma migrate deploy

# Seed production data
npx prisma db seed
```

## 🤝 Katkıda Bulunma

### Git Workflow

1. **Feature branch oluştur:**
```bash
git checkout -b feature/new-feature
```

2. **Değişiklikleri commit et:**
```bash
git add .
git commit -m "feat: add new feature"
```

3. **Push et:**
```bash
git push origin feature/new-feature
```

4. **Pull Request oluştur**

### Code Review Checklist

- [ ] TypeScript types doğru
- [ ] ESLint hataları yok
- [ ] Testler yazıldı
- [ ] Dokümantasyon güncellendi
- [ ] Performance etkisi değerlendirildi

### Issue Template

```markdown
## Bug Report / Feature Request

### Description
[Kısa açıklama]

### Steps to Reproduce
1. [Adım 1]
2. [Adım 2]
3. [Adım 3]

### Expected Behavior
[Beklenen davranış]

### Actual Behavior
[Gerçek davranış]

### Environment
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.0.0]
```

## 📞 Destek

- **GitHub Issues** - Bug reports ve feature requests
- **Discord** - Geliştirici topluluğu
- **Email** - admin@tdcmarket.com

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

**TDC Market Development Team** 🚀

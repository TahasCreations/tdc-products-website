# TDC Market - Premium E-ticaret Platformu

## 🚀 Proje Özeti

TDC Market, premium koleksiyon ve tasarım ürünleri için geliştirilmiş modern bir e-ticaret platformudur. Next.js 14 App Router, React, TypeScript, Tailwind CSS, shadcn/ui ve framer-motion teknolojileri kullanılarak geliştirilmiştir.

## 🎨 Tasarım Sistemi

### Brand Colors
- **Background**: `#0B0B0B` (Koyu zemin)
- **Foreground**: `#F6F6F6` (Açık metin)
- **Accent**: `#CBA135` (Altın vurgu)
- **Accent Light**: `#F4D03F`
- **Accent Dark**: `#B8941F`

### Tasarım İlkeleri
- Modern, premium ve ferah tasarım
- Micro-interactions (200-300ms framer-motion animasyonlar)
- 12 kolon grid sistemi
- Bol whitespace kullanımı
- Responsive tasarım (mobile-first)

## 🏗️ Teknik Mimari

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Animations**: framer-motion
- **Forms**: react-hook-form + zod
- **Icons**: lucide-react
- **Themes**: next-themes

### Backend & Database
- **ORM**: Prisma
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: NextAuth.js
- **File Storage**: Google Cloud Storage

### Cloud Services
- **AI/ML**: Google Cloud Vertex AI (moderation, embeddings, recommendations)
- **Analytics**: Google Cloud BigQuery
- **Security**: Google Cloud reCAPTCHA Enterprise, Web Risk API
- **Notifications**: Firebase Cloud Messaging (FCM)
- **Image Processing**: Sharp + Google Cloud Vision API

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── (public)/              # Public sayfalar (Header ile)
│   │   ├── layout.tsx         # Public layout
│   │   ├── page.tsx           # Ana sayfa
│   │   ├── hakkimizda/        # Hakkımızda sayfası
│   │   ├── k/                 # Kategori sayfaları
│   │   ├── urun/              # Ürün sayfaları
│   │   └── api/               # API routes
│   └── (admin)/               # Admin sayfalar (Header olmadan)
│       └── admin/
│           ├── layout.tsx     # Admin layout
│           ├── page.tsx       # Admin dashboard
│           └── components/    # Admin bileşenleri
├── components/
│   ├── layout/                # Layout bileşenleri
│   │   └── Header.tsx         # Ana header
│   ├── categories/            # Kategori bileşenleri
│   ├── products/              # Ürün bileşenleri
│   ├── media/                 # Medya bileşenleri
│   ├── seo/                   # SEO bileşenleri
│   ├── accessibility/         # Erişilebilirlik
│   └── performance/           # Performans
├── lib/
│   ├── gcp.ts                 # Google Cloud servisleri
│   ├── media/                 # Medya yönetimi
│   ├── seo/                   # SEO araçları
│   └── performance/           # Performans izleme
└── contexts/                  # React Context'ler
```

## 🎯 Ana Özellikler

### 1. Global Header & Navigation
- Sticky header (top-0 z-50)
- Responsive hamburger menü
- Mega menü (kategoriler için)
- Arama, favoriler, sepet, kullanıcı menüsü
- Dark/Light tema desteği

### 2. Kategori Sayfaları (6 Adet)
- **Figür & Koleksiyon**: 3D/loop video, neon vurgu
- **Moda & Aksesuar**: Koleksiyon slider, renk varyantları
- **Elektronik**: Tech vurgu, özellik kartları, karşılaştırma
- **Ev & Yaşam**: Oda kısayolları, kombin rehberi
- **Sanat & Hobi**: Moodboard grid, kit önerileri
- **Hediyelik**: Hediye bulucu wizard, özel gün temaları

### 3. Hakkımızda Sayfası
- Hero + güven rozetleri
- Misyon-Vizyon-Değerler
- İstatistikler (animasyonlu sayaç)
- Timeline
- Ekip kartları
- Süreç şeffaflığı
- Sosyal kanıt
- Politika & güvence
- SSS (Accordion)
- İletişim CTA + harita

### 4. Admin - ETA (Estimated Time of Arrival) Sistemi
- Üretim türü (stoklu/elyapımı)
- Tahmin modu (sabit/aralık/kural)
- İş günü kuralları
- Kesim saati
- Bölge override'ları
- Tatil takvimi
- Kapasite ve backlog yönetimi
- Varyant bazlı ETA
- SLA matrisi
- Çok depo yönetimi
- JSON-LD entegrasyonu

### 5. Medya/Görsel Altyapısı
- **Medya Kütüphanesi (DAM)**: Upload, etiket, koleksiyon
- **AutoImage Orchestrator**: Boş görselleri otomatik doldurma
- **Hero Manager**: A/B test, sezon planlama
- **Lottie Animasyonlar**: Mikro-animasyonlar
- **Before/After**: Kişiselleştirme gösterimi
- **3D/AR Önizleme**: model-viewer entegrasyonu
- **UGC Galerisi**: Müşteri içerikleri + moderasyon
- **Dinamik Rozetler**: SVG köşe rozetleri
- **OG Image API**: Dinamik sosyal medya görselleri
- **Renk Paleti**: Otomatik palet çıkarma

### 6. SEO & Performans
- **Structured Data**: Schema.org JSON-LD
- **Meta Tags**: Open Graph, Twitter Cards
- **Core Web Vitals**: LCP, FID, CLS izleme
- **Lazy Loading**: Intersection Observer
- **Code Splitting**: Dinamik import
- **Image Optimization**: AVIF/WebP, blur placeholder
- **Performance Budget**: Otomatik uyarı sistemi

### 7. Erişilebilirlik (A11y)
- **Screen Reader**: ARIA labels, announcements
- **Keyboard Navigation**: Tab order, focus management
- **Focus Trap**: Modal/dialog odak yönetimi
- **Reduced Motion**: prefers-reduced-motion desteği
- **High Contrast**: prefers-contrast desteği
- **Font Size**: Kullanıcı tercihi (küçük/orta/büyük)
- **Skip Links**: Hızlı navigasyon

## 🔧 Kurulum

### Gereksinimler
- Node.js 18+
- npm/yarn
- Google Cloud hesabı (opsiyonel)

### Adımlar
1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd tdc-products-website
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment variables ayarlayın**
```bash
cp .env.example .env.local
```

4. **Database'i hazırlayın**
```bash
npx prisma generate
npx prisma db push
```

5. **Geliştirme sunucusunu başlatın**
```bash
npm run dev
```

## 🌍 Environment Variables

```env
# Database
DATABASE_URL="file:./dev.db"

# Google Cloud (Opsiyonel)
GOOGLE_CLOUD_PROJECT_ID="your-project-id"
GOOGLE_CLOUD_CREDENTIALS="path/to/credentials.json"

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="your-site-key"
RECAPTCHA_SECRET_KEY="your-secret-key"

# FCM
FCM_SERVER_KEY="your-fcm-server-key"

# Analytics
GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"

# Image Generation (Opsiyonel)
IMAGE_PROVIDER="replicate"
REPLICATE_API_TOKEN="your-replicate-token"
```

## 📊 Performans Metrikleri

### Core Web Vitals Hedefleri
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **FCP**: < 1.5s
- **TTFB**: < 600ms

### Performans Budget
- Sayfa yükleme: < 3s
- Bellek kullanımı: < 50MB
- Bundle boyutu: < 250KB (gzipped)

## 🧪 Test Stratejisi

### Test Türleri
1. **Unit Tests**: Jest + React Testing Library
2. **Integration Tests**: API endpoints
3. **E2E Tests**: Playwright
4. **Performance Tests**: Lighthouse CI
5. **Accessibility Tests**: axe-core

### Test Komutları
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Performance tests
npm run test:performance

# Accessibility tests
npm run test:a11y
```

## 🚀 Deployment

### Vercel (Önerilen)
1. GitHub'a push edin
2. Vercel'e bağlayın
3. Environment variables ayarlayın
4. Deploy edin

### Docker
```bash
# Build image
docker build -t tdc-market .

# Run container
docker run -p 3000:3000 tdc-market
```

## 📈 Monitoring & Analytics

### Performance Monitoring
- Core Web Vitals izleme
- Real User Monitoring (RUM)
- Performance budget alerts
- Memory usage tracking

### Analytics
- Google Analytics 4
- Custom event tracking
- User behavior analysis
- Conversion funnel

### Error Tracking
- Sentry entegrasyonu
- Error boundary'ler
- API error logging
- Performance error alerts

## 🔒 Güvenlik

### Güvenlik Önlemleri
- reCAPTCHA Enterprise
- Web Risk API
- Input validation (zod)
- XSS protection
- CSRF protection
- Rate limiting
- Secure headers

### Data Protection
- GDPR compliance
- KVKK uyumluluğu
- Data encryption
- Secure file upload
- Privacy policy
- Cookie consent

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Website**: https://tdcmarket.com
- **Email**: info@tdcmarket.com
- **GitHub**: https://github.com/tdc-market

---

**TDC Market** - Premium koleksiyon ve tasarım ürünleri mağazası 🎨✨

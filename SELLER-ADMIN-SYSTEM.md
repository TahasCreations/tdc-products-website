# 🏪 TDC Market - Multi-Tenant Satıcı Admin Paneli Sistemi

## 📋 Genel Bakış

TDC Market, satıcıların kendi mağazalarını oluşturabilecekleri, yönetebilecekleri ve kendi domainlerini bağlayabilecekleri profesyonel bir multi-tenant e-ticaret platformudur.

## ✨ Temel Özellikler

### 🎨 Satıcı Admin Paneli
- **Modern Dashboard**: KPI'lar, grafikler ve gerçek zamanlı istatistikler
- **Ürün Yönetimi**: Tam CRUD işlemleri, stok takibi, kategori yönetimi
- **Sipariş Yönetimi**: Sipariş takibi, durum güncelleme, müşteri bilgileri
- **Müşteri Yönetimi**: Müşteri listesi, sipariş geçmişi, iletişim
- **Analitik**: Satış raporları, ürün performansı, müşteri analizi

### 🎨 Mağaza Özelleştirme
- **Theme Customizer**: Renk paleti, logo, header düzeni
- **Site Builder**: Drag & drop sayfa tasarımı (hazır şablonlar)
- **Responsive Design**: Tüm cihazlarda mükemmel görünüm
- **SEO Optimizasyonu**: Meta etiketler, sitemap, schema markup

### 🌐 Domain Yönetimi
- **Custom Domain**: Kendi domain adresinizi bağlayın
- **DNS Yönetimi**: Otomatik DNS yapılandırma talimatları
- **SSL Sertifikası**: Otomatik HTTPS desteği
- **Multi-Domain**: Birden fazla domain desteği (plan bazlı)

### 💳 Abonelik Sistemi
- **4 Farklı Plan**: FREE, STARTER, GROWTH, PRO
- **Esnek Faturalama**: Aylık veya yıllık (%20 indirimli)
- **Komisyon Oranları**: Plan bazlı değişken komisyon
- **Domain Hakları**: Premium planlarda ücretsiz domain

### 🔒 Güvenlik
- **Multi-tenant Architecture**: Tam veri izolasyonu
- **Role-based Access Control**: BUYER, SELLER, ADMIN rolleri
- **NextAuth Integration**: Güvenli kimlik doğrulama
- **Middleware Protection**: Rota bazlı erişim kontrolü

## 📁 Proje Yapısı

```
tdc-products-website/
├── app/
│   ├── (seller-admin)/          # Satıcı admin paneli
│   │   ├── layout.tsx            # Admin layout wrapper
│   │   └── seller/
│   │       ├── page.tsx          # Dashboard
│   │       ├── products/         # Ürün yönetimi
│   │       ├── orders/           # Sipariş yönetimi
│   │       ├── customers/        # Müşteri yönetimi
│   │       ├── analytics/        # Analitik
│   │       ├── marketing/        # Pazarlama
│   │       ├── store/            # Mağaza tasarımı
│   │       │   ├── builder/      # Site builder
│   │       │   ├── theme/        # Tema ayarları
│   │       │   └── pages/        # Sayfa yönetimi
│   │       ├── domain/           # Domain yönetimi
│   │       ├── billing/          # Abonelik & fatura
│   │       └── settings/         # Ayarlar
│   │
│   └── api/
│       └── seller/               # Satıcı API endpoints
│           ├── domains/          # Domain işlemleri
│           ├── theme/            # Tema işlemleri
│           ├── subscription/     # Abonelik işlemleri
│           └── pages/            # Sayfa işlemleri
│
├── components/
│   └── seller-admin/             # Satıcı admin bileşenleri
│       ├── SellerAdminLayout.tsx
│       ├── SellerDashboard.tsx
│       ├── SellerProductsList.tsx
│       ├── SellerOrdersList.tsx
│       ├── SellerDomainManagement.tsx
│       ├── SellerThemeCustomizer.tsx
│       ├── SellerBillingManagement.tsx
│       └── SellerStoreBuilder.tsx
│
├── middleware.ts                 # Multi-tenant routing
└── prisma/
    └── schema.prisma             # Database schema
```

## 🗄️ Database Schema

### SellerProfile
```prisma
model SellerProfile {
  id             String
  userId         String
  storeName      String
  storeSlug      String
  description    String?
  logoUrl        String?
  status         String
  rating         Float
  totalSales     Int
  
  products       Product[]
  subscriptions  Subscription[]
  domains        StoreDomain[]
  theme          StoreTheme?
}
```

### Subscription
```prisma
model Subscription {
  id           String
  sellerId     String
  plan         Plan          // FREE, STARTER, GROWTH, PRO
  status       String
  billingCycle BillingCycle  // MONTHLY, YEARLY
  price        Float?
  periodStart  DateTime
  periodEnd    DateTime
}
```

### StoreDomain
```prisma
model StoreDomain {
  id        String
  sellerId  String
  hostname  String
  status    DomainStatus  // PENDING, VERIFYING, ACTIVE, REJECTED
  dnsTarget String?
  verifiedAt DateTime?
}
```

### StoreTheme
```prisma
model StoreTheme {
  id            String
  sellerId      String
  logoUrl       String?
  primaryColor  String?
  heroImageUrls String
  headerLayout  String?
}
```

## 🚀 Kurulum

### 1. Bağımlılıkları Yükle
```bash
npm install
```

### 2. Environment Variables
`.env.local` dosyası oluşturun:
```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Migration
```bash
npx prisma generate
npx prisma db push
```

### 4. Geliştirme Sunucusu
```bash
npm run dev
```

## 📊 Abonelik Planları

### 🆓 FREE Plan
- 5 ürüne kadar
- Temel mağaza tasarımı
- TDC subdomain
- %10 komisyon
- Temel analitik

### ⭐ STARTER Plan - ₺299/ay
- 50 ürüne kadar
- Gelişmiş tema özelleştirme
- 1 custom domain
- %7 komisyon
- Gelişmiş analitik
- SEO araçları

### 📈 GROWTH Plan - ₺599/ay (En Popüler)
- 200 ürüne kadar
- Tüm tema özellikleri
- 3 custom domain
- %5 komisyon
- Premium analitik
- Reklam kampanyaları
- Email pazarlama

### 🚀 PRO Plan - ₺1299/ay
- Sınırsız ürün
- Özel tema geliştirme
- 10 custom domain
- %3 komisyon
- AI destekli analitik
- API erişimi
- Toplu ürün yükleme
- Multi-channel satış

## 🌐 Multi-Tenant Routing

### Subdomain Routing
```
tdcmarket.com/satici-adi
```

### Custom Domain Routing
```
www.satici-domain.com
```

### Middleware Logic
```typescript
// middleware.ts
- Custom domain tespiti
- Satıcı profilini yükleme
- Tema ve ayarları uygulama
- Route rewriting
```

## 🎨 Tema Sistemi

### Renk Özelleştirme
- Primary color seçimi
- Hazır renk paletleri
- Hex code desteği

### Logo Yönetimi
- Logo upload
- Otomatik boyutlandırma
- Responsive görüntüleme

### Layout Seçenekleri
- Centered header
- Left-aligned header
- Split header

### Hero Görselleri
- Çoklu görsel desteği
- Carousel/slider
- Responsive images

## 🔐 Güvenlik Özellikleri

### Authentication
- NextAuth.js integration
- Session management
- JWT tokens

### Authorization
- Role-based access control
- Route protection
- API endpoint security

### Data Isolation
- Tenant-based queries
- Seller ownership verification
- Secure data access

## 📱 Responsive Design

- **Mobile First**: Mobil cihazlar için optimize
- **Tablet Support**: Tablet görünümü
- **Desktop**: Geniş ekran desteği
- **Touch Friendly**: Dokunmatik ekran uyumlu

## 🎯 Kullanıcı Deneyimi

### Dashboard
- Gerçek zamanlı KPI'lar
- Grafikler ve istatistikler
- Hızlı erişim butonları
- Bildirim sistemi

### Ürün Yönetimi
- Sürükle-bırak görsel yükleme
- Toplu işlemler
- Filtreleme ve sıralama
- Stok uyarıları

### Sipariş Yönetimi
- Sipariş detayları
- Durum güncelleme
- Müşteri bilgileri
- Yazdırılabilir faturalar

### Domain Yönetimi
- DNS talimatları
- Otomatik doğrulama
- SSL sertifika yönetimi
- Domain durumu takibi

## 🚀 Gelecek Geliştirmeler

### Planlanan Özellikler
- [ ] Gelişmiş site builder (drag & drop)
- [ ] Email template editor
- [ ] SMS bildirimleri
- [ ] Canlı chat desteği
- [ ] Mobil uygulama
- [ ] Influencer marketplace
- [ ] Affiliate sistemi
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] A/B testing tools

### Teknik İyileştirmeler
- [ ] Redis cache
- [ ] CDN integration
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Server-side rendering optimization
- [ ] GraphQL API
- [ ] Webhook system
- [ ] Real-time notifications

## 📞 Destek

### Dokümantasyon
- API dokümantasyonu
- Video eğitimler
- SSS bölümü
- Blog yazıları

### İletişim
- Email: support@tdcmarket.com
- Canlı chat: 7/24 (PRO plan)
- Telefon: +90 XXX XXX XX XX

## 📄 Lisans

Bu proje TDC Products tarafından geliştirilmiştir.

---

**TDC Market** - Profesyonel E-Ticaret Platformu 🚀


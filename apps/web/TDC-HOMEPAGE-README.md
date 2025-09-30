# TDC Market Ana Sayfa - Tasarım Notları & Kullanım

## 🎨 Tasarım Sistemi

### Renk Paleti
```css
/* TDC Brand Colors */
--tdc-primary: #5A63F2        /* TDC Indigo */
--tdc-primary-dark: #3E46C9   /* Primary Dark */
--tdc-accent: #FF7A59         /* Coral */
--tdc-success: #2BD9AF        /* Success */
--tdc-warning: #F59E0B        /* Warning */
--tdc-ink: #0F172A            /* Ink */
--tdc-neutral-100: #F1F5F9    /* Neutral100 */
--tdc-surface: #FFFFFF        /* Surface */
```

### Tipografi
- **Başlık Fontu**: Clash Display (serif)
- **Metin/UI Fontu**: Inter (sans-serif)
- **Alternatif**: Manrope (sans-serif)

### Köşe Yarıçapı
- **TDC Standard**: 16px (`rounded-tdc`)
- **Küçük**: 4px (`rounded-sm`)
- **Büyük**: 24px (`rounded-3xl`)

## 🧩 Bileşenler

### 1. AnnouncementBar
```tsx
<AnnouncementBar onClose={() => {}} />
```
- **Özellikler**: Kapatılabilir duyuru çubuğu
- **İçerik**: "%7 komisyon • Özel domain • 14 gün iade"
- **Animasyon**: Slide-right efekti

### 2. Hero
```tsx
<Hero onSearch={(query) => {}} />
```
- **Özellikler**: 
  - Ana başlık ve alt metin
  - Arama çubuğu
  - CTA butonları (Keşfet, Mağazanı Aç)
  - İstatistikler (10K+ Satıcı, 50K+ Ürün, 1M+ Müşteri)
- **Animasyonlar**: Fade-in, float, glow efektleri

### 3. CategoryGrid
```tsx
<CategoryGrid 
  categories={categories} 
  onCategoryClick={(category) => {}} 
/>
```
- **Özellikler**:
  - 6 kategori kartı
  - Hover'da gradient border
  - Trend rozeti
  - Ürün sayısı gösterimi

### 4. CollectionStrip
```tsx
<CollectionStrip 
  collections={collections} 
  onProductClick={(product) => {}}
  onCollectionClick={(collection) => {}}
/>
```
- **Özellikler**:
  - 4 kürasyon şeridi
  - 1 büyük + 4 küçük kart düzeni
  - Ürün önizlemeleri

### 5. CouponBanner
```tsx
<CouponBanner 
  coupons={coupons} 
  onCouponCopy={(coupon) => {}} 
/>
```
- **Özellikler**:
  - Kupon kodu gösterimi
  - Kopyala butonu
  - Confetti animasyonu
  - Ek kuponlar (gizli/görünür)

### 6. StoreSpotlight
```tsx
<StoreSpotlight 
  stores={stores} 
  onStoreClick={(store) => {}} 
/>
```
- **Özellikler**:
  - 3 mağaza kartı
  - Doğrulanmış rozeti
  - Mağaza istatistikleri
  - Favorilere ekleme

### 7. TrustSection
```tsx
<TrustSection />
```
- **Özellikler**:
  - 6 güven özelliği
  - İstatistik kartları
  - Ödeme yöntemi rozetleri

### 8. BlogSection
```tsx
<BlogSection 
  posts={posts} 
  onPostClick={(post) => {}} 
/>
```
- **Özellikler**:
  - 3 blog yazısı
  - Kategori rozetleri
  - Okuma süresi
  - Newsletter kayıt

## 📊 Analytics Events

### Event İsimleri
```typescript
// Arama
'home_search_submit'     // Arama yapıldığında
'home_category_click'    // Kategori tıklandığında
'home_collection_click'  // Koleksiyon tıklandığında

// Ürün Etkileşimleri
'product_card_click'     // Ürün kartı tıklandığında
'coupon_copy'           // Kupon kopyalandığında

// Satıcı Etkileşimleri
'seller_cta_click'      // Satıcı CTA tıklandığında

// Blog
'blog_post_click'       // Blog yazısı tıklandığında
```

### Event Properties
```typescript
// Arama Eventi
{
  query: string
}

// Kategori Eventi
{
  category_id: string,
  category_name: string
}

// Ürün Eventi
{
  product_id: string,
  product_name: string,
  product_price: number
}

// Kupon Eventi
{
  code: string,
  discount: number,
  type: 'percentage' | 'fixed'
}
```

## 🔄 ISR Revalidation

### Revalidate Tag Sistemi
```typescript
// API Endpoint: /api/revalidate
POST /api/revalidate
{
  "tag": "home",
  "secret": "your-secret-key"
}
```

### Kullanım
```typescript
// Admin panelinde içerik güncellendiğinde
fetch('/api/revalidate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tag: 'home',
    secret: process.env.REVALIDATE_SECRET
  })
});
```

## 🎯 Performans Optimizasyonları

### Next/Image Kullanımı
```tsx
<Image
  src="/images/hero/showcase-1.jpg"
  alt="3D Figür Koleksiyonu"
  fill
  className="object-cover"
  priority  // Hero görseli için
  loading="lazy"  // Diğer görseller için
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Font Optimizasyonu
```css
/* Font display swap */
font-display: swap;

/* Preconnect to Google Fonts */
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### Critical CSS
- Hero section için inline CSS
- Above-the-fold içerik için kritik stiller
- Lazy loading için skeleton loader'lar

## ♿ Erişilebilirlik

### ARIA Labels
```tsx
<button aria-label="Arama yap">
<Link aria-label="3D Figürler kategorisini görüntüle">
<input aria-label="Ürün arama">
```

### Keyboard Navigation
- Tab ile gezinme
- Enter ile etkileşim
- Escape ile kapatma
- Arrow keys ile seçim

### Screen Reader Support
```tsx
<span className="sr-only">Ekran okuyucu için açıklama</span>
```

### Focus Management
```css
.focus-visible {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}
```

## 📱 Responsive Design

### Breakpoints
```css
xs: 475px   /* Extra small */
sm: 640px   /* Small */
md: 768px   /* Medium */
lg: 1024px  /* Large */
xl: 1280px  /* Extra large */
2xl: 1536px /* 2X large */
```

### Mobile-First Approach
- Mobil tasarım öncelikli
- Progressive enhancement
- Touch-friendly etkileşimler

## 🧪 Test Coverage

### Unit Tests (Jest + Testing Library)
```bash
npm run test
```
- Bileşen render testleri
- Event handler testleri
- Props validation testleri

### E2E Tests (Playwright)
```bash
npm run test:e2e
```
- Kullanıcı akış testleri
- Responsive testleri
- Accessibility testleri

## 🚀 Deployment

### Vercel Deployment
```bash
# Production build
npm run build

# Deploy to Vercel
vercel --prod
```

### Environment Variables
```env
REVALIDATE_SECRET=your-secret-key
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_GTM_ID=your-gtm-id
```

## 📈 Lighthouse Scores

### Hedeflenen Skorlar
- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

### Optimizasyon Teknikleri
- Image optimization
- Font optimization
- Critical CSS inlining
- Lazy loading
- Code splitting

## 🔧 Geliştirme

### Geliştirme Sunucusu
```bash
npm run dev
```

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run type-check
```

### Build
```bash
npm run build
```

## 📝 Changelog

### v1.0.0 (2024-01-15)
- ✅ TDC Market ana sayfa tasarımı
- ✅ Responsive layout
- ✅ Analytics entegrasyonu
- ✅ SEO optimizasyonu
- ✅ Erişilebilirlik iyileştirmeleri
- ✅ Test coverage
- ✅ ISR revalidation sistemi

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.


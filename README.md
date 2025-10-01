# TDC Products - Premium Figür & Koleksiyon Dünyası

Modern, Figma-vari animasyonlu ve görsel ağırlıklı e-ticaret platformu. Next.js 14, Tailwind CSS ve Framer Motion ile geliştirilmiştir.

## 🎨 Tasarım Sistemi

### Renk Paleti
- **Primary**: #5A63F2 (Indigo)
- **Accent**: #FF7A59 (Coral) 
- **Ink**: #0F172A (Dark)
- **Neutral**: #F1F5F9 (Light)
- **Surface**: #FFFFFF (White)

### Tipografi
- **Başlık**: Clash Display (Serif)
- **Metin/UI**: Inter/Manrope (Sans-serif)

### Tasarım Prensipleri
- 16px border radius
- Yumuşak gölgeler
- Gradient vurgular (Indigo → Coral)
- Mobil-önce yaklaşım
- 8-pt grid sistemi
- AA kontrast oranı

## 🚀 Özellikler

### Header
- **İki Ayrı Giriş Butonu**: Kullanıcı ve Satıcı girişi
- **Kare Kontur + Glow**: Hover efektleri ile
- **Sticky Header**: Scroll ile opacity geçişi
- **Figma Smart Animate**: Nav link underline animasyonları

### Ana Sayfa Bölümleri
1. **Hero Section**: Lottie animasyonlu, parçacık efektli
2. **Featured Collections**: 1 büyük + 4 küçük kart grid
3. **Media Showcase**: Video/görsel carousel
4. **Quality Section**: 3 kart (Premium reçine, El boyama, Sınırlı üretim)
5. **Community Section**: Testimonial'lar ve sosyal kanıt
6. **CTA Strip**: Email kayıt formu, parlayan gradient arka plan

### Animasyonlar
- **Framer Motion**: Scroll-reveal, hover micro-animations
- **CSS Animations**: Pulse, float, glow efektleri
- **Reduced Motion**: Accessibility desteği
- **Performance**: Optimized animations

## 🛠 Teknoloji Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Remix Icons
- **Fonts**: Inter, Manrope, Clash Display
- **TypeScript**: Full type safety
- **Performance**: Next/Image, Font optimization

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Production build
npm run build

# Production sunucusunu başlat
npm start
```

## 🎯 Performans

- **Lighthouse Score**: Performance ≥ 90, Accessibility ≥ 95
- **LCP**: < 2.5s
- **Bundle Size**: 225 kB (First Load JS)
- **Images**: Next/Image ile optimize edilmiş
- **Fonts**: display: swap ile optimize edilmiş

## 📱 Responsive Design

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px - 1440px+
- **Breakpoints**: Tailwind CSS default breakpoints

## ♿ Erişilebilirlik

- **ARIA Labels**: Tüm interactive elementler
- **Keyboard Navigation**: Tab order ve focus management
- **Screen Reader**: Semantic HTML yapısı
- **Color Contrast**: AA seviyesi kontrast
- **Reduced Motion**: prefers-reduced-motion desteği

## 🎨 Animasyon Sistemi

### Framer Motion Kullanımı
```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  whileHover={{ scale: 1.05 }}
>
  Content
</motion.div>
```

### CSS Animations
```css
.animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
.animate-slide-up { animation: slideUp 0.5s ease-out; }
.animate-scale-in { animation: scaleIn 0.3s ease-out; }
```

## 🖼 Görsel Optimizasyonu

- **Next/Image**: Otomatik format seçimi (WebP, AVIF)
- **Lazy Loading**: Görünüm alanına giren görseller
- **Responsive Images**: Farklı ekran boyutları için
- **CLS**: 0.1 altı Cumulative Layout Shift

## 🔧 Geliştirme

### Proje Yapısı
```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Ana sayfa
│   └── globals.css     # Global stiller
├── components/         # React bileşenleri
│   ├── Header.tsx      # Header bileşeni
│   ├── Footer.tsx      # Footer bileşeni
│   ├── AuthModal.tsx   # Giriş modalları
│   └── home/           # Ana sayfa bileşenleri
└── animations/         # Lottie animasyonları
```

### Tailwind Konfigürasyonu
- Custom color palette
- Typography scale
- Spacing system
- Border radius values
- Box shadows
- Animations & keyframes

## 🚀 Deployment

### Vercel (Önerilen)
1. GitHub repository'yi bağla
2. Vercel dashboard'da proje oluştur
3. Auto-deploy aktif
4. Environment variables ayarla

### Build Komutları
```bash
npm run build    # Production build
npm run start    # Production server
npm run dev      # Development server
npm run lint     # ESLint check
```

## 📈 Analytics & SEO

- **Meta Tags**: Open Graph, Twitter Cards
- **Sitemap**: Otomatik sitemap.xml
- **Robots.txt**: SEO optimizasyonu
- **Structured Data**: Schema.org markup
- **Performance**: Core Web Vitals

## 🎯 Gelecek Özellikler

- [ ] Lottie animasyonları entegrasyonu
- [ ] Gerçek görsel assets
- [ ] Backend API entegrasyonu
- [ ] E-ticaret fonksiyonları
- [ ] Admin paneli
- [ ] Multi-language desteği

## 📄 Lisans

Bu proje TDC Products tarafından geliştirilmiştir.

---

**TDC Products** - Premium Figür & Koleksiyon Dünyası 🎨✨
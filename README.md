# TDC Products Website

Modern ve responsive 3D baskı figür satış sitesi. Next.js 15, React 19, TypeScript ve Tailwind CSS kullanılarak geliştirilmiştir.

## 🚀 Özellikler

- **Modern Tasarım**: Responsive ve kullanıcı dostu arayüz
- **3D Figür Koleksiyonu**: Anime, oyun ve film karakterleri
- **Admin Paneli**: Ürün, kupon ve sipariş yönetimi
- **BİST Entegrasyonu**: Borsa verileri takibi
- **Blog Sistemi**: İçerik yönetimi
- **WhatsApp Entegrasyonu**: Müşteri iletişimi
- **SEO Optimizasyonu**: Meta etiketleri ve yapılandırılmış veri

## 🛠️ Teknolojiler

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Remix Icons
- **Fonts**: Google Fonts (Inter, Pacifico)
- **Images**: Next.js Image Optimization
- **Deployment**: Vercel

## 📦 Kurulum

1. **Projeyi klonlayın:**
```bash
git clone <repository-url>
cd tdc-products-website
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Development server'ı başlatın:**
```bash
npm run dev
```

4. **Tarayıcıda açın:**
```
http://localhost:3000
```

## 🏗️ Build ve Deploy

### Production Build
```bash
npm run build
```

### Production Server
```bash
npm start
```

### Vercel Deploy
Proje Vercel'e deploy edilmeye hazırdır. `vercel.json` dosyası konfigüre edilmiştir.

## 📁 Proje Yapısı

```
tdc-products-website/
├── components/           # Shared components
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Site footer
│   └── WhatsAppButton.tsx # WhatsApp contact button
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── about/       # About page
│   │   ├── admin/       # Admin panel
│   │   ├── blog/        # Blog pages
│   │   ├── contact/     # Contact page
│   │   ├── products/    # Product pages
│   │   ├── tdc-bist/    # BIST page
│   │   ├── globals.css  # Global styles
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   └── data/            # Static data
│       └── products.ts  # Product data
├── public/              # Static assets
├── next.config.ts       # Next.js config
├── tailwind.config.ts   # Tailwind config
├── tsconfig.json        # TypeScript config
└── vercel.json          # Vercel config
```

## 🎨 Tasarım Sistemi

### Renkler
- **Primary**: Orange (#f97316)
- **Secondary**: Blue (#3b82f6)
- **Background**: White, Gray gradients
- **Text**: Gray scale (#374151, #6b7280, etc.)

### Typography
- **Headings**: Inter (Bold)
- **Body**: Inter (Regular)
- **Logo**: Pacifico (Cursive)

### Components
- **Cards**: Rounded corners, shadows, hover effects
- **Buttons**: Gradient backgrounds, hover animations
- **Forms**: Clean inputs with focus states
- **Navigation**: Sticky header with mobile menu

## 📱 Responsive Design

- **Mobile First**: 320px+
- **Tablet**: 768px+
- **Desktop**: 1024px+
- **Large Desktop**: 1280px+

## 🔧 Konfigürasyon

### Tailwind CSS
```typescript
// tailwind.config.ts
content: [
  './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './src/app/**/*.{js,ts,jsx,tsx,mdx}',
]
```

### Next.js
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    domains: ['readdy.ai'],
  },
  experimental: {
    optimizeCss: true,
  },
}
```

## 🚀 Performance

- **Image Optimization**: Next.js Image component
- **CSS Optimization**: Tailwind CSS purging
- **Code Splitting**: Automatic by Next.js
- **Static Generation**: Pre-rendered pages
- **Lazy Loading**: Images and components

## 📊 SEO

- **Meta Tags**: Dynamic meta descriptions
- **Structured Data**: Product schema markup
- **Sitemap**: Automatic generation
- **Robots.txt**: Search engine directives
- **Open Graph**: Social media sharing

## 🔒 Güvenlik

- **TypeScript**: Type safety
- **ESLint**: Code quality
- **Next.js Security**: Built-in protections
- **Input Validation**: Form validation

## 📈 Analytics

- **Performance Monitoring**: Vercel Analytics
- **Error Tracking**: Built-in error boundaries
- **User Analytics**: Ready for integration

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Telefon**: 0555 898 82 42
- **E-posta**: bentahasarii@gmail.com
- **Adres**: Erzene, 66. Sk. No:5 D:1A, 35040 Bornova/İzmir

## 🙏 Teşekkürler

- Next.js ekibi
- Tailwind CSS ekibi
- Remix Icons
- Google Fonts
- Vercel

---

**TDC Products** - Hayallerinizi gerçeğe dönüştürüyoruz! 🎨✨

# 🚀 TDC Products - Production Deployment Rehberi

## 📋 Ön Gereksinimler

### 1. Environment Variables
`.env.local` dosyasında şu değişkenlerin tanımlı olduğundan emin olun:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Supabase Kurulumu
- Supabase projesi oluşturulmuş olmalı
- Database tabloları kurulmuş olmalı
- Storage bucket'ları oluşturulmuş olmalı
- RLS politikaları uygulanmış olmalı

## 🏗️ Local Production Build

### Windows
```bash
# Deployment script çalıştır
deploy.bat

# Veya manuel olarak
npm run deploy:prod
```

### Linux/Mac
```bash
# Script'i çalıştırılabilir yap
chmod +x deploy.sh

# Deployment script çalıştır
./deploy.sh

# Veya manuel olarak
npm run deploy:prod
```

## ☁️ Vercel Deployment

### 1. Vercel CLI ile
```bash
# Vercel CLI kur
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 2. Vercel Dashboard ile
1. [Vercel Dashboard](https://vercel.com/dashboard)'a gidin
2. "New Project" tıklayın
3. GitHub repository'nizi seçin
4. Environment variables'ları ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. "Deploy" tıklayın

### 3. Environment Variables (Vercel)
Vercel Dashboard > Project Settings > Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔧 Production Optimizasyonları

### 1. Build Optimizasyonu
```bash
# Production build
npm run build

# Build analizi
npm run build:analyze
```

### 2. Performance Kontrolü
- Lighthouse testleri yapın
- Core Web Vitals kontrol edin
- Bundle size analizi yapın

### 3. SEO Kontrolü
- Meta etiketleri kontrol edin
- Sitemap.xml oluşturulduğunu kontrol edin
- robots.txt kontrol edin

## 🧪 Test Etme

### 1. Build Testi
```bash
npm run test:build
```

### 2. TypeScript Kontrolü
```bash
npm run type-check
```

### 3. Lint Kontrolü
```bash
npm run lint
```

## 🔍 Sorun Giderme

### Build Hataları
1. TypeScript hatalarını düzeltin
2. ESLint uyarılarını kontrol edin
3. Environment variables'ları kontrol edin

### Runtime Hataları
1. Browser console'u kontrol edin
2. Network sekmesini kontrol edin
3. Supabase log'larını kontrol edin

### Performance Sorunları
1. Bundle size'ı kontrol edin
2. Image optimization'ı kontrol edin
3. API response time'ları kontrol edin

## 📊 Monitoring

### 1. Vercel Analytics
- Performance monitoring
- Error tracking
- User analytics

### 2. Supabase Monitoring
- Database performance
- Storage usage
- API calls

### 3. Custom Monitoring
- Error boundaries
- Performance metrics
- User feedback

## 🔄 CI/CD

### GitHub Actions (Örnek)
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🎯 Production Checklist

### ✅ Kurulum
- [ ] Environment variables tanımlı
- [ ] Supabase projesi kurulu
- [ ] Database tabloları oluşturuldu
- [ ] Storage bucket'ları hazır
- [ ] RLS politikaları uygulandı

### ✅ Build
- [ ] TypeScript hataları yok
- [ ] ESLint uyarıları kontrol edildi
- [ ] Build başarılı
- [ ] Bundle size kabul edilebilir

### ✅ Test
- [ ] Ana sayfa yükleniyor
- [ ] Ürün sayfaları çalışıyor
- [ ] Admin paneli erişilebilir
- [ ] Görsel yükleme çalışıyor
- [ ] API endpoint'leri çalışıyor

### ✅ Performance
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals iyi
- [ ] Image optimization çalışıyor
- [ ] Caching doğru ayarlandı

### ✅ SEO
- [ ] Meta etiketleri doğru
- [ ] Sitemap.xml oluşturuldu
- [ ] robots.txt mevcut
- [ ] Structured data eklendi

## 📞 Destek

Sorun yaşarsanız:
1. Console log'larını kontrol edin
2. Network sekmesini kontrol edin
3. Supabase Dashboard'ı kontrol edin
4. Vercel log'larını kontrol edin

---

**TDC Products** - Production'a hazır! 🚀✨

# TDC Market - Modüler E-ticaret Platformu

TDC Market, modüler plug-in mimarisine sahip gelişmiş bir e-ticaret platformudur. Her modül bağımsız olarak geliştirilebilir, test edilebilir ve başka projelere entegre edilebilir.

## 🚀 Özellikler

- **Modüler Mimari**: Her özellik bağımsız modül olarak geliştirilebilir
- **Plug-in Sistemi**: Modüller runtime'da yüklenebilir ve kaldırılabilir
- **TypeScript**: Tam tip güvenliği
- **Next.js 14**: App Router ile modern React framework
- **Supabase**: PostgreSQL veritabanı ve real-time özellikler
- **Tailwind CSS**: Modern ve responsive UI
- **Monorepo**: pnpm + Turborepo ile hızlı geliştirme

## 📁 Proje Yapısı

```
tdc-market/
├── apps/
│   ├── web/                 # Ana web uygulaması (localhost:3000)
│   └── admin/               # Admin paneli (localhost:3001)
├── packages/
│   ├── core/                # Çekirdek modül sistemi
│   ├── ui/                  # Ortak UI bileşenleri
│   ├── sdk/                 # SDK ve API client'ları
│   ├── shared/              # Paylaşılan tipler ve utilities
│   └── feature-*/           # Özellik modülleri
│       ├── feature-pricing/     # Fiyat yönetimi
│       ├── feature-accounting/  # Muhasebe
│       ├── feature-loyalty/     # Sadakat programı
│       └── feature-automation/  # Otomasyon
├── docs/                    # Dokümantasyon
└── database/               # Veritabanı şemaları
```

## 🛠️ Kurulum

### Gereksinimler

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL veya Supabase hesabı

### Hızlı Başlangıç

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/tdc/market.git
cd market
```

2. **Bağımlılıkları yükleyin:**
```bash
pnpm install
```

3. **Environment variables'ları ayarlayın:**
```bash
cp env.example .env.local
# .env.local dosyasını düzenleyin
```

4. **Veritabanını kurun:**
```bash
pnpm db:migrate
pnpm db:seed
```

5. **Uygulamaları başlatın:**
```bash
pnpm dev
```

Uygulamalar şu adreslerde çalışacak:
- Web: http://localhost:3000
- Admin: http://localhost:3001

## 📦 Mevcut Modüller

### 🏷️ Pricing Module (@tdc/feature-pricing)
- Fiyat önerileri ve optimizasyonu
- Rakip fiyat takibi
- Fiyat simülasyonu
- Otomatik fiyat uyarıları

### 💰 Accounting Module (@tdc/feature-accounting)
- Fatura yönetimi
- Mali raporlar
- Gelir-gider takibi
- Vergi hesaplamaları

### 🎁 Loyalty Module (@tdc/feature-loyalty)
- Müşteri sadakat programı
- Puan sistemi
- Ödül yönetimi
- Kampanya takibi

### ⚙️ Automation Module (@tdc/feature-automation)
- İş süreçleri otomasyonu
- Workflow yönetimi
- Trigger sistemi
- Zamanlanmış görevler

## 🚀 Komutlar

### Geliştirme
```bash
# Tüm uygulamaları başlat
pnpm dev

# Sadece web uygulamasını başlat
pnpm --filter @tdc/web dev

# Sadece admin uygulamasını başlat
pnpm --filter @tdc/admin dev

# Sadece core paketini build et
pnpm --filter @tdc/core build
```

### Build ve Deploy
```bash
# Tüm paketleri build et
pnpm build

# Production build
pnpm build:production

# Vercel'e deploy
pnpm deploy:vercel
```

### Veritabanı
```bash
# Migration'ları çalıştır
pnpm db:migrate

# Demo verileri yükle
pnpm db:seed

# Demo verileri temizle
pnpm clean:demo

# Tüm verileri temizle
pnpm clean:all
```

### Test
```bash
# Tüm testleri çalıştır
pnpm test

# Type check
pnpm type-check

# Lint
pnpm lint
```

## 🔧 Yeni Modül Ekleme

1. **Modül dizinini oluşturun:**
```bash
mkdir packages/feature-your-module
cd packages/feature-your-module
```

2. **Temel dosyaları oluşturun:**
```bash
# package.json, tsconfig.json, plugin.manifest.json
# src/index.ts, src/components/, src/api/
```

3. **Modülü admin'e ekleyin:**
```typescript
// apps/admin/src/modules.ts
export const activeModules = [
  'pricing',
  'accounting',
  'loyalty',
  'automation',
  'your-module' // Yeni modülünüzü ekleyin
];
```

Detaylı rehber için [Modüler Mimari Dokümantasyonu](docs/modular-architecture.md) dosyasını inceleyin.

## 📚 Dokümantasyon

- [Modüler Mimari Rehberi](docs/modular-architecture.md)
- [API Dokümantasyonu](docs/api.md)
- [UI Bileşenleri](docs/ui-components.md)
- [Veritabanı Şeması](docs/database-schema.md)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasını inceleyin.

## 🆘 Destek

- GitHub Issues: [Sorun bildir](https://github.com/tdc/market/issues)
- Dokümantasyon: [docs/](docs/)
- Email: support@tdc.com

## 🏗️ Roadmap

- [ ] Daha fazla e-ticaret modülü
- [ ] Mobile app desteği
- [ ] Multi-tenant mimari
- [ ] Advanced analytics
- [ ] AI/ML entegrasyonları
- [ ] Third-party entegrasyonlar

---

**TDC Market** - Modüler e-ticaret platformu ile işinizi büyütün! 🚀
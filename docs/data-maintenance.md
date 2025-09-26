# Veri Yönetimi ve Bakım

Bu dokümantasyon TDC Market projesindeki demo veri yönetimi ve bakım işlemlerini açıklar.

## 🚀 Hızlı Başlangıç

### Demo Veri Temizleme
```bash
# Demo verileri temizle
pnpm clean:demo
npm run clean:demo
yarn clean:demo
```

### Demo Veri Ekleme
```bash
# Demo verileri ekle (DEMO_MODE=true gerekli)
pnpm seed:demo
npm run seed:demo
yarn seed:demo
```

## 🔧 Environment Variables

### Gerekli Değişkenler
```env
# Demo veri yönetimi
DEMO_MODE=false                    # Demo veri kullanımını kontrol eder
ALLOW_DESTRUCTIVE=false           # Yıkıcı işlemler için güvenlik bayrağı
NODE_ENV=development              # Ortam kontrolü
```

### Güvenlik Ayarları
- **Production'da:** `DEMO_MODE=false` ve `ALLOW_DESTRUCTIVE=false` olmalı
- **Development'da:** `DEMO_MODE=true` ve `ALLOW_DESTRUCTIVE=true` olabilir

## 📊 Demo Veri Yönetimi

### Demo Veri Tespiti
Sistem aşağıdaki pattern'lere göre demo verileri tespit eder:

#### Email Pattern'leri
- `@example.com`
- `@demo.com`
- `@test.com`
- `@sample.com`

#### İsim Pattern'leri
- `demo`, `test`, `sample`, `mock`, `fake` içeren isimler

#### Kod/SKU Pattern'leri
- `DEMO-` ile başlayan kodlar
- `TEST-` ile başlayan kodlar
- `SAMPLE-` ile başlayan kodlar

#### İçerik Pattern'leri
- `demo`, `test`, `sample`, `mock`, `fake` içeren açıklamalar

### Veritabanı Şeması
Tüm tablolara `is_demo BOOLEAN DEFAULT false` alanı eklenmiştir:

```sql
-- Örnek tablo güncellemesi
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
-- ... diğer tablolar
```

## 🛠️ Komutlar

### Temizleme Komutları
```bash
# Demo verileri temizle
pnpm clean:demo

# Tüm temizleme işlemleri
pnpm clean:all

# Next.js cache temizle
pnpm clean
```

### Seed Komutları
```bash
# Demo verileri ekle
pnpm seed:demo

# Normal seed (DEMO_MODE kontrolü ile)
pnpm seed
```

### Veritabanı Komutları
```bash
# Supabase bağlantısını test et
pnpm test:supabase

# Supabase kurulumu
pnpm setup:supabase
```

## 🔒 Güvenlik

### Production Güvenliği
- Production ortamında demo veri temizleme **yasaktır**
- `NODE_ENV=production` kontrolü yapılır
- `ALLOW_DESTRUCTIVE=true` gerekir

### Development Güvenliği
- Demo veri ekleme sadece `DEMO_MODE=true` iken çalışır
- Tüm demo veriler `is_demo=true` ile işaretlenir
- Mock data sadece development'ta kullanılır

## 📋 Temizleme Raporu

### Temizlenen Tablolar
- `categories` - Kategori verileri
- `products` - Ürün verileri
- `orders` - Sipariş verileri
- `customers` - Müşteri verileri
- `coupons` - Kupon verileri
- `invoices` - Fatura verileri
- `campaigns` - Kampanya verileri
- `employees` - Çalışan verileri
- `admin_users` - Admin kullanıcı verileri
- `site_users` - Site kullanıcı verileri
- `blog_posts` - Blog yazı verileri
- `comments` - Yorum verileri
- `wishlist` - İstek listesi verileri
- `subscriptions` - Abonelik verileri
- `gift_cards` - Hediye kartı verileri
- `loyalty_points` - Sadakat puanı verileri
- `price_optimization` - Fiyat optimizasyon verileri
- `automations` - Otomasyon verileri
- `ai_recommendations` - AI öneri verileri
- `security_threats` - Güvenlik tehdit verileri
- `security_vulnerabilities` - Güvenlik açığı verileri
- `performance_metrics` - Performans metrik verileri
- `page_performance` - Sayfa performans verileri
- `bundle_analysis` - Bundle analiz verileri
- `performance_recommendations` - Performans öneri verileri
- `ai_insights` - AI içgörü verileri
- `ai_chatbot_interactions` - AI chatbot etkileşim verileri
- `analytics_sessions` - Analitik oturum verileri
- `page_views` - Sayfa görüntüleme verileri
- `sessions` - Oturum verileri
- `users` - Kullanıcı verileri
- `error_logs` - Hata log verileri
- `security_logs` - Güvenlik log verileri

### Temizleme Kriterleri
1. **is_demo=true** olan kayıtlar
2. **Email pattern'leri** eşleşen kayıtlar
3. **İsim pattern'leri** eşleşen kayıtlar
4. **Kod/SKU pattern'leri** eşleşen kayıtlar
5. **İçerik pattern'leri** eşleşen kayıtlar

## 🚨 Hata Durumları

### Yaygın Hatalar

#### "Production ortamında demo veri temizleme yasak!"
```bash
# Çözüm: NODE_ENV kontrolü
NODE_ENV=development pnpm clean:demo
```

#### "Destructive işlemler için izin gerekli!"
```bash
# Çözüm: ALLOW_DESTRUCTIVE=true ayarla
ALLOW_DESTRUCTIVE=true pnpm clean:demo
```

#### "Demo mode aktif değil!"
```bash
# Çözüm: DEMO_MODE=true ayarla
DEMO_MODE=true pnpm seed:demo
```

#### "Supabase environment variables bulunamadı!"
```bash
# Çözüm: .env.local dosyasını kontrol et
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

## 📈 Performans

### Temizleme Performansı
- **Ortalama süre:** 2-5 saniye
- **Rate limiting:** 100ms bekleme
- **Batch işlem:** Tablo bazında
- **Hata toleransı:** Devam eder

### Seed Performansı
- **Ortalama süre:** 5-10 saniye
- **Rate limiting:** 200ms bekleme
- **Veri miktarı:** 200+ kayıt
- **Foreign key:** Sıralı ekleme

## 🔄 Backup ve Geri Yükleme

### Backup Önerileri
```bash
# Veritabanı backup
pg_dump your_database > backup.sql

# Supabase backup
# Supabase Dashboard > Settings > Database > Backups
```

### Geri Yükleme
```bash
# SQL backup'tan geri yükle
psql your_database < backup.sql

# Supabase'den geri yükle
# Supabase Dashboard > Settings > Database > Backups
```

## 📞 Destek

### Sorun Bildirimi
1. Hata mesajını kopyalayın
2. Environment variables'ları kontrol edin
3. Log dosyalarını inceleyin
4. GitHub Issues'da bildirin

### Geliştirici Notları
- Script'ler TypeScript ile yazılmıştır
- `tsx` kullanılarak çalıştırılır
- Supabase client ile veritabanı işlemleri
- Faker.js ile demo veri üretimi

## 📚 Ek Kaynaklar

- [Supabase Dokümantasyonu](https://supabase.com/docs)
- [Faker.js Dokümantasyonu](https://fakerjs.dev/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [TypeScript Dokümantasyonu](https://www.typescriptlang.org/docs/)

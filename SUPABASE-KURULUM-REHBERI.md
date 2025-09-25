# 🚀 SUPABASE KURULUM REHBERİ

## 1. SUPABASE PROJESİ OLUŞTUR

### 1.1 Supabase Dashboard'a Git
- https://supabase.com/dashboard adresine git
- GitHub ile giriş yap
- "New Project" butonuna tıkla

### 1.2 Proje Ayarları
```
Project Name: tdc-products-website
Database Password: Güçlü bir şifre oluştur (unutma!)
Region: Frankfurt (Türkiye'ye en yakın)
Pricing Plan: Free (başlangıç için yeterli)
```

### 1.3 Proje Oluştur
- "Create new project" butonuna tıkla
- Proje oluşturulmasını bekle (2-3 dakika)

## 2. ENVIRONMENT VARIABLES AYARLA

### 2.1 Supabase Bilgilerini Al
Supabase Dashboard → Settings → API sayfasından:
- Project URL
- anon/public key  
- service_role key

### 2.2 .env.local Dosyası Oluştur
Proje kök dizininde `.env.local` dosyası oluştur:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Site URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Admin Configuration
ADMIN_CLEANUP_TOKEN=change_me_strong_token_12345
DEV_ADMIN_BYPASS=true
DEV_ADMIN_EMAIL=bentahasarii@gmail.com
DEV_ADMIN_PASSWORD=35sandalye

# E-posta Ayarları
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Security
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_AI=true
```

## 3. VERİTABANI ŞEMASINI KUR

### 3.1 SQL Editor'a Git
Supabase Dashboard → SQL Editor

### 3.2 Ana Şemayı Çalıştır
`database/complete-schema.sql` dosyasının içeriğini kopyala ve çalıştır.

### 3.3 Emoji Desteği Ekle
`supabase-emoji-fix.sql` dosyasını çalıştır.

## 4. ADMIN KULLANICISI OLUŞTUR

### 4.1 Authentication'a Git
Supabase Dashboard → Authentication → Users

### 4.2 Kullanıcı Ekle
```
Email: bentahasarii@gmail.com
Password: 35sandalye
```

### 4.3 Admin Yetkisi Ver
Supabase Dashboard → SQL Editor'da:
```sql
-- Admin kullanıcısına tam yetki ver
UPDATE auth.users 
SET raw_user_meta_data = '{"role": "admin"}'::jsonb
WHERE email = 'bentahasarii@gmail.com';
```

## 5. TEST ET

### 5.1 Development Server'ı Başlat
```bash
npm run dev
```

### 5.2 Bağlantıyı Test Et
```bash
node test-supabase-connection.js
```

### 5.3 Admin Paneli Test Et
- http://localhost:3000/admin adresine git
- Oluşturduğun admin hesabıyla giriş yap
- Kategori ekleme/silme işlemlerini test et

## 6. SORUN GİDERME

### 6.1 Bağlantı Sorunu
- Environment variables'ı kontrol et
- Supabase URL'nin doğru olduğundan emin ol
- Internet bağlantısını kontrol et

### 6.2 Authentication Sorunu
- Admin kullanıcısının doğru oluşturulduğundan emin ol
- Email verification'ı kontrol et

### 6.3 Veritabanı Sorunu
- SQL script'lerinin doğru çalıştığını kontrol et
- RLS policy'lerini kontrol et

## 7. PRODUCTION DEPLOYMENT

### 7.1 Vercel'e Deploy Et
```bash
npm run build
vercel --prod
```

### 7.2 Environment Variables'ı Vercel'e Ekle
Vercel Dashboard → Project Settings → Environment Variables

### 7.3 Production URL'leri Güncelle
`.env.local` dosyasında:
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
NEXTAUTH_URL=https://your-domain.vercel.app
```

## ✅ BAŞARILI KURULUM KONTROL LİSTESİ

- [ ] Supabase projesi oluşturuldu
- [ ] Environment variables ayarlandı
- [ ] Veritabanı şeması kuruldu
- [ ] Admin kullanıcısı oluşturuldu
- [ ] Bağlantı test edildi
- [ ] Kategori işlemleri test edildi
- [ ] Production'a deploy edildi

## 🎉 SONUÇ

Artık e-ticaret modülün tamamen fonksiyonel! Kategori ekleme/silme, ürün yönetimi, sipariş takibi ve tüm diğer özellikler gerçek veritabanında çalışacak.

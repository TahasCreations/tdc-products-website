# TDC Market - Authentication Setup

## Prisma ile Kalıcı Kullanıcılar & Roller Kurulumu

### 1. Environment Variables

`.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/tdc_market?schema=public"

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Cloud Storage
GCP_PROJECT_ID=your-gcp-project-id
GCP_CLIENT_EMAIL=your-service-account-email
GCP_PRIVATE_KEY=your-private-key
GCS_BUCKET=your-bucket-name
```

### 2. Veritabanı Kurulumu

#### Lokal PostgreSQL:
```bash
# PostgreSQL kurulumu (Windows)
# https://www.postgresql.org/download/windows/

# Veritabanı oluşturma
createdb tdc_market

# Migration çalıştırma
npx prisma migrate dev --name init
```

#### Production (Önerilen):
- **Neon**: https://neon.tech
- **Railway**: https://railway.app
- **PlanetScale**: https://planetscale.com

### 3. Google OAuth Kurulumu

1. Google Cloud Console'a gidin: https://console.cloud.google.com
2. Yeni proje oluşturun veya mevcut projeyi seçin
3. "APIs & Services" > "Credentials" bölümüne gidin
4. "Create Credentials" > "OAuth 2.0 Client IDs" seçin
5. Application type: "Web application"
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Client ID ve Client Secret'i `.env` dosyasına ekleyin

### 4. Migration Çalıştırma

```bash
# Prisma client generate
npx prisma generate

# Database migration
npx prisma migrate dev --name init

# Veritabanını görüntüleme (opsiyonel)
npx prisma studio
```

### 5. Rol Sistemi

Sistem aşağıdaki rollerle gelir:

- **USER**: Normal kullanıcı
- **ADMIN**: Tam yetkili admin
- **MODERATOR**: İçerik moderatörü
- **SELLER**: Satıcı
- **CUSTOMER_SERVICE**: Müşteri hizmetleri

### 6. Test

```bash
# Development server başlatma
npm run dev

# Tarayıcıda http://localhost:3000 adresine gidin
# "Google ile Giriş" butonuna tıklayın
```

## Özellikler

✅ **Google OAuth** entegrasyonu  
✅ **JWT/Database** session yönetimi  
✅ **Rol tabanlı** yetkilendirme  
✅ **Prisma ORM** ile veritabanı yönetimi  
✅ **NextAuth.js v5** ile modern authentication  
✅ **TypeScript** desteği  
✅ **Server-side** session okuma  

## Sorun Giderme

### Veritabanı Bağlantı Hatası
- PostgreSQL servisinin çalıştığından emin olun
- DATABASE_URL'in doğru olduğunu kontrol edin
- Firewall ayarlarını kontrol edin

### Google OAuth Hatası
- Client ID ve Secret'in doğru olduğunu kontrol edin
- Redirect URI'nin doğru olduğunu kontrol edin
- Google Cloud Console'da OAuth consent screen'i yapılandırın

### Migration Hatası
- Veritabanının boş olduğundan emin olun
- Prisma schema'sının geçerli olduğunu kontrol edin
- `npx prisma format` komutunu çalıştırın

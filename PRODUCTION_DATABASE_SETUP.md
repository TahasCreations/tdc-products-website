# 🗄️ PRODUCTION DATABASE KURULUM REHBERİ

## 📊 MEVCUT DURUM

**Development:**
```
Database: SQLite
Location: ./prisma/dev.db (lokal dosya)
⚠️ Bu sadece test için - Production'da KULLANILMAZ!
```

---

## 🚀 PRODUCTION ÇÖZÜMLER

### **SEÇENEK 1: VERCEL + POSTGRES (ÖNERİLEN) ⭐**

Vercel'in kendi yönetimli PostgreSQL servisi (Vercel Postgres)

**Avantajları:**
- ✅ Vercel ile tam entegre
- ✅ Otomatik yedekleme
- ✅ Kolay setup (3 dakika)
- ✅ İlk 256 MB ücretsiz
- ✅ Serverless ölçekleme

**Fiyatlandırma:**
```
FREE:     256 MB storage, 60 saat compute/ay
HOBBY:    $5/ay - 512 MB, 100 saat
PRO:      $20/ay - 10 GB, sınırsız compute
```

**Kurulum Adımları:**

#### **1. Vercel Dashboard'a Gidin**
```
https://vercel.com/dashboard
→ Projenizi seçin
→ "Storage" tab'ına gidin
→ "Create Database"
→ "Postgres" seçin
```

#### **2. Database Oluşturun**
```
1. Database adı: tdc-products-db
2. Region: eu-central-1 (Frankfurt - Türkiye'ye en yakın)
3. "Create" tıklayın
```

#### **3. Environment Variables Otomatik Eklenir**
```
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
```

#### **4. Prisma Schema Güncelleyin**

`prisma/schema.prisma` dosyasını güncelleyin:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

#### **5. Migration Uygulayın**
```bash
# Lokal olarak test (opsiyonel)
npx prisma migrate dev

# Vercel'de otomatik çalışacak
# Her deploy'da Prisma migrate otomatik uygulanır
```

---

### **SEÇENEK 2: SUPABASE (ÜCRETSİZ + GÜÇLÜ) 🔥**

PostgreSQL + gerçek zamanlı özellikler + Storage + Auth

**Avantajları:**
- ✅ Tamamen ücretsiz başlangıç (500 MB)
- ✅ Otomatik yedekleme
- ✅ Realtime database
- ✅ File storage dahil
- ✅ Authentication dahil
- ✅ REST API otomatik

**Fiyatlandırma:**
```
FREE:  500 MB database, 1 GB file storage, 50k MAU
PRO:   $25/ay - 8 GB database, 100 GB storage
```

**Kurulum Adımları:**

#### **1. Supabase Hesabı Oluşturun**
```
https://supabase.com
→ "Start your project"
→ GitHub ile giriş yapın
```

#### **2. Yeni Proje Oluşturun**
```
1. Organization: Kişisel/Şirket
2. Proje adı: tdc-products
3. Database şifresi: Güçlü bir şifre (kaydedin!)
4. Region: eu-central-1 (Frankfurt)
5. "Create new project"
```

#### **3. Connection String Alın**
```
Project Dashboard → Settings → Database

Connection string:
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

#### **4. Vercel'de Environment Variable Ekleyin**
```
Vercel Dashboard → Your Project → Settings → Environment Variables

DATABASE_URL = postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

#### **5. Prisma Schema Güncelleyin**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### **6. Migration Uygulayın**
```bash
npx prisma migrate deploy
```

---

### **SEÇENEK 3: PLANETSCALE (MySQL + ÖLÇEKLENME)**

Serverless MySQL - GitHub için optimize edilmiş

**Avantajları:**
- ✅ Otomatik ölçekleme
- ✅ Ücretsiz 5 GB
- ✅ Branching (Git gibi database)
- ✅ Otomatik backup

**Fiyatlandırma:**
```
HOBBY: Ücretsiz - 5 GB, 1 milyar row reads/ay
SCALER: $29/ay - 10 GB, 10 milyar row reads
```

**Kurulum:**
```
https://planetscale.com
→ Create database
→ Connection string alın
→ DATABASE_URL olarak ekleyin
```

---

## 🔧 ADIM ADIM KURULUM (VERCEL POSTGRES - ÖNERİLEN)

### **1. Prisma Schema'yı Güncelleyin**

`prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

### **2. Package.json'a Build Script Ekleyin**

`package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### **3. Vercel'de Database Oluşturun**

1. Vercel Dashboard → Storage → Create Database → Postgres
2. Environment variables otomatik eklenir
3. Redeploy tetikleyin

### **4. Migration Otomatik Uygulanır**

Her deploy'da:
```
✅ Prisma Client generate edilir
✅ Migrations apply edilir
✅ Next.js build edilir
```

---

## 📁 VERİ DEPOLAMA YAPISI

### **User Tablosu**
```sql
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT,
  "email" TEXT UNIQUE,
  "password" TEXT,  -- bcrypt hash
  "phone" TEXT,
  "role" TEXT DEFAULT 'BUYER',
  "roles" TEXT,     -- JSON: ["BUYER","SELLER"]
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP
);
```

### **SellerProfile Tablosu**
```sql
CREATE TABLE "SellerProfile" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT UNIQUE REFERENCES "User"("id"),
  "storeName" TEXT,
  "storeSlug" TEXT UNIQUE,
  "description" TEXT,
  "logoUrl" TEXT,
  "rating" REAL DEFAULT 0,
  "totalSales" INTEGER DEFAULT 0
);
```

### **Product Tablosu**
```sql
CREATE TABLE "Product" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "price" REAL NOT NULL,
  "stock" INTEGER DEFAULT 0,
  "sellerId" TEXT REFERENCES "SellerProfile"("id"),
  "images" TEXT,  -- JSON array
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

### **Order Tablosu**
```sql
CREATE TABLE "Order" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES "User"("id"),
  "totalAmount" REAL,
  "status" TEXT DEFAULT 'PENDING',
  "createdAt" TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 GÜVENLİK ÖNERİLERİ

### **1. Environment Variables**
```bash
# .env (LOKALde)
DATABASE_URL="postgresql://..."
POSTGRES_PRISMA_URL="..."
NEXTAUTH_SECRET="..." # openssl rand -base64 32

# Vercel'de
Settings → Environment Variables
- Production
- Preview
- Development
```

### **2. Prisma Migrations**
```bash
# Development
npx prisma migrate dev --name add_feature

# Production (otomatik)
npx prisma migrate deploy
```

### **3. Backup Stratejisi**
```
Vercel Postgres: Otomatik günlük backup
Supabase: Otomatik günlük backup
PlanetScale: Otomatik backup + branching
```

---

## 📊 VERİ ÖRNEKLER

### **Kullanıcı Kaydı:**
```
POST /api/auth/register
{
  "name": "Ahmet Yılmaz",
  "email": "ahmet@example.com",
  "password": "securepass123",
  "phone": "5551234567"
}

→ Database'e yazılır:
User {
  id: "clx123abc...",
  name: "Ahmet Yılmaz",
  email: "ahmet@example.com",
  password: "$2b$12$hashedpassword...",
  phone: "5551234567",
  role: "BUYER",
  roles: '["BUYER"]'
}
```

### **Satıcı Profili:**
```
POST /api/partners/seller/apply
{
  "storeName": "Ahmet'in Mağazası",
  "taxNumber": "1234567890",
  "iban": "TR..."
}

→ Database'e yazılır:
SellerProfile {
  id: "clx456def...",
  userId: "clx123abc...",
  storeName: "Ahmet'in Mağazası",
  storeSlug: "ahmetin-magazasi",
  status: "pending"
}
```

### **Ürün Ekleme:**
```
POST /api/products
{
  "title": "Özel Figür",
  "price": 299.90,
  "stock": 10
}

→ Database'e yazılır:
Product {
  id: "clx789ghi...",
  title: "Özel Figür",
  price: 299.90,
  stock: 10,
  sellerId: "clx456def...",
  createdAt: "2025-01-01T12:00:00Z"
}
```

---

## ✅ ÖNERİLEN SETUP (HIZLI BAŞLANGIÇ)

### **BU ADIMI İZLEYİN:**

1. **Vercel Dashboard → Storage → Create Postgres**
2. **Database oluşturun (2 dakika)**
3. **Environment variables otomatik eklenir**
4. **`prisma/schema.prisma` güncelleyin:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_PRISMA_URL")
     directUrl = env("POSTGRES_URL_NON_POOLING")
   }
   ```
5. **Git push → Vercel otomatik deploy eder**
6. **Migration otomatik uygulanır**
7. **✅ Canlı!**

---

## 🎯 SONUÇ

**Development:**
- ✅ SQLite (./dev.db) - Lokal test

**Production:**
- ✅ PostgreSQL (Vercel/Supabase) - Canlı sistem
- ✅ Tüm veriler güvenli şekilde saklanır
- ✅ Otomatik backup
- ✅ Ölçeklenebilir

**Verileriniz:**
- ✅ Kullanıcı bilgileri → `User` tablosu
- ✅ Satıcı profilleri → `SellerProfile` tablosu
- ✅ Ürünler → `Product` tablosu
- ✅ Siparişler → `Order` tablosu
- ✅ Her şey ilişkisel olarak bağlı

Hangi database çözümünü tercih ediyorsunuz?
1. Vercel Postgres (en kolay)
2. Supabase (en güçlü, ücretsiz)
3. PlanetScale (MySQL)


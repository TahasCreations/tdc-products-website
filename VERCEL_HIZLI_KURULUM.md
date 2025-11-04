# ⚡ VERCEL + POSTGRES HIZLI KURULUM (5 DAKİKA)

## 🎯 ÖZET

Şu anda **SQLite** kullanıyoruz (lokal dosya - sadece test için).  
Production'da **PostgreSQL** kullanmalıyız (bulut database).

---

## 🚀 ADIM ADIM KURULUM

### **1. VERCEL'DE DATABASE OLUŞTURUN (2 dakika)**

```
1. https://vercel.com/dashboard adresine gidin
2. Projenizi seçin (tdc-products-website)
3. Üst menüden "Storage" tab'ına tıklayın
4. "Create Database" butonuna tıklayın
5. "Postgres" seçin
6. Database adı: tdc-products-db
7. Region: Frankfurt (eu-central-1) - Türkiye'ye en yakın
8. "Create" tıklayın
```

**✅ Vercel otomatik olarak şunları ekler:**
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

---

### **2. ENVIRONMENT VARIABLES KONTROL (30 saniye)**

```
Vercel Dashboard → Your Project → Settings → Environment Variables

Otomatik eklenmiş olmalı:
✅ POSTGRES_URL
✅ POSTGRES_PRISMA_URL
✅ POSTGRES_URL_NON_POOLING

Eksik olanları manuel ekleyin:
+ NEXTAUTH_SECRET (openssl rand -base64 32 ile oluşturun)
+ NEXTAUTH_URL (https://www.tdcproductsonline.com)
+ GOOGLE_CLIENT_ID
+ GOOGLE_CLIENT_SECRET
```

---

### **3. PRISMA SCHEMA GÜNCELLENDİ ✅**

`prisma/schema.prisma` dosyası zaten güncellendi:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Not:** Vercel otomatik olarak `DATABASE_URL` kullanacak.

---

### **4. BUILD SCRIPT GÜNCELLENDİ ✅**

`package.json` dosyası zaten güncellendi:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

Her deploy'da:
1. Prisma Client generate edilir
2. Database migrations uygulanır
3. Next.js build edilir

---

### **5. GIT PUSH & DEPLOY (1 dakika)**

```bash
git add .
git commit -m "feat: Add PostgreSQL support for production"
git push origin main
```

**Vercel otomatik deploy eder:**
```
✅ Prisma Client generate
✅ Database migration apply
✅ Next.js build
✅ Deploy complete!
```

---

### **6. DATABASE TABLOSU OLUŞTURULDU ✅**

Migration deploy edilince otomatik olarak şu tablolar oluşur:

```
✅ User (kullanıcılar)
✅ SellerProfile (satıcı profilleri)
✅ InfluencerProfile (influencer profilleri)
✅ Product (ürünler)
✅ Order (siparişler)
✅ Review (yorumlar)
✅ Address (adresler)
✅ ChatMessage (destek mesajları)
✅ 50+ tablo daha...
```

---

## 📊 VERİ DEPOLAMA YAPISI

### **Kullanıcı Kaydı:**
```
Kullanıcı /kayit sayfasından kayıt olur
    ↓
POST /api/auth/register
    ↓
PostgreSQL → User tablosuna yazılır
    ↓
{
  id: "clx123...",
  name: "Ahmet Yılmaz",
  email: "ahmet@example.com",
  password: "$2b$12$hashed...",
  roles: '["BUYER"]'
}
```

### **Satıcı Başvurusu:**
```
Kullanıcı /partner/satici-ol'a gider
    ↓
POST /api/partners/seller/apply
    ↓
PostgreSQL → SellerProfile tablosuna yazılır
    ↓
{
  id: "clx456...",
  userId: "clx123...",
  storeName: "Ahmet'in Mağazası",
  storeSlug: "ahmetin-magazasi",
  status: "pending"
}
```

### **Ürün Ekleme:**
```
Satıcı dashboard'dan ürün ekler
    ↓
POST /api/products
    ↓
PostgreSQL → Product tablosuna yazılır
    ↓
{
  id: "clx789...",
  title: "Özel Figür",
  price: 299.90,
  sellerId: "clx456...",
  images: ["url1", "url2"]
}
```

---

## 🔐 VERİ GÜVENLİĞİ

### **Otomatik Backup:**
```
✅ Vercel Postgres: Günlük otomatik backup
✅ Point-in-time recovery (son 7 gün)
✅ Encryption at rest
✅ SSL/TLS connection
```

### **Scalability:**
```
✅ Serverless connection pooling
✅ Otomatik scaling
✅ 1000+ concurrent connections
```

---

## ✅ KONTROL LİSTESİ

Deploy'dan sonra kontrol edin:

**1. Vercel Dashboard:**
```
✅ Storage → Postgres → tdc-products-db ACTIVE
✅ Deployments → Son deploy SUCCESS
✅ Environment Variables → 3+ postgres değişkeni
```

**2. Canlı Site:**
```
https://www.tdcproductsonline.com/kayit
→ Kayıt ol
→ Giriş yap
→ Profil sayfası açılıyor mu?
```

**3. Database Kontrol:**
```
Vercel Dashboard → Storage → Query
SELECT COUNT(*) FROM "User";
→ Kayıtlı kullanıcı sayısı
```

---

## 🎯 SONUÇ

**ÖNCE (Development):**
```
❌ SQLite (./dev.db - lokal dosya)
❌ Sadece kendi bilgisayarınızda çalışır
❌ Production'a taşınamaz
```

**ŞIMDI (Production):**
```
✅ PostgreSQL (Vercel Postgres - bulut)
✅ Tüm kullanıcı verileri güvenli
✅ Otomatik backup
✅ Sınırsız ölçekleme
✅ Her deploy'da otomatik migration
```

**Tüm Veriler Artık Depolanıyor:**
- ✅ Kullanıcı kayıtları
- ✅ Satıcı profilleri
- ✅ Ürünler
- ✅ Siparişler
- ✅ Yorumlar
- ✅ Her şey!

---

## 📞 DESTEK

**Sorun mu var?**

1. Vercel Dashboard → Logs kontrol edin
2. `npx prisma studio` ile local database kontrol edin
3. Migration hatası: `npx prisma migrate reset` (development'ta)

**Database görmek için:**
```
Vercel Dashboard → Storage → Query Tab
→ SQL sorguları çalıştırabilirsiniz
```

Kurulum tamamlandı! 🎉


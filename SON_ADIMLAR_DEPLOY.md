# 🚀 SON ADIMLAR - DEPLOY & TEST

## ✅ DATABASE_URL EKLENDİ!

Artık başka bir şey eklemenize gerek YOK!

---

## 🎯 ŞİMDİ SADECE DEPLOY EDİN!

### **ADIM 1: Git Push (2 dakika)**

```bash
git add .
git commit -m "feat: Google Cloud SQL PostgreSQL ready"
git push origin main
```

**Vercel otomatik yapacak:**
```
1. ✅ npm install
2. ✅ prisma generate (Prisma Client oluştur)
3. ✅ prisma migrate deploy (TABLOLARI OLUŞTUR!)
   ├─ User tablosu
   ├─ SellerProfile tablosu
   ├─ Product tablosu
   ├─ Order tablosu
   └─ 50+ tablo daha
4. ✅ next build
5. ✅ Deploy complete!
```

**Toplam süre:** 3-5 dakika

---

## 🔍 DEPLOY TAKİP ETME

### **Vercel Dashboard:**
```
https://vercel.com/dashboard

1. Projenize tıklayın
2. "Deployments" tab
3. En üstteki deployment → "Building..."
4. "View Build Logs" tıklayın
```

### **Loglarda Arayın:**

**Migration başarılı mı?**
```
Arama: "prisma migrate deploy"

Görmek istediğiniz:
✅ "The following migration(s) have been applied:"
✅ "init_google_cloud_sql"
✅ "add_password_phone"
✅ "Database is now in sync with your schema"
```

**Build başarılı mı?**
```
Arama: "Generating static pages"

Görmek istediğiniz:
✅ "Generating static pages (235/235)"
✅ "Finalizing page optimization ✓"
✅ "Build Completed"
```

---

## ✅ TEST (Deploy Tamamlandıktan Sonra)

### **TEST 1: Health Check**
```bash
curl https://www.tdcproductsonline.com/api/health/db
```

**Beklenen response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-03T...",
  "database": {
    "provider": "Google Cloud SQL PostgreSQL",
    "host": "34.89.254.41",
    "database": "tdc_products",
    "ssl": "require"
  },
  "message": "Database connected"
}
```

✅ `"status": "healthy"` görüyorsanız → **DATABASE BAĞLANDI!**

---

### **TEST 2: Kullanıcı Kaydı**

```
1. https://www.tdcproductsonline.com/kayit sayfasına gidin

2. Formu doldurun:
   Ad Soyad: Test Kullanıcı
   Email: test@example.com
   Telefon: 5551234567
   Şifre: test123456
   Şifre Tekrar: test123456
   ☑️ Kullanım şartları

3. reCAPTCHA'yı tamamlayın

4. "Hesap Oluştur" tıklayın

5. ✅ Başarılı olursa:
   - Otomatik giriş yapılır
   - Anasayfaya yönlendirilir
   - Kullanıcı Google Cloud SQL'e kaydedilir!
```

---

### **TEST 3: Google Cloud SQL'de Kontrol**

```
1. Google Cloud Console → SQL → tdc-products-db

2. "QUERY" tab'ına tıklayın

3. Query yazın:
SELECT * FROM "User" ORDER BY "createdAt" DESC LIMIT 5;

4. "RUN" tıklayın

5. ✅ Kaydettiğiniz kullanıcıyı göreceksiniz!
   - test@example.com
   - Test Kullanıcı
   - roles: ["BUYER"]
   - password: $2b$12$... (hash)
```

---

## 📦 SATICI ÜRÜN YÜKLEME TESTİ

### **TEST 4: Satıcı Başvurusu**

```
1. https://www.tdcproductsonline.com/partner/satici-ol

2. Başvuru formunu doldurun:
   Mağaza Adı: Test Mağazası
   Vergi No: 1234567890
   IBAN: TR123456789...
   vb.

3. "Başvuru Yap" tıklayın

4. ✅ Başarılı olursa:
   - SellerProfile tablosuna yazılır
   - Status: "pending"
   - Admin panelinde görünür
```

**Google Cloud SQL'de kontrol:**
```sql
SELECT * FROM "SellerProfile" WHERE "userId" = '[USER-ID]';

Göreceksiniz:
- storeName: "Test Mağazası"
- storeSlug: "test-magazasi"
- status: "pending"
- taxNumber: "1234567890"
```

---

### **TEST 5: Admin Onayı (Satıcı Aktif Etme)**

```
1. https://www.tdcproductsonline.com/admin (admin girişi)

2. Ortaklar → Satıcı Başvuruları

3. Test Mağazası → "Onayla"

4. ✅ Başarılı olursa:
   - SellerProfile.status: "pending" → "approved"
   - User.roles: ["BUYER", "SELLER"]
```

---

### **TEST 6: Ürün Ekleme**

```
1. https://www.tdcproductsonline.com/partner/seller/dashboard
   (Satıcı olarak giriş)

2. "Ürünlerim" → "Yeni Ürün Ekle"

3. Ürün bilgilerini girin:
   Başlık: Test Ürünü
   Fiyat: 99.90
   Stok: 10
   Kategori: Figürler
   Resim: Upload edin

4. "Kaydet" tıklayın

5. ✅ Başarılı olursa:
   - Product tablosuna yazılır
   - sellerId bağlanır
   - Anasayfada görünür!
```

**Google Cloud SQL'de kontrol:**
```sql
SELECT * FROM "Product" WHERE "sellerId" = '[SELLER-ID]';

Göreceksiniz:
- title: "Test Ürünü"
- price: 99.90
- stock: 10
- sellerId: [SELLER-PROFILE-ID]
- createdAt: 2025-11-03...
```

---

## 📊 VERİ AKIŞI (OTOMATIK)

### **Kullanıcı kayıt olur:**
```
/kayit formu
    ↓
POST /api/auth/register
    ↓
Prisma ORM
    ↓
Google Cloud SQL → User tablosu
    ↓
✅ KAYDEDİLDİ! (otomatik)
```

### **Satıcı ürün ekler:**
```
/partner/seller/dashboard → "Yeni Ürün"
    ↓
POST /api/products
    ↓
Prisma ORM
    ↓
Google Cloud SQL → Product tablosu
    ↓
✅ KAYDEDİLDİ! (otomatik)
```

### **Müşteri sipariş verir:**
```
Sepete ekle → Ödeme yap
    ↓
POST /api/orders
    ↓
Prisma ORM
    ↓
Google Cloud SQL → Order tablosu
    ↓
✅ KAYDEDİLDİ! (otomatik)
```

**HİÇBİR EKSTRA AYAR GEREKMİYOR!**

Kod zaten hazır:
- ✅ `prisma.user.create()` → User tablosuna yazar
- ✅ `prisma.product.create()` → Product tablosuna yazar
- ✅ `prisma.order.create()` → Order tablosuna yazar

---

## 🔧 SİSTEM NASIL ÇALIŞIYOR?

### **Prisma ORM (Zaten Hazır):**

**Kullanıcı kaydı kodu (app/api/auth/register/route.ts):**
```typescript
const user = await prisma.user.create({
  data: {
    name: "Ahmet",
    email: "ahmet@example.com",
    password: "$2b$12$...", // hash
    phone: "5551234567",
    roles: '["BUYER"]'
  }
});

// Prisma otomatik yapar:
// 1. DATABASE_URL'i okur
// 2. Google Cloud SQL'e bağlanır
// 3. INSERT INTO "User" VALUES (...) çalıştırır
// 4. Kaydedilir!
```

**Ürün ekleme kodu (zaten var):**
```typescript
const product = await prisma.product.create({
  data: {
    title: "Özel Figür",
    price: 299.90,
    stock: 10,
    sellerId: "seller-id..."
  }
});

// Prisma otomatik:
// Google Cloud SQL → Product tablosuna yazar
```

**SİZ HİÇBİR KOD YAZMADINIZ!**  
Tüm API route'lar zaten Prisma kullanıyor!

---

## 🎉 DEPLOY SONRASI OLAN BİTEN

### **Vercel Deploy Eder:**
```
1. prisma generate
   → Prisma Client oluşturulur

2. prisma migrate deploy
   → Google Cloud SQL'e bağlanır
   → Tabloları oluşturur:
     CREATE TABLE "User" (...)
     CREATE TABLE "SellerProfile" (...)
     CREATE TABLE "Product" (...)
     ... 50+ tablo

3. next build
   → 235 sayfa build edilir

4. Deploy complete!
   → Site canlı!
```

### **Artık Her Şey Otomatik:**
```
✅ Kullanıcı kayıt olur → Google Cloud SQL'e yazılır
✅ Satıcı başvuru yapar → Google Cloud SQL'e yazılır
✅ Ürün ekler → Google Cloud SQL'e yazılır
✅ Sipariş gelir → Google Cloud SQL'e yazılır
✅ Yorum yapılır → Google Cloud SQL'e yazılır
✅ Her veri → Google Cloud SQL'e yazılır!
```

**HİÇBİR EKSTRA AYAR GEREKMİYOR!**

---

## ✅ KONTROL LİSTESİ

Deploy sonrası kontrol edin:

**1. Vercel Deployment:**
- [ ] Latest deployment "Ready" durumda mı?
- [ ] Build logs'da "prisma migrate deploy" başarılı mı?
- [ ] "Database is now in sync" mesajı var mı?

**2. Database Health:**
- [ ] https://www.tdcproductsonline.com/api/health/db → 200 OK?
- [ ] Response'da "status": "healthy" var mı?

**3. Google Cloud SQL:**
- [ ] Instance "Running" durumda mı?
- [ ] Connections → "Active connections" > 0 mı?

**4. Fonksiyon Testi:**
- [ ] Kullanıcı kaydı çalışıyor mu? (/kayit)
- [ ] Giriş yapabiliyorsunuz mu? (/giris)
- [ ] Profile sayfası açılıyor mu? (/profile)

**HEPSİ ✅ İSE: SİSTEM TAMAMEN ÇALIŞIYOR!**

---

## 🎯 ÖZET

### **YAPMANıZ GEREKEN:**
```bash
git push origin main
```

**Hepsi bu! 🎉**

---

### **YAPMAYA GEREK YOK:**
- ❌ Başka environment variable eklemeye
- ❌ Database tablosu oluşturmaya
- ❌ Migration çalıştırmaya
- ❌ Kod değiştirmeye
- ❌ Hiçbir şeye!

**Çünkü:**
- ✅ Tüm API route'lar zaten Prisma kullanıyor
- ✅ Prisma otomatik Google Cloud SQL'e yazıyor
- ✅ Vercel otomatik migration'ları uyguluyor
- ✅ Sistem tamamen hazır!

---

## 🚀 DEPLOY VE TEST

```bash
# 1. Push edin
git push origin main

# 2. Deploy'u bekleyin (3-5 dakika)
# Vercel Dashboard → Building... → Ready

# 3. Test edin
curl https://www.tdcproductsonline.com/api/health/db

# 4. Kayıt olun
https://www.tdcproductsonline.com/kayit

# 5. ✅ ÇALIŞIYOR!
```

Başka soru var mı? Yoksa deploy edelim! 🎯


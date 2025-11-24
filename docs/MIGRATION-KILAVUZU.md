# 🔄 Migration Kılavuzu - Çok Satıcılı Sistem İyileştirmeleri

**Tarih:** 2025-01-XX  
**Migration Adı:** `add_multi_vendor_complete`

---

## 📋 MIGRATION İÇERİĞİ

Bu migration şunları ekler:

1. **ReturnRequest.sellerId** - İade taleplerini satıcıya bağlar
2. **Coupon.sellerId** - Kuponları satıcıya bağlar (nullable - platform kuponları için)
3. **SupportTicket.sellerId** - Destek taleplerini satıcıya bağlar
4. **SellerOrder** - Yeni model (sub-order sistemi)

---

## 🚀 MIGRATION ÇALIŞTIRMA

### Yöntem 1: Prisma Migrate (Önerilen)

```bash
# Veritabanı bağlantısı kontrol edin
npx prisma migrate dev --name add_multi_vendor_complete
```

### Yöntem 2: Manuel SQL Çalıştırma

Eğer Prisma migrate çalışmıyorsa, SQL dosyasını manuel çalıştırabilirsiniz:

```bash
# PostgreSQL'e bağlanın
psql -h 34.230.67.57 -U tdc_admin -d tdc_products

# Migration SQL'ini çalıştırın
\i prisma/migrations/20250101000000_add_multi_vendor_complete/migration.sql
```

### Yöntem 3: Vercel/Production

Production ortamında:

1. Vercel Dashboard'a gidin
2. Environment Variables'da `DATABASE_URL` kontrol edin
3. Vercel CLI ile migration çalıştırın:
```bash
vercel env pull
npx prisma migrate deploy
```

---

## ✅ MIGRATION SONRASI KONTROLLER

### 1. Schema Kontrolü
```bash
npx prisma db pull
npx prisma generate
```

### 2. Veritabanı Kontrolü
```sql
-- SellerOrder tablosu var mı?
SELECT * FROM "SellerOrder" LIMIT 1;

-- Index'ler oluşturuldu mu?
SELECT indexname FROM pg_indexes WHERE tablename = 'SellerOrder';

-- Foreign key'ler var mı?
SELECT conname, conrelid::regclass, confrelid::regclass 
FROM pg_constraint 
WHERE conname LIKE '%sellerId%';
```

### 3. API Testleri
```bash
# İade talepleri API
curl http://localhost:3000/api/seller/returns

# Kuponlar API
curl http://localhost:3000/api/seller/coupons

# Destek talepleri API
curl http://localhost:3000/api/seller/support-tickets

# Sub-orders API
curl http://localhost:3000/api/seller/orders
```

---

## ⚠️ ÖNEMLİ NOTLAR

1. **Veri Kaybı:** Bu migration mevcut verileri etkilemez, sadece yeni kolonlar ve tablo ekler.

2. **Nullable Fields:** 
   - `ReturnRequest.sellerId` - nullable (eski kayıtlar için)
   - `Coupon.sellerId` - nullable (platform kuponları için)
   - `SupportTicket.sellerId` - nullable (genel destek talepleri için)

3. **Backward Compatibility:** Eski kayıtlar `sellerId = null` olacak, bu normaldir.

4. **Index'ler:** Tüm yeni kolonlar için index'ler oluşturuldu, performans için önemli.

---

## 🔄 ROLLBACK (Geri Alma)

Eğer migration'ı geri almak isterseniz:

```sql
-- SellerOrder tablosunu sil
DROP TABLE IF EXISTS "SellerOrder";

-- Kolonları kaldır
ALTER TABLE "SupportTicket" DROP COLUMN IF EXISTS "sellerId";
ALTER TABLE "Coupon" DROP COLUMN IF EXISTS "sellerId";
ALTER TABLE "ReturnRequest" DROP COLUMN IF EXISTS "sellerId";

-- Index'leri kaldır
DROP INDEX IF EXISTS "SupportTicket_sellerId_idx";
DROP INDEX IF EXISTS "Coupon_sellerId_idx";
DROP INDEX IF EXISTS "ReturnRequest_sellerId_idx";
```

---

## 📊 MIGRATION DOSYASI

**Dosya:** `prisma/migrations/20250101000000_add_multi_vendor_complete/migration.sql`

Migration dosyası hazır ve production'a deploy edilmeye hazır.

---

**Son Güncelleme:** 2025-01-XX


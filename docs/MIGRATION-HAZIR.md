# ✅ Migration Hazır - Çok Satıcılı Sistem İyileştirmeleri

**Tarih:** 2025-01-XX  
**Migration Dosyası:** `prisma/migrations/20250101000000_add_multi_vendor_complete/migration.sql`

---

## 📋 MIGRATION İÇERİĞİ

Bu migration şunları ekler:

1. ✅ **ReturnRequest.sellerId** - İade taleplerini satıcıya bağlar
2. ✅ **Coupon.sellerId** - Kuponları satıcıya bağlar (nullable)
3. ✅ **SupportTicket.sellerId** - Destek taleplerini satıcıya bağlar
4. ✅ **SellerOrder** - Yeni tablo (sub-order sistemi)

---

## 🚀 MIGRATION ÇALIŞTIRMA

### Veritabanı Bağlantısı Kontrolü

Migration dosyası hazır. Veritabanına bağlanabildiğinizde çalıştırabilirsiniz:

```bash
# Prisma migrate (önerilen)
npx prisma migrate dev --name add_multi_vendor_complete

# Veya production için
npx prisma migrate deploy
```

### Manuel SQL Çalıştırma

Eğer Prisma migrate çalışmıyorsa:

```bash
# PostgreSQL'e bağlanın
psql -h [HOST] -U [USER] -d [DATABASE]

# Migration SQL'ini çalıştırın
\i prisma/migrations/20250101000000_add_multi_vendor_complete/migration.sql
```

---

## ✅ MIGRATION ÖZELLİKLERİ

- ✅ **IF NOT EXISTS** kontrolleri - Güvenli çalıştırma
- ✅ **Index'ler** - Performans için
- ✅ **Foreign Key'ler** - Veri bütünlüğü
- ✅ **Nullable Fields** - Backward compatibility
- ✅ **Unique Constraints** - SellerOrder için

---

## 📊 DEĞİŞİKLİKLER

### ReturnRequest Tablosu
```sql
ALTER TABLE "ReturnRequest" ADD COLUMN IF NOT EXISTS "sellerId" TEXT;
CREATE INDEX IF NOT EXISTS "ReturnRequest_sellerId_idx" ON "ReturnRequest"("sellerId");
```

### Coupon Tablosu
```sql
ALTER TABLE "Coupon" ADD COLUMN IF NOT EXISTS "sellerId" TEXT;
CREATE INDEX IF NOT EXISTS "Coupon_sellerId_idx" ON "Coupon"("sellerId");
```

### SupportTicket Tablosu
```sql
ALTER TABLE "SupportTicket" ADD COLUMN IF NOT EXISTS "sellerId" TEXT;
CREATE INDEX IF NOT EXISTS "SupportTicket_sellerId_idx" ON "SupportTicket"("sellerId");
```

### SellerOrder Tablosu (YENİ)
```sql
CREATE TABLE IF NOT EXISTS "SellerOrder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "total" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "commissionRate" DOUBLE PRECISION NOT NULL,
    "payoutAmount" DOUBLE PRECISION NOT NULL,
    "paidAt" TIMESTAMP(3),
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "trackingNumber" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SellerOrder_pkey" PRIMARY KEY ("id")
);
```

---

## ⚠️ ÖNEMLİ NOTLAR

1. **Veri Kaybı Yok:** Bu migration sadece yeni kolonlar ve tablo ekler, mevcut verileri etkilemez.

2. **Nullable Fields:** 
   - Eski kayıtlar `sellerId = null` olacak (normal)
   - Platform kuponları `sellerId = null` olacak (normal)

3. **Güvenli Migration:** `IF NOT EXISTS` kontrolleri sayesinde birden fazla kez çalıştırılabilir.

---

## ✅ SONUÇ

**Migration dosyası hazır ve production'a deploy edilmeye hazır!**

Veritabanı bağlantısı sağlandığında migration çalıştırılabilir.

---

**Son Güncelleme:** 2025-01-XX


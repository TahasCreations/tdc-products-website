-- TDC Products - Smart Rewards Update
-- Kullanıcı dostu ve işletme dostu ödüller

-- Önce eski ödülleri temizle
DELETE FROM "Reward";

-- Yeni akıllı ödüller ekle
INSERT INTO "Reward" ("id", "type", "title", "description", "pointsCost", "value", "discountPercent", "stock", "isActive", "imageUrl") VALUES

-- KÜÇÜK ÖDÜLLER (Kolay erişilebilir)
(gen_random_uuid()::text, 'FREE_SHIPPING', 'Ücretsiz Kargo', 'Bir sonraki siparişinizde ücretsiz kargo (Min. 100 TL)', 300, 0, 0, -1, true, null),

(gen_random_uuid()::text, 'GIFT', 'Sürpriz Hediye Ürün', 'Siparişinize sürpriz aksesuar hediye (Min. 150 TL)', 500, 0, 0, -1, true, null),

(gen_random_uuid()::text, 'CASHBACK', '5 TL İndirim', '5 TL değerinde alışveriş indirimi (Min. 100 TL)', 500, 5, 0, -1, true, null),

-- ORTA SEVİYE ÖDÜLLER (Motivasyon artırıcı)
(gen_random_uuid()::text, 'CASHBACK', '10 TL İndirim', '10 TL değerinde alışveriş indirimi (Min. 150 TL)', 1000, 10, 0, -1, true, null),

(gen_random_uuid()::text, 'CASHBACK', '15 TL İndirim', '15 TL değerinde alışveriş indirimi (Min. 200 TL)', 1500, 15, 0, -1, true, null),

(gen_random_uuid()::text, 'GIFT', 'Özel Figür Hediye', 'Küçük boy özel figür hediye (Min. 250 TL)', 1800, 0, 0, 100, true, null),

(gen_random_uuid()::text, 'VOUCHER', 'Öncelikli Destek', '7 gün boyunca öncelikli müşteri desteği', 1200, 0, 0, -1, true, null),

-- BÜYÜK ÖDÜLLER (Sadakat ödülleri)
(gen_random_uuid()::text, 'CASHBACK', '25 TL İndirim', '25 TL değerinde alışveriş indirimi (Min. 300 TL)', 2500, 25, 0, -1, true, null),

(gen_random_uuid()::text, 'CASHBACK', '50 TL İndirim', '50 TL değerinde alışveriş indirimi (Min. 500 TL)', 5000, 50, 0, -1, true, null),

(gen_random_uuid()::text, 'GIFT', 'Premium Figür Hediye', 'Orta boy premium figür hediye (Min. 500 TL)', 4500, 0, 0, 50, true, null),

-- ÖZEL ÖDÜLLER (Sadakat ve VIP)
(gen_random_uuid()::text, 'VOUCHER', 'VIP Müşteri Statüsü', '30 gün VIP müşteri (özel indirimler, erken erişim)', 3000, 0, 0, -1, true, null),

(gen_random_uuid()::text, 'VOUCHER', 'Doğum Günü Hediyesi', 'Doğum gününüzde özel hediye ve indirim', 2000, 0, 0, -1, true, null),

(gen_random_uuid()::text, 'CASHBACK', '100 TL İndirim', '100 TL değerinde alışveriş indirimi (Min. 1000 TL)', 10000, 100, 0, -1, true, null),

(gen_random_uuid()::text, 'GIFT', 'Özel Koleksiyon Figürü', 'Büyük boy koleksiyon figürü hediye (Min. 750 TL)', 8000, 0, 0, 20, true, null),

-- SÜRPRİZ ÖDÜLLER (Engagement artırıcı)
(gen_random_uuid()::text, 'VOUCHER', 'Çarkı Çevir Hakkı', 'Şans çarkını 3 kez çevirme hakkı', 800, 0, 0, -1, true, null),

(gen_random_uuid()::text, 'VOUCHER', 'Referans Bonusu 2x', '7 gün boyunca referans puanlarınız 2 katına çıkar', 1500, 0, 0, -1, true, null),

(gen_random_uuid()::text, 'GIFT', '3D Baskı Kredisi', '50 TL değerinde 3D baskı kredisi', 3500, 0, 0, -1, true, null),

-- SEZONSel ÖDÜLLER (Özel günler için)
(gen_random_uuid()::text, 'GIFT', 'Özel Gün Paketi', 'Özel günler için hediye paketi (bayram, yılbaşı vb.)', 2500, 0, 0, 200, true, null),

(gen_random_uuid()::text, 'VOUCHER', 'Erken Erişim', 'Yeni ürünlere 24 saat erken erişim', 1000, 0, 0, -1, true, null),

(gen_random_uuid()::text, 'CASHBACK', 'Süper Ödül 200 TL', '200 TL değerinde mega indirim (Min. 2000 TL)', 20000, 200, 0, -1, true, null);

-- Ayarları güncelle (daha dengeli)
UPDATE "PointSettings" 
SET "value" = '150' 
WHERE "key" = 'POINTS_TO_TL_RATE';  -- 150 puan = 1 TL (daha dengeli)

UPDATE "PointSettings" 
SET "value" = '1500' 
WHERE "key" = 'MIN_WITHDRAWAL_POINTS';  -- Min. 1500 puan (10 TL)

UPDATE "PointSettings" 
SET "value" = '2000' 
WHERE "key" = 'MAX_WITHDRAWAL_AMOUNT';  -- Max. 2000 TL çekim

COMMIT;


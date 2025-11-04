-- TDC Products - Fix ENUMs and Missing Columns
-- Google Cloud SQL Console'da çalıştırın

-- 1. ENUM tiplerini oluştur (eğer yoksa)
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('BUYER', 'SELLER', 'INFLUENCER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "Plan" AS ENUM ('FREE', 'STARTER', 'GROWTH', 'PRO');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. User tablosundaki role sütununun tipini güncelle
-- Önce mevcut veriyi saklayalım
ALTER TABLE "User" 
ALTER COLUMN "role" TYPE VARCHAR(20);

-- Şimdi ENUM tipine çevirelim
ALTER TABLE "User" 
ALTER COLUMN "role" TYPE "Role" USING "role"::text::"Role";

-- Default değeri ayarla
ALTER TABLE "User" 
ALTER COLUMN "role" SET DEFAULT 'BUYER';

-- 3. emailPreferences sütununu ekle (eğer yoksa)
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "emailPreferences" JSONB;

-- 4. Kontrol: ENUM'ları listele
SELECT n.nspname as schema, t.typname as typename, e.enumlabel as label
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE t.typname IN ('Role', 'Plan')
ORDER BY t.typname, e.enumsortorder;

-- 5. Kontrol: User tablosunun sütunlarını listele
SELECT column_name, data_type, udt_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'User'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Test: Mevcut admin kullanıcısını kontrol et
SELECT "id", "email", "role", "emailPreferences" IS NOT NULL as has_email_prefs
FROM "User" 
WHERE "email" = 'bentahasarii@gmail.com';


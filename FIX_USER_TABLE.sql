-- TDC Products - Fix User Table (Eksik Sütunları Ekle)
-- Google Cloud SQL Console'da çalıştırın

-- User tablosuna eksik sütunları ekleyin
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "emailPreferences" JSONB;

-- Kontrol: User tablosunun sütunlarını listele
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'User'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test: Yeni kullanıcı oluştur (kayıt testı)
-- Bu satırı test için kullanabilirsiniz:
-- INSERT INTO "User" ("id", "email", "name", "role", "isActive", "createdAt", "updatedAt")
-- VALUES ('test-' || gen_random_uuid()::text, 'test@example.com', 'Test User', 'BUYER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


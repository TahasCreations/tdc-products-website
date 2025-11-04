-- TDC Products - Check if tables exist
-- Google Cloud SQL Console'da çalıştırın

-- 1. Hangi database'e bağlısınız?
SELECT current_database();

-- 2. Hangi tablolar var?
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 3. User tablosu var mı?
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'User'
) as user_table_exists;

-- 4. Eğer User tablosu varsa, kaç kullanıcı var?
-- (Bu satır hata verecek eğer tablo yoksa - bu normaldir)
SELECT COUNT(*) as user_count FROM "User";

-- 5. Admin kullanıcısı var mı?
-- (Bu satır hata verecek eğer tablo yoksa - bu normaldir)
SELECT * FROM "User" WHERE "role" = 'ADMIN';


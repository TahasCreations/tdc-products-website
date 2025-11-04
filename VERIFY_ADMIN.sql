-- TDC Products - Verify Admin User
-- Google Cloud SQL Console'da çalıştırın

-- Admin kullanıcısını kontrol et
SELECT 
    "id",
    "name",
    "email",
    "role",
    "roles",
    CASE 
        WHEN "password" IS NOT NULL THEN 'Password var (' || LENGTH("password") || ' karakter)'
        ELSE 'Password YOK'
    END as password_status,
    "isActive",
    "createdAt"
FROM "User" 
WHERE "email" = 'bentahasarii@gmail.com' OR "role" = 'ADMIN';

-- Eğer admin yoksa, oluştur (CREATE_ADMIN.sql'den)
-- Eğer admin varsa ama password yoksa, password ekle:
UPDATE "User" 
SET "password" = '$2b$12$U/ADCZNDQcHsuiAPxyZBmOhmnejzDzVCgPnZgxPJXiOk4e8dCutJC'
WHERE "email" = 'bentahasarii@gmail.com' AND ("password" IS NULL OR "password" = '');

-- Son kontrol
SELECT "id", "email", "role", "password" IS NOT NULL as has_password FROM "User" WHERE "email" = 'bentahasarii@gmail.com';


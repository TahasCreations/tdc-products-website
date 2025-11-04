-- TDC Products - KESIN ÇÖZÜM - Admin Oluştur/Güncelle
-- Cloud Shell'de çalıştırın

-- 1. Önce mevcut admin kullanıcısını silin (varsa)
DELETE FROM "User" WHERE "email" = 'bentahasarii@gmail.com';

-- 2. Yeni admin kullanıcısını oluşturun
INSERT INTO "User" (
    "id",
    "name",
    "email",
    "password",
    "role",
    "roles",
    "emailVerified",
    "isActive",
    "createdAt",
    "updatedAt"
) VALUES (
    'admin-12345',
    'Admin',
    'bentahasarii@gmail.com',
    '$2b$12$U/ADCZNDQcHsuiAPxyZBmOhmnejzDzVCgPnZgxPJXiOk4e8dCutJC',
    'ADMIN',
    '["ADMIN","BUYER"]',
    CURRENT_TIMESTAMP,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 3. Kontrol edin
SELECT "id", "email", "role", "password" IS NOT NULL as has_password, LENGTH("password") as password_length 
FROM "User" 
WHERE "email" = 'bentahasarii@gmail.com';

-- Beklenen sonuç:
--     id     |         email          | role  | has_password | password_length
-- -----------+------------------------+-------+--------------+-----------------
--  admin-... | bentahasarii@gmail.com | ADMIN | t            | 60


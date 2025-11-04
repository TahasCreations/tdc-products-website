-- TDC Products - Create Admin User
-- Google Cloud SQL Console'da çalıştırın (CREATE_TABLES.sql çalıştırıldıktan SONRA)

-- Admin kullanıcısı oluştur
-- Email: bentahasarii@gmail.com
-- Şifre: 35Sandalye (bcrypt hash ile)

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
    'admin-' || gen_random_uuid()::text,
    'Admin',
    'bentahasarii@gmail.com',
    '$2b$12$U/ADCZNDQcHsuiAPxyZBmOhmnejzDzVCgPnZgxPJXiOk4e8dCutJC',
    'ADMIN',
    '["ADMIN","BUYER"]',
    CURRENT_TIMESTAMP,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT ("email") DO NOTHING;

-- Kontrol: Admin oluşturuldu mu?
SELECT "id", "name", "email", "role", "createdAt" FROM "User" WHERE "role" = 'ADMIN';


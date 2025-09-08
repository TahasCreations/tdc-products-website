-- İlk admin kullanıcısını oluştur
-- Bu SQL'i Supabase SQL Editor'da çalıştırın

-- 1. Admin kullanıcıları tablosuna ilk admin'i ekle
INSERT INTO admin_users (email, name, is_active) 
VALUES ('bentahasarii@gmail.com', 'Admin User', true)
ON CONFLICT (email) DO UPDATE SET 
  name = EXCLUDED.name,
  is_active = EXCLUDED.is_active;

-- 2. Supabase Auth'da kullanıcı oluştur (bu kısmı manuel olarak yapmanız gerekecek)
-- Supabase Dashboard > Authentication > Users > Add User
-- Email: bentahasarii@gmail.com
-- Password: 35sandalye
-- Email Confirm: true

-- 3. Kullanıcının admin olduğunu işaretle
-- Bu kısım otomatik olarak admin panelinden yapılacak

-- Kontrol için admin kullanıcıları listele
SELECT * FROM admin_users WHERE email = 'bentahasarii@gmail.com';

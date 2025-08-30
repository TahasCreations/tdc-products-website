-- Supabase Storage Politikalarını Düzeltme
-- Bu dosyayı Supabase Dashboard'da SQL Editor'da çalıştırın

-- 1. Mevcut storage politikalarını temizle
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;

-- 2. Yeni storage politikaları oluştur
-- Herkesin okuma yapabilmesi için
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Authenticated kullanıcıların yükleme yapabilmesi için
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Authenticated kullanıcıların güncelleme yapabilmesi için
CREATE POLICY "Authenticated users can update images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Authenticated kullanıcıların silme yapabilmesi için
CREATE POLICY "Authenticated users can delete images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- 3. Bucket'ın public olduğundan emin ol
UPDATE storage.buckets 
SET public = true 
WHERE id = 'images';

-- 4. RLS'yi storage.objects için etkinleştir
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 5. Test için basit bir policy (geliştirme ortamı için)
-- DİKKAT: Bu sadece geliştirme ortamı için kullanın!
CREATE POLICY "Allow all operations for development" ON storage.objects
FOR ALL USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- 6. Bucket'ı yeniden oluştur (eğer yoksa)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('images', 'images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 7. Mevcut dosyaları kontrol et
SELECT 
  name,
  bucket_id,
  created_at,
  updated_at
FROM storage.objects 
WHERE bucket_id = 'images'
ORDER BY created_at DESC
LIMIT 10;

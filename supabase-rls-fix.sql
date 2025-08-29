-- Supabase Storage RLS Politikası Düzeltmesi - Güncellenmiş
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- 1. Önce mevcut politikaları temizle
DROP POLICY IF EXISTS "Allow bucket creation" ON storage.buckets;
DROP POLICY IF EXISTS "Allow bucket reading" ON storage.buckets;
DROP POLICY IF EXISTS "Allow bucket updating" ON storage.buckets;
DROP POLICY IF EXISTS "Allow bucket deletion" ON storage.buckets;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- 2. Storage bucket'ları için RLS'yi etkinleştir
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Bucket okuma politikası (herkes okuyabilir)
CREATE POLICY "Allow bucket reading" ON storage.buckets
FOR SELECT USING (true);

-- 4. Object okuma politikası (herkes okuyabilir)
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- 5. Object yükleme politikası (anon ve authenticated kullanıcılar için)
CREATE POLICY "Allow object uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images'
);

-- 6. Object güncelleme politikası (herkes güncelleyebilir)
CREATE POLICY "Allow object updates" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images'
);

-- 7. Object silme politikası (herkes silebilir)
CREATE POLICY "Allow object deletion" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images'
);

-- 8. Bucket'ın public olduğunu kontrol et
UPDATE storage.buckets 
SET public = true
WHERE name = 'images';

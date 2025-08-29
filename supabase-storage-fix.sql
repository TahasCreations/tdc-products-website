-- Supabase Storage RLS Politikası Düzeltmesi
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

-- 3. Bucket oluşturma politikası (anon ve authenticated kullanıcılar için)
CREATE POLICY "Allow bucket creation" ON storage.buckets
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' OR auth.role() = 'anon'
);

-- 4. Bucket okuma politikası (herkes okuyabilir)
CREATE POLICY "Allow bucket reading" ON storage.buckets
FOR SELECT USING (true);

-- 5. Bucket güncelleme politikası (sadece bucket sahibi)
CREATE POLICY "Allow bucket updating" ON storage.buckets
FOR UPDATE USING (auth.uid() = owner);

-- 6. Bucket silme politikası (sadece bucket sahibi)
CREATE POLICY "Allow bucket deletion" ON storage.buckets
FOR DELETE USING (auth.uid() = owner);

-- 7. Object okuma politikası (herkes okuyabilir)
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- 8. Object yükleme politikası (authenticated kullanıcılar için)
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- 9. Object güncelleme politikası (sadece yükleyen kullanıcı)
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' AND 
  auth.uid() = owner
);

-- 10. Object silme politikası (sadece yükleyen kullanıcı)
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' AND 
  auth.uid() = owner
);

-- 11. 'images' bucket'ını oluştur (eğer yoksa)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- 12. Bucket ayarlarını güncelle
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
WHERE id = 'images';

-- Supabase Storage RLS Politikaları
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- 1. Storage bucket'ları için RLS'yi etkinleştir
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Bucket oluşturma politikası (anon ve authenticated kullanıcılar için)
CREATE POLICY "Allow bucket creation" ON storage.buckets
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' OR auth.role() = 'anon'
);

-- 3. Bucket okuma politikası (herkes okuyabilir)
CREATE POLICY "Allow bucket reading" ON storage.buckets
FOR SELECT USING (true);

-- 4. Bucket güncelleme politikası (sadece bucket sahibi)
CREATE POLICY "Allow bucket updating" ON storage.buckets
FOR UPDATE USING (auth.uid() = owner);

-- 5. Bucket silme politikası (sadece bucket sahibi)
CREATE POLICY "Allow bucket deletion" ON storage.buckets
FOR DELETE USING (auth.uid() = owner);

-- 6. Object yükleme politikası (authenticated kullanıcılar için)
CREATE POLICY "Allow object uploads" ON storage.objects
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND
  bucket_id = 'images'
);

-- 7. Object okuma politikası (herkes okuyabilir)
CREATE POLICY "Allow object reading" ON storage.objects
FOR SELECT USING (
  bucket_id = 'images'
);

-- 8. Object güncelleme politikası (sadece yükleyen kullanıcı)
CREATE POLICY "Allow object updating" ON storage.objects
FOR UPDATE USING (
  auth.uid() = owner AND
  bucket_id = 'images'
);

-- 9. Object silme politikası (sadece yükleyen kullanıcı)
CREATE POLICY "Allow object deletion" ON storage.objects
FOR DELETE USING (
  auth.uid() = owner AND
  bucket_id = 'images'
);

-- 10. 'images' bucket'ını oluştur (eğer yoksa)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- 11. Bucket için public erişim politikası
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- 12. Authenticated kullanıcılar için upload politikası
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- 13. Kullanıcı kendi dosyalarını güncelleyebilir
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' AND 
  auth.uid() = owner
);

-- 14. Kullanıcı kendi dosyalarını silebilir
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' AND 
  auth.uid() = owner
);

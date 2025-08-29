# 🔧 Supabase Storage RLS Sorunu Çözümü

## 🚨 Sorun: "new row violates row-level security policy"

Bu hata, Supabase Storage'da RLS (Row Level Security) politikalarının doğru ayarlanmamasından kaynaklanır.

## ✅ Çözüm Adımları:

### 1. Supabase SQL Editor'da RLS Politikalarını Çalıştırın

1. **Supabase Dashboard** → **SQL Editor**
2. **"New query"** butonuna tıklayın
3. Aşağıdaki kodu yapıştırın ve **Run** butonuna tıklayın:

```sql
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
```

### 2. Manuel Bucket Oluşturma (Alternatif)

Eğer SQL çalıştırmak istemiyorsanız:

1. **Supabase Dashboard** → **Storage**
2. **"New bucket"** butonuna tıklayın
3. **Bucket name**: `images`
4. **Public bucket** ✅ işaretleyin
5. **"Create bucket"** butonuna tıklayın

### 3. Bucket Ayarlarını Kontrol Edin

1. **Storage** sekmesinde `images` bucket'ına tıklayın
2. **Settings** sekmesine gidin
3. Aşağıdaki ayarları kontrol edin:
   - **File size limit**: `5242880` (5MB)
   - **Allowed MIME types**: `image/*`
   - **Public bucket**: ✅ İşaretli

### 4. Environment Variables Kontrolü

Vercel Dashboard'da environment variables'ların doğru olduğundan emin olun:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 🧪 Test Etme

### 1. Admin Panelinde Test
1. `/admin` sayfasına gidin
2. Demo hesabı ile giriş yapın (`admin` / `admin123`)
3. **Ürünler** sekmesine gidin
4. Görsel yükleme alanını test edin

### 2. Beklenen Sonuçlar
- ✅ **Bucket bulundu**: Normal yükleme işlemi
- ✅ **Görsel yükleme**: Başarılı
- ✅ **Önizleme**: Yüklenen görseller görünür

## 🚨 Hata Durumunda

### Eğer hala "RLS policy violation" hatası alırsanız:

1. **Supabase Dashboard** → **Authentication** → **Policies**
2. Storage tablosundaki politikaları kontrol edin
3. Gerekirse politikaları silip yeniden oluşturun

### Supabase Support'a Başvurma

Eğer sorun devam ederse:
1. **Supabase Discord**'da destek alın
2. **Supabase GitHub Issues**'da arama yapın
3. **Supabase Support**'a ticket açın

## 🔒 Güvenlik Notları

### RLS Politikaları Açıklaması:
- ✅ **Bucket creation**: Anon ve authenticated kullanıcılar bucket oluşturabilir
- ✅ **Bucket reading**: Herkes bucket'ları okuyabilir
- ✅ **Object upload**: Sadece authenticated kullanıcılar yükleyebilir
- ✅ **Object reading**: Herkes görselleri okuyabilir
- ✅ **Object management**: Kullanıcılar kendi dosyalarını yönetebilir

### Dosya Güvenliği:
- ✅ **Boyut limiti**: 5MB maksimum
- ✅ **Tip kontrolü**: Sadece görsel dosyaları
- ✅ **Benzersiz isimler**: Timestamp ile
- ✅ **Public erişim**: CDN üzerinden optimize

---

**Not:** Bu çözüm Supabase Storage RLS sorununu tamamen çözer. Eğer sorun devam ederse, Supabase projenizin ayarlarını kontrol edin.

# Supabase Storage Kurulum Kılavuzu

## 🚀 Storage Bucket Oluşturma

### 1. Supabase Dashboard'a Giriş
1. https://supabase.com adresine gidin
2. Projenizi seçin
3. Sol menüden **Storage** sekmesine tıklayın

### 2. Bucket Oluşturma
1. **"New bucket"** butonuna tıklayın
2. Bucket adı: `images`
3. **Public bucket** seçeneğini işaretleyin
4. **"Create bucket"** butonuna tıklayın

### 3. RLS Politikalarını Ayarlama
1. Sol menüden **SQL Editor** sekmesine tıklayın
2. **"New query"** butonuna tıklayın
3. Aşağıdaki SQL kodunu yapıştırın ve çalıştırın:

```sql
-- Storage bucket'ları için RLS'yi etkinleştir
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Bucket okuma politikası (herkes okuyabilir)
CREATE POLICY "Allow bucket reading" ON storage.buckets
FOR SELECT USING (true);

-- Object okuma politikası (herkes okuyabilir)
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Authenticated kullanıcılar için upload politikası
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' AND 
  auth.role() = 'authenticated'
);

-- Kullanıcı kendi dosyalarını güncelleyebilir
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' AND 
  auth.uid() = owner
);

-- Kullanıcı kendi dosyalarını silebilir
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' AND 
  auth.uid() = owner
);
```

### 4. Bucket Ayarları
1. Storage sekmesinde `images` bucket'ına tıklayın
2. **Settings** sekmesine gidin
3. Aşağıdaki ayarları yapın:
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/*`
   - **Public bucket**: ✅ İşaretli

## 🔧 Environment Variables

### 1. Vercel Dashboard'da Ayarlama
1. Vercel Dashboard'a gidin
2. Projenizi seçin
3. **Settings** → **Environment Variables**
4. Aşağıdaki değişkenleri ekleyin:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Supabase'den Anahtarları Alma
1. Supabase Dashboard → **Settings** → **API**
2. **Project URL** ve **anon public** anahtarını kopyalayın
3. **service_role** anahtarını da kopyalayın (güvenli tutun)

## 🧪 Test Etme

### 1. Admin Panelinde Test
1. `/admin` sayfasına gidin
2. Demo hesabı ile giriş yapın (`admin` / `admin123`)
3. **Ürünler** sekmesine gidin
4. Görsel yükleme alanını test edin

### 2. Hata Kontrolü
Eğer hata alırsanız:
1. Browser console'u kontrol edin
2. Network sekmesinde API çağrılarını kontrol edin
3. Supabase Dashboard'da Storage loglarını kontrol edin

## 🔒 Güvenlik Notları

### 1. RLS Politikaları
- ✅ Herkes görselleri okuyabilir
- ✅ Sadece authenticated kullanıcılar yükleyebilir
- ✅ Kullanıcılar sadece kendi dosyalarını silebilir

### 2. Dosya Limitleri
- ✅ Maksimum dosya boyutu: 5MB
- ✅ Sadece görsel dosyaları kabul edilir
- ✅ Benzersiz dosya adları otomatik oluşturulur

### 3. Public Erişim
- ✅ Görseller public olarak erişilebilir
- ✅ CDN üzerinden optimize edilmiş erişim
- ✅ Cache kontrolü aktif

## 🚨 Sorun Giderme

### 1. "Storage bucket bulunamadı" Hatası
**Çözüm:**
1. Supabase Dashboard'da Storage sekmesine gidin
2. `images` bucket'ının var olduğunu kontrol edin
3. Bucket yoksa oluşturun

### 2. "RLS policy violation" Hatası
**Çözüm:**
1. SQL Editor'da RLS politikalarını çalıştırın
2. Bucket'ın public olduğunu kontrol edin
3. Environment variables'ları kontrol edin

### 3. "Upload failed" Hatası
**Çözüm:**
1. Dosya boyutunu kontrol edin (max 5MB)
2. Dosya tipini kontrol edin (sadece görsel)
3. Network bağlantısını kontrol edin

## 📞 Destek

Sorun yaşarsanız:
1. Supabase Discord'da destek alın
2. Supabase GitHub issues'da arama yapın
3. Proje maintainer'ına ulaşın

---

**Not:** Bu kılavuz Supabase Storage'ın temel kurulumu için hazırlanmıştır. Daha gelişmiş özellikler için Supabase dokümantasyonunu inceleyin.

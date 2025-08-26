# Supabase Kurulum Rehberi

## ✅ Mevcut Durum
Proje şu anda **Demo Modu** ile çalışıyor. Supabase bağlantısı olmadan da admin paneli ve ürün yönetimi çalışıyor.

## 🚀 Supabase'e Geçiş Adımları

### 1. Supabase Projesi Oluştur

1. [supabase.com](https://supabase.com) adresine git
2. "Start your project" butonuna tıkla
3. GitHub ile giriş yap
4. "New Project" butonuna tıkla
5. Proje adı: `tdc-products-website`
6. Database password oluştur (unutma!)
7. Region seç (Türkiye için en yakın)
8. "Create new project" butonuna tıkla

### 2. Database Tablosu Oluştur

Supabase Dashboard'da SQL Editor'a git ve şu kodu çalıştır:

```sql
-- Products tablosu
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INTEGER DEFAULT 0,
  image TEXT,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) aktif et
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (public read)
CREATE POLICY "Public read access" ON products
  FOR SELECT USING (true);

-- Sadece authenticated users yazabilir (admin için)
CREATE POLICY "Authenticated users can insert" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### 3. Environment Variables Ayarla

Proje kök dizininde `.env.local` dosyası oluştur:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Base URL (production için)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Bu değerleri nereden bulacağım?**
- Supabase Dashboard → Settings → API
- Project URL: `NEXT_PUBLIC_SUPABASE_URL`
- anon/public key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- service_role key: `SUPABASE_SERVICE_ROLE_KEY`

### 4. Admin Kullanıcısı Oluştur

1. Supabase Dashboard → Authentication → Users
2. "Add user" butonuna tıkla
3. E-posta ve şifre gir
4. Kullanıcıyı oluştur

### 5. Test Et

1. Development server'ı yeniden başlat: `npm run dev`
2. `/admin` sayfasına git
3. Oluşturduğun admin hesabıyla giriş yap
4. Ürün ekle/düzenle/sil işlemlerini test et

## 🔄 Demo Modu vs Supabase Modu

### Demo Modu (Şu anki durum)
- ✅ Çalışıyor
- ✅ Ürün yönetimi var
- ✅ JSON dosyası kullanıyor
- ❌ Gerçek veritabanı yok
- ❌ Gerçek authentication yok

### Supabase Modu (Hedef)
- ✅ Gerçek PostgreSQL veritabanı
- ✅ Gerçek authentication
- ✅ Real-time updates
- ✅ Production ready
- ✅ Scalable

## 🛠️ Mevcut Özellikler

### Admin Panel
- ✅ Dashboard (istatistikler)
- ✅ Ürün yönetimi (CRUD)
- ✅ Kupon yönetimi
- ✅ Sipariş yönetimi
- ✅ Demo/Supabase mod geçişi

### API Routes
- ✅ `/api/products` - Tüm CRUD işlemleri
- ✅ Fallback JSON dosyası desteği
- ✅ Supabase entegrasyonu

### Frontend
- ✅ Responsive tasarım
- ✅ Modern UI/UX
- ✅ Real-time updates
- ✅ Error handling

## 📝 Sonraki Adımlar

1. **Supabase projesi oluştur**
2. **Environment variables ayarla**
3. **Admin kullanıcısı oluştur**
4. **Test et**
5. **Production'a deploy et**

## 🚨 Önemli Notlar

- Environment variables ayarlanmadan Supabase çalışmaz
- `.env.local` dosyası git'e commit edilmemeli
- Production'da environment variables Vercel'de ayarlanmalı
- Admin kullanıcısı oluşturulmadan admin paneline erişim olmaz

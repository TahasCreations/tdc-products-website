-- TDC Products Website Database Setup - FIXED VERSION
-- Bu script'i Supabase SQL Editor'da çalıştırın

-- 1. Önce mevcut tabloyu temizle (eğer varsa)
DROP TABLE IF EXISTS products CASCADE;

-- 2. Products tablosu oluştur
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

-- 3. RLS (Row Level Security) aktif et
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 4. Tüm eski politikaları temizle
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Authenticated users can insert" ON products;
DROP POLICY IF EXISTS "Authenticated users can update" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON products;
DROP POLICY IF EXISTS "Service role full access" ON products;

-- 5. YENİ POLİTİKALAR - BASİT VE ÇALIŞAN
-- Herkes okuyabilir (public read) - EN ÖNEMLİSİ
CREATE POLICY "Public read access" ON products
  FOR SELECT USING (true);

-- Service role her şeyi yapabilir (admin için)
CREATE POLICY "Service role full access" ON products
  FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users da yazabilir (alternatif)
CREATE POLICY "Authenticated users can insert" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- 6. Updated_at trigger fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Trigger'ı oluştur
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Test verisi ekle
INSERT INTO products (title, slug, price, category, stock, image, description, status) VALUES
('Test Ürün 1', 'test-urun-1', 99.99, 'Elektronik', 10, 'https://via.placeholder.com/300x200', 'Bu bir test ürünüdür.', 'active'),
('Test Ürün 2', 'test-urun-2', 149.99, 'Giyim', 5, 'https://via.placeholder.com/300x200', 'Bu da bir test ürünüdür.', 'active')
ON CONFLICT (slug) DO NOTHING;

-- 9. Tabloyu kontrol et
SELECT * FROM products;

-- 10. RLS politikalarını kontrol et
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'products';

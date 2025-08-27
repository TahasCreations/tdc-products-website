-- 🚨 KESİN ÇÖZÜM - Bu kodu Supabase SQL Editor'da çalıştırın

-- 1. Mevcut tabloyu tamamen sil
DROP TABLE IF EXISTS products CASCADE;

-- 2. Yeni tablo oluştur
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

-- 3. RLS'yi KAPAT (geçici olarak)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- 4. Test verisi ekle
INSERT INTO products (title, slug, price, category, stock, image, description, status) VALUES
('Test Ürün 1', 'test-urun-1', 99.99, 'Elektronik', 10, 'https://via.placeholder.com/300x200', 'Bu bir test ürünüdür.', 'active'),
('Test Ürün 2', 'test-urun-2', 149.99, 'Giyim', 5, 'https://via.placeholder.com/300x200', 'Bu da bir test ürünüdür.', 'active'),
('Naruto Figürü', 'naruto-figur', 299.00, 'Anime', 8, 'https://via.placeholder.com/300x200', 'Naruto Uzumaki figürü.', 'active');

-- 5. Kontrol et
SELECT * FROM products;

-- 6. Eğer çalışıyorsa, RLS'yi tekrar aç ve basit politika ekle
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all" ON products FOR ALL USING (true);

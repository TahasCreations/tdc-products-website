-- TDC Products Database Setup
-- Bu kodu Supabase Dashboard → SQL Editor'da çalıştır

-- Categories tablosu
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#6b7280',
  icon VARCHAR(50) DEFAULT 'ri-more-line',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products tablosu
CREATE TABLE IF NOT EXISTS products (
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
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Authenticated users can insert" ON products;
DROP POLICY IF EXISTS "Authenticated users can update" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete" ON products;

DROP POLICY IF EXISTS "Public read access categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON categories;

-- Yeni politikalar - Service Role bypass ile
-- Herkes okuyabilir (public read)
CREATE POLICY "Public read access" ON products
  FOR SELECT USING (true);

CREATE POLICY "Public read access categories" ON categories
  FOR SELECT USING (true);

-- Service role her şeyi yapabilir (admin için)
CREATE POLICY "Service role full access" ON products
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access categories" ON categories
  FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users da yazabilir (alternatif)
CREATE POLICY "Authenticated users can insert" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert categories" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update categories" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete categories" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Otomatik updated_at sütunu güncelleme fonksiyonu ve trigger'ı
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Örnek kategoriler ekle (eğer yoksa)
INSERT INTO categories (name, color, icon) VALUES
('Anime', '#ec4899', 'ri-gamepad-line'),
('Gaming', '#3b82f6', 'ri-controller-line'),
('Film', '#8b5cf6', 'ri-movie-line'),
('Diğer', '#6b7280', 'ri-more-line')
ON CONFLICT (name) DO NOTHING;

-- Örnek ürünler ekle (eğer yoksa)
INSERT INTO products (title, slug, price, category, stock, image, description) VALUES
('Naruto Uzumaki Figürü', 'naruto-uzumaki-figur', 299.00, 'Anime', 10, 'https://images.unsplash.com/photo-1598550880863-4e8b90e87174?q=80&w=1200&auto=format&fit=crop', 'Yüksek detaylı, dayanıklı malzemeden üretilmiş Naruto Uzumaki 3D baskı figürü.'),
('Link Zelda Figürü', 'link-zelda-figur', 349.00, 'Gaming', 8, 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop', 'The Legend of Zelda serisinden ilham alınarak üretilmiş detaylı Link figürü.'),
('Spider-Man Figürü', 'spider-man-figur', 279.00, 'Film', 15, 'https://images.unsplash.com/photo-1612036782180-6f0b6b820d4c?q=80&w=1200&auto=format&fit=crop', 'İkonik Spider-Man karakterinin dinamik pozda 3D baskı figürü.'),
('Goku Super Saiyan', 'goku-super-saiyan', 399.00, 'Anime', 12, 'https://images.unsplash.com/photo-1613336026275-d6d0d1a82561?q=80&w=1200&auto=format&fit=crop', 'Dragon Ball evreninden Goku''nun Super Saiyan formunda detaylı figürü.')
ON CONFLICT (slug) DO NOTHING;

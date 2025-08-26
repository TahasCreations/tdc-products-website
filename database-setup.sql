-- TDC Products Database Setup
-- Bu kodu Supabase Dashboard → SQL Editor'da çalıştır

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

-- Örnek ürünler ekle
INSERT INTO products (title, slug, price, category, stock, image, description) VALUES
('Naruto Uzumaki Figür', 'naruto-uzumaki-figur', 299.99, 'Anime', 10, 'https://readdy.ai/images/naruto.jpg', 'Naruto Uzumaki karakterinin detaylı 3D baskı figürü'),
('Link Zelda Figür', 'link-zelda-figur', 399.99, 'Oyun', 5, 'https://readdy.ai/images/link.jpg', 'Legend of Zelda serisinden Link karakteri'),
('Spider-Man Figür', 'spider-man-figur', 349.99, 'Film', 8, 'https://readdy.ai/images/spiderman.jpg', 'Spider-Man karakterinin aksiyon figürü'),
('Goku Super Saiyan', 'goku-super-saiyan', 449.99, 'Anime', 12, 'https://readdy.ai/images/goku.jpg', 'Dragon Ball serisinden Goku Super Saiyan formu');

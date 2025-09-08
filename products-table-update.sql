-- Products tablosuna yeni kolonlar ekle
-- Bu SQL'i Supabase SQL Editor'da çalıştırın

-- 1. hasVariationPrices kolonu ekle
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS hasVariationPrices BOOLEAN DEFAULT false;

-- 2. variationPrices kolonu ekle (JSON formatında)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS variationPrices JSONB DEFAULT '{}';

-- 3. images kolonu ekle (eğer yoksa)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- 4. variations kolonu ekle (eğer yoksa)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS variations TEXT[] DEFAULT '{}';

-- 5. Kontrol için tabloyu listele
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

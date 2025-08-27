-- 🔐 RLS'yi Güvenli Şekilde Açma
-- Bu kodu Supabase SQL Editor'da çalıştırın

-- 1. RLS'yi aç
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 2. Tüm eski politikaları temizle (eğer varsa)
DROP POLICY IF EXISTS "Public read access" ON products;
DROP POLICY IF EXISTS "Authenticated users can insert" ON products;
DROP POLICY IF EXISTS "Authenticated users can update" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON products;
DROP POLICY IF EXISTS "Service role full access" ON products;
DROP POLICY IF EXISTS "Allow all" ON products;

-- 3. YENİ GÜVENLİ POLİTİKALAR

-- Herkes okuyabilir (public read) - EN ÖNEMLİSİ
CREATE POLICY "Public read access" ON products
  FOR SELECT USING (true);

-- Service role her şeyi yapabilir (admin için)
CREATE POLICY "Service role full access" ON products
  FOR ALL USING (auth.role() = 'service_role');

-- Authenticated users da yazabilir (admin panel için)
CREATE POLICY "Authenticated users can insert" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- 4. Politikaları kontrol et
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'products';

-- 5. Test verisi hala var mı kontrol et
SELECT COUNT(*) as product_count FROM products;

-- Products tablosuna stock sütunu ekleme (eğer yoksa)
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- Mevcut ürünlere varsayılan stok değeri atama
UPDATE products SET stock = 10 WHERE stock IS NULL OR stock = 0;

-- Stock sütununu NOT NULL yapma
ALTER TABLE products ALTER COLUMN stock SET NOT NULL;

-- Stock için index oluşturma
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- Düşük stoklu ürünleri bulmak için view oluşturma
CREATE OR REPLACE VIEW low_stock_products AS
SELECT id, title, stock, category, created_at
FROM products
WHERE stock <= 5
ORDER BY stock ASC;

-- Stok tükenmiş ürünleri bulmak için view oluşturma
CREATE OR REPLACE VIEW out_of_stock_products AS
SELECT id, title, stock, category, created_at
FROM products
WHERE stock = 0
ORDER BY created_at DESC;

-- Stock Movements tablosu oluşturma
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
  quantity INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reason TEXT NOT NULL,
  notes TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stock Alerts tablosu oluşturma
CREATE TABLE IF NOT EXISTS stock_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_title TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'overstock')),
  threshold INTEGER NOT NULL,
  current_stock INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler oluşturma
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(type);

CREATE INDEX IF NOT EXISTS idx_stock_alerts_product_id ON stock_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_alert_type ON stock_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_is_active ON stock_alerts(is_active);

-- RLS (Row Level Security) etkinleştirme
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;

-- RLS politikaları - Admin kullanıcılar tüm stok işlemlerini yönetebilir
CREATE POLICY "Enable all access for authenticated users on stock_movements" ON stock_movements
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users on stock_alerts" ON stock_alerts
  FOR ALL USING (auth.role() = 'authenticated');

-- Stok güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_stock_alert_current_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Stock alerts tablosundaki current_stock'u güncelle
  UPDATE stock_alerts 
  SET current_stock = NEW.stock 
  WHERE product_id = NEW.id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger oluşturma - products tablosu güncellendiğinde stock_alerts'i güncelle
CREATE TRIGGER update_stock_alerts_on_product_update
  AFTER UPDATE OF stock ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_stock_alert_current_stock();

-- Örnek stok uyarıları ekleme
INSERT INTO stock_alerts (product_id, product_title, alert_type, threshold, current_stock, is_active) VALUES
-- Bu örnekler products tablosundaki mevcut ürünlerin ID'leri ile güncellenmelidir
-- (uuid-1, 'Naruto Uzumaki Figürü', 'low_stock', 5, 10, true),
-- (uuid-2, 'Goku Figürü', 'out_of_stock', 0, 0, true);

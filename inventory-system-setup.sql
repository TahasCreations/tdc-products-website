-- Stok ve Envanter Yönetimi Sistemi
-- Bu script stok takibi için gerekli tabloları oluşturur

-- Ürünler tablosu (eğer yoksa)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID,
  subcategory_id UUID,
  sku VARCHAR(100) UNIQUE,
  barcode VARCHAR(100),
  weight DECIMAL(8,2),
  dimensions VARCHAR(100), -- "10x20x30 cm" formatında
  color VARCHAR(50),
  material VARCHAR(100),
  brand VARCHAR(100),
  model VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stok tablosu
CREATE TABLE IF NOT EXISTS inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  current_stock INTEGER NOT NULL DEFAULT 0,
  minimum_stock INTEGER NOT NULL DEFAULT 0, -- Minimum stok uyarısı
  maximum_stock INTEGER, -- Maksimum stok limiti
  reserved_stock INTEGER DEFAULT 0, -- Rezerve edilmiş stok
  available_stock INTEGER GENERATED ALWAYS AS (current_stock - reserved_stock) STORED,
  location VARCHAR(100), -- Depo konumu
  batch_number VARCHAR(100), -- Parti numarası
  expiry_date DATE, -- Son kullanma tarihi
  cost_price DECIMAL(10,2), -- Maliyet fiyatı
  selling_price DECIMAL(10,2), -- Satış fiyatı
  supplier_id UUID, -- Tedarikçi ID
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stok Hareketleri tablosu
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment', 'transfer', 'return')),
  quantity INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reference_type VARCHAR(50), -- 'purchase', 'sale', 'adjustment', 'transfer'
  reference_id UUID, -- İlgili kayıt ID'si
  reason TEXT, -- Hareket sebebi
  location_from VARCHAR(100), -- Nereden
  location_to VARCHAR(100), -- Nereye
  cost_per_unit DECIMAL(10,2),
  total_cost DECIMAL(10,2),
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tedarikçiler tablosu
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  tax_number VARCHAR(50),
  payment_terms VARCHAR(100), -- Ödeme koşulları
  credit_limit DECIMAL(10,2), -- Kredi limiti
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Satın Alma Siparişleri tablosu
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id),
  order_date DATE NOT NULL,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Satın Alma Sipariş Detayları tablosu
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_cost DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL,
  received_quantity INTEGER DEFAULT 0, -- Teslim alınan miktar
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stok Uyarıları tablosu
CREATE TABLE IF NOT EXISTS stock_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'expiry_warning', 'overstock')),
  current_stock INTEGER NOT NULL,
  threshold_value INTEGER NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Depo Konumları tablosu
CREATE TABLE IF NOT EXISTS warehouse_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL, -- Depo kodu (A1, B2, vb.)
  description TEXT,
  capacity INTEGER, -- Kapasite
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stok Transferleri tablosu
CREATE TABLE IF NOT EXISTS stock_transfers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transfer_number VARCHAR(50) UNIQUE NOT NULL,
  from_location VARCHAR(100) NOT NULL,
  to_location VARCHAR(100) NOT NULL,
  transfer_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'completed', 'cancelled')),
  notes TEXT,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stok Transfer Detayları tablosu
CREATE TABLE IF NOT EXISTS stock_transfer_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transfer_id UUID REFERENCES stock_transfers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  transferred_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_current_stock ON inventory(current_stock);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_stock_movements_movement_type ON stock_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_product_id ON stock_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_is_read ON stock_alerts(is_read);

-- RLS (Row Level Security) etkinleştir
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_transfer_items ENABLE ROW LEVEL SECURITY;

-- Policy'ler (Admin kullanıcıları tüm stok verilerine erişebilir)
CREATE POLICY "Admin users can manage products" ON products FOR ALL USING (true);
CREATE POLICY "Admin users can manage inventory" ON inventory FOR ALL USING (true);
CREATE POLICY "Admin users can manage stock_movements" ON stock_movements FOR ALL USING (true);
CREATE POLICY "Admin users can manage suppliers" ON suppliers FOR ALL USING (true);
CREATE POLICY "Admin users can manage purchase_orders" ON purchase_orders FOR ALL USING (true);
CREATE POLICY "Admin users can manage purchase_order_items" ON purchase_order_items FOR ALL USING (true);
CREATE POLICY "Admin users can manage stock_alerts" ON stock_alerts FOR ALL USING (true);
CREATE POLICY "Admin users can manage warehouse_locations" ON warehouse_locations FOR ALL USING (true);
CREATE POLICY "Admin users can manage stock_transfers" ON stock_transfers FOR ALL USING (true);
CREATE POLICY "Admin users can manage stock_transfer_items" ON stock_transfer_items FOR ALL USING (true);

-- Trigger'lar için fonksiyon
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Stok hareketi trigger'ı
CREATE OR REPLACE FUNCTION update_inventory_on_movement()
RETURNS TRIGGER AS $$
BEGIN
    -- Stok hareketi eklendikten sonra inventory tablosunu güncelle
    IF TG_OP = 'INSERT' THEN
        UPDATE inventory 
        SET current_stock = NEW.new_stock,
            last_updated = NOW()
        WHERE product_id = NEW.product_id;
        
        -- Stok uyarıları kontrol et
        PERFORM check_stock_alerts(NEW.product_id);
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Stok uyarıları kontrol fonksiyonu
CREATE OR REPLACE FUNCTION check_stock_alerts(product_uuid UUID)
RETURNS VOID AS $$
DECLARE
    current_stock_count INTEGER;
    min_stock_count INTEGER;
    product_name_val VARCHAR(255);
BEGIN
    -- Mevcut stok miktarını al
    SELECT current_stock, minimum_stock INTO current_stock_count, min_stock_count
    FROM inventory 
    WHERE product_id = product_uuid;
    
    -- Ürün adını al
    SELECT name INTO product_name_val
    FROM products 
    WHERE id = product_uuid;
    
    -- Stok uyarıları oluştur
    IF current_stock_count <= 0 THEN
        INSERT INTO stock_alerts (product_id, alert_type, current_stock, threshold_value, message)
        VALUES (product_uuid, 'out_of_stock', current_stock_count, 0, 
                product_name_val || ' ürünü stokta tükendi!');
    ELSIF current_stock_count <= min_stock_count THEN
        INSERT INTO stock_alerts (product_id, alert_type, current_stock, threshold_value, message)
        VALUES (product_uuid, 'low_stock', current_stock_count, min_stock_count, 
                product_name_val || ' ürünü minimum stok seviyesinin altında!');
    END IF;
END;
$$ language 'plpgsql';

-- Trigger'ları oluştur
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_suppliers_updated_at ON suppliers;
CREATE TRIGGER update_suppliers_updated_at 
  BEFORE UPDATE ON suppliers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_purchase_orders_updated_at ON purchase_orders;
CREATE TRIGGER update_purchase_orders_updated_at 
  BEFORE UPDATE ON purchase_orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stock_transfers_updated_at ON stock_transfers;
CREATE TRIGGER update_stock_transfers_updated_at 
  BEFORE UPDATE ON stock_transfers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inventory_on_stock_movement ON stock_movements;
CREATE TRIGGER update_inventory_on_stock_movement 
  AFTER INSERT ON stock_movements 
  FOR EACH ROW 
  EXECUTE FUNCTION update_inventory_on_movement();

-- Örnek veriler
INSERT INTO warehouse_locations (name, code, description) VALUES
('Ana Depo', 'A1', 'Ana depo alanı'),
('Yan Depo', 'B1', 'Yan depo alanı'),
('Soğuk Hava Deposu', 'C1', 'Soğuk hava deposu')
ON CONFLICT (code) DO NOTHING;

INSERT INTO suppliers (name, contact_person, email, phone, address, tax_number, payment_terms) VALUES
('ABC Tedarik A.Ş.', 'Ahmet Yılmaz', 'ahmet@abctedarik.com', '0212 123 45 67', 'İstanbul, Türkiye', '1234567890', '30 gün'),
('XYZ Üretim Ltd.', 'Mehmet Demir', 'mehmet@xyzuretim.com', '0216 987 65 43', 'Ankara, Türkiye', '0987654321', '15 gün')
ON CONFLICT DO NOTHING;

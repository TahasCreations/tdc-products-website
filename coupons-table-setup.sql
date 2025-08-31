-- Coupons tablosu oluşturma
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(10,2) NOT NULL,
  min_amount DECIMAL(10,2),
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler oluşturma
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_expires_at ON coupons(expires_at);

-- RLS (Row Level Security) etkinleştirme
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- RLS politikaları - Admin kullanıcılar tüm kuponları yönetebilir
CREATE POLICY "Enable all access for authenticated users" ON coupons
  FOR ALL USING (auth.role() = 'authenticated');

-- Updated_at trigger'ı
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_coupons_updated_at 
    BEFORE UPDATE ON coupons 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Örnek kuponlar ekleme
INSERT INTO coupons (code, type, value, min_amount, max_uses, expires_at, is_active) VALUES
('YILBASI2024', 'percentage', 20.00, 100.00, 50, '2024-12-31 23:59:59+00', true),
('HOSGELDIN', 'fixed', 25.00, 50.00, 100, '2024-06-30 23:59:59+00', true),
('YAZ2024', 'percentage', 15.00, 75.00, 200, '2024-08-31 23:59:59+00', true);

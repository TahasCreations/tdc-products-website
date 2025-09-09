-- Period Operations Tablosu
CREATE TABLE IF NOT EXISTS period_operations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('opening', 'closing', 'adjustment')),
  period VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  description TEXT,
  affected_records INTEGER DEFAULT 0,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_period_operations_type ON period_operations(type);
CREATE INDEX IF NOT EXISTS idx_period_operations_status ON period_operations(status);
CREATE INDEX IF NOT EXISTS idx_period_operations_period ON period_operations(period);
CREATE INDEX IF NOT EXISTS idx_period_operations_created_at ON period_operations(created_at);
CREATE INDEX IF NOT EXISTS idx_period_operations_created_by ON period_operations(created_by);

-- RLS Politikaları
ALTER TABLE period_operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view all period operations" ON period_operations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'accountant')
    )
  );

CREATE POLICY "Admin users can insert period operations" ON period_operations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'accountant')
    )
  );

CREATE POLICY "Admin users can update period operations" ON period_operations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'accountant')
    )
  );

CREATE POLICY "Admin users can delete period operations" ON period_operations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'accountant')
    )
  );

-- Trigger fonksiyonu
CREATE OR REPLACE FUNCTION update_period_operations_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'ı ekle
CREATE TRIGGER update_period_operations_updated_at 
  BEFORE UPDATE ON period_operations 
  FOR EACH ROW EXECUTE FUNCTION update_period_operations_updated_at_column();

-- Örnek veriler
INSERT INTO period_operations (name, type, period, description, status, affected_records, created_by) VALUES
  ('2024 Dönem Açma', 'opening', '2024', '2024 muhasebe dönemi açma işlemi', 'completed', 150, (SELECT id FROM admin_users LIMIT 1)),
  ('2023 Dönem Kapatma', 'closing', '2023', '2023 muhasebe dönemi kapatma işlemi', 'completed', 75, (SELECT id FROM admin_users LIMIT 1)),
  ('Aralık Düzeltme', 'adjustment', '2024', 'Aralık ayı kayıtlarında düzeltme', 'pending', 0, (SELECT id FROM admin_users LIMIT 1)),
  ('2024 Q1 Kapanış', 'closing', '2024-Q1', '2024 ilk çeyrek kapanış işlemi', 'pending', 0, (SELECT id FROM admin_users LIMIT 1));

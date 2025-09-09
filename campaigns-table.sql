-- Campaigns Tablosu
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  target_audience VARCHAR(20) NOT NULL CHECK (target_audience IN ('all', 'newsletter', 'active', 'inactive')),
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipients_count INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2) DEFAULT 0,
  click_rate DECIMAL(5,2) DEFAULT 0
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_target_audience ON campaigns(target_audience);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_by ON campaigns(created_by);

-- RLS Politikaları
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view all campaigns" ON campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'marketing_manager')
    )
  );

CREATE POLICY "Admin users can insert campaigns" ON campaigns
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'marketing_manager')
    )
  );

CREATE POLICY "Admin users can update campaigns" ON campaigns
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'marketing_manager')
    )
  );

CREATE POLICY "Admin users can delete campaigns" ON campaigns
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role IN ('owner', 'admin', 'marketing_manager')
    )
  );

-- Trigger fonksiyonu
CREATE OR REPLACE FUNCTION update_campaigns_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'ı ekle
CREATE TRIGGER update_campaigns_updated_at 
  BEFORE UPDATE ON campaigns 
  FOR EACH ROW EXECUTE FUNCTION update_campaigns_updated_at_column();

-- Örnek kampanya verileri
INSERT INTO campaigns (name, subject, content, target_audience, status, created_by) VALUES
  ('Hoş Geldin Kampanyası', 'TDC''ye Hoş Geldiniz!', 'Merhaba! TDC ailesine katıldığınız için teşekkür ederiz. İlk siparişinizde %10 indirim kazanın!', 'all', 'sent', (SELECT id FROM admin_users LIMIT 1)),
  ('Yeni Ürün Duyurusu', 'Yeni Ürünler Geldi!', 'En yeni ürünlerimizi keşfedin. Sınırlı süre için özel fiyatlar!', 'newsletter', 'draft', (SELECT id FROM admin_users LIMIT 1)),
  ('Sadık Müşteri Kampanyası', 'Size Özel İndirim', 'Sadık müşterilerimiz için özel indirim fırsatı. Kaçırmayın!', 'active', 'scheduled', (SELECT id FROM admin_users LIMIT 1));

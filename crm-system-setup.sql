-- Müşteri Yönetimi (CRM) Sistemi
-- Bu script CRM için gerekli tabloları oluşturur

-- Müşteriler tablosu (genişletilmiş)
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id), -- Supabase auth ile bağlantı
  customer_code VARCHAR(50) UNIQUE, -- Müşteri kodu
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  mobile VARCHAR(20),
  company_name VARCHAR(255),
  job_title VARCHAR(100),
  birth_date DATE,
  gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
  
  -- Adres bilgileri
  billing_address TEXT,
  shipping_address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'Türkiye',
  
  -- İletişim tercihleri
  preferred_contact_method VARCHAR(20) CHECK (preferred_contact_method IN ('email', 'phone', 'sms', 'whatsapp')),
  newsletter_subscription BOOLEAN DEFAULT false,
  sms_notifications BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  
  -- Müşteri segmentasyonu
  customer_type VARCHAR(20) DEFAULT 'individual' CHECK (customer_type IN ('individual', 'corporate', 'wholesale', 'retail')),
  customer_status VARCHAR(20) DEFAULT 'active' CHECK (customer_status IN ('active', 'inactive', 'blocked', 'vip')),
  customer_tier VARCHAR(20) DEFAULT 'bronze' CHECK (customer_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  
  -- Finansal bilgiler
  credit_limit DECIMAL(10,2) DEFAULT 0,
  payment_terms VARCHAR(50), -- Ödeme koşulları
  tax_number VARCHAR(50), -- Vergi numarası
  tax_office VARCHAR(100), -- Vergi dairesi
  
  -- Sosyal medya
  website VARCHAR(255),
  linkedin VARCHAR(255),
  twitter VARCHAR(255),
  instagram VARCHAR(255),
  
  -- Notlar ve etiketler
  notes TEXT,
  tags TEXT[], -- Etiketler array olarak
  source VARCHAR(100), -- Müşteri kaynağı (website, referral, etc.)
  
  -- İstatistikler
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  average_order_value DECIMAL(10,2) DEFAULT 0,
  last_order_date DATE,
  first_order_date DATE,
  
  -- Sistem bilgileri
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id)
);

-- Müşteri İletişim Geçmişi tablosu
CREATE TABLE IF NOT EXISTS customer_communications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  communication_type VARCHAR(20) NOT NULL CHECK (communication_type IN ('email', 'phone', 'sms', 'whatsapp', 'meeting', 'note')),
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  communication_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration_minutes INTEGER, -- Telefon görüşmesi süresi
  outcome VARCHAR(100), -- Görüşme sonucu
  follow_up_date DATE, -- Takip tarihi
  follow_up_notes TEXT,
  is_important BOOLEAN DEFAULT false,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Müşteri Etiketleri tablosu
CREATE TABLE IF NOT EXISTS customer_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Müşteri-Etiket İlişkisi tablosu
CREATE TABLE IF NOT EXISTS customer_tag_relations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES customer_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, tag_id)
);

-- Müşteri Görevleri tablosu
CREATE TABLE IF NOT EXISTS customer_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  task_type VARCHAR(20) DEFAULT 'follow_up' CHECK (task_type IN ('follow_up', 'call', 'email', 'meeting', 'quote', 'other')),
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  due_date DATE,
  completed_date DATE,
  assigned_to UUID REFERENCES admin_users(id),
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Müşteri Fırsatları tablosu (Sales Pipeline)
CREATE TABLE IF NOT EXISTS customer_opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  stage VARCHAR(20) DEFAULT 'lead' CHECK (stage IN ('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100), -- Başarı olasılığı %
  expected_value DECIMAL(10,2) NOT NULL,
  expected_close_date DATE,
  actual_close_date DATE,
  source VARCHAR(100), -- Fırsat kaynağı
  competitor VARCHAR(100), -- Rakip
  notes TEXT,
  assigned_to UUID REFERENCES admin_users(id),
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Müşteri Segmentasyonu tablosu
CREATE TABLE IF NOT EXISTS customer_segments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  criteria JSONB, -- Segmentasyon kriterleri (JSON formatında)
  customer_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Müşteri Kampanyaları tablosu
CREATE TABLE IF NOT EXISTS customer_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  campaign_type VARCHAR(20) NOT NULL CHECK (campaign_type IN ('email', 'sms', 'whatsapp', 'phone', 'social')),
  target_segment_id UUID REFERENCES customer_segments(id),
  start_date DATE NOT NULL,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  total_recipients INTEGER DEFAULT 0,
  total_sent INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_converted INTEGER DEFAULT 0,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Müşteri Kampanya Detayları tablosu
CREATE TABLE IF NOT EXISTS customer_campaign_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES customer_campaigns(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'converted', 'bounced', 'unsubscribed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Müşteri Geri Bildirimleri tablosu
CREATE TABLE IF NOT EXISTS customer_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  feedback_type VARCHAR(20) NOT NULL CHECK (feedback_type IN ('satisfaction', 'complaint', 'suggestion', 'compliment', 'review')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 1-5 arası puan
  title VARCHAR(255),
  content TEXT NOT NULL,
  order_id UUID, -- İlgili sipariş (eğer varsa)
  is_public BOOLEAN DEFAULT false, -- Halka açık mı?
  is_resolved BOOLEAN DEFAULT false,
  resolution_notes TEXT,
  resolved_by UUID REFERENCES admin_users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_customer_type ON customers(customer_type);
CREATE INDEX IF NOT EXISTS idx_customers_customer_status ON customers(customer_status);
CREATE INDEX IF NOT EXISTS idx_customers_customer_tier ON customers(customer_tier);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);
CREATE INDEX IF NOT EXISTS idx_customer_communications_customer_id ON customer_communications(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_communications_communication_date ON customer_communications(communication_date);
CREATE INDEX IF NOT EXISTS idx_customer_tasks_customer_id ON customer_tasks(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_tasks_due_date ON customer_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_customer_tasks_status ON customer_tasks(status);
CREATE INDEX IF NOT EXISTS idx_customer_opportunities_customer_id ON customer_opportunities(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_opportunities_stage ON customer_opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_customer_campaigns_status ON customer_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_customer_feedback_customer_id ON customer_feedback(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_feedback_rating ON customer_feedback(rating);

-- RLS (Row Level Security) etkinleştir
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_campaign_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_feedback ENABLE ROW LEVEL SECURITY;

-- Policy'ler (Admin kullanıcıları tüm CRM verilerine erişebilir)
CREATE POLICY "Admin users can manage customers" ON customers FOR ALL USING (true);
CREATE POLICY "Admin users can manage customer_communications" ON customer_communications FOR ALL USING (true);
CREATE POLICY "Admin users can manage customer_tags" ON customer_tags FOR ALL USING (true);
CREATE POLICY "Admin users can manage customer_tag_relations" ON customer_tag_relations FOR ALL USING (true);
CREATE POLICY "Admin users can manage customer_tasks" ON customer_tasks FOR ALL USING (true);
CREATE POLICY "Admin users can manage customer_opportunities" ON customer_opportunities FOR ALL USING (true);
CREATE POLICY "Admin users can manage customer_segments" ON customer_segments FOR ALL USING (true);
CREATE POLICY "Admin users can manage customer_campaigns" ON customer_campaigns FOR ALL USING (true);
CREATE POLICY "Admin users can manage customer_campaign_details" ON customer_campaign_details FOR ALL USING (true);
CREATE POLICY "Admin users can manage customer_feedback" ON customer_feedback FOR ALL USING (true);

-- Trigger'lar için fonksiyon
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Müşteri istatistiklerini güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Sipariş eklendiğinde müşteri istatistiklerini güncelle
    IF TG_OP = 'INSERT' AND TG_TABLE_NAME = 'orders' THEN
        UPDATE customers 
        SET 
            total_orders = total_orders + 1,
            total_spent = total_spent + NEW.total_amount,
            average_order_value = (total_spent + NEW.total_amount) / (total_orders + 1),
            last_order_date = NEW.created_at::date,
            first_order_date = COALESCE(first_order_date, NEW.created_at::date)
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger'ları oluştur
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at 
  BEFORE UPDATE ON customers 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customer_tasks_updated_at ON customer_tasks;
CREATE TRIGGER update_customer_tasks_updated_at 
  BEFORE UPDATE ON customer_tasks 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customer_opportunities_updated_at ON customer_opportunities;
CREATE TRIGGER update_customer_opportunities_updated_at 
  BEFORE UPDATE ON customer_opportunities 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customer_segments_updated_at ON customer_segments;
CREATE TRIGGER update_customer_segments_updated_at 
  BEFORE UPDATE ON customer_segments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customer_campaigns_updated_at ON customer_campaigns;
CREATE TRIGGER update_customer_campaigns_updated_at 
  BEFORE UPDATE ON customer_campaigns 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Örnek etiketler
INSERT INTO customer_tags (name, color, description) VALUES
('VIP Müşteri', '#FFD700', 'Çok değerli müşteriler'),
('Yeni Müşteri', '#10B981', 'Yeni kayıt olan müşteriler'),
('Sadık Müşteri', '#8B5CF6', 'Uzun süreli müşteriler'),
('Potansiyel', '#F59E0B', 'Potansiyel müşteriler'),
('Şikayetçi', '#EF4444', 'Şikayet eden müşteriler'),
('Kurumsal', '#3B82F6', 'Kurumsal müşteriler')
ON CONFLICT (name) DO NOTHING;

-- Örnek segmentler
INSERT INTO customer_segments (name, description, criteria) VALUES
('Yüksek Değerli Müşteriler', 'Toplam harcaması 10.000 TL üzeri müşteriler', 
 '{"total_spent": {"$gte": 10000}}'),
('Yeni Müşteriler', 'Son 30 gün içinde kayıt olan müşteriler', 
 '{"created_at": {"$gte": "30 days ago"}}'),
('Aktif Müşteriler', 'Son 90 gün içinde sipariş veren müşteriler', 
 '{"last_order_date": {"$gte": "90 days ago"}}'),
('VIP Müşteriler', 'VIP tier müşteriler', 
 '{"customer_tier": "platinum"}')
ON CONFLICT DO NOTHING;

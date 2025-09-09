-- E-İrsaliye Sistemi
-- GİB E-İrsaliye entegrasyonu ve irsaliye yönetimi

-- E-İrsaliye ayarları
CREATE TABLE IF NOT EXISTS eirsaliye_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(200) NOT NULL,
    tax_number VARCHAR(11) NOT NULL,
    tax_office VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(100),
    gib_username VARCHAR(100) NOT NULL,
    gib_password VARCHAR(500) NOT NULL,
    test_mode BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-İrsaliye durumları
CREATE TABLE IF NOT EXISTS eirsaliye_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status_code VARCHAR(20) NOT NULL UNIQUE,
    status_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_success BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-İrsaliye irsaliyeleri
CREATE TABLE IF NOT EXISTS eirsaliye_irsaliyes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    irsaliye_number VARCHAR(50) NOT NULL UNIQUE,
    irsaliye_date DATE NOT NULL,
    irsaliye_type VARCHAR(20) DEFAULT 'satis', -- 'satis', 'alim', 'iade', 'devir'
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'sent', 'accepted', 'rejected', 'cancelled'
    gib_status VARCHAR(20),
    gib_uuid VARCHAR(100),
    gib_ettn VARCHAR(100),
    sender_vkn VARCHAR(11) NOT NULL,
    sender_title VARCHAR(200) NOT NULL,
    receiver_vkn VARCHAR(11),
    receiver_title VARCHAR(200) NOT NULL,
    receiver_address TEXT,
    receiver_city VARCHAR(50),
    receiver_postal_code VARCHAR(10),
    receiver_phone VARCHAR(20),
    receiver_email VARCHAR(100),
    total_amount DECIMAL(15,2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'TRY',
    tax_amount DECIMAL(15,2) DEFAULT 0,
    net_amount DECIMAL(15,2) NOT NULL,
    notes TEXT,
    xml_content TEXT,
    pdf_path TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    accepted_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-İrsaliye kalemleri
CREATE TABLE IF NOT EXISTS eirsaliye_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    irsaliye_id UUID REFERENCES eirsaliye_irsaliyes(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    product_code VARCHAR(50),
    product_name VARCHAR(200) NOT NULL,
    product_description TEXT,
    unit VARCHAR(20) NOT NULL, -- 'adet', 'kg', 'lt', 'm', 'm2', 'm3'
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 18.00,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    net_amount DECIMAL(15,2) NOT NULL,
    discount_rate DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-İrsaliye logları
CREATE TABLE IF NOT EXISTS eirsaliye_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    irsaliye_id UUID REFERENCES eirsaliye_irsaliyes(id) ON DELETE CASCADE,
    operation_type VARCHAR(50) NOT NULL, -- 'create', 'send', 'status_check', 'cancel', 'download'
    status VARCHAR(20) NOT NULL, -- 'success', 'error', 'warning'
    request_data JSONB,
    response_data JSONB,
    error_message TEXT,
    execution_time INTEGER, -- milisaniye
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-İrsaliye şablonları
CREATE TABLE IF NOT EXISTS eirsaliye_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name VARCHAR(200) NOT NULL,
    template_type VARCHAR(50) NOT NULL, -- 'customer', 'product', 'default'
    template_data JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-İrsaliye müşteri entegrasyonları
CREATE TABLE IF NOT EXISTS eirsaliye_customer_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID,
    customer_vkn VARCHAR(11),
    customer_title VARCHAR(200) NOT NULL,
    integration_type VARCHAR(50) NOT NULL, -- 'api', 'file', 'manual'
    integration_config JSONB,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-İrsaliye toplu işlemler
CREATE TABLE IF NOT EXISTS eirsaliye_batch_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_name VARCHAR(200) NOT NULL,
    operation_type VARCHAR(50) NOT NULL, -- 'send', 'status_check', 'download'
    total_count INTEGER NOT NULL,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-İrsaliye toplu işlem detayları
CREATE TABLE IF NOT EXISTS eirsaliye_batch_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES eirsaliye_batch_operations(id) ON DELETE CASCADE,
    irsaliye_id UUID REFERENCES eirsaliye_irsaliyes(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL, -- 'pending', 'success', 'error'
    error_message TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-İrsaliye raporları
CREATE TABLE IF NOT EXISTS eirsaliye_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_name VARCHAR(200) NOT NULL,
    report_type VARCHAR(50) NOT NULL, -- 'daily', 'monthly', 'yearly', 'custom'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_irsaliyes INTEGER DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    report_data JSONB,
    file_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-İrsaliye bildirimleri
CREATE TABLE IF NOT EXISTS eirsaliye_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    irsaliye_id UUID REFERENCES eirsaliye_irsaliyes(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL, -- 'status_change', 'error', 'reminder'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-İrsaliye kuyruğu
CREATE TABLE IF NOT EXISTS eirsaliye_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    irsaliye_id UUID REFERENCES eirsaliye_irsaliyes(id) ON DELETE CASCADE,
    operation_type VARCHAR(50) NOT NULL, -- 'send', 'status_check', 'download', 'cancel'
    priority INTEGER DEFAULT 5, -- 1-10, 1 en yüksek öncelik
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_eirsaliye_irsaliyes_irsaliye_number ON eirsaliye_irsaliyes(irsaliye_number);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_irsaliyes_irsaliye_date ON eirsaliye_irsaliyes(irsaliye_date);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_irsaliyes_status ON eirsaliye_irsaliyes(status);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_irsaliyes_gib_status ON eirsaliye_irsaliyes(gib_status);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_irsaliyes_sender_vkn ON eirsaliye_irsaliyes(sender_vkn);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_irsaliyes_receiver_vkn ON eirsaliye_irsaliyes(receiver_vkn);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_items_irsaliye_id ON eirsaliye_items(irsaliye_id);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_logs_irsaliye_id ON eirsaliye_logs(irsaliye_id);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_logs_operation_type ON eirsaliye_logs(operation_type);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_logs_created_at ON eirsaliye_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_customer_integrations_customer_vkn ON eirsaliye_customer_integrations(customer_vkn);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_batch_details_batch_id ON eirsaliye_batch_details(batch_id);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_batch_details_irsaliye_id ON eirsaliye_batch_details(irsaliye_id);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_reports_start_date ON eirsaliye_reports(start_date);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_reports_end_date ON eirsaliye_reports(end_date);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_notifications_irsaliye_id ON eirsaliye_notifications(irsaliye_id);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_notifications_is_read ON eirsaliye_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_queue_status ON eirsaliye_queue(status);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_queue_priority ON eirsaliye_queue(priority);
CREATE INDEX IF NOT EXISTS idx_eirsaliye_queue_scheduled_at ON eirsaliye_queue(scheduled_at);

-- Trigger fonksiyonları
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'lar
CREATE TRIGGER update_eirsaliye_settings_updated_at BEFORE UPDATE ON eirsaliye_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_eirsaliye_irsaliyes_updated_at BEFORE UPDATE ON eirsaliye_irsaliyes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_eirsaliye_templates_updated_at BEFORE UPDATE ON eirsaliye_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_eirsaliye_customer_integrations_updated_at BEFORE UPDATE ON eirsaliye_customer_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data
INSERT INTO eirsaliye_statuses (status_code, status_name, description, is_success) VALUES
('GONDERILDI', 'Gönderildi', 'İrsaliye GİB sistemine gönderildi', true),
('KABUL_EDILDI', 'Kabul Edildi', 'İrsaliye alıcı tarafından kabul edildi', true),
('REDDEDILDI', 'Reddedildi', 'İrsaliye alıcı tarafından reddedildi', false),
('IPTAL_EDILDI', 'İptal Edildi', 'İrsaliye iptal edildi', false),
('BEKLEMEDE', 'Beklemede', 'İrsaliye işlem bekliyor', false),
('HATA', 'Hata', 'İrsaliye işleminde hata oluştu', false),
('ZAMAN_ASIMI', 'Zaman Aşımı', 'İrsaliye zaman aşımına uğradı', false)
ON CONFLICT (status_code) DO NOTHING;

-- Varsayılan şablonlar
INSERT INTO eirsaliye_templates (template_name, template_type, template_data, is_default) VALUES
('Varsayılan İrsaliye Şablonu', 'default', '{
  "header": {
    "company_logo": "",
    "show_tax_number": true,
    "show_phone": true,
    "show_email": true
  },
  "items": {
    "show_product_code": true,
    "show_description": true,
    "show_unit": true,
    "show_discount": true
  },
  "footer": {
    "show_notes": true,
    "show_signature": true
  }
}', true),
('Müşteri Şablonu', 'customer', '{
  "customer_info": {
    "show_address": true,
    "show_phone": true,
    "show_email": true
  },
  "items": {
    "show_product_code": false,
    "show_description": true,
    "show_unit": true,
    "show_discount": false
  }
}', false),
('Ürün Şablonu', 'product', '{
  "items": {
    "show_product_code": true,
    "show_description": true,
    "show_unit": true,
    "show_discount": true,
    "group_by_category": true
  }
}', false)
ON CONFLICT DO NOTHING;

-- RLS politikaları
ALTER TABLE eirsaliye_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE eirsaliye_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE eirsaliye_irsaliyes ENABLE ROW LEVEL SECURITY;
ALTER TABLE eirsaliye_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE eirsaliye_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE eirsaliye_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE eirsaliye_customer_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE eirsaliye_batch_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE eirsaliye_batch_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE eirsaliye_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE eirsaliye_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE eirsaliye_queue ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcıları için tam erişim
CREATE POLICY "Admin full access to eirsaliye_settings" ON eirsaliye_settings FOR ALL USING (true);
CREATE POLICY "Admin full access to eirsaliye_statuses" ON eirsaliye_statuses FOR ALL USING (true);
CREATE POLICY "Admin full access to eirsaliye_irsaliyes" ON eirsaliye_irsaliyes FOR ALL USING (true);
CREATE POLICY "Admin full access to eirsaliye_items" ON eirsaliye_items FOR ALL USING (true);
CREATE POLICY "Admin full access to eirsaliye_logs" ON eirsaliye_logs FOR ALL USING (true);
CREATE POLICY "Admin full access to eirsaliye_templates" ON eirsaliye_templates FOR ALL USING (true);
CREATE POLICY "Admin full access to eirsaliye_customer_integrations" ON eirsaliye_customer_integrations FOR ALL USING (true);
CREATE POLICY "Admin full access to eirsaliye_batch_operations" ON eirsaliye_batch_operations FOR ALL USING (true);
CREATE POLICY "Admin full access to eirsaliye_batch_details" ON eirsaliye_batch_details FOR ALL USING (true);
CREATE POLICY "Admin full access to eirsaliye_reports" ON eirsaliye_reports FOR ALL USING (true);
CREATE POLICY "Admin full access to eirsaliye_notifications" ON eirsaliye_notifications FOR ALL USING (true);
CREATE POLICY "Admin full access to eirsaliye_queue" ON eirsaliye_queue FOR ALL USING (true);

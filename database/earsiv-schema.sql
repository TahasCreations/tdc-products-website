-- E-Arşiv Fatura Sistemi Database Schema
-- GİB (Gelir İdaresi Başkanlığı) E-Arşiv entegrasyonu için gerekli tablolar

-- E-Arşiv Entegrasyon Ayarları
CREATE TABLE IF NOT EXISTS earsiv_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    test_mode BOOLEAN DEFAULT true,
    gib_username VARCHAR(255) NOT NULL,
    gib_password VARCHAR(255) NOT NULL,
    gib_endpoint VARCHAR(500) DEFAULT 'https://earsivtest.izibiz.com.tr',
    certificate_path VARCHAR(500),
    certificate_password VARCHAR(255),
    auto_send_enabled BOOLEAN DEFAULT false,
    email_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-Arşiv Durumları
CREATE TABLE IF NOT EXISTS earsiv_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-Arşiv Durumları Seed Data
INSERT INTO earsiv_statuses (name, description) VALUES
('DRAFT', 'Taslak'),
('SENT', 'Gönderildi'),
('DELIVERED', 'Teslim Edildi'),
('REJECTED', 'Reddedildi'),
('CANCELLED', 'İptal Edildi'),
('PROCESSING', 'İşleniyor'),
('ERROR', 'Hata'),
('ARCHIVED', 'Arşivlendi')
ON CONFLICT (name) DO NOTHING;

-- E-Arşiv Faturaları
CREATE TABLE IF NOT EXISTS earsiv_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    gib_uuid VARCHAR(255) UNIQUE,
    invoice_number VARCHAR(100) NOT NULL,
    invoice_date DATE NOT NULL,
    status_id UUID REFERENCES earsiv_statuses(id),
    xml_content TEXT,
    pdf_content BYTEA,
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-Arşiv Logları
CREATE TABLE IF NOT EXISTS earsiv_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    earsiv_invoice_id UUID REFERENCES earsiv_invoices(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    request_data JSONB,
    response_data JSONB,
    status_code INTEGER,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-Arşiv Test Ortamı Ayarları
CREATE TABLE IF NOT EXISTS earsiv_test_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    test_username VARCHAR(255) NOT NULL,
    test_password VARCHAR(255) NOT NULL,
    test_endpoint VARCHAR(500) DEFAULT 'https://earsivtest.izibiz.com.tr',
    test_certificate_path VARCHAR(500),
    test_certificate_password VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-Arşiv Şablonları
CREATE TABLE IF NOT EXISTS earsiv_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_type VARCHAR(50) NOT NULL, -- 'SATIS', 'ALIS', 'IADE', 'TEVKIFAT'
    xml_template TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-Arşiv Müşteri Entegrasyonları
CREATE TABLE IF NOT EXISTS earsiv_customer_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    gib_identifier VARCHAR(255), -- GİB'deki müşteri tanımlayıcısı
    e_arsiv_enabled BOOLEAN DEFAULT false,
    email VARCHAR(255),
    phone VARCHAR(20),
    auto_send BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-Arşiv Toplu İşlemler
CREATE TABLE IF NOT EXISTS earsiv_batch_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    batch_name VARCHAR(255) NOT NULL,
    total_invoices INTEGER DEFAULT 0,
    processed_invoices INTEGER DEFAULT 0,
    successful_invoices INTEGER DEFAULT 0,
    failed_invoices INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-Arşiv Toplu İşlem Detayları
CREATE TABLE IF NOT EXISTS earsiv_batch_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID REFERENCES earsiv_batch_operations(id) ON DELETE CASCADE,
    earsiv_invoice_id UUID REFERENCES earsiv_invoices(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'PENDING',
    error_message TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-Arşiv Raporları
CREATE TABLE IF NOT EXISTS earsiv_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    report_type VARCHAR(50) NOT NULL, -- 'DAILY', 'MONTHLY', 'YEARLY', 'CUSTOM'
    report_date DATE NOT NULL,
    total_invoices INTEGER DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    successful_invoices INTEGER DEFAULT 0,
    failed_invoices INTEGER DEFAULT 0,
    report_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_earsiv_invoices_company_id ON earsiv_invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_earsiv_invoices_status_id ON earsiv_invoices(status_id);
CREATE INDEX IF NOT EXISTS idx_earsiv_invoices_invoice_id ON earsiv_invoices(invoice_id);
CREATE INDEX IF NOT EXISTS idx_earsiv_invoices_invoice_date ON earsiv_invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_earsiv_logs_company_id ON earsiv_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_earsiv_logs_earsiv_invoice_id ON earsiv_logs(earsiv_invoice_id);
CREATE INDEX IF NOT EXISTS idx_earsiv_customer_integrations_company_id ON earsiv_customer_integrations(company_id);
CREATE INDEX IF NOT EXISTS idx_earsiv_customer_integrations_contact_id ON earsiv_customer_integrations(contact_id);
CREATE INDEX IF NOT EXISTS idx_earsiv_batch_operations_company_id ON earsiv_batch_operations(company_id);
CREATE INDEX IF NOT EXISTS idx_earsiv_batch_details_batch_id ON earsiv_batch_details(batch_id);
CREATE INDEX IF NOT EXISTS idx_earsiv_reports_company_id ON earsiv_reports(company_id);
CREATE INDEX IF NOT EXISTS idx_earsiv_reports_report_date ON earsiv_reports(report_date);

-- Triggers
CREATE OR REPLACE FUNCTION update_earsiv_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_earsiv_settings_updated_at
    BEFORE UPDATE ON earsiv_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_earsiv_updated_at();

CREATE TRIGGER trigger_earsiv_invoices_updated_at
    BEFORE UPDATE ON earsiv_invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_earsiv_updated_at();

CREATE TRIGGER trigger_earsiv_test_settings_updated_at
    BEFORE UPDATE ON earsiv_test_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_earsiv_updated_at();

CREATE TRIGGER trigger_earsiv_templates_updated_at
    BEFORE UPDATE ON earsiv_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_earsiv_updated_at();

CREATE TRIGGER trigger_earsiv_customer_integrations_updated_at
    BEFORE UPDATE ON earsiv_customer_integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_earsiv_updated_at();

CREATE TRIGGER trigger_earsiv_batch_operations_updated_at
    BEFORE UPDATE ON earsiv_batch_operations
    FOR EACH ROW
    EXECUTE FUNCTION update_earsiv_updated_at();

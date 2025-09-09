-- E-Fatura Database Schema
-- GİB (Gelir İdaresi Başkanlığı) E-Fatura entegrasyonu için gerekli tablolar

-- E-Fatura Entegrasyon Ayarları
CREATE TABLE IF NOT EXISTS efatura_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    test_mode BOOLEAN DEFAULT true,
    gib_username VARCHAR(255) NOT NULL,
    gib_password VARCHAR(255) NOT NULL,
    gib_endpoint VARCHAR(500) DEFAULT 'https://efaturatest.izibiz.com.tr',
    certificate_path VARCHAR(500),
    certificate_password VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-Fatura Durumları
CREATE TABLE IF NOT EXISTS efatura_statuses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-Fatura Durumları Seed Data
INSERT INTO efatura_statuses (name, description) VALUES
('DRAFT', 'Taslak'),
('SENT', 'Gönderildi'),
('DELIVERED', 'Teslim Edildi'),
('REJECTED', 'Reddedildi'),
('CANCELLED', 'İptal Edildi'),
('PROCESSING', 'İşleniyor'),
('ERROR', 'Hata')
ON CONFLICT (name) DO NOTHING;

-- E-Fatura Faturaları
CREATE TABLE IF NOT EXISTS efatura_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    gib_uuid VARCHAR(255) UNIQUE,
    invoice_number VARCHAR(100) NOT NULL,
    invoice_date DATE NOT NULL,
    status_id UUID REFERENCES efatura_statuses(id),
    xml_content TEXT,
    pdf_content BYTEA,
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-Fatura Logları
CREATE TABLE IF NOT EXISTS efatura_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    efatura_invoice_id UUID REFERENCES efatura_invoices(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    request_data JSONB,
    response_data JSONB,
    status_code INTEGER,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-Fatura Test Ortamı Ayarları
CREATE TABLE IF NOT EXISTS efatura_test_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    test_username VARCHAR(255) NOT NULL,
    test_password VARCHAR(255) NOT NULL,
    test_endpoint VARCHAR(500) DEFAULT 'https://efaturatest.izibiz.com.tr',
    test_certificate_path VARCHAR(500),
    test_certificate_password VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-Fatura Şablonları
CREATE TABLE IF NOT EXISTS efatura_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_type VARCHAR(50) NOT NULL, -- 'SATIS', 'ALIS', 'IADE'
    xml_template TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-Fatura Müşteri Entegrasyonları
CREATE TABLE IF NOT EXISTS efatura_customer_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    gib_identifier VARCHAR(255), -- GİB'deki müşteri tanımlayıcısı
    e_fatura_enabled BOOLEAN DEFAULT false,
    e_arsiv_enabled BOOLEAN DEFAULT false,
    email VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_efatura_invoices_company_id ON efatura_invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_efatura_invoices_status_id ON efatura_invoices(status_id);
CREATE INDEX IF NOT EXISTS idx_efatura_invoices_invoice_id ON efatura_invoices(invoice_id);
CREATE INDEX IF NOT EXISTS idx_efatura_logs_company_id ON efatura_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_efatura_logs_efatura_invoice_id ON efatura_logs(efatura_invoice_id);
CREATE INDEX IF NOT EXISTS idx_efatura_customer_integrations_company_id ON efatura_customer_integrations(company_id);
CREATE INDEX IF NOT EXISTS idx_efatura_customer_integrations_contact_id ON efatura_customer_integrations(contact_id);

-- Triggers
CREATE OR REPLACE FUNCTION update_efatura_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_efatura_settings_updated_at
    BEFORE UPDATE ON efatura_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_efatura_updated_at();

CREATE TRIGGER trigger_efatura_invoices_updated_at
    BEFORE UPDATE ON efatura_invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_efatura_updated_at();

CREATE TRIGGER trigger_efatura_test_settings_updated_at
    BEFORE UPDATE ON efatura_test_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_efatura_updated_at();

CREATE TRIGGER trigger_efatura_templates_updated_at
    BEFORE UPDATE ON efatura_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_efatura_updated_at();

CREATE TRIGGER trigger_efatura_customer_integrations_updated_at
    BEFORE UPDATE ON efatura_customer_integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_efatura_updated_at();
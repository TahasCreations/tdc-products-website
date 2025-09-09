-- Banka Entegrasyonları Sistemi
-- Halkbank, İş Bankası ve diğer bankalar için entegrasyon

-- Banka bilgileri tablosu
CREATE TABLE IF NOT EXISTS banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    logo_url TEXT,
    website_url TEXT,
    support_phone VARCHAR(20),
    support_email VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banka entegrasyon ayarları
CREATE TABLE IF NOT EXISTS bank_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_id UUID REFERENCES banks(id) ON DELETE CASCADE,
    integration_type VARCHAR(50) NOT NULL, -- 'api', 'file_transfer', 'webhook'
    api_endpoint TEXT,
    api_key VARCHAR(500),
    api_secret VARCHAR(500),
    username VARCHAR(100),
    password VARCHAR(500),
    certificate_path TEXT,
    private_key_path TEXT,
    is_test_mode BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_frequency INTEGER DEFAULT 60, -- dakika
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banka hesapları
CREATE TABLE IF NOT EXISTS bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_id UUID REFERENCES banks(id) ON DELETE CASCADE,
    account_name VARCHAR(200) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    iban VARCHAR(34) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'TRY',
    account_type VARCHAR(20) DEFAULT 'checking', -- 'checking', 'savings', 'credit'
    balance DECIMAL(15,2) DEFAULT 0,
    available_balance DECIMAL(15,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    last_balance_update TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banka işlemleri
CREATE TABLE IF NOT EXISTS bank_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
    transaction_id VARCHAR(100) NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'TRY',
    transaction_type VARCHAR(20) NOT NULL, -- 'credit', 'debit'
    description TEXT,
    reference_number VARCHAR(100),
    balance_after DECIMAL(15,2),
    category VARCHAR(50),
    is_reconciled BOOLEAN DEFAULT false,
    reconciled_at TIMESTAMP WITH TIME ZONE,
    reconciled_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EFT/Havale işlemleri
CREATE TABLE IF NOT EXISTS bank_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
    to_bank_code VARCHAR(10),
    to_account_number VARCHAR(50),
    to_iban VARCHAR(34),
    to_name VARCHAR(200) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'TRY',
    description TEXT,
    transfer_type VARCHAR(20) DEFAULT 'eft', -- 'eft', 'havale', 'swift'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    transaction_id VARCHAR(100),
    error_message TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kredi kartı işlemleri
CREATE TABLE IF NOT EXISTS credit_card_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_number VARCHAR(20) NOT NULL,
    card_holder_name VARCHAR(200) NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency_code VARCHAR(3) DEFAULT 'TRY',
    merchant_name VARCHAR(200),
    merchant_category VARCHAR(50),
    transaction_type VARCHAR(20) NOT NULL, -- 'purchase', 'refund', 'cash_advance'
    approval_code VARCHAR(20),
    is_foreign BOOLEAN DEFAULT false,
    exchange_rate DECIMAL(10,4),
    original_amount DECIMAL(15,2),
    original_currency VARCHAR(3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banka entegrasyon logları
CREATE TABLE IF NOT EXISTS bank_integration_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_integration_id UUID REFERENCES bank_integrations(id) ON DELETE CASCADE,
    operation_type VARCHAR(50) NOT NULL, -- 'sync', 'transfer', 'balance_check'
    status VARCHAR(20) NOT NULL, -- 'success', 'error', 'warning'
    request_data JSONB,
    response_data JSONB,
    error_message TEXT,
    execution_time INTEGER, -- milisaniye
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banka bildirimleri
CREATE TABLE IF NOT EXISTS bank_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL, -- 'balance_alert', 'transaction_alert', 'transfer_completed'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Banka şablonları
CREATE TABLE IF NOT EXISTS bank_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_id UUID REFERENCES banks(id) ON DELETE CASCADE,
    template_name VARCHAR(200) NOT NULL,
    template_type VARCHAR(50) NOT NULL, -- 'transfer', 'payment', 'recurring'
    template_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_bank_integrations_bank_id ON bank_integrations(bank_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_bank_id ON bank_accounts(bank_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_account_id ON bank_transactions(bank_account_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_date ON bank_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_bank_transfers_from_account ON bank_transfers(from_account_id);
CREATE INDEX IF NOT EXISTS idx_bank_transfers_status ON bank_transfers(status);
CREATE INDEX IF NOT EXISTS idx_credit_card_transactions_date ON credit_card_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_bank_integration_logs_integration_id ON bank_integration_logs(bank_integration_id);
CREATE INDEX IF NOT EXISTS idx_bank_notifications_account_id ON bank_notifications(bank_account_id);

-- Trigger fonksiyonları
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger'lar
CREATE TRIGGER update_banks_updated_at BEFORE UPDATE ON banks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_integrations_updated_at BEFORE UPDATE ON bank_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON bank_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_transactions_updated_at BEFORE UPDATE ON bank_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_transfers_updated_at BEFORE UPDATE ON bank_transfers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_credit_card_transactions_updated_at BEFORE UPDATE ON credit_card_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_templates_updated_at BEFORE UPDATE ON bank_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data
INSERT INTO banks (name, code, website_url, support_phone, support_email) VALUES
('Türkiye İş Bankası A.Ş.', 'ISBANK', 'https://www.isbank.com.tr', '0850 222 0 800', 'destek@isbank.com.tr'),
('Türkiye Halk Bankası A.Ş.', 'HALKBANK', 'https://www.halkbank.com.tr', '0850 222 0 400', 'destek@halkbank.com.tr'),
('Akbank T.A.Ş.', 'AKBANK', 'https://www.akbank.com', '0850 222 0 500', 'destek@akbank.com'),
('Garanti BBVA', 'GARANTI', 'https://www.garantibbva.com.tr', '0850 222 0 300', 'destek@garanti.com.tr'),
('Yapı Kredi Bankası A.Ş.', 'YAPIKREDI', 'https://www.yapikredi.com.tr', '0850 222 0 444', 'destek@yapikredi.com.tr'),
('Ziraat Bankası A.Ş.', 'ZIRAAT', 'https://www.ziraatbank.com.tr', '0850 222 0 100', 'destek@ziraatbank.com.tr')
ON CONFLICT (code) DO NOTHING;

-- RLS politikaları
ALTER TABLE banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_card_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_integration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_templates ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcıları için tam erişim
CREATE POLICY "Admin full access to banks" ON banks FOR ALL USING (true);
CREATE POLICY "Admin full access to bank_integrations" ON bank_integrations FOR ALL USING (true);
CREATE POLICY "Admin full access to bank_accounts" ON bank_accounts FOR ALL USING (true);
CREATE POLICY "Admin full access to bank_transactions" ON bank_transactions FOR ALL USING (true);
CREATE POLICY "Admin full access to bank_transfers" ON bank_transfers FOR ALL USING (true);
CREATE POLICY "Admin full access to credit_card_transactions" ON credit_card_transactions FOR ALL USING (true);
CREATE POLICY "Admin full access to bank_integration_logs" ON bank_integration_logs FOR ALL USING (true);
CREATE POLICY "Admin full access to bank_notifications" ON bank_notifications FOR ALL USING (true);
CREATE POLICY "Admin full access to bank_templates" ON bank_templates FOR ALL USING (true);

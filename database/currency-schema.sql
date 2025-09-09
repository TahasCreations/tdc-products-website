-- Çoklu Döviz Kuru Sistemi Database Schema
-- TCMB (Türkiye Cumhuriyet Merkez Bankası) entegrasyonu için gerekli tablolar

-- Döviz Kuru Ayarları
CREATE TABLE IF NOT EXISTS currency_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    auto_update_enabled BOOLEAN DEFAULT true,
    update_frequency VARCHAR(20) DEFAULT 'DAILY', -- DAILY, HOURLY, MANUAL
    tcmb_endpoint VARCHAR(500) DEFAULT 'https://www.tcmb.gov.tr/kurlar/today.xml',
    last_update TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Döviz Kuru Geçmişi
CREATE TABLE IF NOT EXISTS currency_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    currency_code VARCHAR(3) NOT NULL, -- USD, EUR, GBP, etc.
    currency_name VARCHAR(100) NOT NULL,
    buy_rate DECIMAL(10,4) NOT NULL,
    sell_rate DECIMAL(10,4) NOT NULL,
    effective_buy_rate DECIMAL(10,4) NOT NULL,
    effective_sell_rate DECIMAL(10,4) NOT NULL,
    rate_date DATE NOT NULL,
    source VARCHAR(50) DEFAULT 'TCMB', -- TCMB, MANUAL, BANK
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Döviz Kuru Logları
CREATE TABLE IF NOT EXISTS currency_rate_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL, -- UPDATE, MANUAL_UPDATE, ERROR
    currency_code VARCHAR(3),
    old_rate DECIMAL(10,4),
    new_rate DECIMAL(10,4),
    source VARCHAR(50),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dövizli İşlemler
CREATE TABLE IF NOT EXISTS currency_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- INVOICE, PAYMENT, RECEIPT, JOURNAL
    transaction_id UUID NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    original_amount DECIMAL(15,2) NOT NULL,
    exchange_rate DECIMAL(10,4) NOT NULL,
    trl_amount DECIMAL(15,2) NOT NULL,
    rate_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Döviz Kuru Favorileri
CREATE TABLE IF NOT EXISTS currency_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    currency_code VARCHAR(3) NOT NULL,
    is_favorite BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Döviz Kuru Alarmları
CREATE TABLE IF NOT EXISTS currency_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    currency_code VARCHAR(3) NOT NULL,
    alert_type VARCHAR(20) NOT NULL, -- ABOVE, BELOW, CHANGE
    target_rate DECIMAL(10,4) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    notification_email VARCHAR(255),
    last_triggered TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_currency_rates_company_id ON currency_rates(company_id);
CREATE INDEX IF NOT EXISTS idx_currency_rates_currency_code ON currency_rates(currency_code);
CREATE INDEX IF NOT EXISTS idx_currency_rates_rate_date ON currency_rates(rate_date);
CREATE INDEX IF NOT EXISTS idx_currency_rates_company_currency_date ON currency_rates(company_id, currency_code, rate_date);
CREATE INDEX IF NOT EXISTS idx_currency_transactions_company_id ON currency_transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_currency_transactions_transaction_id ON currency_transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_currency_rate_logs_company_id ON currency_rate_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_currency_favorites_company_id ON currency_favorites(company_id);
CREATE INDEX IF NOT EXISTS idx_currency_alerts_company_id ON currency_alerts(company_id);

-- Triggers
CREATE OR REPLACE FUNCTION update_currency_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_currency_settings_updated_at
    BEFORE UPDATE ON currency_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_currency_updated_at();

CREATE TRIGGER trigger_currency_rates_updated_at
    BEFORE UPDATE ON currency_rates
    FOR EACH ROW
    EXECUTE FUNCTION update_currency_updated_at();

CREATE TRIGGER trigger_currency_favorites_updated_at
    BEFORE UPDATE ON currency_favorites
    FOR EACH ROW
    EXECUTE FUNCTION update_currency_updated_at();

CREATE TRIGGER trigger_currency_alerts_updated_at
    BEFORE UPDATE ON currency_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_currency_updated_at();

-- Seed Data - Varsayılan döviz kurları
INSERT INTO currency_rates (company_id, currency_code, currency_name, buy_rate, sell_rate, effective_buy_rate, effective_sell_rate, rate_date, source) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'USD', 'Amerikan Doları', 34.5000, 34.6000, 34.5000, 34.6000, CURRENT_DATE, 'TCMB'),
('550e8400-e29b-41d4-a716-446655440000', 'EUR', 'Euro', 37.2000, 37.3000, 37.2000, 37.3000, CURRENT_DATE, 'TCMB'),
('550e8400-e29b-41d4-a716-446655440000', 'GBP', 'İngiliz Sterlini', 43.8000, 43.9000, 43.8000, 43.9000, CURRENT_DATE, 'TCMB'),
('550e8400-e29b-41d4-a716-446655440000', 'JPY', 'Japon Yeni', 0.2300, 0.2400, 0.2300, 0.2400, CURRENT_DATE, 'TCMB'),
('550e8400-e29b-41d4-a716-446655440000', 'CHF', 'İsviçre Frangı', 38.5000, 38.6000, 38.5000, 38.6000, CURRENT_DATE, 'TCMB')
ON CONFLICT DO NOTHING;

-- Varsayılan döviz kuru ayarları
INSERT INTO currency_settings (company_id, auto_update_enabled, update_frequency, last_update) VALUES
('550e8400-e29b-41d4-a716-446655440000', true, 'DAILY', NOW())
ON CONFLICT DO NOTHING;

-- Varsayılan favori dövizler
INSERT INTO currency_favorites (company_id, currency_code, is_favorite, display_order) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'USD', true, 1),
('550e8400-e29b-41d4-a716-446655440000', 'EUR', true, 2),
('550e8400-e29b-41d4-a716-446655440000', 'GBP', true, 3)
ON CONFLICT DO NOTHING;

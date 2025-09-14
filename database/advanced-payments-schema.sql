-- Gelişmiş Ödeme Sistemi Veritabanı Şeması
-- Milyon lira değerinde e-ticaret platformu için

-- Gelişmiş ödemeler tablosu
CREATE TABLE IF NOT EXISTS advanced_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'credit_card', 'bank_transfer', 'crypto', 'mobile_payment'
    amount DECIMAL(15,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL, -- Taksitli ödemeler için toplam tutar
    currency VARCHAR(3) DEFAULT 'TRY',
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20),
    payment_details JSONB, -- Ödeme yöntemine özel detaylar
    installment_data JSONB, -- Taksit bilgileri
    security_checks JSONB, -- Güvenlik kontrolleri
    provider_response JSONB, -- Ödeme sağlayıcısı yanıtı
    fees DECIMAL(10,2) DEFAULT 0,
    processing_time INTEGER, -- Milisaniye cinsinden
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'refunded'
    fraud_score DECIMAL(3,2), -- 0.00 - 1.00 arası
    risk_level VARCHAR(10), -- 'low', 'medium', 'high'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ödeme sağlayıcıları tablosu
CREATE TABLE IF NOT EXISTS payment_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'credit_card', 'bank_transfer', 'crypto', 'mobile_payment'
    enabled BOOLEAN DEFAULT true,
    config JSONB, -- Sağlayıcıya özel konfigürasyon
    fees_config JSONB, -- Komisyon yapılandırması
    security_config JSONB, -- Güvenlik ayarları
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Taksit seçenekleri tablosu
CREATE TABLE IF NOT EXISTS installment_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    installments INTEGER NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    min_amount DECIMAL(10,2) NOT NULL,
    max_amount DECIMAL(10,2),
    enabled BOOLEAN DEFAULT true,
    bank_codes TEXT[], -- Desteklenen banka kodları
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ödeme geçmişi tablosu
CREATE TABLE IF NOT EXISTS payment_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES advanced_payments(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fraud detection logları
CREATE TABLE IF NOT EXISTS fraud_detection_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES advanced_payments(id) ON DELETE CASCADE,
    risk_score DECIMAL(3,2) NOT NULL,
    risk_factors JSONB, -- Risk faktörleri
    action_taken VARCHAR(50), -- 'approved', 'rejected', 'manual_review'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3D Secure doğrulama logları
CREATE TABLE IF NOT EXISTS secure_3d_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES advanced_payments(id) ON DELETE CASCADE,
    verification_method VARCHAR(50), -- 'sms', 'email', 'app'
    verification_code VARCHAR(10),
    verification_status VARCHAR(20), -- 'pending', 'verified', 'failed'
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    verified_at TIMESTAMP WITH TIME ZONE
);

-- Ödeme iade tablosu
CREATE TABLE IF NOT EXISTS payment_refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES advanced_payments(id) ON DELETE CASCADE,
    refund_amount DECIMAL(15,2) NOT NULL,
    refund_reason TEXT,
    refund_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    refund_method VARCHAR(50), -- 'original', 'bank_transfer', 'store_credit'
    refund_details JSONB,
    processed_by UUID, -- Admin kullanıcı ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Ödeme istatistikleri tablosu
CREATE TABLE IF NOT EXISTS payment_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    total_count INTEGER NOT NULL,
    success_count INTEGER NOT NULL,
    failed_count INTEGER NOT NULL,
    average_processing_time INTEGER, -- Milisaniye
    fraud_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler
CREATE INDEX IF NOT EXISTS idx_advanced_payments_transaction_id ON advanced_payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_advanced_payments_customer_email ON advanced_payments(customer_email);
CREATE INDEX IF NOT EXISTS idx_advanced_payments_status ON advanced_payments(status);
CREATE INDEX IF NOT EXISTS idx_advanced_payments_created_at ON advanced_payments(created_at);
CREATE INDEX IF NOT EXISTS idx_advanced_payments_payment_method ON advanced_payments(payment_method);

CREATE INDEX IF NOT EXISTS idx_payment_history_payment_id ON payment_history(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_status ON payment_history(status);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at);

CREATE INDEX IF NOT EXISTS idx_fraud_detection_logs_payment_id ON fraud_detection_logs(payment_id);
CREATE INDEX IF NOT EXISTS idx_fraud_detection_logs_risk_score ON fraud_detection_logs(risk_score);
CREATE INDEX IF NOT EXISTS idx_fraud_detection_logs_created_at ON fraud_detection_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_secure_3d_logs_payment_id ON secure_3d_logs(payment_id);
CREATE INDEX IF NOT EXISTS idx_secure_3d_logs_verification_status ON secure_3d_logs(verification_status);

CREATE INDEX IF NOT EXISTS idx_payment_refunds_payment_id ON payment_refunds(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_refunds_refund_status ON payment_refunds(refund_status);

CREATE INDEX IF NOT EXISTS idx_payment_statistics_date ON payment_statistics(date);
CREATE INDEX IF NOT EXISTS idx_payment_statistics_payment_method ON payment_statistics(payment_method);

-- Trigger'lar
CREATE OR REPLACE FUNCTION update_payment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_advanced_payments_updated_at
    BEFORE UPDATE ON advanced_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_updated_at();

CREATE TRIGGER update_payment_providers_updated_at
    BEFORE UPDATE ON payment_providers
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_updated_at();

CREATE TRIGGER update_installment_options_updated_at
    BEFORE UPDATE ON installment_options
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_updated_at();

-- Ödeme geçmişi otomatik kayıt
CREATE OR REPLACE FUNCTION log_payment_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO payment_history (payment_id, status, description, metadata)
        VALUES (NEW.id, NEW.status, 'Status changed from ' || OLD.status || ' to ' || NEW.status, 
                jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status));
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER log_payment_status_change_trigger
    AFTER UPDATE ON advanced_payments
    FOR EACH ROW
    EXECUTE FUNCTION log_payment_status_change();

-- Varsayılan veriler
INSERT INTO payment_providers (name, type, enabled, config, fees_config, security_config) VALUES
('Visa/MasterCard', 'credit_card', true, 
 '{"processor": "stripe", "api_key": "sk_test_...", "webhook_secret": "whsec_..."}',
 '{"percentage": 2.9, "fixed": 0.30, "currency": "TRY"}',
 '{"3d_secure": true, "fraud_detection": true, "cvv_required": true}'),
 
('Banka Havalesi', 'bank_transfer', true,
 '{"bank_name": "TDC Bank", "iban": "TR12 0006 4000 0011 2345 6789 01", "account_holder": "TDC Products Ltd."}',
 '{"percentage": 0, "fixed": 0, "currency": "TRY"}',
 '{"verification_required": true, "manual_approval": true}'),
 
('Kripto Para', 'crypto', true,
 '{"bitcoin_address": "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", "ethereum_address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"}',
 '{"percentage": 0.5, "fixed": 0, "currency": "TRY"}',
 '{"blockchain_verification": true, "min_confirmations": 1}'),
 
('Mobil Ödeme', 'mobile_payment', true,
 '{"apple_pay": true, "google_pay": true, "paypal": true}',
 '{"percentage": 0, "fixed": 0, "currency": "TRY"}',
 '{"biometric_verification": true, "device_verification": true}');

INSERT INTO installment_options (installments, interest_rate, min_amount, max_amount, enabled, bank_codes) VALUES
(1, 0.00, 0, NULL, true, '{}'),
(2, 0.00, 0, NULL, true, '{}'),
(3, 0.00, 0, NULL, true, '{}'),
(6, 5.00, 100, 50000, true, '{}'),
(9, 8.00, 100, 50000, true, '{}'),
(12, 12.00, 100, 50000, true, '{}');

-- RLS (Row Level Security) politikaları
ALTER TABLE advanced_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_detection_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE secure_3d_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_refunds ENABLE ROW LEVEL SECURITY;

-- Müşteriler sadece kendi ödemelerini görebilir
CREATE POLICY "Customers can view own payments" ON advanced_payments
    FOR SELECT USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Customers can view own payment history" ON payment_history
    FOR SELECT USING (
        payment_id IN (
            SELECT id FROM advanced_payments 
            WHERE customer_email = auth.jwt() ->> 'email'
        )
    );

-- Admin'ler tüm ödemeleri görebilir
CREATE POLICY "Admins can view all payments" ON advanced_payments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data ->> 'role' = 'admin'
        )
    );

-- View'lar
CREATE VIEW payment_summary AS
SELECT 
    p.id,
    p.transaction_id,
    p.payment_method,
    p.amount,
    p.total_amount,
    p.currency,
    p.customer_name,
    p.customer_email,
    p.status,
    p.fees,
    p.processing_time,
    p.created_at,
    CASE 
        WHEN p.installment_data IS NOT NULL THEN 
            (p.installment_data ->> 'installments')::integer
        ELSE 1
    END as installments,
    CASE 
        WHEN p.installment_data IS NOT NULL THEN 
            (p.installment_data ->> 'interestRate')::decimal
        ELSE 0
    END as interest_rate
FROM advanced_payments p;

-- Ödeme istatistikleri view'ı
CREATE VIEW daily_payment_stats AS
SELECT 
    DATE(created_at) as date,
    payment_method,
    COUNT(*) as total_payments,
    SUM(amount) as total_amount,
    AVG(processing_time) as avg_processing_time,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_payments,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_payments
FROM advanced_payments
GROUP BY DATE(created_at), payment_method
ORDER BY date DESC, payment_method;

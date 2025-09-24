-- TDC Market - Tam Veritabanı Şeması
-- Bu dosya tüm e-ticaret modüllerini içerir

-- 1. Admin Kullanıcıları
\i admin-users-schema.sql

-- 2. Sipariş Yönetimi
\i orders-schema.sql

-- 3. Ürün Yönetimi
\i products-schema.sql

-- 4. Ödeme ve Kargo
\i payment-shipping-schema.sql

-- 5. Ek tablolar ve fonksiyonlar

-- Site ayarları tablosu
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bildirimler tablosu
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Log tablosu
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(20) NOT NULL, -- 'debug', 'info', 'warn', 'error'
    message TEXT NOT NULL,
    context JSONB,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);

-- RLS politikaları
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcıları için tam erişim
CREATE POLICY "Admin full access to site_settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Admin full access to notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Admin full access to system_logs" ON system_logs FOR ALL USING (true);

-- Müşteriler için bildirim erişimi
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Genel ayarlar için okuma erişimi
CREATE POLICY "Public can view public settings" ON site_settings FOR SELECT USING (is_public = true);

-- Varsayılan site ayarları
INSERT INTO site_settings (key, value, description, category, is_public) VALUES
('site_name', '"TDC Market"', 'Site adı', 'general', true),
('site_description', '"Global pazaryeri platformu"', 'Site açıklaması', 'general', true),
('site_logo', '""', 'Site logosu URL', 'general', true),
('default_currency', '"TRY"', 'Varsayılan para birimi', 'ecommerce', true),
('supported_currencies', '["TRY", "USD", "EUR"]', 'Desteklenen para birimleri', 'ecommerce', true),
('default_language', '"tr"', 'Varsayılan dil', 'i18n', true),
('supported_languages', '["tr", "en", "de", "fr", "es", "ar"]', 'Desteklenen diller', 'i18n', true),
('maintenance_mode', 'false', 'Bakım modu', 'system', false),
('registration_enabled', 'true', 'Kayıt olma durumu', 'auth', true),
('email_verification_required', 'true', 'E-posta doğrulama gerekli', 'auth', false),
('max_upload_size', '10485760', 'Maksimum dosya yükleme boyutu (bytes)', 'system', false),
('allowed_file_types', '["jpg", "jpeg", "png", "gif", "webp", "pdf", "doc", "docx"]', 'İzin verilen dosya türleri', 'system', false),
('seo_title', '"TDC Market - Global Pazaryeri"', 'SEO başlığı', 'seo', true),
('seo_description', '"TDC Market ile dünya çapında alışveriş yapın. Güvenilir satıcılar, hızlı teslimat, güvenli ödeme."', 'SEO açıklaması', 'seo', true),
('seo_keywords', '"e-ticaret, online alışveriş, pazaryeri, güvenli ödeme, hızlı teslimat"', 'SEO anahtar kelimeleri', 'seo', true),
('contact_email', '"info@tdcmarket.com"', 'İletişim e-postası', 'contact', true),
('contact_phone', '"+90 555 898 82 42"', 'İletişim telefonu', 'contact', true),
('contact_address', '"İstanbul, Türkiye"', 'İletişim adresi', 'contact', true),
('social_facebook', '""', 'Facebook sayfası', 'social', true),
('social_twitter', '""', 'Twitter hesabı', 'social', true),
('social_instagram', '""', 'Instagram hesabı', 'social', true),
('social_linkedin', '""', 'LinkedIn sayfası', 'social', true),
('analytics_google', '""', 'Google Analytics ID', 'analytics', false),
('analytics_facebook', '""', 'Facebook Pixel ID', 'analytics', false),
('payment_iyzico_key', '""', 'iyzico API anahtarı', 'payment', false),
('payment_iyzico_secret', '""', 'iyzico gizli anahtarı', 'payment', false),
('payment_stripe_key', '""', 'Stripe API anahtarı', 'payment', false),
('payment_stripe_secret', '""', 'Stripe gizli anahtarı', 'payment', false),
('email_smtp_host', '""', 'SMTP sunucu', 'email', false),
('email_smtp_port', '587', 'SMTP port', 'email', false),
('email_smtp_user', '""', 'SMTP kullanıcı adı', 'email', false),
('email_smtp_pass', '""', 'SMTP şifre', 'email', false),
('email_from_name', '"TDC Market"', 'E-posta gönderen adı', 'email', false),
('email_from_email', '"noreply@tdcmarket.com"', 'E-posta gönderen adresi', 'email', false)
ON CONFLICT (key) DO NOTHING;

-- Varsayılan kategoriler
INSERT INTO categories (id, name, slug, description, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Elektronik', 'elektronik', 'Elektronik ürünler ve aksesuarlar', true),
('550e8400-e29b-41d4-a716-446655440002', 'Ev & Yaşam', 'ev-yasam', 'Ev ve yaşam ürünleri', true),
('550e8400-e29b-41d4-a716-446655440003', 'Moda', 'moda', 'Giyim ve aksesuar ürünleri', true),
('550e8400-e29b-41d4-a716-446655440004', 'Spor & Outdoor', 'spor-outdoor', 'Spor ve outdoor ürünleri', true),
('550e8400-e29b-41d4-a716-446655440005', 'Kitap & Hobi', 'kitap-hobi', 'Kitap ve hobi ürünleri', true)
ON CONFLICT (slug) DO NOTHING;

-- Varsayılan ödeme yöntemleri
INSERT INTO payment_methods (name, code, type, provider, is_online, is_active, description) VALUES
('Kredi Kartı', 'CREDIT_CARD', 'credit_card', 'iyzico', true, true, 'Visa, Mastercard, American Express'),
('Banka Havalesi', 'BANK_TRANSFER', 'bank_transfer', 'garanti', false, true, 'Banka havalesi ile ödeme'),
('Kapıda Ödeme', 'CASH_ON_DELIVERY', 'cash_on_delivery', 'aras', false, true, 'Kapıda nakit ödeme'),
('PayPal', 'PAYPAL', 'digital_wallet', 'paypal', true, true, 'PayPal ile ödeme')
ON CONFLICT (code) DO NOTHING;

-- Varsayılan kargo firmaları
INSERT INTO shipping_companies (name, code, delivery_time_min, delivery_time_max, base_price, pricing_type, is_active) VALUES
('Aras Kargo', 'ARAS', 1, 2, 15.00, 'weight_based', true),
('MNG Kargo', 'MNG', 1, 3, 12.00, 'weight_based', true),
('Yurtiçi Kargo', 'YURTICI', 2, 4, 10.00, 'weight_based', true),
('PTT Kargo', 'PTT', 3, 5, 8.00, 'fixed', true)
ON CONFLICT (code) DO NOTHING;

-- Varsayılan abonelik planları
INSERT INTO subscription_plans (name, description, type, price, currency, billing_cycle, features, is_popular, is_active) VALUES
('Ücretsiz', 'Temel özellikler', 'buyer', 0.00, 'TRY', 'monthly', '["Sınırsız alışveriş", "Standart destek", "Temel güvenlik"]', false, true),
('Premium', 'Gelişmiş özellikler', 'buyer', 29.99, 'TRY', 'monthly', '["Sınırsız alışveriş", "Öncelikli destek", "Gelişmiş güvenlik", "Hızlı teslimat", "Özel indirimler"]', true, true),
('VIP', 'Tüm özellikler', 'buyer', 59.99, 'TRY', 'monthly', '["Sınırsız alışveriş", "7/24 destek", "Maksimum güvenlik", "Ücretsiz kargo", "Özel indirimler", "Kişisel asistan"]', false, true),
('Satıcı Başlangıç', 'Yeni satıcılar için', 'seller', 99.99, 'TRY', 'monthly', '["50 ürün", "Temel analitik", "E-posta destek", "%5 komisyon"]', false, true),
('Satıcı Profesyonel', 'Deneyimli satıcılar için', 'seller', 199.99, 'TRY', 'monthly', '["500 ürün", "Gelişmiş analitik", "Telefon destek", "%3 komisyon", "Özel kampanyalar"]', true, true),
('Satıcı Kurumsal', 'Büyük işletmeler için', 'seller', 399.99, 'TRY', 'monthly', '["Sınırsız ürün", "Tam analitik", "7/24 destek", "%2 komisyon", "Özel kampanyalar", "API erişimi"]', false, true)
ON CONFLICT DO NOTHING;

-- Trigger: Güncelleme zamanını otomatik güncelle
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_site_settings_updated_at();

-- Fonksiyon: Site ayarını getir
CREATE OR REPLACE FUNCTION get_site_setting(setting_key TEXT)
RETURNS JSONB AS $$
DECLARE
    setting_value JSONB;
BEGIN
    SELECT value INTO setting_value 
    FROM site_settings 
    WHERE key = setting_key AND is_public = true;
    
    RETURN COALESCE(setting_value, 'null'::jsonb);
END;
$$ LANGUAGE plpgsql;

-- Fonksiyon: Bildirim oluştur
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_title TEXT,
    p_message TEXT,
    p_type TEXT DEFAULT 'info',
    p_action_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (user_id, title, message, type, action_url)
    VALUES (p_user_id, p_title, p_message, p_type, p_action_url)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Fonksiyon: Sistem logu oluştur
CREATE OR REPLACE FUNCTION log_system_event(
    p_level TEXT,
    p_message TEXT,
    p_context JSONB DEFAULT NULL,
    p_user_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO system_logs (level, message, context, user_id, ip_address, user_agent)
    VALUES (p_level, p_message, p_context, p_user_id, 
            inet_client_addr(), current_setting('request.headers', true)::jsonb->>'user-agent')
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

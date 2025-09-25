-- 🚀 TDC PRODUCTS WEBSITE - TAM SUPABASE ŞEMASI
-- Bu dosyayı Supabase SQL Editor'da çalıştırın

-- ========================================
-- 1. ADMIN KULLANICILARI
-- ========================================

-- Admin kullanıcıları tablosu
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 2. KATEGORİLER
-- ========================================

-- Kategoriler tablosu
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    description TEXT,
    image_url TEXT,
    emoji VARCHAR(10) DEFAULT '📦',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. ÜRÜNLER
-- ========================================

-- Ürünler tablosu
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    subcategory_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    weight DECIMAL(8,3),
    dimensions JSONB,
    images JSONB,
    main_image TEXT,
    status VARCHAR(20) DEFAULT 'active',
    stock INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 5,
    track_inventory BOOLEAN DEFAULT true,
    allow_backorder BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_digital BOOLEAN DEFAULT false,
    download_url TEXT,
    seo_title VARCHAR(200),
    seo_description TEXT,
    seo_keywords TEXT,
    tags TEXT[],
    attributes JSONB,
    variants JSONB,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 4. SİPARİŞLER
-- ========================================

-- Siparişler tablosu
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    billing_address JSONB NOT NULL,
    shipping_address JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    status VARCHAR(50) DEFAULT 'pending',
    payment_status VARCHAR(50) DEFAULT 'pending',
    shipping_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    shipping_method VARCHAR(50),
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sipariş öğeleri tablosu
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    product_sku VARCHAR(100),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 5. ÖDEME SİSTEMİ
-- ========================================

-- Ödeme yöntemleri tablosu
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL,
    provider VARCHAR(50),
    is_online BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    configuration JSONB,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ödeme işlemleri tablosu
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    status VARCHAR(50) DEFAULT 'pending',
    transaction_id VARCHAR(100),
    gateway_response JSONB,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 6. KARGO SİSTEMİ
-- ========================================

-- Kargo firmaları tablosu
CREATE TABLE IF NOT EXISTS shipping_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    delivery_time_min INTEGER DEFAULT 1,
    delivery_time_max INTEGER DEFAULT 3,
    base_price DECIMAL(10,2) DEFAULT 0,
    pricing_type VARCHAR(50) DEFAULT 'weight_based',
    is_active BOOLEAN DEFAULT true,
    configuration JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kargo işlemleri tablosu
CREATE TABLE IF NOT EXISTS shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    shipping_company_id UUID REFERENCES shipping_companies(id) ON DELETE SET NULL,
    tracking_number VARCHAR(100),
    status VARCHAR(50) DEFAULT 'preparing',
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 7. ABONELİK SİSTEMİ
-- ========================================

-- Abonelik planları tablosu
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'buyer', 'seller'
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    features JSONB,
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kullanıcı abonelikleri tablosu
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'active',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 8. SİTE AYARLARI
-- ========================================

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

-- ========================================
-- 9. BİLDİRİMLER
-- ========================================

-- Bildirimler tablosu
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 10. SİSTEM LOGLARI
-- ========================================

-- Sistem logları tablosu
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    context JSONB,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 11. İNDEKSLER
-- ========================================

-- Kategoriler indeksleri
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_emoji ON categories(emoji);

-- Ürünler indeksleri
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Siparişler indeksleri
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Diğer indeksler
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);

-- ========================================
-- 12. RLS (ROW LEVEL SECURITY)
-- ========================================

-- RLS'yi aktif et
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcıları için tam erişim
CREATE POLICY "Admin full access to admin_users" ON admin_users FOR ALL USING (true);
CREATE POLICY "Admin full access to categories" ON categories FOR ALL USING (true);
CREATE POLICY "Admin full access to products" ON products FOR ALL USING (true);
CREATE POLICY "Admin full access to orders" ON orders FOR ALL USING (true);
CREATE POLICY "Admin full access to order_items" ON order_items FOR ALL USING (true);
CREATE POLICY "Admin full access to payment_methods" ON payment_methods FOR ALL USING (true);
CREATE POLICY "Admin full access to payments" ON payments FOR ALL USING (true);
CREATE POLICY "Admin full access to shipping_companies" ON shipping_companies FOR ALL USING (true);
CREATE POLICY "Admin full access to shipments" ON shipments FOR ALL USING (true);
CREATE POLICY "Admin full access to subscription_plans" ON subscription_plans FOR ALL USING (true);
CREATE POLICY "Admin full access to user_subscriptions" ON user_subscriptions FOR ALL USING (true);
CREATE POLICY "Admin full access to site_settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Admin full access to notifications" ON notifications FOR ALL USING (true);
CREATE POLICY "Admin full access to system_logs" ON system_logs FOR ALL USING (true);

-- Müşteriler için okuma erişimi
CREATE POLICY "Customers can view active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Customers can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Customers can view own orders" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Customers can view own order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.customer_id = auth.uid())
);

-- Genel ayarlar için okuma erişimi
CREATE POLICY "Public can view public settings" ON site_settings FOR SELECT USING (is_public = true);

-- Kullanıcılar için bildirim erişimi
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ========================================
-- 13. TRIGGER'LAR
-- ========================================

-- Güncelleme zamanını otomatik güncelle
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger'ları ekle
CREATE TRIGGER trigger_update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_payment_methods_updated_at
    BEFORE UPDATE ON payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_shipping_companies_updated_at
    BEFORE UPDATE ON shipping_companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_shipments_updated_at
    BEFORE UPDATE ON shipments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_subscription_plans_updated_at
    BEFORE UPDATE ON subscription_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 14. VARSayILAN VERİLER
-- ========================================

-- Varsayılan kategoriler
INSERT INTO categories (id, name, slug, description, emoji, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Elektronik', 'elektronik', 'Elektronik ürünler ve aksesuarlar', '📱', true),
('550e8400-e29b-41d4-a716-446655440002', 'Ev & Yaşam', 'ev-yasam', 'Ev ve yaşam ürünleri', '🏠', true),
('550e8400-e29b-41d4-a716-446655440003', 'Moda', 'moda', 'Giyim ve aksesuar ürünleri', '👕', true),
('550e8400-e29b-41d4-a716-446655440004', 'Spor & Outdoor', 'spor-outdoor', 'Spor ve outdoor ürünleri', '⚽', true),
('550e8400-e29b-41d4-a716-446655440005', 'Kitap & Hobi', 'kitap-hobi', 'Kitap ve hobi ürünleri', '📚', true)
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

-- ========================================
-- 15. YARDIMCI FONKSİYONLAR
-- ========================================

-- Site ayarını getir
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

-- Bildirim oluştur
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

-- Sistem logu oluştur
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

-- ========================================
-- ✅ KURULUM TAMAMLANDI
-- ========================================

-- Kurulum başarılı mesajı
SELECT 'TDC Products Website veritabanı şeması başarıyla kuruldu!' as message;

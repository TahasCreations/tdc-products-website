-- Ödeme ve Kargo Yönetimi Sistemi

-- Ödeme yöntemleri tablosu
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'credit_card', 'bank_transfer', 'cash_on_delivery', 'digital_wallet'
    provider VARCHAR(100), -- 'iyzico', 'stripe', 'paypal', 'garanti', 'isbank'
    is_online BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    processing_fee_percentage DECIMAL(5,2) DEFAULT 0,
    processing_fee_fixed DECIMAL(10,2) DEFAULT 0,
    min_amount DECIMAL(10,2) DEFAULT 0,
    max_amount DECIMAL(10,2),
    supported_currencies TEXT[] DEFAULT ARRAY['TRY'],
    configuration JSONB, -- Provider-specific settings
    icon_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kargo firmaları tablosu
CREATE TABLE IF NOT EXISTS shipping_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    delivery_time_min INTEGER DEFAULT 1, -- Gün cinsinden
    delivery_time_max INTEGER DEFAULT 3,
    base_price DECIMAL(10,2) DEFAULT 0,
    pricing_type VARCHAR(20) DEFAULT 'fixed', -- 'fixed', 'weight_based', 'distance_based'
    price_per_kg DECIMAL(10,2) DEFAULT 0,
    free_shipping_threshold DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    supported_regions TEXT[] DEFAULT ARRAY['Turkey'],
    tracking_url_template TEXT,
    configuration JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kargo fiyatları tablosu
CREATE TABLE IF NOT EXISTS shipping_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipping_company_id UUID REFERENCES shipping_companies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    weight_from DECIMAL(8,3) NOT NULL,
    weight_to DECIMAL(8,3) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    free_shipping_threshold DECIMAL(10,2),
    delivery_time_min INTEGER DEFAULT 1,
    delivery_time_max INTEGER DEFAULT 3,
    is_active BOOLEAN DEFAULT true,
    supported_cities TEXT[],
    excluded_cities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kuponlar tablosu
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount', 'free_shipping'
    value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2),
    usage_limit INTEGER,
    usage_limit_per_customer INTEGER DEFAULT 1,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    applicable_products UUID[],
    applicable_categories UUID[],
    excluded_products UUID[],
    excluded_categories UUID[],
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kupon kullanım geçmişi
CREATE TABLE IF NOT EXISTS coupon_usage_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Abonelik planları tablosu
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL, -- 'seller', 'buyer'
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'yearly', 'lifetime'
    features JSONB NOT NULL, -- Array of features
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    max_products INTEGER,
    max_orders_per_month INTEGER,
    commission_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kullanıcı abonelikleri
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'suspended'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50),
    auto_renew BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_payment_methods_code ON payment_methods(code);
CREATE INDEX IF NOT EXISTS idx_payment_methods_type ON payment_methods(type);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_active ON payment_methods(is_active);
CREATE INDEX IF NOT EXISTS idx_shipping_companies_code ON shipping_companies(code);
CREATE INDEX IF NOT EXISTS idx_shipping_companies_is_active ON shipping_companies(is_active);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_company_id ON shipping_rates(shipping_company_id);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_weight ON shipping_rates(weight_from, weight_to);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_valid_until ON coupons(valid_until);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON coupon_usage_history(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_customer_id ON coupon_usage_history(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_type ON subscription_plans(type);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_is_active ON subscription_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_id ON user_subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);

-- RLS politikaları
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcıları için tam erişim
CREATE POLICY "Admin full access to payment_methods" ON payment_methods FOR ALL USING (true);
CREATE POLICY "Admin full access to shipping_companies" ON shipping_companies FOR ALL USING (true);
CREATE POLICY "Admin full access to shipping_rates" ON shipping_rates FOR ALL USING (true);
CREATE POLICY "Admin full access to coupons" ON coupons FOR ALL USING (true);
CREATE POLICY "Admin full access to coupon_usage_history" ON coupon_usage_history FOR ALL USING (true);
CREATE POLICY "Admin full access to subscription_plans" ON subscription_plans FOR ALL USING (true);
CREATE POLICY "Admin full access to user_subscriptions" ON user_subscriptions FOR ALL USING (true);

-- Müşteriler için okuma erişimi (aktif olanlar)
CREATE POLICY "Customers can view active payment methods" ON payment_methods FOR SELECT USING (is_active = true);
CREATE POLICY "Customers can view active shipping companies" ON shipping_companies FOR SELECT USING (is_active = true);
CREATE POLICY "Customers can view active shipping rates" ON shipping_rates FOR SELECT USING (is_active = true);
CREATE POLICY "Customers can view active coupons" ON coupons FOR SELECT USING (is_active = true);
CREATE POLICY "Customers can view active subscription plans" ON subscription_plans FOR SELECT USING (is_active = true);

-- Müşteriler için kupon kullanımı
CREATE POLICY "Customers can create coupon usage" ON coupon_usage_history FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers can view own coupon usage" ON coupon_usage_history FOR SELECT USING (auth.uid() = customer_id);

-- Müşteriler için abonelik yönetimi
CREATE POLICY "Customers can manage own subscriptions" ON user_subscriptions FOR ALL USING (auth.uid() = user_id);

-- Trigger: Güncelleme zamanını otomatik güncelle
CREATE OR REPLACE FUNCTION update_payment_shipping_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_payment_methods_updated_at
    BEFORE UPDATE ON payment_methods
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_shipping_updated_at();

CREATE TRIGGER trigger_update_shipping_companies_updated_at
    BEFORE UPDATE ON shipping_companies
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_shipping_updated_at();

CREATE TRIGGER trigger_update_shipping_rates_updated_at
    BEFORE UPDATE ON shipping_rates
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_shipping_updated_at();

CREATE TRIGGER trigger_update_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_shipping_updated_at();

CREATE TRIGGER trigger_update_subscription_plans_updated_at
    BEFORE UPDATE ON subscription_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_shipping_updated_at();

CREATE TRIGGER trigger_update_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_shipping_updated_at();

-- Trigger: Kupon kullanım sayacını güncelle
CREATE OR REPLACE FUNCTION update_coupon_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE coupons 
    SET used_count = used_count + 1 
    WHERE id = NEW.coupon_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_coupon_usage_count
    AFTER INSERT ON coupon_usage_history
    FOR EACH ROW
    EXECUTE FUNCTION update_coupon_usage_count();

-- Trigger: Abonelik süresi kontrolü
CREATE OR REPLACE FUNCTION check_subscription_expiry()
RETURNS TRIGGER AS $$
BEGIN
    -- Süresi dolmuş abonelikleri pasif yap
    UPDATE user_subscriptions 
    SET status = 'expired' 
    WHERE expires_at < NOW() AND status = 'active';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_subscription_expiry
    AFTER INSERT OR UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION check_subscription_expiry();

-- E-ticaret Geliştirmeleri Sistemi
-- Bu script kargo, ödeme ve kupon sistemleri için gerekli tabloları oluşturur

-- Kargo Firmaları tablosu
CREATE TABLE IF NOT EXISTS shipping_companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL, -- Kargo kodu (ARAS, YURTICI, MNG, vb.)
  api_endpoint VARCHAR(255), -- API endpoint URL
  api_key VARCHAR(255), -- API anahtarı
  tracking_url_template VARCHAR(255), -- Takip URL şablonu
  logo_url VARCHAR(255), -- Logo URL
  is_active BOOLEAN DEFAULT true,
  delivery_time_min INTEGER, -- Minimum teslimat süresi (gün)
  delivery_time_max INTEGER, -- Maksimum teslimat süresi (gün)
  weight_limit DECIMAL(8,2), -- Ağırlık limiti (kg)
  size_limit VARCHAR(100), -- Boyut limiti
  coverage_areas TEXT[], -- Kapsama alanları
  pricing_type VARCHAR(20) DEFAULT 'fixed' CHECK (pricing_type IN ('fixed', 'weight_based', 'distance_based', 'api_based')),
  base_price DECIMAL(8,2) DEFAULT 0, -- Temel fiyat
  price_per_kg DECIMAL(8,2) DEFAULT 0, -- Kg başına fiyat
  free_shipping_threshold DECIMAL(8,2), -- Ücretsiz kargo eşiği
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kargo Bölgeleri tablosu
CREATE TABLE IF NOT EXISTS shipping_zones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  countries TEXT[] DEFAULT ARRAY['TR'], -- Ülke kodları
  cities TEXT[], -- Şehir isimleri
  postal_codes TEXT[], -- Posta kodları
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kargo Fiyatlandırması tablosu
CREATE TABLE IF NOT EXISTS shipping_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shipping_company_id UUID REFERENCES shipping_companies(id) ON DELETE CASCADE,
  shipping_zone_id UUID REFERENCES shipping_zones(id) ON DELETE CASCADE,
  weight_from DECIMAL(8,2) NOT NULL DEFAULT 0, -- Başlangıç ağırlığı (kg)
  weight_to DECIMAL(8,2), -- Bitiş ağırlığı (kg)
  price DECIMAL(8,2) NOT NULL, -- Fiyat
  free_shipping_threshold DECIMAL(8,2), -- Ücretsiz kargo eşiği
  estimated_days_min INTEGER, -- Tahmini teslimat süresi (min)
  estimated_days_max INTEGER, -- Tahmini teslimat süresi (max)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kargo Takip Numaraları tablosu
CREATE TABLE IF NOT EXISTS shipping_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  shipping_company_id UUID REFERENCES shipping_companies(id),
  tracking_number VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, picked_up, in_transit, delivered, failed
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  tracking_url VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ödeme Yöntemleri tablosu
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL, -- Ödeme kodu (CREDIT_CARD, BANK_TRANSFER, CASH, vb.)
  type VARCHAR(20) NOT NULL CHECK (type IN ('card', 'bank_transfer', 'cash', 'digital_wallet', 'installment')),
  provider VARCHAR(100), -- Ödeme sağlayıcısı (İyzico, PayTR, vb.)
  api_endpoint VARCHAR(255),
  api_key VARCHAR(255),
  secret_key VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  is_online BOOLEAN DEFAULT true, -- Online ödeme mi?
  requires_verification BOOLEAN DEFAULT false, -- Doğrulama gerekiyor mu?
  processing_fee_percentage DECIMAL(5,2) DEFAULT 0, -- İşlem ücreti yüzdesi
  processing_fee_fixed DECIMAL(8,2) DEFAULT 0, -- Sabit işlem ücreti
  min_amount DECIMAL(8,2) DEFAULT 0, -- Minimum ödeme tutarı
  max_amount DECIMAL(8,2), -- Maksimum ödeme tutarı
  supported_currencies TEXT[] DEFAULT ARRAY['TRY'], -- Desteklenen para birimleri
  logo_url VARCHAR(255),
  description TEXT,
  instructions TEXT, -- Kullanım talimatları
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ödeme İşlemleri tablosu
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  payment_method_id UUID REFERENCES payment_methods(id),
  transaction_id VARCHAR(100) UNIQUE, -- Ödeme sağlayıcısından gelen ID
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'TRY',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  payment_status VARCHAR(20), -- Ödeme sağlayıcısından gelen durum
  gateway_response JSONB, -- Ödeme sağlayıcısından gelen yanıt
  failure_reason TEXT, -- Hata sebebi
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kuponlar tablosu
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y')),
  value DECIMAL(10,2) NOT NULL, -- İndirim değeri
  min_order_amount DECIMAL(10,2) DEFAULT 0, -- Minimum sipariş tutarı
  max_discount_amount DECIMAL(10,2), -- Maksimum indirim tutarı
  usage_limit INTEGER, -- Toplam kullanım limiti
  usage_limit_per_customer INTEGER DEFAULT 1, -- Müşteri başına kullanım limiti
  used_count INTEGER DEFAULT 0, -- Kullanım sayısı
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT true, -- Herkese açık mı?
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  applicable_products UUID[], -- Uygulanabilir ürünler
  applicable_categories UUID[], -- Uygulanabilir kategoriler
  excluded_products UUID[], -- Hariç tutulan ürünler
  customer_restrictions JSONB, -- Müşteri kısıtlamaları
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kupon Kullanımları tablosu
CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  discount_amount DECIMAL(10,2) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist tablosu
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- Ürün Karşılaştırması tablosu
CREATE TABLE IF NOT EXISTS product_comparisons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  session_id VARCHAR(100), -- Oturum ID'si (misafir kullanıcılar için)
  product_ids UUID[] NOT NULL, -- Karşılaştırılan ürünler
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ürün İncelemeleri tablosu
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id), -- Hangi siparişten
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT,
  is_verified_purchase BOOLEAN DEFAULT false, -- Doğrulanmış satın alma mı?
  is_approved BOOLEAN DEFAULT false, -- Onaylandı mı?
  helpful_count INTEGER DEFAULT 0, -- Faydalı bulundu sayısı
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ürün İnceleme Yanıtları tablosu
CREATE TABLE IF NOT EXISTS product_review_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES product_reviews(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES admin_users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_shipping_companies_code ON shipping_companies(code);
CREATE INDEX IF NOT EXISTS idx_shipping_companies_is_active ON shipping_companies(is_active);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_company_zone ON shipping_rates(shipping_company_id, shipping_zone_id);
CREATE INDEX IF NOT EXISTS idx_shipping_tracking_order_id ON shipping_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_shipping_tracking_tracking_number ON shipping_tracking(tracking_number);
CREATE INDEX IF NOT EXISTS idx_payment_methods_code ON payment_methods(code);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_active ON payment_methods(is_active);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_transaction_id ON payment_transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);
CREATE INDEX IF NOT EXISTS idx_coupons_valid_from_until ON coupons(valid_from, valid_until);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_order_id ON coupon_usage(order_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_customer_id ON wishlists(customer_id);
CREATE INDEX IF NOT EXISTS idx_product_comparisons_customer_id ON product_comparisons(customer_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_customer_id ON product_reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);

-- RLS (Row Level Security) etkinleştir
ALTER TABLE shipping_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_review_replies ENABLE ROW LEVEL SECURITY;

-- Policy'ler
CREATE POLICY "Admin users can manage shipping_companies" ON shipping_companies FOR ALL USING (true);
CREATE POLICY "Admin users can manage shipping_zones" ON shipping_zones FOR ALL USING (true);
CREATE POLICY "Admin users can manage shipping_rates" ON shipping_rates FOR ALL USING (true);
CREATE POLICY "Admin users can manage shipping_tracking" ON shipping_tracking FOR ALL USING (true);
CREATE POLICY "Admin users can manage payment_methods" ON payment_methods FOR ALL USING (true);
CREATE POLICY "Admin users can manage payment_transactions" ON payment_transactions FOR ALL USING (true);
CREATE POLICY "Admin users can manage coupons" ON coupons FOR ALL USING (true);
CREATE POLICY "Admin users can manage coupon_usage" ON coupon_usage FOR ALL USING (true);
CREATE POLICY "Admin users can manage wishlists" ON wishlists FOR ALL USING (true);
CREATE POLICY "Admin users can manage product_comparisons" ON product_comparisons FOR ALL USING (true);
CREATE POLICY "Admin users can manage product_reviews" ON product_reviews FOR ALL USING (true);
CREATE POLICY "Admin users can manage product_review_replies" ON product_review_replies FOR ALL USING (true);

-- Müşteriler kendi wishlist'lerini yönetebilir
CREATE POLICY "Customers can manage own wishlists" ON wishlists FOR ALL USING (auth.uid() = customer_id);

-- Müşteriler kendi incelemelerini yönetebilir
CREATE POLICY "Customers can manage own reviews" ON product_reviews FOR ALL USING (auth.uid() = customer_id);

-- Trigger'lar için fonksiyon
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Kupon kullanım sayısını güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_coupon_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE coupons 
        SET used_count = used_count + 1
        WHERE id = NEW.coupon_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE coupons 
        SET used_count = used_count - 1
        WHERE id = OLD.coupon_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger'ları oluştur
DROP TRIGGER IF EXISTS update_shipping_companies_updated_at ON shipping_companies;
CREATE TRIGGER update_shipping_companies_updated_at 
  BEFORE UPDATE ON shipping_companies 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shipping_rates_updated_at ON shipping_rates;
CREATE TRIGGER update_shipping_rates_updated_at 
  BEFORE UPDATE ON shipping_rates 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shipping_tracking_updated_at ON shipping_tracking;
CREATE TRIGGER update_shipping_tracking_updated_at 
  BEFORE UPDATE ON shipping_tracking 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER update_payment_methods_updated_at 
  BEFORE UPDATE ON payment_methods 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_transactions_updated_at ON payment_transactions;
CREATE TRIGGER update_payment_transactions_updated_at 
  BEFORE UPDATE ON payment_transactions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
CREATE TRIGGER update_coupons_updated_at 
  BEFORE UPDATE ON coupons 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_comparisons_updated_at ON product_comparisons;
CREATE TRIGGER update_product_comparisons_updated_at 
  BEFORE UPDATE ON product_comparisons 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_reviews_updated_at ON product_reviews;
CREATE TRIGGER update_product_reviews_updated_at 
  BEFORE UPDATE ON product_reviews 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_coupon_usage_count_trigger ON coupon_usage;
CREATE TRIGGER update_coupon_usage_count_trigger 
  AFTER INSERT OR DELETE ON coupon_usage 
  FOR EACH ROW 
  EXECUTE FUNCTION update_coupon_usage_count();

-- Örnek veriler
INSERT INTO shipping_companies (name, code, delivery_time_min, delivery_time_max, base_price, is_active) VALUES
('Aras Kargo', 'ARAS', 1, 3, 15.00, true),
('Yurtiçi Kargo', 'YURTICI', 1, 2, 12.00, true),
('MNG Kargo', 'MNG', 1, 3, 14.00, true),
('PTT Kargo', 'PTT', 2, 5, 10.00, true),
('Sürat Kargo', 'SURAT', 1, 2, 13.00, true)
ON CONFLICT (code) DO NOTHING;

INSERT INTO payment_methods (name, code, type, is_active, is_online, processing_fee_percentage) VALUES
('Kredi Kartı', 'CREDIT_CARD', 'card', true, true, 2.90),
('Banka Havalesi', 'BANK_TRANSFER', 'bank_transfer', true, false, 0.00),
('Kapıda Ödeme', 'CASH_ON_DELIVERY', 'cash', true, false, 5.00),
('Taksitli Ödeme', 'INSTALLMENT', 'installment', true, true, 3.50),
('PayPal', 'PAYPAL', 'digital_wallet', true, true, 3.40)
ON CONFLICT (code) DO NOTHING;

INSERT INTO shipping_zones (name, description, countries, cities) VALUES
('İstanbul', 'İstanbul il sınırları', ARRAY['TR'], ARRAY['İstanbul']),
('Ankara', 'Ankara il sınırları', ARRAY['TR'], ARRAY['Ankara']),
('İzmir', 'İzmir il sınırları', ARRAY['TR'], ARRAY['İzmir']),
('Diğer İller', 'Diğer tüm iller', ARRAY['TR'], ARRAY[]::TEXT[])
ON CONFLICT DO NOTHING;

-- Örnek kuponlar
INSERT INTO coupons (code, name, description, type, value, min_order_amount, usage_limit, valid_until) VALUES
('WELCOME10', 'Hoş Geldin İndirimi', 'Yeni müşteriler için %10 indirim', 'percentage', 10.00, 100.00, 100, NOW() + INTERVAL '1 year'),
('FREESHIP', 'Ücretsiz Kargo', '200 TL üzeri alışverişlerde ücretsiz kargo', 'free_shipping', 0.00, 200.00, 1000, NOW() + INTERVAL '6 months'),
('SAVE50', '50 TL İndirim', '300 TL üzeri alışverişlerde 50 TL indirim', 'fixed_amount', 50.00, 300.00, 50, NOW() + INTERVAL '3 months')
ON CONFLICT (code) DO NOTHING;

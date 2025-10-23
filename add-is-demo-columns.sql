-- =====================================================
-- IS_DEMO ALAN EKLEME SCRIPTI
-- =====================================================
-- Bu script tüm tablolara is_demo boolean alanı ekler
-- Demo veri temizliği için önce bu script çalıştırılmalıdır
-- 
-- NOT: Bu script güvenlidir, mevcut verileri değiştirmez
-- =====================================================

BEGIN;

-- E-commerce tabloları
ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS sellers ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS product_reviews ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS product_filters ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Kullanıcı tabloları
ALTER TABLE IF EXISTS customers ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS admin_users ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS site_users ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Sipariş tabloları
ALTER TABLE IF EXISTS orders ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS invoices ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS coupons ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Blog tabloları
ALTER TABLE IF EXISTS blog_posts ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS comments ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Kampanya tabloları
ALTER TABLE IF EXISTS campaigns ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS gift_cards ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Çalışan tabloları
ALTER TABLE IF EXISTS employees ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Wishlist ve subscriptions
ALTER TABLE IF EXISTS wishlist ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS subscriptions ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Loyalty
ALTER TABLE IF EXISTS loyalty_points ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- AI ve optimization
ALTER TABLE IF EXISTS price_optimization ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS automations ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS ai_recommendations ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS ai_insights ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS ai_chatbot_interactions ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Security
ALTER TABLE IF EXISTS security_threats ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS security_vulnerabilities ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Performance
ALTER TABLE IF EXISTS performance_metrics ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS page_performance ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS bundle_analysis ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS performance_recommendations ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Analytics
ALTER TABLE IF EXISTS analytics_sessions ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS page_views ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS sessions ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Logs
ALTER TABLE IF EXISTS error_logs ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS security_logs ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Index oluştur (performans için)
CREATE INDEX IF NOT EXISTS idx_categories_is_demo ON categories(is_demo) WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_products_is_demo ON products(is_demo) WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_sellers_is_demo ON sellers(is_demo) WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_orders_is_demo ON orders(is_demo) WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_customers_is_demo ON customers(is_demo) WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_admin_users_is_demo ON admin_users(is_demo) WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_is_demo ON blog_posts(is_demo) WHERE is_demo = true;
CREATE INDEX IF NOT EXISTS idx_campaigns_is_demo ON campaigns(is_demo) WHERE is_demo = true;

COMMIT;

SELECT '✅ is_demo alanları başarıyla eklendi!' as "Durum";
SELECT '💡 Şimdi check-demo-data.sql ile kontrol edebilir veya clean-demo-data.sql ile temizlik yapabilirsiniz' as "Sonraki Adım";


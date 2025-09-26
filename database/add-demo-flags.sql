-- Demo Data Management Schema Updates
-- Bu script tüm tablolara is_demo alanı ekler ve mevcut demo verileri işaretler

-- Categories tablosuna is_demo alanı ekle
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Products tablosuna is_demo alanı ekle
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Orders tablosuna is_demo alanı ekle
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Customers tablosuna is_demo alanı ekle
ALTER TABLE customers ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Coupons tablosuna is_demo alanı ekle
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Invoices tablosuna is_demo alanı ekle
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Campaigns tablosuna is_demo alanı ekle
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Employees tablosuna is_demo alanı ekle
ALTER TABLE employees ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Admin users tablosuna is_demo alanı ekle
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Site users tablosuna is_demo alanı ekle
ALTER TABLE site_users ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Blog posts tablosuna is_demo alanı ekle
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Comments tablosuna is_demo alanı ekle
ALTER TABLE comments ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Wishlist tablosuna is_demo alanı ekle
ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Subscriptions tablosuna is_demo alanı ekle
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Gift cards tablosuna is_demo alanı ekle
ALTER TABLE gift_cards ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Loyalty points tablosuna is_demo alanı ekle
ALTER TABLE loyalty_points ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Price optimization tablosuna is_demo alanı ekle
ALTER TABLE price_optimization ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Automations tablosuna is_demo alanı ekle
ALTER TABLE automations ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- AI recommendations tablosuna is_demo alanı ekle
ALTER TABLE ai_recommendations ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Security threats tablosuna is_demo alanı ekle
ALTER TABLE security_threats ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Security vulnerabilities tablosuna is_demo alanı ekle
ALTER TABLE security_vulnerabilities ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Performance metrics tablosuna is_demo alanı ekle
ALTER TABLE performance_metrics ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Page performance tablosuna is_demo alanı ekle
ALTER TABLE page_performance ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Bundle analysis tablosuna is_demo alanı ekle
ALTER TABLE bundle_analysis ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Performance recommendations tablosuna is_demo alanı ekle
ALTER TABLE performance_recommendations ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- AI insights tablosuna is_demo alanı ekle
ALTER TABLE ai_insights ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- AI chatbot interactions tablosuna is_demo alanı ekle
ALTER TABLE ai_chatbot_interactions ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Analytics sessions tablosuna is_demo alanı ekle
ALTER TABLE analytics_sessions ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Page views tablosuna is_demo alanı ekle
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Sessions tablosuna is_demo alanı ekle
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Users tablosuna is_demo alanı ekle
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Error logs tablosuna is_demo alanı ekle
ALTER TABLE error_logs ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Security logs tablosuna is_demo alanı ekle
ALTER TABLE security_logs ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Mevcut demo verileri işaretle
-- Categories
UPDATE categories SET is_demo = true 
WHERE name ILIKE '%demo%' 
   OR name ILIKE '%test%' 
   OR name ILIKE '%sample%'
   OR slug ILIKE '%demo%'
   OR slug ILIKE '%test%'
   OR slug ILIKE '%sample%';

-- Products
UPDATE products SET is_demo = true 
WHERE name ILIKE '%demo%' 
   OR name ILIKE '%test%' 
   OR name ILIKE '%sample%'
   OR sku ILIKE 'DEMO-%'
   OR sku ILIKE 'TEST-%'
   OR sku ILIKE 'SAMPLE-%'
   OR description ILIKE '%demo%'
   OR description ILIKE '%test%'
   OR description ILIKE '%sample%';

-- Orders
UPDATE orders SET is_demo = true 
WHERE order_number ILIKE '%demo%'
   OR order_number ILIKE '%test%'
   OR order_number ILIKE '%sample%'
   OR customer_name ILIKE '%demo%'
   OR customer_name ILIKE '%test%'
   OR customer_name ILIKE '%sample%'
   OR customer_email ILIKE '%@example.com'
   OR customer_email ILIKE '%@demo.com'
   OR customer_email ILIKE '%@test.com';

-- Customers
UPDATE customers SET is_demo = true 
WHERE first_name ILIKE '%demo%'
   OR first_name ILIKE '%test%'
   OR first_name ILIKE '%sample%'
   OR last_name ILIKE '%demo%'
   OR last_name ILIKE '%test%'
   OR last_name ILIKE '%sample%'
   OR email ILIKE '%@example.com'
   OR email ILIKE '%@demo.com'
   OR email ILIKE '%@test.com'
   OR company_name ILIKE '%demo%'
   OR company_name ILIKE '%test%'
   OR company_name ILIKE '%sample%';

-- Coupons
UPDATE coupons SET is_demo = true 
WHERE code ILIKE '%demo%'
   OR code ILIKE '%test%'
   OR code ILIKE '%sample%'
   OR description ILIKE '%demo%'
   OR description ILIKE '%test%'
   OR description ILIKE '%sample%';

-- Invoices
UPDATE invoices SET is_demo = true 
WHERE invoice_number ILIKE '%demo%'
   OR invoice_number ILIKE '%test%'
   OR invoice_number ILIKE '%sample%'
   OR customer_name ILIKE '%demo%'
   OR customer_name ILIKE '%test%'
   OR customer_name ILIKE '%sample%'
   OR customer_email ILIKE '%@example.com'
   OR customer_email ILIKE '%@demo.com'
   OR customer_email ILIKE '%@test.com';

-- Campaigns
UPDATE campaigns SET is_demo = true 
WHERE name ILIKE '%demo%'
   OR name ILIKE '%test%'
   OR name ILIKE '%sample%'
   OR description ILIKE '%demo%'
   OR description ILIKE '%test%'
   OR description ILIKE '%sample%';

-- Employees
UPDATE employees SET is_demo = true 
WHERE first_name ILIKE '%demo%'
   OR first_name ILIKE '%test%'
   OR first_name ILIKE '%sample%'
   OR last_name ILIKE '%demo%'
   OR last_name ILIKE '%test%'
   OR last_name ILIKE '%sample%'
   OR email ILIKE '%@example.com'
   OR email ILIKE '%@demo.com'
   OR email ILIKE '%@test.com';

-- Admin users
UPDATE admin_users SET is_demo = true 
WHERE name ILIKE '%demo%'
   OR name ILIKE '%test%'
   OR name ILIKE '%sample%'
   OR email ILIKE '%@example.com'
   OR email ILIKE '%@demo.com'
   OR email ILIKE '%@test.com';

-- Site users
UPDATE site_users SET is_demo = true 
WHERE first_name ILIKE '%demo%'
   OR first_name ILIKE '%test%'
   OR first_name ILIKE '%sample%'
   OR last_name ILIKE '%demo%'
   OR last_name ILIKE '%test%'
   OR last_name ILIKE '%sample%'
   OR email ILIKE '%@example.com'
   OR email ILIKE '%@demo.com'
   OR email ILIKE '%@test.com';

-- Blog posts
UPDATE blog_posts SET is_demo = true 
WHERE title ILIKE '%demo%'
   OR title ILIKE '%test%'
   OR title ILIKE '%sample%'
   OR slug ILIKE '%demo%'
   OR slug ILIKE '%test%'
   OR slug ILIKE '%sample%'
   OR content ILIKE '%demo%'
   OR content ILIKE '%test%'
   OR content ILIKE '%sample%';

-- Comments
UPDATE comments SET is_demo = true 
WHERE content ILIKE '%demo%'
   OR content ILIKE '%test%'
   OR content ILIKE '%sample%'
   OR author_name ILIKE '%demo%'
   OR author_name ILIKE '%test%'
   OR author_name ILIKE '%sample%'
   OR author_email ILIKE '%@example.com'
   OR author_email ILIKE '%@demo.com'
   OR author_email ILIKE '%@test.com';

-- Wishlist
UPDATE wishlist SET is_demo = true 
WHERE user_id ILIKE '%demo%'
   OR user_id ILIKE '%test%'
   OR user_id ILIKE '%sample%';

-- Subscriptions
UPDATE subscriptions SET is_demo = true 
WHERE user_id ILIKE '%demo%'
   OR user_id ILIKE '%test%'
   OR user_id ILIKE '%sample%'
   OR plan_name ILIKE '%demo%'
   OR plan_name ILIKE '%test%'
   OR plan_name ILIKE '%sample%';

-- Gift cards
UPDATE gift_cards SET is_demo = true 
WHERE code ILIKE '%demo%'
   OR code ILIKE '%test%'
   OR code ILIKE '%sample%'
   OR recipient_email ILIKE '%@example.com'
   OR recipient_email ILIKE '%@demo.com'
   OR recipient_email ILIKE '%@test.com';

-- Loyalty points
UPDATE loyalty_points SET is_demo = true 
WHERE user_id ILIKE '%demo%'
   OR user_id ILIKE '%test%'
   OR user_id ILIKE '%sample%';

-- Price optimization
UPDATE price_optimization SET is_demo = true 
WHERE product_id ILIKE '%demo%'
   OR product_id ILIKE '%test%'
   OR product_id ILIKE '%sample%';

-- Automations
UPDATE automations SET is_demo = true 
WHERE name ILIKE '%demo%'
   OR name ILIKE '%test%'
   OR name ILIKE '%sample%'
   OR description ILIKE '%demo%'
   OR description ILIKE '%test%'
   OR description ILIKE '%sample%';

-- AI recommendations
UPDATE ai_recommendations SET is_demo = true 
WHERE user_id ILIKE '%demo%'
   OR user_id ILIKE '%test%'
   OR user_id ILIKE '%sample%'
   OR product_id ILIKE '%demo%'
   OR product_id ILIKE '%test%'
   OR product_id ILIKE '%sample%';

-- Security threats
UPDATE security_threats SET is_demo = true 
WHERE title ILIKE '%demo%'
   OR title ILIKE '%test%'
   OR title ILIKE '%sample%'
   OR description ILIKE '%demo%'
   OR description ILIKE '%test%'
   OR description ILIKE '%sample%';

-- Security vulnerabilities
UPDATE security_vulnerabilities SET is_demo = true 
WHERE title ILIKE '%demo%'
   OR title ILIKE '%test%'
   OR title ILIKE '%sample%'
   OR description ILIKE '%demo%'
   OR description ILIKE '%test%'
   OR description ILIKE '%sample%';

-- Performance metrics
UPDATE performance_metrics SET is_demo = true 
WHERE page_name ILIKE '%demo%'
   OR page_name ILIKE '%test%'
   OR page_name ILIKE '%sample%'
   OR page_url ILIKE '%demo%'
   OR page_url ILIKE '%test%'
   OR page_url ILIKE '%sample%';

-- Page performance
UPDATE page_performance SET is_demo = true 
WHERE page_name ILIKE '%demo%'
   OR page_name ILIKE '%test%'
   OR page_name ILIKE '%sample%'
   OR page_url ILIKE '%demo%'
   OR page_url ILIKE '%test%'
   OR page_url ILIKE '%sample%';

-- Bundle analysis
UPDATE bundle_analysis SET is_demo = true 
WHERE name ILIKE '%demo%'
   OR name ILIKE '%test%'
   OR name ILIKE '%sample%';

-- Performance recommendations
UPDATE performance_recommendations SET is_demo = true 
WHERE title ILIKE '%demo%'
   OR title ILIKE '%test%'
   OR title ILIKE '%sample%'
   OR description ILIKE '%demo%'
   OR description ILIKE '%test%'
   OR description ILIKE '%sample%';

-- AI insights
UPDATE ai_insights SET is_demo = true 
WHERE title ILIKE '%demo%'
   OR title ILIKE '%test%'
   OR title ILIKE '%sample%'
   OR description ILIKE '%demo%'
   OR description ILIKE '%test%'
   OR description ILIKE '%sample%';

-- AI chatbot interactions
UPDATE ai_chatbot_interactions SET is_demo = true 
WHERE user_id ILIKE '%demo%'
   OR user_id ILIKE '%test%'
   OR user_id ILIKE '%sample%';

-- Analytics sessions
UPDATE analytics_sessions SET is_demo = true 
WHERE user_id ILIKE '%demo%'
   OR user_id ILIKE '%test%'
   OR user_id ILIKE '%sample%';

-- Page views
UPDATE page_views SET is_demo = true 
WHERE user_id ILIKE '%demo%'
   OR user_id ILIKE '%test%'
   OR user_id ILIKE '%sample%'
   OR path ILIKE '%demo%'
   OR path ILIKE '%test%'
   OR path ILIKE '%sample%';

-- Sessions
UPDATE sessions SET is_demo = true 
WHERE user_id ILIKE '%demo%'
   OR user_id ILIKE '%test%'
   OR user_id ILIKE '%sample%';

-- Users
UPDATE users SET is_demo = true 
WHERE first_name ILIKE '%demo%'
   OR first_name ILIKE '%test%'
   OR first_name ILIKE '%sample%'
   OR last_name ILIKE '%demo%'
   OR last_name ILIKE '%test%'
   OR last_name ILIKE '%sample%'
   OR email ILIKE '%@example.com'
   OR email ILIKE '%@demo.com'
   OR email ILIKE '%@test.com';

-- Error logs
UPDATE error_logs SET is_demo = true 
WHERE message ILIKE '%demo%'
   OR message ILIKE '%test%'
   OR message ILIKE '%sample%'
   OR user_id ILIKE '%demo%'
   OR user_id ILIKE '%test%'
   OR user_id ILIKE '%sample%';

-- Security logs
UPDATE security_logs SET is_demo = true 
WHERE event_type ILIKE '%demo%'
   OR event_type ILIKE '%test%'
   OR event_type ILIKE '%sample%'
   OR user_id ILIKE '%demo%'
   OR user_id ILIKE '%test%'
   OR user_id ILIKE '%sample%';

-- Demo veri sayılarını raporla
SELECT 
    'categories' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM categories
UNION ALL
SELECT 
    'products' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM products
UNION ALL
SELECT 
    'orders' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM orders
UNION ALL
SELECT 
    'customers' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM customers
UNION ALL
SELECT 
    'coupons' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM coupons
UNION ALL
SELECT 
    'invoices' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM invoices
UNION ALL
SELECT 
    'campaigns' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM campaigns
UNION ALL
SELECT 
    'employees' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM employees
UNION ALL
SELECT 
    'admin_users' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM admin_users
UNION ALL
SELECT 
    'site_users' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM site_users
UNION ALL
SELECT 
    'blog_posts' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM blog_posts
UNION ALL
SELECT 
    'comments' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM comments
UNION ALL
SELECT 
    'wishlist' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM wishlist
UNION ALL
SELECT 
    'subscriptions' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM subscriptions
UNION ALL
SELECT 
    'gift_cards' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM gift_cards
UNION ALL
SELECT 
    'loyalty_points' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM loyalty_points
UNION ALL
SELECT 
    'price_optimization' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM price_optimization
UNION ALL
SELECT 
    'automations' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM automations
UNION ALL
SELECT 
    'ai_recommendations' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM ai_recommendations
UNION ALL
SELECT 
    'security_threats' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM security_threats
UNION ALL
SELECT 
    'security_vulnerabilities' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM security_vulnerabilities
UNION ALL
SELECT 
    'performance_metrics' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM performance_metrics
UNION ALL
SELECT 
    'page_performance' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM page_performance
UNION ALL
SELECT 
    'bundle_analysis' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM bundle_analysis
UNION ALL
SELECT 
    'performance_recommendations' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM performance_recommendations
UNION ALL
SELECT 
    'ai_insights' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM ai_insights
UNION ALL
SELECT 
    'ai_chatbot_interactions' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM ai_chatbot_interactions
UNION ALL
SELECT 
    'analytics_sessions' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM analytics_sessions
UNION ALL
SELECT 
    'page_views' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM page_views
UNION ALL
SELECT 
    'sessions' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM sessions
UNION ALL
SELECT 
    'users' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM users
UNION ALL
SELECT 
    'error_logs' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM error_logs
UNION ALL
SELECT 
    'security_logs' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN is_demo = true THEN 1 END) as demo_records
FROM security_logs
ORDER BY table_name;

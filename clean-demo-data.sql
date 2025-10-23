-- =====================================================
-- DEMO VERİLERİNİ TEMİZLEME SCRIPTI
-- =====================================================
-- Bu script tüm demo/test verilerini güvenli bir şekilde siler
-- Ana admin kullanıcısını ve sistem ayarlarını korur
-- 
-- KULLANIM:
-- 1. Önce veritabanı yedeği alın!
-- 2. Bu script'i Supabase SQL Editor'da çalıştırın
-- 3. Sonuçları kontrol edin
-- =====================================================

-- İşlem başlangıcı
BEGIN;

-- =====================================================
-- 1. E-COMMERCE VERİLERİ TEMİZLİĞİ
-- =====================================================

-- 1.1 Ürün yorumlarını sil (is_demo = true olanlar)
DELETE FROM product_reviews WHERE is_demo = true;
RAISE NOTICE 'Ürün yorumları temizlendi';

-- 1.2 Ürün filtrelerini sil
DELETE FROM product_filters WHERE category_id IN (
    SELECT id FROM categories WHERE is_demo = true
);
RAISE NOTICE 'Ürün filtreleri temizlendi';

-- 1.3 Demo ürünleri sil
DELETE FROM products WHERE is_demo = true;
RAISE NOTICE 'Demo ürünler temizlendi';

-- 1.4 Demo satıcıları sil
DELETE FROM sellers WHERE is_demo = true;
RAISE NOTICE 'Demo satıcılar temizlendi';

-- 1.5 Demo kategorileri sil
DELETE FROM categories WHERE is_demo = true;
RAISE NOTICE 'Demo kategoriler temizlendi';

-- =====================================================
-- 2. KULLANICI VERİLERİ TEMİZLİĞİ
-- =====================================================

-- 2.1 Demo müşterileri sil (@example.com, @demo.com, @test.com)
DELETE FROM customers 
WHERE email ILIKE '%@example.com'
   OR email ILIKE '%@demo.com'
   OR email ILIKE '%@test.com'
   OR is_demo = true;
RAISE NOTICE 'Demo müşteriler temizlendi';

-- 2.2 Demo site kullanıcılarını sil (ANA ADMİN HARİÇ)
DELETE FROM site_users 
WHERE is_demo = true
   OR (email ILIKE '%@example.com' AND email != 'bentahasarii@gmail.com')
   OR (email ILIKE '%@demo.com' AND email != 'bentahasarii@gmail.com')
   OR (email ILIKE '%@test.com' AND email != 'bentahasarii@gmail.com');
RAISE NOTICE 'Demo site kullanıcıları temizlendi';

-- 2.3 Demo admin kullanıcılarını sil (ANA ADMİN HARİÇ)
DELETE FROM admin_users 
WHERE is_demo = true
   OR (email ILIKE '%@example.com' AND email != 'bentahasarii@gmail.com')
   OR (email ILIKE '%@demo.com' AND email != 'bentahasarii@gmail.com')
   OR (email ILIKE '%@test.com' AND email != 'bentahasarii@gmail.com');
RAISE NOTICE 'Demo admin kullanıcıları temizlendi (Ana admin korundu)';

-- =====================================================
-- 3. SİPARİŞ VE MUHASEBE VERİLERİ TEMİZLİĞİ
-- =====================================================

-- 3.1 Demo siparişleri sil
DELETE FROM orders 
WHERE is_demo = true
   OR customer_email ILIKE '%@example.com'
   OR customer_email ILIKE '%@demo.com'
   OR customer_email ILIKE '%@test.com';
RAISE NOTICE 'Demo siparişler temizlendi';

-- 3.2 Demo faturaları sil
DELETE FROM invoices 
WHERE is_demo = true
   OR customer_email ILIKE '%@example.com'
   OR customer_email ILIKE '%@demo.com'
   OR customer_email ILIKE '%@test.com';
RAISE NOTICE 'Demo faturalar temizlendi';

-- 3.3 Demo kuponları sil
DELETE FROM coupons WHERE is_demo = true;
RAISE NOTICE 'Demo kuponlar temizlendi';

-- =====================================================
-- 4. MUHASEBE SİSTEMİ TEMİZLİĞİ
-- =====================================================

-- 4.1 Demo şirket verilerini sil
-- (TDC Products Ltd. Şti. gibi demo şirket)
DELETE FROM journal_lines 
WHERE journal_entry_id IN (
    SELECT id FROM journal_entries 
    WHERE company_id = '550e8400-e29b-41d4-a716-446655440000'
);

DELETE FROM journal_entries 
WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';

DELETE FROM stock_items 
WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';

DELETE FROM contacts 
WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';

DELETE FROM bank_accounts 
WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';

DELETE FROM cashboxes 
WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';

DELETE FROM tax_configs 
WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';

DELETE FROM accounts 
WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';

DELETE FROM companies 
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

RAISE NOTICE 'Demo muhasebe verileri temizlendi';

-- =====================================================
-- 5. BLOG VE İÇERİK VERİLERİ TEMİZLİĞİ
-- =====================================================

-- 5.1 Demo yorumları sil
DELETE FROM comments 
WHERE is_demo = true
   OR author_email ILIKE '%@example.com'
   OR author_email ILIKE '%@demo.com'
   OR author_email ILIKE '%@test.com';
RAISE NOTICE 'Demo yorumlar temizlendi';

-- 5.2 Demo blog yazılarını sil
DELETE FROM blog_posts WHERE is_demo = true;
RAISE NOTICE 'Demo blog yazıları temizlendi';

-- =====================================================
-- 6. KAMPANYA VE PAZARLAMA VERİLERİ TEMİZLİĞİ
-- =====================================================

-- 6.1 Demo kampanyaları sil
DELETE FROM campaigns WHERE is_demo = true;
RAISE NOTICE 'Demo kampanyalar temizlendi';

-- 6.2 Demo hediye kartlarını sil
DELETE FROM gift_cards 
WHERE is_demo = true
   OR recipient_email ILIKE '%@example.com'
   OR recipient_email ILIKE '%@demo.com'
   OR recipient_email ILIKE '%@test.com';
RAISE NOTICE 'Demo hediye kartları temizlendi';

-- =====================================================
-- 7. ÇALIŞAN VERİLERİ TEMİZLİĞİ
-- =====================================================

-- 7.1 Demo çalışanları sil
DELETE FROM employees 
WHERE is_demo = true
   OR email ILIKE '%@example.com'
   OR email ILIKE '%@demo.com'
   OR email ILIKE '%@test.com';
RAISE NOTICE 'Demo çalışanlar temizlendi';

-- =====================================================
-- 8. DİĞER SİSTEM VERİLERİ TEMİZLİĞİ
-- =====================================================

-- 8.1 Wishlist temizle
DELETE FROM wishlist WHERE is_demo = true;
RAISE NOTICE 'Demo wishlist temizlendi';

-- 8.2 Subscriptions temizle
DELETE FROM subscriptions WHERE is_demo = true;
RAISE NOTICE 'Demo abonelikler temizlendi';

-- 8.3 Loyalty points temizle
DELETE FROM loyalty_points WHERE is_demo = true;
RAISE NOTICE 'Demo sadakat puanları temizlendi';

-- 8.4 Price optimization temizle
DELETE FROM price_optimization WHERE is_demo = true;
RAISE NOTICE 'Demo fiyat optimizasyonları temizlendi';

-- 8.5 Automations temizle
DELETE FROM automations WHERE is_demo = true;
RAISE NOTICE 'Demo otomasyonlar temizlendi';

-- =====================================================
-- 9. AI VE ANALİTİK VERİLERİ TEMİZLİĞİ
-- =====================================================

-- 9.1 AI recommendations temizle
DELETE FROM ai_recommendations WHERE is_demo = true;
RAISE NOTICE 'Demo AI önerileri temizlendi';

-- 9.2 AI insights temizle
DELETE FROM ai_insights WHERE is_demo = true;
RAISE NOTICE 'Demo AI içgörüleri temizlendi';

-- 9.3 AI chatbot interactions temizle
DELETE FROM ai_chatbot_interactions WHERE is_demo = true;
RAISE NOTICE 'Demo chatbot etkileşimleri temizlendi';

-- 9.4 Analytics sessions temizle
DELETE FROM analytics_sessions WHERE is_demo = true;
RAISE NOTICE 'Demo analytics oturumları temizlendi';

-- 9.5 Page views temizle
DELETE FROM page_views WHERE is_demo = true;
RAISE NOTICE 'Demo sayfa görüntülemeleri temizlendi';

-- 9.6 Sessions temizle
DELETE FROM sessions WHERE is_demo = true;
RAISE NOTICE 'Demo oturumlar temizlendi';

-- =====================================================
-- 10. GÜVENLİK VE PERFORMANS VERİLERİ TEMİZLİĞİ
-- =====================================================

-- 10.1 Security threats temizle
DELETE FROM security_threats WHERE is_demo = true;
RAISE NOTICE 'Demo güvenlik tehditleri temizlendi';

-- 10.2 Security vulnerabilities temizle
DELETE FROM security_vulnerabilities WHERE is_demo = true;
RAISE NOTICE 'Demo güvenlik açıkları temizlendi';

-- 10.3 Performance metrics temizle
DELETE FROM performance_metrics WHERE is_demo = true;
RAISE NOTICE 'Demo performans metrikleri temizlendi';

-- 10.4 Page performance temizle
DELETE FROM page_performance WHERE is_demo = true;
RAISE NOTICE 'Demo sayfa performansı temizlendi';

-- 10.5 Bundle analysis temizle
DELETE FROM bundle_analysis WHERE is_demo = true;
RAISE NOTICE 'Demo bundle analizleri temizlendi';

-- 10.6 Performance recommendations temizle
DELETE FROM performance_recommendations WHERE is_demo = true;
RAISE NOTICE 'Demo performans önerileri temizlendi';

-- =====================================================
-- 11. LOG VERİLERİ TEMİZLİĞİ
-- =====================================================

-- 11.1 Error logs temizle
DELETE FROM error_logs WHERE is_demo = true;
RAISE NOTICE 'Demo hata logları temizlendi';

-- 11.2 Security logs temizle
DELETE FROM security_logs WHERE is_demo = true;
RAISE NOTICE 'Demo güvenlik logları temizlendi';

-- =====================================================
-- 12. PRISMA SEED VERİLERİ TEMİZLİĞİ
-- =====================================================

-- 12.1 Test kullanıcılarını sil
DELETE FROM "User" 
WHERE email IN (
    'admin@tdc.local',
    'seller@tdc.local',
    'seller2@tdc.local',
    'buyer@tdc.local',
    'admin@tdcmarket.com',
    'seller@tdcmarket.com'
);
RAISE NOTICE 'Prisma seed kullanıcıları temizlendi';

-- =====================================================
-- 13. ADMIN OTURUM VE AKTİVİTE LOGLARINI TEMİZLE
-- =====================================================

-- 13.1 Süresi dolmuş admin oturumlarını temizle
DELETE FROM admin_sessions WHERE expires_at < NOW();
RAISE NOTICE 'Süresi dolmuş admin oturumları temizlendi';

-- 13.2 Eski admin aktivite loglarını temizle (90 günden eski)
DELETE FROM admin_activity_logs WHERE created_at < NOW() - INTERVAL '90 days';
RAISE NOTICE 'Eski admin aktivite logları temizlendi';

-- =====================================================
-- SONUÇ RAPORU
-- =====================================================

-- Temizlik sonrası kalan kayıt sayıları
DO $$
DECLARE
    msg TEXT;
BEGIN
    RAISE NOTICE '=================================================';
    RAISE NOTICE 'TEMİZLİK SONUÇ RAPORU';
    RAISE NOTICE '=================================================';
    
    -- Her tablo için kalan kayıt sayısını göster
    PERFORM pg_sleep(0.1);
    
    SELECT INTO msg FORMAT('✓ Categories kalan: %s', COUNT(*)) FROM categories;
    RAISE NOTICE '%', msg;
    
    SELECT INTO msg FORMAT('✓ Products kalan: %s', COUNT(*)) FROM products;
    RAISE NOTICE '%', msg;
    
    SELECT INTO msg FORMAT('✓ Sellers kalan: %s', COUNT(*)) FROM sellers;
    RAISE NOTICE '%', msg;
    
    SELECT INTO msg FORMAT('✓ Customers kalan: %s', COUNT(*)) FROM customers;
    RAISE NOTICE '%', msg;
    
    SELECT INTO msg FORMAT('✓ Orders kalan: %s', COUNT(*)) FROM orders;
    RAISE NOTICE '%', msg;
    
    SELECT INTO msg FORMAT('✓ Admin Users kalan: %s', COUNT(*)) FROM admin_users;
    RAISE NOTICE '%', msg;
    
    SELECT INTO msg FORMAT('✓ Site Users kalan: %s', COUNT(*)) FROM site_users;
    RAISE NOTICE '%', msg;
    
    SELECT INTO msg FORMAT('✓ Companies kalan: %s', COUNT(*)) FROM companies;
    RAISE NOTICE '%', msg;
    
    RAISE NOTICE '=================================================';
    RAISE NOTICE '✅ Demo veri temizliği tamamlandı!';
    RAISE NOTICE '=================================================';
END $$;

-- İşlemi onayla
COMMIT;

-- Vacuum işlemi (opsiyonel, veritabanını optimize eder)
VACUUM ANALYZE;


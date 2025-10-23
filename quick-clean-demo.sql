-- =====================================================
-- HIZLI DEMO VERİ TEMİZLİĞİ
-- =====================================================
-- Bu basitleştirilmiş script sadece var olan tabloları temizler
-- Supabase SQL Editor'da çalıştırın
-- =====================================================

BEGIN;

-- 1. E-COMMERCE VERİLERİ
DO $$ 
BEGIN
    -- Product reviews
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_reviews') THEN
        DELETE FROM product_reviews WHERE is_demo = true;
        RAISE NOTICE '✓ Ürün yorumları temizlendi';
    END IF;

    -- Product filters
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_filters') THEN
        DELETE FROM product_filters WHERE category_id IN (
            SELECT id FROM categories WHERE is_demo = true
        );
        RAISE NOTICE '✓ Ürün filtreleri temizlendi';
    END IF;

    -- Products
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        DELETE FROM products WHERE is_demo = true;
        RAISE NOTICE '✓ Demo ürünler temizlendi';
    END IF;

    -- Sellers
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sellers') THEN
        DELETE FROM sellers WHERE is_demo = true;
        RAISE NOTICE '✓ Demo satıcılar temizlendi';
    END IF;

    -- Categories
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') THEN
        DELETE FROM categories WHERE is_demo = true;
        RAISE NOTICE '✓ Demo kategoriler temizlendi';
    END IF;
END $$;

-- 2. KULLANICI VERİLERİ
DO $$ 
BEGIN
    -- Customers
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'customers') THEN
        DELETE FROM customers 
        WHERE email ILIKE '%@example.com'
           OR email ILIKE '%@demo.com'
           OR email ILIKE '%@test.com'
           OR is_demo = true;
        RAISE NOTICE '✓ Demo müşteriler temizlendi';
    END IF;

    -- Site users (ANA ADMİN HARİÇ)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_users') THEN
        DELETE FROM site_users 
        WHERE is_demo = true
           OR (email ILIKE '%@example.com' AND email != 'bentahasarii@gmail.com')
           OR (email ILIKE '%@demo.com' AND email != 'bentahasarii@gmail.com')
           OR (email ILIKE '%@test.com' AND email != 'bentahasarii@gmail.com');
        RAISE NOTICE '✓ Demo site kullanıcıları temizlendi';
    END IF;

    -- Admin users (ANA ADMİN HARİÇ)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_users') THEN
        DELETE FROM admin_users 
        WHERE is_demo = true
           OR (email ILIKE '%@example.com' AND email != 'bentahasarii@gmail.com')
           OR (email ILIKE '%@demo.com' AND email != 'bentahasarii@gmail.com')
           OR (email ILIKE '%@test.com' AND email != 'bentahasarii@gmail.com');
        RAISE NOTICE '✓ Demo admin kullanıcıları temizlendi (Ana admin korundu)';
    END IF;

    -- Prisma User tablosu
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'User') THEN
        DELETE FROM "User" 
        WHERE email IN (
            'admin@tdc.local',
            'seller@tdc.local',
            'seller2@tdc.local',
            'buyer@tdc.local',
            'admin@tdcmarket.com',
            'seller@tdcmarket.com'
        );
        RAISE NOTICE '✓ Prisma seed kullanıcıları temizlendi';
    END IF;
END $$;

-- 3. SİPARİŞ VERİLERİ
DO $$ 
BEGIN
    -- Orders
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'orders') THEN
        DELETE FROM orders 
        WHERE is_demo = true
           OR customer_email ILIKE '%@example.com'
           OR customer_email ILIKE '%@demo.com'
           OR customer_email ILIKE '%@test.com';
        RAISE NOTICE '✓ Demo siparişler temizlendi';
    END IF;

    -- Invoices
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'invoices') THEN
        DELETE FROM invoices 
        WHERE is_demo = true
           OR customer_email ILIKE '%@example.com'
           OR customer_email ILIKE '%@demo.com'
           OR customer_email ILIKE '%@test.com';
        RAISE NOTICE '✓ Demo faturalar temizlendi';
    END IF;

    -- Coupons
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'coupons') THEN
        DELETE FROM coupons WHERE is_demo = true;
        RAISE NOTICE '✓ Demo kuponlar temizlendi';
    END IF;
END $$;

-- 4. MUHASEBE SİSTEMİ (Demo Şirket: TDC Products Ltd.)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'journal_lines') THEN
        DELETE FROM journal_lines 
        WHERE journal_entry_id IN (
            SELECT id FROM journal_entries 
            WHERE company_id = '550e8400-e29b-41d4-a716-446655440000'
        );
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'journal_entries') THEN
        DELETE FROM journal_entries 
        WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stock_items') THEN
        DELETE FROM stock_items 
        WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contacts') THEN
        DELETE FROM contacts 
        WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bank_accounts') THEN
        DELETE FROM bank_accounts 
        WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cashboxes') THEN
        DELETE FROM cashboxes 
        WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tax_configs') THEN
        DELETE FROM tax_configs 
        WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'accounts') THEN
        DELETE FROM accounts 
        WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies') THEN
        DELETE FROM companies 
        WHERE id = '550e8400-e29b-41d4-a716-446655440000';
        RAISE NOTICE '✓ Demo muhasebe verileri temizlendi';
    END IF;
END $$;

-- 5. BLOG VE İÇERİK
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'comments') THEN
        DELETE FROM comments 
        WHERE is_demo = true
           OR author_email ILIKE '%@example.com'
           OR author_email ILIKE '%@demo.com'
           OR author_email ILIKE '%@test.com';
        RAISE NOTICE '✓ Demo yorumlar temizlendi';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_posts') THEN
        DELETE FROM blog_posts WHERE is_demo = true;
        RAISE NOTICE '✓ Demo blog yazıları temizlendi';
    END IF;
END $$;

-- 6. KAMPANYA VE PAZARLAMA
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'campaigns') THEN
        DELETE FROM campaigns WHERE is_demo = true;
        RAISE NOTICE '✓ Demo kampanyalar temizlendi';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gift_cards') THEN
        DELETE FROM gift_cards 
        WHERE is_demo = true
           OR recipient_email ILIKE '%@example.com'
           OR recipient_email ILIKE '%@demo.com'
           OR recipient_email ILIKE '%@test.com';
        RAISE NOTICE '✓ Demo hediye kartları temizlendi';
    END IF;
END $$;

-- 7. ÇALIŞAN VERİLERİ
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'employees') THEN
        DELETE FROM employees 
        WHERE is_demo = true
           OR email ILIKE '%@example.com'
           OR email ILIKE '%@demo.com'
           OR email ILIKE '%@test.com';
        RAISE NOTICE '✓ Demo çalışanlar temizlendi';
    END IF;
END $$;

-- 8. OTURUM VE LOG TEMİZLİĞİ
DO $$ 
BEGIN
    -- Süresi dolmuş oturumlar
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_sessions') THEN
        DELETE FROM admin_sessions WHERE expires_at < NOW();
        RAISE NOTICE '✓ Süresi dolmuş admin oturumları temizlendi';
    END IF;

    -- Eski aktivite logları (90 gün+)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_activity_logs') THEN
        DELETE FROM admin_activity_logs WHERE created_at < NOW() - INTERVAL '90 days';
        RAISE NOTICE '✓ Eski admin aktivite logları temizlendi';
    END IF;
END $$;

-- SONUÇ RAPORU
DO $$
DECLARE
    msg TEXT;
BEGIN
    RAISE NOTICE '=================================================';
    RAISE NOTICE '✅ DEMO VERİ TEMİZLİĞİ TAMAMLANDI!';
    RAISE NOTICE '=================================================';
    
    -- Kalan kayıt sayıları
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') THEN
        SELECT INTO msg FORMAT('Categories kalan: %s', COUNT(*)) FROM categories;
        RAISE NOTICE '%', msg;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        SELECT INTO msg FORMAT('Products kalan: %s', COUNT(*)) FROM products;
        RAISE NOTICE '%', msg;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sellers') THEN
        SELECT INTO msg FORMAT('Sellers kalan: %s', COUNT(*)) FROM sellers;
        RAISE NOTICE '%', msg;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_users') THEN
        SELECT INTO msg FORMAT('Admin Users kalan: %s', COUNT(*)) FROM admin_users;
        RAISE NOTICE '%', msg;
        
        -- Ana admin kontrolü
        IF EXISTS (SELECT 1 FROM admin_users WHERE email = 'bentahasarii@gmail.com') THEN
            RAISE NOTICE '✅ Ana admin korundu: bentahasarii@gmail.com';
        ELSE
            RAISE WARNING '❌ UYARI: Ana admin bulunamadı!';
        END IF;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies') THEN
        SELECT INTO msg FORMAT('Companies kalan: %s', COUNT(*)) FROM companies;
        RAISE NOTICE '%', msg;
    END IF;
    
    RAISE NOTICE '=================================================';
END $$;

COMMIT;

-- Optimize et
VACUUM ANALYZE;

SELECT '🎉 Veritabanı temizliği başarıyla tamamlandı!' as "Durum";


-- =====================================================
-- HIZLI DEMO VERİ KONTROLÜ
-- =====================================================
-- Bu script mevcut demo verileri kontrol eder
-- Supabase SQL Editor'da çalıştırın
-- =====================================================

SELECT '🔍 DEMO VERİ KONTROL RAPORU' as "════════════════════════";

-- E-COMMERCE
DO $$ 
DECLARE
    cat_count INTEGER := 0;
    prod_count INTEGER := 0;
    seller_count INTEGER := 0;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '🏷️ E-COMMERCE VERİLERİ';
    RAISE NOTICE '─────────────────────';
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'categories') THEN
        SELECT COUNT(*) INTO cat_count FROM categories WHERE is_demo = true;
        RAISE NOTICE 'Categories demo: %', cat_count;
    ELSE
        RAISE NOTICE 'Categories: Tablo yok';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products') THEN
        SELECT COUNT(*) INTO prod_count FROM products WHERE is_demo = true;
        RAISE NOTICE 'Products demo: %', prod_count;
    ELSE
        RAISE NOTICE 'Products: Tablo yok';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sellers') THEN
        SELECT COUNT(*) INTO seller_count FROM sellers WHERE is_demo = true;
        RAISE NOTICE 'Sellers demo: %', seller_count;
    ELSE
        RAISE NOTICE 'Sellers: Tablo yok';
    END IF;
END $$;

-- KULLANICILAR
DO $$ 
DECLARE
    admin_count INTEGER := 0;
    admin_demo INTEGER := 0;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '👥 KULLANICI VERİLERİ';
    RAISE NOTICE '─────────────────────';
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_users') THEN
        SELECT COUNT(*) INTO admin_count FROM admin_users;
        SELECT COUNT(*) INTO admin_demo FROM admin_users 
        WHERE is_demo = true 
           OR (email ILIKE '%@example.com' AND email != 'bentahasarii@gmail.com')
           OR (email ILIKE '%@demo.com' AND email != 'bentahasarii@gmail.com')
           OR (email ILIKE '%@test.com' AND email != 'bentahasarii@gmail.com');
        RAISE NOTICE 'Admin Users toplam: % (Demo: %)', admin_count, admin_demo;
        
        -- Ana admin kontrolü
        IF EXISTS (SELECT 1 FROM admin_users WHERE email = 'bentahasarii@gmail.com') THEN
            RAISE NOTICE '✅ Ana admin mevcut: bentahasarii@gmail.com';
        ELSE
            RAISE WARNING '❌ Ana admin BULUNAMADI!';
        END IF;
    ELSE
        RAISE NOTICE 'Admin Users: Tablo yok';
    END IF;
END $$;

-- MUHASEBE
DO $$ 
DECLARE
    company_count INTEGER := 0;
    account_count INTEGER := 0;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '💼 MUHASEBE VERİLERİ';
    RAISE NOTICE '─────────────────────';
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies') THEN
        SELECT COUNT(*) INTO company_count FROM companies 
        WHERE id = '550e8400-e29b-41d4-a716-446655440000';
        RAISE NOTICE 'Demo Companies: %', company_count;
    ELSE
        RAISE NOTICE 'Companies: Tablo yok';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'accounts') THEN
        SELECT COUNT(*) INTO account_count FROM accounts 
        WHERE company_id = '550e8400-e29b-41d4-a716-446655440000';
        RAISE NOTICE 'Demo Accounts: %', account_count;
    ELSE
        RAISE NOTICE 'Accounts: Tablo yok';
    END IF;
END $$;

SELECT '';
SELECT '════════════════════════' as "Kontrol Tamamlandı";
SELECT '✅ Yukarıdaki sayıları kontrol edin' as "Not";
SELECT '💡 Temizlemek için quick-clean-demo.sql çalıştırın' as "Sonraki Adım";


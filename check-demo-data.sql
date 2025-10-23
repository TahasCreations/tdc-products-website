-- =====================================================
-- DEMO VERİLERİNİ KONTROL ETME SCRIPTI
-- =====================================================
-- Bu script mevcut demo/test verilerini listeler
-- Temizlik öncesi ve sonrası karşılaştırma için kullanın
-- =====================================================

-- Başlık
SELECT '========================================' as "TEMİZLİK ÖNCESİ DEMO VERİLERİ RAPORU";
SELECT '========================================' as "----------------------------------------";

-- =====================================================
-- 1. E-COMMERCE VERİLERİ
-- =====================================================

SELECT 
    '🏷️ E-COMMERCE VERİLERİ' as "Kategori",
    '' as "Tablo",
    '' as "Toplam",
    '' as "Demo",
    '' as "Gerçek";

SELECT 
    '├─' as "Kategori",
    'categories' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN is_demo = true THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN is_demo = false OR is_demo IS NULL THEN 1 END)::text as "Gerçek"
FROM categories;

SELECT 
    '├─' as "Kategori",
    'products' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN is_demo = true THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN is_demo = false OR is_demo IS NULL THEN 1 END)::text as "Gerçek"
FROM products;

SELECT 
    '├─' as "Kategori",
    'sellers' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN is_demo = true THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN is_demo = false OR is_demo IS NULL THEN 1 END)::text as "Gerçek"
FROM sellers;

SELECT 
    '└─' as "Kategori",
    'product_reviews' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN is_demo = true THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN is_demo = false OR is_demo IS NULL THEN 1 END)::text as "Gerçek"
FROM product_reviews;

-- =====================================================
-- 2. KULLANICI VERİLERİ
-- =====================================================

SELECT '' as ""; -- Boş satır

SELECT 
    '👥 KULLANICI VERİLERİ' as "Kategori",
    '' as "Tablo",
    '' as "Toplam",
    '' as "Demo",
    '' as "Gerçek";

SELECT 
    '├─' as "Kategori",
    'admin_users' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN is_demo = true OR email ILIKE '%@example.com' OR email ILIKE '%@demo.com' OR email ILIKE '%@test.com' THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN (is_demo = false OR is_demo IS NULL) AND email NOT ILIKE '%@example.com' AND email NOT ILIKE '%@demo.com' AND email NOT ILIKE '%@test.com' THEN 1 END)::text as "Gerçek"
FROM admin_users;

SELECT 
    '├─' as "Kategori",
    'site_users' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN is_demo = true OR email ILIKE '%@example.com' OR email ILIKE '%@demo.com' OR email ILIKE '%@test.com' THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN (is_demo = false OR is_demo IS NULL) AND email NOT ILIKE '%@example.com' AND email NOT ILIKE '%@demo.com' AND email NOT ILIKE '%@test.com' THEN 1 END)::text as "Gerçek"
FROM site_users;

SELECT 
    '└─' as "Kategori",
    'customers' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN is_demo = true OR email ILIKE '%@example.com' OR email ILIKE '%@demo.com' OR email ILIKE '%@test.com' THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN (is_demo = false OR is_demo IS NULL) AND email NOT ILIKE '%@example.com' AND email NOT ILIKE '%@demo.com' AND email NOT ILIKE '%@test.com' THEN 1 END)::text as "Gerçek"
FROM customers;

-- =====================================================
-- 3. SİPARİŞ VERİLERİ
-- =====================================================

SELECT '' as ""; -- Boş satır

SELECT 
    '🛒 SİPARİŞ VERİLERİ' as "Kategori",
    '' as "Tablo",
    '' as "Toplam",
    '' as "Demo",
    '' as "Gerçek";

SELECT 
    '├─' as "Kategori",
    'orders' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN is_demo = true OR customer_email ILIKE '%@example.com' OR customer_email ILIKE '%@demo.com' OR customer_email ILIKE '%@test.com' THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN (is_demo = false OR is_demo IS NULL) AND customer_email NOT ILIKE '%@example.com' AND customer_email NOT ILIKE '%@demo.com' AND customer_email NOT ILIKE '%@test.com' THEN 1 END)::text as "Gerçek"
FROM orders;

SELECT 
    '├─' as "Kategori",
    'invoices' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN is_demo = true OR customer_email ILIKE '%@example.com' OR customer_email ILIKE '%@demo.com' OR customer_email ILIKE '%@test.com' THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN (is_demo = false OR is_demo IS NULL) AND customer_email NOT ILIKE '%@example.com' AND customer_email NOT ILIKE '%@demo.com' AND customer_email NOT ILIKE '%@test.com' THEN 1 END)::text as "Gerçek"
FROM invoices;

SELECT 
    '└─' as "Kategori",
    'coupons' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN is_demo = true THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN is_demo = false OR is_demo IS NULL THEN 1 END)::text as "Gerçek"
FROM coupons;

-- =====================================================
-- 4. MUHASEBE VERİLERİ
-- =====================================================

SELECT '' as ""; -- Boş satır

SELECT 
    '💼 MUHASEBE VERİLERİ' as "Kategori",
    '' as "Tablo",
    '' as "Toplam",
    '' as "Demo",
    '' as "Gerçek";

SELECT 
    '├─' as "Kategori",
    'companies' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN id = '550e8400-e29b-41d4-a716-446655440000' THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN id != '550e8400-e29b-41d4-a716-446655440000' THEN 1 END)::text as "Gerçek"
FROM companies;

SELECT 
    '├─' as "Kategori",
    'accounts' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN company_id = '550e8400-e29b-41d4-a716-446655440000' THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN company_id != '550e8400-e29b-41d4-a716-446655440000' THEN 1 END)::text as "Gerçek"
FROM accounts;

SELECT 
    '├─' as "Kategori",
    'journal_entries' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN company_id = '550e8400-e29b-41d4-a716-446655440000' THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN company_id != '550e8400-e29b-41d4-a716-446655440000' THEN 1 END)::text as "Gerçek"
FROM journal_entries;

SELECT 
    '└─' as "Kategori",
    'contacts' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN company_id = '550e8400-e29b-41d4-a716-446655440000' THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN company_id != '550e8400-e29b-41d4-a716-446655440000' THEN 1 END)::text as "Gerçek"
FROM contacts;

-- =====================================================
-- 5. BLOG VE İÇERİK
-- =====================================================

SELECT '' as ""; -- Boş satır

SELECT 
    '📝 BLOG VE İÇERİK' as "Kategori",
    '' as "Tablo",
    '' as "Toplam",
    '' as "Demo",
    '' as "Gerçek";

SELECT 
    '├─' as "Kategori",
    'blog_posts' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN is_demo = true THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN is_demo = false OR is_demo IS NULL THEN 1 END)::text as "Gerçek"
FROM blog_posts;

SELECT 
    '└─' as "Kategori",
    'comments' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN is_demo = true OR author_email ILIKE '%@example.com' OR author_email ILIKE '%@demo.com' OR author_email ILIKE '%@test.com' THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN (is_demo = false OR is_demo IS NULL) AND author_email NOT ILIKE '%@example.com' AND author_email NOT ILIKE '%@demo.com' AND author_email NOT ILIKE '%@test.com' THEN 1 END)::text as "Gerçek"
FROM comments;

-- =====================================================
-- 6. KAMPANYA VE PAZARLAMA
-- =====================================================

SELECT '' as ""; -- Boş satır

SELECT 
    '📣 KAMPANYA VE PAZARLAMA' as "Kategori",
    '' as "Tablo",
    '' as "Toplam",
    '' as "Demo",
    '' as "Gerçek";

SELECT 
    '├─' as "Kategori",
    'campaigns' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN is_demo = true THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN is_demo = false OR is_demo IS NULL THEN 1 END)::text as "Gerçek"
FROM campaigns;

SELECT 
    '└─' as "Kategori",
    'gift_cards' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN is_demo = true OR recipient_email ILIKE '%@example.com' OR recipient_email ILIKE '%@demo.com' OR recipient_email ILIKE '%@test.com' THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN (is_demo = false OR is_demo IS NULL) AND recipient_email NOT ILIKE '%@example.com' AND recipient_email NOT ILIKE '%@demo.com' AND recipient_email NOT ILIKE '%@test.com' THEN 1 END)::text as "Gerçek"
FROM gift_cards;

-- =====================================================
-- 7. ÇALIŞAN VERİLERİ
-- =====================================================

SELECT '' as ""; -- Boş satır

SELECT 
    '👔 ÇALIŞAN VERİLERİ' as "Kategori",
    '' as "Tablo",
    '' as "Toplam",
    '' as "Demo",
    '' as "Gerçek";

SELECT 
    '└─' as "Kategori",
    'employees' as "Tablo",
    COUNT(*)::text as "Toplam",
    COUNT(CASE WHEN is_demo = true OR email ILIKE '%@example.com' OR email ILIKE '%@demo.com' OR email ILIKE '%@test.com' THEN 1 END)::text as "Demo",
    COUNT(CASE WHEN (is_demo = false OR is_demo IS NULL) AND email NOT ILIKE '%@example.com' AND email NOT ILIKE '%@demo.com' AND email NOT ILIKE '%@test.com' THEN 1 END)::text as "Gerçek"
FROM employees;

-- =====================================================
-- 8. ÖZET İSTATİSTİKLER
-- =====================================================

SELECT '' as ""; -- Boş satır
SELECT '========================================' as "ÖZET İSTATİSTİKLER";
SELECT '========================================' as "----------------------------------------";

-- Toplam demo veri sayısı
WITH demo_counts AS (
    SELECT 'categories' as tablo, COUNT(*) as sayi FROM categories WHERE is_demo = true
    UNION ALL
    SELECT 'products', COUNT(*) FROM products WHERE is_demo = true
    UNION ALL
    SELECT 'sellers', COUNT(*) FROM sellers WHERE is_demo = true
    UNION ALL
    SELECT 'orders', COUNT(*) FROM orders WHERE is_demo = true OR customer_email ILIKE '%@example.com' OR customer_email ILIKE '%@demo.com' OR customer_email ILIKE '%@test.com'
    UNION ALL
    SELECT 'customers', COUNT(*) FROM customers WHERE is_demo = true OR email ILIKE '%@example.com' OR email ILIKE '%@demo.com' OR email ILIKE '%@test.com'
    UNION ALL
    SELECT 'admin_users', COUNT(*) FROM admin_users WHERE is_demo = true OR (email ILIKE '%@example.com' AND email != 'bentahasarii@gmail.com') OR (email ILIKE '%@demo.com' AND email != 'bentahasarii@gmail.com') OR (email ILIKE '%@test.com' AND email != 'bentahasarii@gmail.com')
    UNION ALL
    SELECT 'blog_posts', COUNT(*) FROM blog_posts WHERE is_demo = true
    UNION ALL
    SELECT 'campaigns', COUNT(*) FROM campaigns WHERE is_demo = true
)
SELECT 
    '📊 Toplam Demo Kayıt' as "Kategori",
    SUM(sayi)::text as "Sayı"
FROM demo_counts;

-- Admin kullanıcı durumu
SELECT 
    '🔐 Ana Admin Durumu' as "Kategori",
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Korunacak (bentahasarii@gmail.com)'
        ELSE '❌ Bulunamadı'
    END as "Durum"
FROM admin_users
WHERE email = 'bentahasarii@gmail.com';

SELECT '' as ""; -- Boş satır
SELECT '========================================' as "----------------------------------------";
SELECT '✅ Kontrol tamamlandı!' as "Durum";
SELECT '💡 Demo verileri temizlemek için clean-demo-data.sql scriptini çalıştırın' as "Not";
SELECT '========================================' as "----------------------------------------";


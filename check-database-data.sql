-- ========================================
-- VERİTABANI VERİ KONTROL SCRIPTI
-- ========================================
-- Bu script mevcut verileri kontrol eder
-- Temizlemeden önce hangi verilerin olduğunu gösterir
-- ========================================

\echo '========================================'
\echo 'VERİTABANI VERİ KONTROL RAPORU'
\echo 'Tarih: ' || NOW()
\echo '========================================'
\echo ''

-- 1. ÜRÜN YÖNETİMİ
\echo '1. ÜRÜN YÖNETİMİ:'
\echo '----------------'
SELECT 
    'Kategoriler' as tablo,
    COUNT(*) as kayit_sayisi,
    COUNT(*) FILTER (WHERE is_demo = true) as demo_sayisi
FROM categories
UNION ALL
SELECT 
    'Ürünler' as tablo,
    COUNT(*) as kayit_sayisi,
    COUNT(*) FILTER (WHERE is_demo = true) as demo_sayisi
FROM products
UNION ALL
SELECT 
    'Ürün Yorumları' as tablo,
    COUNT(*) as kayit_sayisi,
    COUNT(*) FILTER (WHERE is_demo = true) as demo_sayisi
FROM product_reviews
UNION ALL
SELECT 
    'Satıcılar' as tablo,
    COUNT(*) as kayit_sayisi,
    COUNT(*) FILTER (WHERE is_demo = true) as demo_sayisi
FROM sellers;

\echo ''

-- 2. SİPARİŞ YÖNETİMİ
\echo '2. SİPARİŞ YÖNETİMİ:'
\echo '--------------------'
SELECT 
    'Siparişler' as tablo,
    COUNT(*) as kayit_sayisi,
    SUM(total_amount) as toplam_tutar
FROM orders
UNION ALL
SELECT 
    'Sipariş Kalemleri' as tablo,
    COUNT(*) as kayit_sayisi,
    SUM(total_price) as toplam_tutar
FROM order_items;

\echo ''

-- 3. MÜŞTERİ YÖNETİMİ (CRM)
\echo '3. MÜŞTERİ YÖNETİMİ (CRM):'
\echo '--------------------------'
SELECT 
    'Müşteriler' as tablo,
    COUNT(*) as kayit_sayisi
FROM customers
UNION ALL
SELECT 
    'Müşteri İletişimleri' as tablo,
    COUNT(*) as kayit_sayisi
FROM customer_communications
UNION ALL
SELECT 
    'Müşteri Görevleri' as tablo,
    COUNT(*) as kayit_sayisi
FROM customer_tasks
UNION ALL
SELECT 
    'Müşteri Fırsatları' as tablo,
    COUNT(*) as kayit_sayisi
FROM customer_opportunities;

\echo ''

-- 4. BLOG YÖNETİMİ
\echo '4. BLOG YÖNETİMİ:'
\echo '-----------------'
SELECT 
    'Blog Yazıları' as tablo,
    COUNT(*) as kayit_sayisi
FROM blogs
UNION ALL
SELECT 
    'Blog Yorumları' as tablo,
    COUNT(*) as kayit_sayisi
FROM blog_comments;

\echo ''

-- 5. MEDYA YÖNETİMİ
\echo '5. MEDYA YÖNETİMİ:'
\echo '------------------'
SELECT 
    'Medya Dosyaları' as tablo,
    COUNT(*) as kayit_sayisi,
    pg_size_pretty(SUM(file_size)::bigint) as toplam_boyut
FROM media_files;

\echo ''

-- 6. PAZARLAMA & SEO
\echo '6. PAZARLAMA & SEO:'
\echo '-------------------'
SELECT 
    'Kampanyalar' as tablo,
    COUNT(*) as kayit_sayisi
FROM campaigns
UNION ALL
SELECT 
    'E-posta Kampanyaları' as tablo,
    COUNT(*) as kayit_sayisi
FROM email_campaigns
UNION ALL
SELECT 
    'Kuponlar' as tablo,
    COUNT(*) as kayit_sayisi
FROM coupons
UNION ALL
SELECT 
    'SEO Ayarları' as tablo,
    COUNT(*) as kayit_sayisi
FROM seo_settings;

\echo ''

-- 7. STOK & ENVANTER
\echo '7. STOK & ENVANTER:'
\echo '-------------------'
SELECT 
    'Envanter' as tablo,
    COUNT(*) as kayit_sayisi,
    SUM(current_stock) as toplam_stok
FROM inventory
UNION ALL
SELECT 
    'Stok Hareketleri' as tablo,
    COUNT(*) as kayit_sayisi,
    NULL as toplam_stok
FROM stock_movements
UNION ALL
SELECT 
    'Tedarikçiler' as tablo,
    COUNT(*) as kayit_sayisi,
    NULL as toplam_stok
FROM suppliers;

\echo ''

-- 8. MUHASEBE
\echo '8. MUHASEBE SİSTEMİ:'
\echo '--------------------'
SELECT 
    'Şirketler' as tablo,
    COUNT(*) as kayit_sayisi
FROM companies
UNION ALL
SELECT 
    'Hesap Planı' as tablo,
    COUNT(*) as kayit_sayisi
FROM accounts
UNION ALL
SELECT 
    'Yevmiye Fişleri' as tablo,
    COUNT(*) as kayit_sayisi
FROM journal_entries
UNION ALL
SELECT 
    'Faturalar' as tablo,
    COUNT(*) as kayit_sayisi
FROM invoices
UNION ALL
SELECT 
    'Cari Hesaplar' as tablo,
    COUNT(*) as kayit_sayisi
FROM contacts;

\echo ''

-- 9. İNSAN KAYNAKLARI
\echo '9. İNSAN KAYNAKLARI (HR):'
\echo '--------------------------'
SELECT 
    'Departmanlar' as tablo,
    COUNT(*) as kayit_sayisi
FROM departments
UNION ALL
SELECT 
    'Pozisyonlar' as tablo,
    COUNT(*) as kayit_sayisi
FROM positions
UNION ALL
SELECT 
    'Çalışanlar' as tablo,
    COUNT(*) as kayit_sayisi
FROM employees
UNION ALL
SELECT 
    'Bordro Kayıtları' as tablo,
    COUNT(*) as kayit_sayisi
FROM payrolls;

\echo ''

-- 10. DİĞER MODÜLLER
\echo '10. DİĞER MODÜLLER:'
\echo '-------------------'
SELECT 
    'Wishlist' as tablo,
    COUNT(*) as kayit_sayisi
FROM wishlists
UNION ALL
SELECT 
    'İadeler' as tablo,
    COUNT(*) as kayit_sayisi
FROM returns
UNION ALL
SELECT 
    'Settlement' as tablo,
    COUNT(*) as kayit_sayisi
FROM settlements
UNION ALL
SELECT 
    'Influencer''lar' as tablo,
    COUNT(*) as kayit_sayisi
FROM influencers
UNION ALL
SELECT 
    'Abonelikler' as tablo,
    COUNT(*) as kayit_sayisi
FROM subscriptions;

\echo ''

-- 11. SİSTEM VERİLERİ
\echo '11. SİSTEM VERİLERİ:'
\echo '--------------------'
SELECT 
    'Bildirimler' as tablo,
    COUNT(*) as kayit_sayisi,
    COUNT(*) FILTER (WHERE is_read = false) as okunmamis
FROM notifications
UNION ALL
SELECT 
    'Sistem Logları' as tablo,
    COUNT(*) as kayit_sayisi,
    NULL as okunmamis
FROM system_logs;

\echo ''

-- 12. TOPLAM VERİTABANI BOYUTU
\echo '12. VERİTABANI İSTATİSTİKLERİ:'
\echo '------------------------------'
SELECT 
    pg_database.datname AS veritabani,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS boyut
FROM pg_database
WHERE datname = current_database();

\echo ''
\echo '========================================'
\echo 'KONTROL RAPORU TAMAMLANDI'
\echo '========================================'


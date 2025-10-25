-- ========================================
-- TDC PRODUCTS WEBSITE - KAPSAMLI VERİ TEMİZLEME
-- ========================================
-- Bu script admin panelindeki TÜM modüllerin demo verilerini temizler
-- Dikkat: Bu işlem geri alınamaz!
-- Tarih: 2025-10-25
-- ========================================

-- Temizlik başlangıç logu
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VERİ TEMİZLEME İŞLEMİ BAŞLADI';
    RAISE NOTICE 'Tarih: %', NOW();
    RAISE NOTICE '========================================';
END $$;

-- ========================================
-- 1. ÜRÜN YÖNETİMİ MODÜLLERİ
-- ========================================

-- Ürünler ve ilişkili tablolar
DO $$
DECLARE
    product_count INTEGER;
    category_count INTEGER;
    review_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO product_count FROM products WHERE is_demo = true OR 1=1;
    SELECT COUNT(*) INTO category_count FROM categories WHERE is_demo = true OR 1=1;
    SELECT COUNT(*) INTO review_count FROM product_reviews WHERE is_demo = true OR 1=1;
    
    RAISE NOTICE '1. ÜRÜN YÖNETİMİ - Temizleniyor...';
    RAISE NOTICE '   - % ürün silinecek', product_count;
    RAISE NOTICE '   - % kategori silinecek', category_count;
    RAISE NOTICE '   - % ürün yorumu silinecek', review_count;
    
    -- Ürün yorumları
    DELETE FROM product_reviews;
    
    -- Ürün filtreleri
    DELETE FROM product_filters;
    
    -- Ürünler (cascade ile ilişkili veriler de silinir)
    DELETE FROM products;
    
    -- Kategoriler
    DELETE FROM categories;
    
    RAISE NOTICE '   ✓ Ürün yönetimi verileri temizlendi';
END $$;

-- ========================================
-- 2. SİPARİŞ YÖNETİMİ MODÜLLERİ
-- ========================================

DO $$
DECLARE
    order_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO order_count FROM orders;
    RAISE NOTICE '2. SİPARİŞ YÖNETİMİ - Temizleniyor...';
    RAISE NOTICE '   - % sipariş silinecek', order_count;
    
    -- Sipariş ödemeleri
    DELETE FROM order_payments;
    
    -- Sipariş kargoları
    DELETE FROM order_shipping;
    
    -- Sipariş durum geçmişi
    DELETE FROM order_status_history;
    
    -- Sipariş kalemleri
    DELETE FROM order_items;
    
    -- Siparişler
    DELETE FROM orders;
    
    -- Sipariş numarası sequence'ini sıfırla
    ALTER SEQUENCE IF EXISTS order_number_seq RESTART WITH 1;
    
    RAISE NOTICE '   ✓ Sipariş yönetimi verileri temizlendi';
END $$;

-- ========================================
-- 3. MÜŞTERİ YÖNETİMİ (CRM)
-- ========================================

DO $$
DECLARE
    customer_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO customer_count FROM customers;
    RAISE NOTICE '3. MÜŞTERİ YÖNETİMİ (CRM) - Temizleniyor...';
    RAISE NOTICE '   - % müşteri silinecek', customer_count;
    
    -- Müşteri segmentleri - müşteri ilişkileri
    DELETE FROM customer_segment_members;
    
    -- Müşteri segmentleri
    DELETE FROM customer_segments;
    
    -- Müşteri fırsatları
    DELETE FROM customer_opportunities;
    
    -- Müşteri görevleri
    DELETE FROM customer_tasks;
    
    -- Müşteri-etiket ilişkileri
    DELETE FROM customer_tag_relations;
    
    -- Müşteri etiketleri
    DELETE FROM customer_tags;
    
    -- Müşteri iletişim geçmişi
    DELETE FROM customer_communications;
    
    -- Müşteri profilleri
    DELETE FROM customer_profiles;
    
    -- Müşteriler
    DELETE FROM customers;
    
    RAISE NOTICE '   ✓ CRM verileri temizlendi';
END $$;

-- ========================================
-- 4. SATICILAR (SELLERS)
-- ========================================

DO $$
DECLARE
    seller_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO seller_count FROM sellers;
    RAISE NOTICE '4. SATICILAR - Temizleniyor...';
    RAISE NOTICE '   - % satıcı silinecek', seller_count;
    
    -- Satıcı yorumları (varsa)
    DELETE FROM seller_reviews WHERE 1=1;
    
    -- Satıcılar
    DELETE FROM sellers;
    
    RAISE NOTICE '   ✓ Satıcı verileri temizlendi';
END $$;

-- ========================================
-- 5. BLOG YÖNETİMİ
-- ========================================

DO $$
DECLARE
    blog_count INTEGER;
    comment_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO blog_count FROM blogs WHERE 1=1;
    SELECT COUNT(*) INTO comment_count FROM blog_comments WHERE 1=1;
    RAISE NOTICE '5. BLOG YÖNETİMİ - Temizleniyor...';
    RAISE NOTICE '   - % blog yazısı silinecek', blog_count;
    RAISE NOTICE '   - % yorum silinecek', comment_count;
    
    -- Yorum rate limiting
    DELETE FROM comment_rate_limits;
    
    -- Yorum beğenileri
    DELETE FROM comment_reactions;
    
    -- Blog yorumları
    DELETE FROM blog_comments;
    
    -- Blog yazıları
    DELETE FROM blogs;
    
    RAISE NOTICE '   ✓ Blog verileri temizlendi';
END $$;

-- ========================================
-- 6. MEDYA YÖNETİMİ
-- ========================================

DO $$
DECLARE
    media_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO media_count FROM media_files WHERE 1=1;
    RAISE NOTICE '6. MEDYA YÖNETİMİ - Temizleniyor...';
    RAISE NOTICE '   - % medya dosyası silinecek', media_count;
    
    -- Medya dosyaları
    DELETE FROM media_files;
    
    -- Medya klasörleri (varsa)
    DELETE FROM media_folders WHERE 1=1;
    
    RAISE NOTICE '   ✓ Medya verileri temizlendi';
END $$;

-- ========================================
-- 7. VISUAL SITE BUILDER
-- ========================================

DO $$
DECLARE
    page_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO page_count FROM site_pages WHERE 1=1;
    RAISE NOTICE '7. SITE BUILDER - Temizleniyor...';
    RAISE NOTICE '   - % sayfa silinecek', page_count;
    
    -- Site sayfaları
    DELETE FROM site_pages;
    
    -- Site şablonları
    DELETE FROM site_templates WHERE 1=1;
    
    -- Site bileşenleri (varsa)
    DELETE FROM site_components WHERE 1=1;
    
    RAISE NOTICE '   ✓ Site builder verileri temizlendi';
END $$;

-- ========================================
-- 8. PAZARLAMA & SEO
-- ========================================

DO $$
DECLARE
    campaign_count INTEGER;
    email_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO campaign_count FROM campaigns WHERE 1=1;
    SELECT COUNT(*) INTO email_count FROM email_campaigns WHERE 1=1;
    RAISE NOTICE '8. PAZARLAMA & SEO - Temizleniyor...';
    RAISE NOTICE '   - % kampanya silinecek', campaign_count;
    RAISE NOTICE '   - % e-posta kampanyası silinecek', email_count;
    
    -- A/B testleri
    DELETE FROM ab_tests;
    
    -- Analytics verileri
    DELETE FROM analytics_data;
    
    -- E-posta şablonları
    DELETE FROM email_templates;
    
    -- E-posta kampanyaları
    DELETE FROM email_campaigns;
    
    -- Sosyal medya gönderileri
    DELETE FROM social_media_posts;
    
    -- Sosyal medya hesapları
    DELETE FROM social_media_accounts;
    
    -- Backlink'ler
    DELETE FROM backlinks;
    
    -- Anahtar kelimeler
    DELETE FROM keywords;
    
    -- SEO ayarları
    DELETE FROM seo_settings;
    
    -- Kampanyalar
    DELETE FROM campaigns;
    
    -- Reklam sistemleri (varsa)
    DELETE FROM ad_campaigns WHERE 1=1;
    
    RAISE NOTICE '   ✓ Pazarlama & SEO verileri temizlendi';
END $$;

-- ========================================
-- 9. KUPONLAR & PROMOSYONLAR
-- ========================================

DO $$
DECLARE
    coupon_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO coupon_count FROM coupons;
    RAISE NOTICE '9. KUPONLAR & PROMOSYONLAR - Temizleniyor...';
    RAISE NOTICE '   - % kupon silinecek', coupon_count;
    
    -- Kupon kullanımları (varsa)
    DELETE FROM coupon_usages WHERE 1=1;
    
    -- Kuponlar
    DELETE FROM coupons;
    
    -- Promosyonlar (varsa)
    DELETE FROM promotions WHERE 1=1;
    
    RAISE NOTICE '   ✓ Kupon & promosyon verileri temizlendi';
END $$;

-- ========================================
-- 10. WİSHLİST (İSTEK LİSTESİ)
-- ========================================

DO $$
DECLARE
    wishlist_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO wishlist_count FROM wishlists;
    RAISE NOTICE '10. WİSHLİST - Temizleniyor...';
    RAISE NOTICE '   - % istek listesi kaydı silinecek', wishlist_count;
    
    -- Wishlist kayıtları
    DELETE FROM wishlists;
    
    RAISE NOTICE '   ✓ Wishlist verileri temizlendi';
END $$;

-- ========================================
-- 11. STOK & ENVANTER YÖNETİMİ
-- ========================================

DO $$
DECLARE
    inventory_count INTEGER;
    movement_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO inventory_count FROM inventory WHERE 1=1;
    SELECT COUNT(*) INTO movement_count FROM stock_movements WHERE 1=1;
    RAISE NOTICE '11. STOK & ENVANTER - Temizleniyor...';
    RAISE NOTICE '   - % envanter kaydı silinecek', inventory_count;
    RAISE NOTICE '   - % stok hareketi silinecek', movement_count;
    
    -- Stok transfer detayları
    DELETE FROM stock_transfer_items WHERE 1=1;
    
    -- Stok transferleri
    DELETE FROM stock_transfers;
    
    -- Stok uyarıları
    DELETE FROM stock_alerts;
    
    -- Satın alma sipariş detayları
    DELETE FROM purchase_order_items;
    
    -- Satın alma siparişleri
    DELETE FROM purchase_orders;
    
    -- Tedarikçiler
    DELETE FROM suppliers;
    
    -- Stok hareketleri
    DELETE FROM stock_movements;
    
    -- Envanter
    DELETE FROM inventory;
    
    -- Depo konumları
    DELETE FROM warehouse_locations;
    
    RAISE NOTICE '   ✓ Stok & envanter verileri temizlendi';
END $$;

-- ========================================
-- 12. MUHASEBE SİSTEMİ
-- ========================================

DO $$
DECLARE
    invoice_count INTEGER;
    journal_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO invoice_count FROM invoices WHERE 1=1;
    SELECT COUNT(*) INTO journal_count FROM journal_entries WHERE 1=1;
    RAISE NOTICE '12. MUHASEBE - Temizleniyor...';
    RAISE NOTICE '   - % fatura silinecek', invoice_count;
    RAISE NOTICE '   - % yevmiye fişi silinecek', journal_count;
    
    -- Audit logları
    DELETE FROM audit_logs;
    
    -- Dönem kilitleri
    DELETE FROM period_locks;
    
    -- Vergi ayarları
    DELETE FROM tax_configs;
    
    -- Banka hareketleri
    DELETE FROM bank_txns;
    
    -- Banka hesapları
    DELETE FROM bank_accounts;
    
    -- Kasa hareketleri
    DELETE FROM cash_txns;
    
    -- Kasa hesapları
    DELETE FROM cashboxes;
    
    -- Stok hareketleri (muhasebe)
    DELETE FROM inventory_txns;
    
    -- Stok kalemleri (muhasebe)
    DELETE FROM stock_items;
    
    -- Fatura satırları
    DELETE FROM invoice_lines;
    
    -- Faturalar
    DELETE FROM invoices;
    
    -- Cari hesaplar (müşteri/tedarikçi)
    DELETE FROM contacts;
    
    -- Yevmiye satırları
    DELETE FROM journal_lines;
    
    -- Yevmiye fişleri
    DELETE FROM journal_entries;
    
    -- Hesap planı (Ana hesaplar hariç temel hesapları koruyabilirsiniz)
    -- DELETE FROM accounts WHERE level > 1; -- Alt hesapları sil
    -- Veya tümünü silmek için:
    DELETE FROM accounts;
    
    -- Şirketler (Dikkat: Bu tüm muhasebe verilerini siler)
    DELETE FROM companies;
    
    RAISE NOTICE '   ✓ Muhasebe verileri temizlendi';
END $$;

-- ========================================
-- 13. İNSAN KAYNAKLARI (HR)
-- ========================================

DO $$
DECLARE
    employee_count INTEGER;
    payroll_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO employee_count FROM employees WHERE 1=1;
    SELECT COUNT(*) INTO payroll_count FROM payrolls WHERE 1=1;
    RAISE NOTICE '13. İNSAN KAYNAKLARI - Temizleniyor...';
    RAISE NOTICE '   - % çalışan silinecek', employee_count;
    RAISE NOTICE '   - % bordro kaydı silinecek', payroll_count;
    
    -- Performans değerlendirmeleri
    DELETE FROM performance_reviews WHERE 1=1;
    
    -- Eğitimler
    DELETE FROM training_sessions WHERE 1=1;
    DELETE FROM training_programs WHERE 1=1;
    
    -- İzin talepleri
    DELETE FROM leave_requests;
    
    -- İzin türleri
    DELETE FROM leave_types;
    
    -- Bordro kayıtları
    DELETE FROM payrolls;
    
    -- Çalışanlar
    DELETE FROM employees;
    
    -- Pozisyonlar
    DELETE FROM positions;
    
    -- Departmanlar
    DELETE FROM departments;
    
    RAISE NOTICE '   ✓ İK verileri temizlendi';
END $$;

-- ========================================
-- 14. İADE YÖNETİMİ (RETURNS)
-- ========================================

DO $$
DECLARE
    return_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO return_count FROM returns WHERE 1=1;
    RAISE NOTICE '14. İADE YÖNETİMİ - Temizleniyor...';
    RAISE NOTICE '   - % iade kaydı silinecek', return_count;
    
    -- İade kalemleri (varsa)
    DELETE FROM return_items WHERE 1=1;
    
    -- İadeler
    DELETE FROM returns;
    
    -- İade kuralları (varsa)
    DELETE FROM return_policies WHERE 1=1;
    
    RAISE NOTICE '   ✓ İade yönetimi verileri temizlendi';
END $$;

-- ========================================
-- 15. SETTLEMENT (ÖDEME YÖNETİMİ)
-- ========================================

DO $$
DECLARE
    settlement_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO settlement_count FROM settlements WHERE 1=1;
    RAISE NOTICE '15. SETTLEMENT - Temizleniyor...';
    RAISE NOTICE '   - % settlement kaydı silinecek', settlement_count;
    
    -- Payout kayıtları
    DELETE FROM payouts WHERE 1=1;
    
    -- Komisyon hesaplamaları
    DELETE FROM commission_calculations WHERE 1=1;
    
    -- Komisyon kuralları
    DELETE FROM commission_rules WHERE 1=1;
    
    -- Settlement kayıtları
    DELETE FROM settlements;
    
    RAISE NOTICE '   ✓ Settlement verileri temizlendi';
END $$;

-- ========================================
-- 16. INFLUENCER YÖNETİMİ
-- ========================================

DO $$
DECLARE
    influencer_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO influencer_count FROM influencers WHERE 1=1;
    RAISE NOTICE '16. INFLUENCER YÖNETİMİ - Temizleniyor...';
    RAISE NOTICE '   - % influencer kaydı silinecek', influencer_count;
    
    -- İşbirlikleri
    DELETE FROM influencer_collaborations WHERE 1=1;
    
    -- Influencer başvuruları
    DELETE FROM influencer_applications WHERE 1=1;
    
    -- Influencer'lar
    DELETE FROM influencers;
    
    RAISE NOTICE '   ✓ Influencer verileri temizlendi';
END $$;

-- ========================================
-- 17. AI LAB & OTOMASYON
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '17. AI LAB - Temizleniyor...';
    
    -- AI öneri geçmişi
    DELETE FROM ai_suggestions WHERE 1=1;
    
    -- OCR işlemleri
    DELETE FROM ocr_jobs WHERE 1=1;
    
    -- KDV asistan geçmişi
    DELETE FROM vat_assistant_history WHERE 1=1;
    
    RAISE NOTICE '   ✓ AI Lab verileri temizlendi';
END $$;

-- ========================================
-- 18. BİLDİRİMLER & SİSTEM LOGLARI
-- ========================================

DO $$
DECLARE
    notification_count INTEGER;
    log_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO notification_count FROM notifications;
    SELECT COUNT(*) INTO log_count FROM system_logs;
    RAISE NOTICE '18. BİLDİRİMLER & LOGLAR - Temizleniyor...';
    RAISE NOTICE '   - % bildirim silinecek', notification_count;
    RAISE NOTICE '   - % sistem logu silinecek', log_count;
    
    -- Bildirimler
    DELETE FROM notifications;
    
    -- Sistem logları
    DELETE FROM system_logs;
    
    -- Aktivite logları (varsa)
    DELETE FROM activity_logs WHERE 1=1;
    
    RAISE NOTICE '   ✓ Bildirim & log verileri temizlendi';
END $$;

-- ========================================
-- 19. ÖDEME & KARGO BİLGİLERİ
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '19. ÖDEME & KARGO - Temizleniyor...';
    
    -- Kargo takipleri (varsa)
    DELETE FROM shipping_trackings WHERE 1=1;
    
    -- Ödeme geçmişi (varsa)
    DELETE FROM payment_history WHERE 1=1;
    
    -- Ödeme yöntemleri - Sadece demo olanları sil
    DELETE FROM payment_methods WHERE is_demo = true;
    
    -- Kargo firmaları - Sadece demo olanları sil
    DELETE FROM shipping_companies WHERE is_demo = true;
    
    RAISE NOTICE '   ✓ Ödeme & kargo verileri temizlendi';
END $$;

-- ========================================
-- 20. ABONELİKLER (SUBSCRIPTIONS)
-- ========================================

DO $$
DECLARE
    subscription_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO subscription_count FROM subscriptions WHERE 1=1;
    RAISE NOTICE '20. ABONELİKLER - Temizleniyor...';
    RAISE NOTICE '   - % abonelik kaydı silinecek', subscription_count;
    
    -- Abonelik geçmişi
    DELETE FROM subscription_history WHERE 1=1;
    
    -- Abonelikler
    DELETE FROM subscriptions;
    
    -- Abonelik planları - Demo planları sil
    DELETE FROM subscription_plans WHERE is_demo = true OR name LIKE '%Test%' OR name LIKE '%Demo%';
    
    RAISE NOTICE '   ✓ Abonelik verileri temizlendi';
END $$;

-- ========================================
-- 21. KULLANICI VERİLERİ (DİKKAT!)
-- ========================================
-- NOT: Admin kullanıcıları ve auth.users tablosunu SİLMİYORUZ!
-- Sadece site kullanıcıları ve test hesapları silinebilir

DO $$
BEGIN
    RAISE NOTICE '21. KULLANICI VERİLERİ - Kontrol ediliyor...';
    
    -- Site kullanıcıları (admin olmayan kullanıcılar)
    -- DELETE FROM site_users WHERE role != 'admin';
    
    -- Test e-postaları (opsiyonel)
    -- DELETE FROM auth.users WHERE email LIKE '%test%' OR email LIKE '%demo%';
    
    RAISE NOTICE '   ⚠ Kullanıcı verileri korunuyor (manuel temizlik gerekirse yapılabilir)';
END $$;

-- ========================================
-- 22. SEQUENCE'LERİ SIFIRLA
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '22. SEQUENCE SIFIRLAMA - İşleniyor...';
    
    -- Tüm sequence'leri sıfırla
    ALTER SEQUENCE IF EXISTS order_number_seq RESTART WITH 1;
    ALTER SEQUENCE IF EXISTS invoice_number_seq RESTART WITH 1;
    ALTER SEQUENCE IF EXISTS customer_code_seq RESTART WITH 1;
    ALTER SEQUENCE IF EXISTS employee_number_seq RESTART WITH 1;
    ALTER SEQUENCE IF EXISTS transfer_number_seq RESTART WITH 1;
    
    RAISE NOTICE '   ✓ Sequence''ler sıfırlandı';
END $$;

-- ========================================
-- 23. VERİTABANI İSTATİSTİKLERİNİ GÜNCELLE
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '23. VERİTABANI OPTİMİZASYONU - İşleniyor...';
    
    -- Vacuum ve analyze yap
    VACUUM ANALYZE;
    
    RAISE NOTICE '   ✓ Veritabanı optimize edildi';
END $$;

-- ========================================
-- TEMİZLİK SONUÇ RAPORU
-- ========================================

DO $$
DECLARE
    remaining_products INTEGER;
    remaining_orders INTEGER;
    remaining_customers INTEGER;
    remaining_invoices INTEGER;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'VERİ TEMİZLEME İŞLEMİ TAMAMLANDI';
    RAISE NOTICE 'Tarih: %', NOW();
    RAISE NOTICE '========================================';
    
    -- Kalan kayıt sayıları
    SELECT COUNT(*) INTO remaining_products FROM products WHERE 1=1;
    SELECT COUNT(*) INTO remaining_orders FROM orders WHERE 1=1;
    SELECT COUNT(*) INTO remaining_customers FROM customers WHERE 1=1;
    SELECT COUNT(*) INTO remaining_invoices FROM invoices WHERE 1=1;
    
    RAISE NOTICE 'KALAN KAYIT SAYILARI:';
    RAISE NOTICE '- Ürünler: %', remaining_products;
    RAISE NOTICE '- Siparişler: %', remaining_orders;
    RAISE NOTICE '- Müşteriler: %', remaining_customers;
    RAISE NOTICE '- Faturalar: %', remaining_invoices;
    RAISE NOTICE '';
    RAISE NOTICE '✓ Tüm demo verileri başarıyla temizlendi!';
    RAISE NOTICE '========================================';
END $$;

-- ========================================
-- YEDEKLEME HATIRLATMASI
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  DİKKAT: Bu script tüm verileri silmiştir.';
    RAISE NOTICE '⚠️  Eğer yedek almadıysanız, veriler geri getirilemez!';
    RAISE NOTICE '';
END $$;


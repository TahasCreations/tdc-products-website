# 🧹 TDC Products Website - Veri Temizleme Sistemi

## 📌 Genel Bakış

Bu proje, admin panelindeki **tüm modüllerin demo verilerini temizlemek** için kapsamlı bir sistem içerir.

## 🎯 Ne Temizlenir?

### ✅ 23 Ana Modül

| Modül | Tablolar | Açıklama |
|-------|----------|----------|
| 🏷️ **Ürün Yönetimi** | products, categories, sellers, product_reviews, product_filters | Tüm ürünler, kategoriler ve satıcılar |
| 🛒 **Sipariş Yönetimi** | orders, order_items, order_payments, order_shipping, order_status_history | Tüm siparişler ve ilgili kayıtlar |
| 👥 **Müşteri Yönetimi (CRM)** | customers, customer_profiles, customer_communications, customer_tasks, customer_opportunities, customer_segments, customer_tags | Tüm müşteri verileri |
| 📝 **Blog Yönetimi** | blogs, blog_comments, comment_reactions | Blog yazıları ve yorumlar |
| 🖼️ **Medya Yönetimi** | media_files, media_folders | Tüm medya dosyaları |
| ✨ **Site Builder** | site_pages, site_templates, site_components | Sayfa tasarımları |
| 📢 **Pazarlama & SEO** | campaigns, email_campaigns, seo_settings, keywords, backlinks, social_media_posts, ab_tests | Tüm pazarlama verileri |
| 🎫 **Kuponlar** | coupons, coupon_usages, promotions | Kupon ve promosyonlar |
| 💝 **Wishlist** | wishlists | İstek listeleri |
| 📦 **Stok & Envanter** | inventory, stock_movements, stock_transfers, purchase_orders, suppliers, warehouse_locations | Tüm stok verileri |
| 💼 **Muhasebe** | companies, accounts, journal_entries, invoices, contacts, bank_accounts, cash_accounts | Tüm muhasebe kayıtları |
| 👔 **İnsan Kaynakları** | departments, positions, employees, payrolls, leave_requests | Personel verileri |
| ↩️ **İade Yönetimi** | returns, return_items, return_policies | İade kayıtları |
| 💰 **Settlement** | settlements, commission_rules, payouts | Ödeme yönetimi |
| 💫 **Influencer** | influencers, influencer_applications, collaborations | Influencer verileri |
| 🤖 **AI Lab** | ai_suggestions, ocr_jobs, vat_assistant_history | AI verileri |
| 📱 **Abonelikler** | subscriptions, subscription_history | Abonelik kayıtları |
| 🔔 **Bildirimler** | notifications, system_logs, activity_logs | Bildirimler ve loglar |
| 💳 **Ödeme & Kargo** | payment_methods, shipping_companies | Ödeme/kargo ayarları |
| 🔄 **Sequence'ler** | order_number_seq, invoice_number_seq | Numara sıralamaları |
| 🗑️ **Diğer** | + 30+ ek tablo | İlişkili tüm tablolar |

**TOPLAM: 100+ Tablo Temizlenir**

## 📁 Dosyalar

| Dosya | Açıklama | Boyut |
|-------|----------|-------|
| `COMPREHENSIVE-DATA-CLEANUP.sql` | Ana temizleme scripti | ~800 satır |
| `check-database-data.sql` | Veri kontrol scripti | ~300 satır |
| `cleanup-database.js` | Node.js otomatik temizleme | ~400 satır |
| `EXECUTE-DATA-CLEANUP.md` | Detaylı kullanım rehberi | Kapsamlı |
| `QUICK-START-CLEANUP.md` | Hızlı başlangıç rehberi | Özet |
| `DATA-CLEANUP-SUMMARY.md` | İşlem özeti | Rapor |

## 🚀 Hızlı Kullanım

### 1️⃣ Yedek Alın!
```bash
# Mutlaka yedek alın!
pg_dump -h [host] -U [user] -d [database] -F c -f backup.dump
```

### 2️⃣ Temizleyin

**En Kolay Yol: Supabase SQL Editor**
```
1. Supabase Dashboard → SQL Editor
2. COMPREHENSIVE-DATA-CLEANUP.sql dosyasını aç
3. Tüm içeriği kopyala
4. SQL Editor'a yapıştır
5. "Run" butonuna tıkla
6. Tamamlanmasını bekle (2-10 dakika)
```

**Alternatif: Node.js Script**
```bash
npm install pg dotenv
node cleanup-database.js
```

### 3️⃣ Doğrulayın
```sql
SELECT COUNT(*) FROM products; -- 0 olmalı
SELECT COUNT(*) FROM orders; -- 0 olmalı
SELECT COUNT(*) FROM customers; -- 0 olmalı
```

## ⚙️ Özellikler

### ✅ Güvenlik
- ✓ Admin kullanıcısı korunur
- ✓ İşlem öncesi onay
- ✓ Transaction kullanımı
- ✓ Rollback desteği
- ✓ Yedek hatırlatması

### ✅ Kullanıcı Dostu
- ✓ Renkli console çıktıları
- ✓ İlerleme göstergesi
- ✓ Detaylı loglama
- ✓ Hata yönetimi
- ✓ Interaktif onaylar

### ✅ Kapsamlı
- ✓ 100+ tablo
- ✓ 23 modül
- ✓ Cascade silme
- ✓ Sequence sıfırlama
- ✓ Veritabanı optimizasyonu

### ✅ Esnek
- ✓ Koşullu silme
- ✓ Tablo varlık kontrolü
- ✓ Hata toleransı
- ✓ Modüler yapı

## ⚠️ Önemli Notlar

1. **Bu işlem geri alınamaz!**
2. **Mutlaka yedek alın!**
3. **Test ortamında deneyin!**
4. **Admin kullanıcınızı korur**
5. **Sistem ayarlarını korur**

## 📊 İşlem Süresi

| Kayıt Sayısı | Süre |
|-------------|------|
| < 1,000 | 1-2 dakika |
| 1,000 - 10,000 | 2-5 dakika |
| 10,000 - 100,000 | 5-15 dakika |
| > 100,000 | 15+ dakika |

## 🔍 Sorun Giderme

### ❌ "relation does not exist"
**Çözüm:** Normal, bazı tablolar mevcut değil. Script otomatik atlar.

### ❌ "permission denied"
**Çözüm:** Süper kullanıcı (postgres) ile bağlanın.

### ❌ "violates foreign key constraint"
**Çözüm:** Script CASCADE kullanıyor, sorun olmamalı. Tekrar deneyin.

### ❌ İşlem çok uzun sürüyor
**Çözüm:** Normal, büyük veritabanları için 10-15 dakika sürebilir.

## 📚 Dokümantasyon

- **Hızlı Başlangıç:** `QUICK-START-CLEANUP.md`
- **Detaylı Rehber:** `EXECUTE-DATA-CLEANUP.md`
- **Özet Rapor:** `DATA-CLEANUP-SUMMARY.md`
- **Bu Dosya:** Genel bakış

## ✅ Kontrol Listesi

- [ ] Veritabanı bağlantısı kontrol edildi
- [ ] Yedek alındı
- [ ] Mevcut veriler kontrol edildi
- [ ] Temizleme scripti çalıştırıldı
- [ ] Sonuçlar doğrulandı
- [ ] Admin kullanıcısı kontrol edildi
- [ ] Uygulama test edildi

## 🎯 Sonuç

Temizlik tamamlandıktan sonra:
- ✅ Tüm demo verileri silinir
- ✅ Admin kullanıcınız korunur
- ✅ Sistem ayarları korunur
- ✅ Veritabanı optimize edilir
- ✅ Yeni veriler eklemeye hazır

## 📞 Destek

Sorun yaşarsanız:
1. Hata mesajını kaydedin
2. `EXECUTE-DATA-CLEANUP.md` sorun giderme bölümüne bakın
3. Veritabanı loglarını kontrol edin
4. Gerekirse yedeği geri yükleyin

---

**💡 Önemli:** İlk kez yapıyorsanız mutlaka test ortamında deneyin!

**🚀 Hazır mısınız?** `QUICK-START-CLEANUP.md` dosyasına bakın ve başlayın!

---

**Son Güncelleme:** 2025-10-25  
**Versiyon:** 1.0.0  
**Durum:** ✅ Hazır


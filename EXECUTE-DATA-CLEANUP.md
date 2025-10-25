# 🧹 TDC Products Website - Kapsamlı Veri Temizleme Rehberi

## 📋 Genel Bakış

Bu rehber, admin panelindeki **TÜM modüllerin demo verilerini temizlemek** için adım adım talimatlar içerir.

## ⚠️ ÖNEMLI UYARILAR

1. **Bu işlem geri alınamaz!** Tüm veriler kalıcı olarak silinecektir.
2. Temizlemeden önce **mutlaka veritabanı yedeği alın**.
3. Bu işlem yalnızca **geliştirme/test ortamlarında** kullanılmalıdır.
4. Canlı sistemde kullanmadan önce **test edin**.

## 📊 Temizlenecek Modüller

### 1. Ürün Yönetimi
- ✅ Kategoriler
- ✅ Ürünler
- ✅ Ürün Yorumları
- ✅ Ürün Filtreleri
- ✅ Satıcılar

### 2. Sipariş Yönetimi
- ✅ Siparişler
- ✅ Sipariş Kalemleri
- ✅ Sipariş Ödemeleri
- ✅ Sipariş Kargoları
- ✅ Sipariş Durumu Geçmişi

### 3. Müşteri Yönetimi (CRM)
- ✅ Müşteriler
- ✅ Müşteri Profilleri
- ✅ Müşteri İletişimleri
- ✅ Müşteri Görevleri
- ✅ Müşteri Fırsatları
- ✅ Müşteri Segmentleri
- ✅ Müşteri Etiketleri

### 4. Blog Yönetimi
- ✅ Blog Yazıları
- ✅ Blog Yorumları
- ✅ Yorum Beğenileri

### 5. Medya Yönetimi
- ✅ Medya Dosyaları
- ✅ Medya Klasörleri

### 6. Visual Site Builder
- ✅ Site Sayfaları
- ✅ Site Şablonları
- ✅ Site Bileşenleri

### 7. Pazarlama & SEO
- ✅ Kampanyalar
- ✅ E-posta Kampanyaları
- ✅ E-posta Şablonları
- ✅ SEO Ayarları
- ✅ Anahtar Kelimeler
- ✅ Backlink'ler
- ✅ Sosyal Medya Hesapları
- ✅ Sosyal Medya Gönderileri
- ✅ A/B Testleri
- ✅ Analytics Verileri

### 8. Kuponlar & Promosyonlar
- ✅ Kuponlar
- ✅ Kupon Kullanımları
- ✅ Promosyonlar

### 9. Wishlist
- ✅ İstek Listesi Kayıtları

### 10. Stok & Envanter
- ✅ Envanter Kayıtları
- ✅ Stok Hareketleri
- ✅ Stok Transferleri
- ✅ Satın Alma Siparişleri
- ✅ Tedarikçiler
- ✅ Depo Konumları
- ✅ Stok Uyarıları

### 11. Muhasebe Sistemi
- ✅ Şirketler
- ✅ Hesap Planı
- ✅ Yevmiye Fişleri
- ✅ Yevmiye Satırları
- ✅ Faturalar
- ✅ Fatura Satırları
- ✅ Cari Hesaplar
- ✅ Stok Kalemleri
- ✅ Banka Hesapları
- ✅ Banka Hareketleri
- ✅ Kasa Hesapları
- ✅ Kasa Hareketleri
- ✅ Vergi Ayarları
- ✅ Dönem Kilitleri
- ✅ Audit Logları

### 12. İnsan Kaynakları (HR)
- ✅ Departmanlar
- ✅ Pozisyonlar
- ✅ Çalışanlar
- ✅ Bordro Kayıtları
- ✅ İzin Türleri
- ✅ İzin Talepleri
- ✅ Eğitim Programları
- ✅ Performans Değerlendirmeleri

### 13. İade Yönetimi
- ✅ İadeler
- ✅ İade Kalemleri
- ✅ İade Kuralları

### 14. Settlement (Ödeme Yönetimi)
- ✅ Settlement Kayıtları
- ✅ Komisyon Kuralları
- ✅ Komisyon Hesaplamaları
- ✅ Payout Kayıtları

### 15. Influencer Yönetimi
- ✅ Influencer'lar
- ✅ Influencer Başvuruları
- ✅ İşbirlikleri

### 16. AI Lab & Otomasyon
- ✅ AI Önerileri
- ✅ OCR İşlemleri
- ✅ KDV Asistan Geçmişi

### 17. Abonelikler
- ✅ Abonelikler
- ✅ Abonelik Geçmişi
- ✅ Abonelik Planları (Demo)

### 18. Bildirimler & Loglar
- ✅ Bildirimler
- ✅ Sistem Logları
- ✅ Aktivite Logları

## 🚀 Temizleme Adımları

### Adım 1: Veritabanı Yedeği Alın

**PostgreSQL için:**
```bash
# Supabase/PostgreSQL yedeği
pg_dump -h [host] -U [user] -d [database] -F c -b -v -f backup_$(date +%Y%m%d_%H%M%S).dump

# Örnek:
pg_dump -h db.xxxxxxxxx.supabase.co -U postgres -d postgres -F c -b -v -f backup_$(date +%Y%m%d_%H%M%S).dump
```

**Supabase Dashboard üzerinden:**
1. Supabase Dashboard'a gidin
2. Settings > Database > Database Backups
3. "Start a backup" butonuna tıklayın

### Adım 2: Mevcut Verileri Kontrol Edin

```bash
# Supabase SQL Editor'da veya psql ile
psql -h [host] -U [user] -d [database] -f check-database-data.sql
```

Bu komut size şu bilgileri verecektir:
- Her modülde kaç kayıt olduğu
- Demo verilerinin sayısı
- Toplam veritabanı boyutu

### Adım 3: Temizleme Scriptini Çalıştırın

**Seçenek 1: Supabase SQL Editor'da**
1. Supabase Dashboard > SQL Editor'a gidin
2. `COMPREHENSIVE-DATA-CLEANUP.sql` dosyasını açın
3. SQL kodunu kopyalayın ve SQL Editor'a yapıştırın
4. "Run" butonuna tıklayın
5. İşlem tamamlanana kadar bekleyin

**Seçenek 2: Terminal/CMD üzerinden**
```bash
# Windows PowerShell
$env:PGPASSWORD="your_password"; psql -h [host] -U postgres -d postgres -f COMPREHENSIVE-DATA-CLEANUP.sql

# Linux/Mac
PGPASSWORD='your_password' psql -h [host] -U postgres -d postgres -f COMPREHENSIVE-DATA-CLEANUP.sql
```

**Seçenek 3: Node.js Script ile**
```bash
node cleanup-database.js
```

### Adım 4: Temizlik Sonrası Doğrulama

```bash
# Verilerin temizlendiğini doğrulayın
psql -h [host] -U [user] -d [database] -f check-database-data.sql
```

Tüm modüllerde `0` kayıt görmelisiniz.

### Adım 5: Sequence'leri Sıfırlayın

Script otomatik olarak sıfırlar, ancak kontrol etmek için:

```sql
-- Sipariş numarası sequence
SELECT nextval('order_number_seq'); -- 1 olmalı

-- Fatura numarası sequence
SELECT nextval('invoice_number_seq'); -- 1 olmalı
```

## 📝 Temizleme Sonrası İşlemler

### 1. Admin Kullanıcısı Oluşturun (Gerekirse)

```sql
-- Admin kullanıcısı oluştur
INSERT INTO admin_users (email, full_name, role, is_active)
VALUES ('admin@tdcproducts.com', 'Admin User', 'admin', true);
```

### 2. Temel Ayarları Yapın

```sql
-- Varsayılan kategoriler ekle (isteğe bağlı)
INSERT INTO categories (name, slug, is_active) VALUES
('Elektronik', 'elektronik', true),
('Ev & Yaşam', 'ev-yasam', true),
('Moda', 'moda', true);

-- Site ayarlarını kontrol et
SELECT * FROM site_settings WHERE is_public = true;
```

### 3. Ödeme ve Kargo Ayarlarını Kontrol Edin

```sql
-- Ödeme yöntemlerini kontrol et
SELECT * FROM payment_methods WHERE is_active = true;

-- Kargo firmalarını kontrol et
SELECT * FROM shipping_companies WHERE is_active = true;
```

## 🔍 Sorun Giderme

### Hata: "relation does not exist"

**Çözüm:** Bazı tablolar veritabanınızda mevcut olmayabilir. Scripti düzenleyin ve o tabloları yorum satırı yapın.

```sql
-- Mevcut olmayan tablo için:
-- DELETE FROM non_existing_table;
```

### Hata: "permission denied"

**Çözüm:** Veritabanı kullanıcınızın yeterli yetkisi olmayabilir. Süper kullanıcı ile bağlanın:

```bash
psql -h [host] -U postgres -d postgres
```

### Hata: "violates foreign key constraint"

**Çözüm:** Script CASCADE silme kullanıyor, ancak bazı durumlarda sıralama önemli. Hata veren tabloları en sona taşıyın.

### İşlem Çok Uzun Sürüyor

**Çözüm:** Büyük tablolar için batch silme kullanın:

```sql
-- 10,000 kayıt batch'lerle sil
DO $$
DECLARE
    deleted_count INTEGER;
BEGIN
    LOOP
        DELETE FROM large_table WHERE id IN (
            SELECT id FROM large_table LIMIT 10000
        );
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        EXIT WHEN deleted_count = 0;
        RAISE NOTICE 'Deleted % rows', deleted_count;
    END LOOP;
END $$;
```

## 📊 İşlem Süresi Tahmini

| Kayıt Sayısı | Tahmini Süre |
|-------------|-------------|
| < 1,000 | 1-2 dakika |
| 1,000 - 10,000 | 2-5 dakika |
| 10,000 - 100,000 | 5-15 dakika |
| > 100,000 | 15+ dakika |

## ✅ Kontrol Listesi

- [ ] Veritabanı yedeği alındı
- [ ] Mevcut veriler kontrol edildi
- [ ] Temizleme scripti çalıştırıldı
- [ ] Temizlik sonrası doğrulama yapıldı
- [ ] Sequence'ler sıfırlandı
- [ ] Admin kullanıcısı oluşturuldu
- [ ] Temel ayarlar yapıldı
- [ ] Uygulama test edildi

## 🎯 Sonuç

Bu işlemden sonra:
- ✅ Tüm demo verileri temizlenmiş olacak
- ✅ Veritabanı sıfır durumda olacak
- ✅ Yeni veriler eklenmeye hazır
- ✅ Admin paneli temiz bir durumda

## 🆘 Destek

Sorun yaşıyorsanız:
1. Hata mesajını kaydedin
2. Hangi adımda hata aldığınızı not edin
3. Veritabanı loglarını kontrol edin
4. Gerekirse yedeği geri yükleyin

## 📚 İlgili Dosyalar

- `COMPREHENSIVE-DATA-CLEANUP.sql` - Ana temizleme scripti
- `check-database-data.sql` - Veri kontrol scripti
- `cleanup-database.js` - Node.js temizleme scripti
- `ADMIN-PANEL-TEMIZLIK-OZETI.md` - Detaylı temizlik raporu

---

**Son Güncelleme:** 2025-10-25
**Versiyon:** 1.0


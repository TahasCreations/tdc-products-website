# Demo Verileri Temizleme Rehberi

## 📋 Genel Bakış

Bu rehber, admin panelinizde bulunan tüm demo/test verilerini güvenli bir şekilde temizlemenizi sağlar. Proje başlatmadan önce bu adımları izleyerek sistemde sadece gerçek verilerin kalmasını sağlayabilirsiniz.

## 🎯 Neleri Temizleyeceğiz?

### E-Commerce Verileri
- ✅ Demo kategoriler (Anime Figürleri, Elektronik, vb.)
- ✅ Demo ürünler (Naruto figürü, LED aydınlatma, vb.)
- ✅ Demo satıcılar (AnimeWorld Store, TechGear Pro, vb.)
- ✅ Demo ürün yorumları
- ✅ Demo ürün filtreleri

### Kullanıcı Verileri
- ✅ Demo müşteriler (@example.com, @demo.com, @test.com)
- ✅ Demo site kullanıcıları
- ✅ Demo admin kullanıcıları (Ana admin HARİÇ)

### Sipariş ve Muhasebe
- ✅ Demo siparişler
- ✅ Demo faturalar
- ✅ Demo kuponlar
- ✅ Demo muhasebe kayıtları (TDC Products Ltd. Şti.)
- ✅ Demo hesap planı
- ✅ Demo banka hesapları ve kasalar

### Blog ve İçerik
- ✅ Demo blog yazıları
- ✅ Demo yorumlar

### Kampanya ve Pazarlama
- ✅ Demo kampanyalar
- ✅ Demo hediye kartları
- ✅ Demo sadakat puanları

### Çalışan Verileri
- ✅ Demo çalışanlar

### AI ve Analitik
- ✅ Demo AI önerileri
- ✅ Demo AI içgörüleri
- ✅ Demo chatbot etkileşimleri
- ✅ Demo analytics verileri

### Güvenlik ve Performans
- ✅ Demo güvenlik tehditleri
- ✅ Demo performans metrikleri
- ✅ Demo log kayıtları

## 🛡️ Neleri KORUYACAĞIZ?

- ✅ **Ana admin kullanıcısı** (bentahasarii@gmail.com)
- ✅ **Admin güvenlik ayarları**
- ✅ **Sistem konfigürasyonları**
- ✅ **Tablo yapıları ve indexler**
- ✅ **RLS (Row Level Security) politikaları**

## 📝 Kullanım Adımları

### 1. Veritabanı Yedeği Alın (ÇOK ÖNEMLİ!)

Temizlik işleminden ÖNCE mutlaka veritabanı yedeği alın!

**Supabase için:**
1. Supabase Dashboard'a gidin
2. Settings > Database
3. "Backups" sekmesine tıklayın
4. "Download backup" butonuna tıklayın

### 2. Mevcut Demo Verilerini Kontrol Edin

Önce ne kadar demo veri olduğunu görmek için kontrol scriptini çalıştırın:

```sql
-- check-demo-data.sql dosyasının içeriğini kopyalayın
-- Supabase SQL Editor'da çalıştırın
```

Bu script size şunları gösterecek:
- Her tabloda kaç demo veri var
- Her tabloda kaç gerçek veri var
- Ana admin kullanıcısının korunup korunmadığı
- Toplam silinecek kayıt sayısı

### 3. Demo Verileri Temizleyin

Kontrol sonuçlarından memnunsanız, temizleme scriptini çalıştırın:

```sql
-- clean-demo-data.sql dosyasının içeriğini kopyalayın
-- Supabase SQL Editor'da çalıştırın
```

**Script çalışırken:**
- Her adım için bilgi mesajları göreceksiniz
- Hata olursa işlem geri alınır (ROLLBACK)
- Sonunda özet rapor gösterilir

### 4. Temizlik Sonrası Kontrol

Temizlik tamamlandıktan sonra tekrar kontrol scriptini çalıştırarak sonuçları doğrulayın:

```sql
-- check-demo-data.sql dosyasını tekrar çalıştırın
```

**Beklenen sonuçlar:**
- Demo kayıt sayıları 0 olmalı
- Ana admin kullanıcısı korunmuş olmalı
- Sistem tabloları ve ayarlar yerinde olmalı

## 🔍 Script Detayları

### `check-demo-data.sql`
- Demo verileri listeler
- Tablo bazında istatistikler gösterir
- Temizlik öncesi ve sonrası karşılaştırma için kullanılır
- Salt okunur (readonly) - hiçbir veri değiştirmez

### `clean-demo-data.sql`
- Tüm demo verileri siler
- Transaction içinde çalışır (hata durumunda geri alır)
- Ana admin kullanıcısını korur
- Detaylı log mesajları gösterir
- Sonunda VACUUM ANALYZE çalıştırır (performans optimizasyonu)

## ⚠️ Önemli Notlar

### 1. Geri Dönüş Yok!
Temizlik işlemi geri alınamaz. Mutlaka yedek alın!

### 2. Ana Admin Korunur
`bentahasarii@gmail.com` email adresli admin kullanıcısı her zaman korunur.

### 3. is_demo Alanı
Bazı tablolarda `is_demo` alanı yoksa, bu script otomatik olarak o tabloyu atlar.

### 4. Email Kontrolü
`@example.com`, `@demo.com`, `@test.com` uzantılı tüm email adresleri demo olarak kabul edilir.

### 5. Muhasebe Verileri
Demo şirket (TDC Products Ltd. Şti.) ile ilgili tüm muhasebe kayıtları silinir.

## 🐛 Sorun Giderme

### "Table does not exist" Hatası
Bazı tablolar veritabanınızda olmayabilir. Script bu durumu otomatik handle eder.

### "Column does not exist" Hatası
`is_demo` alanı yoksa, önce `database/add-demo-flags.sql` scriptini çalıştırın.

### Transaction Timeout
Çok fazla veri varsa timeout olabilir. Bu durumda scripti parça parça çalıştırın:
1. Önce e-commerce verilerini temizleyin
2. Sonra kullanıcı verilerini
3. Son olarak diğerlerini

### Ana Admin Silinmiş!
Yedekten geri yükleyin ve scripti tekrar kontrol edin.

## 📊 Temizlik Sonrası Beklenen Durum

| Tablo | Demo Veri | Gerçek Veri | Durum |
|-------|-----------|-------------|-------|
| categories | 0 | 0+ | ✅ Temiz |
| products | 0 | 0+ | ✅ Temiz |
| sellers | 0 | 0+ | ✅ Temiz |
| orders | 0 | 0+ | ✅ Temiz |
| customers | 0 | 0+ | ✅ Temiz |
| admin_users | 0 | 1+ | ✅ Ana admin korundu |
| companies | 0 | 0+ | ✅ Demo şirket silindi |

## 🎉 Başarılı Temizlik Sonrası

Temizlik başarılı olduktan sonra:

1. ✅ Admin paneline giriş yapın
2. ✅ Tüm menüleri kontrol edin
3. ✅ Hiçbir demo veri görmemelisiniz
4. ✅ Sistem normal çalışmalı
5. ✅ Gerçek veriler ekleyebilmelisiniz

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Veritabanı yedeğinden geri yükleyin
2. Script loglarını kontrol edin
3. Hata mesajlarını kaydedin
4. Gerekirse teknik destek alın

## 🔐 Güvenlik Tavsiyeleri

### Temizlik Sonrası Yapılması Gerekenler:

1. **Ana Admin Şifresini Değiştirin**
   - Varsayılan şifre: `35sandalye`
   - Güçlü bir şifre belirleyin

2. **Yeni Admin Kullanıcıları Ekleyin**
   - Gerçek email adresleri kullanın
   - 2FA (Two-Factor Authentication) aktif edin

3. **Güvenlik Ayarlarını Kontrol Edin**
   - `admin_security_settings` tablosunu inceleyin
   - Gerekirse ayarları güncelleyin

4. **RLS Politikalarını Kontrol Edin**
   - Tüm tablolarda RLS aktif mi?
   - Politikalar doğru çalışıyor mu?

## 📅 Periyodik Temizlik

Projeniz canlıya geçtikten sonra periyodik olarak:
- Eski log kayıtlarını temizleyin (90 gün+)
- Süresi dolmuş oturumları silin
- Soft-deleted kayıtları temizleyin (eğer varsa)

---

**Son Güncelleme:** 2024-01-01
**Versiyon:** 1.0.0


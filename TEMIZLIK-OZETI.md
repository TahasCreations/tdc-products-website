# 🧹 Demo Veri Temizliği - Özet ve Hızlı Başlangıç

## 📦 Oluşturulan Dosyalar

Size 4 adet SQL dosyası hazırladım:

### 1. `add-is-demo-columns.sql` (İlk adım - opsiyonel)
- **Ne yapar:** Tüm tablolara `is_demo` alanı ekler
- **Ne zaman:** Eğer tablolarınızda `is_demo` alanı yoksa
- **Güvenli mi:** ✅ Evet, sadece alan ekler, veri silmez

### 2. `check-demo-data.sql` (Kontrol scripti)
- **Ne yapar:** Hangi tablolarda kaç demo veri olduğunu gösterir
- **Ne zaman:** Temizlik öncesi ve sonrası
- **Güvenli mi:** ✅ Evet, sadece okur, hiçbir şey değiştirmez

### 3. `clean-demo-data.sql` (Temizlik scripti)
- **Ne yapar:** Tüm demo verilerini siler
- **Ne zaman:** Yedek aldıktan ve kontrol ettikten sonra
- **Güvenli mi:** ⚠️ Yedek almadan ÇALIŞTIRMAYIN!

### 4. `DEMO-DATA-CLEANUP-GUIDE.md` (Detaylı rehber)
- Tüm sürecin detaylı açıklaması
- Sorun giderme önerileri
- Güvenlik tavsiyeleri

## 🚀 Hızlı Başlangıç (3 Adım)

### Adım 1: Yedek Alın! 🛡️
```
1. Supabase Dashboard → Settings → Database → Backups
2. "Download backup" butonuna tıklayın
3. Yedeği güvenli bir yere kaydedin
```

### Adım 2: Kontrol Edin 🔍
```sql
-- Supabase SQL Editor'ı açın
-- check-demo-data.sql dosyasının içeriğini yapıştırın
-- Çalıştırın ve sonuçları inceleyin
```

**Görecekleriniz:**
- 📊 Her tabloda kaç demo veri var
- ✅ Ana admin korunuyor mu
- 📈 Toplam silinecek kayıt sayısı

### Adım 3: Temizleyin 🧹
```sql
-- Supabase SQL Editor'ı açın
-- clean-demo-data.sql dosyasının içeriğını yapıştırın
-- Çalıştırın ve işlemin bitmesini bekleyin
```

**İşlem sırası:**
1. E-commerce verileri silinir
2. Kullanıcı verileri silinir (ana admin korunur)
3. Sipariş ve muhasebe verileri silinir
4. Blog ve içerik verileri silinir
5. Kampanya verileri silinir
6. AI ve analitik verileri silinir
7. Log verileri silinir
8. Sonuç raporu gösterilir

## ⚠️ ÖNEMLİ UYARILAR

### ❌ YAPMAYIN:
- Yedek almadan temizlik yapmayın
- Production ortamında test etmeyin
- Ana admin şifresini kaybetmeyin
- İşlem sırasında bağlantıyı kesmeyin

### ✅ YAPIN:
- Mutlaka yedek alın
- Önce check scriptini çalıştırın
- Sonuçları inceleyin
- Temizlik sonrası kontrol edin
- Ana admin şifresini değiştirin

## 🔐 Korunan Veriler

Bu veriler **SİLİNMEZ**, korunur:

- ✅ Ana admin kullanıcısı (`bentahasarii@gmail.com`)
- ✅ Admin güvenlik ayarları
- ✅ Tablo yapıları (schemas)
- ✅ RLS politikaları
- ✅ Trigger'lar ve fonksiyonlar
- ✅ Indexler

## 🗑️ Silinecek Demo Veriler

### E-Commerce
- Kategoriler: Anime Figürleri, Elektronik, Moda, vb.
- Ürünler: Naruto figürü, kulaklık, LED ışık, vb.
- Satıcılar: AnimeWorld Store, TechGear Pro, vb.
- Yorumlar: Ahmet Yılmaz, Ayşe Demir, vb.

### Kullanıcılar
- @example.com uzantılı tüm mailler
- @demo.com uzantılı tüm mailler
- @test.com uzantılı tüm mailler
- Demo olarak işaretlenmiş kullanıcılar

### Muhasebe
- TDC Products Ltd. Şti. (demo şirket)
- Demo hesap planı (TDHP)
- Demo açılış fişi
- Demo cari hesaplar
- Demo banka hesapları

### Diğerleri
- Demo siparişler, faturalar, kuponlar
- Demo blog yazıları, yorumlar
- Demo kampanyalar, hediye kartları
- Demo çalışanlar
- Demo AI verileri
- Demo analitik verileri
- Demo log kayıtları

## 📊 Beklenen Sonuçlar

### Temizlik Öncesi
```
Categories: 50+ demo kayıt
Products: 10+ demo kayıt
Sellers: 5+ demo kayıt
Orders: Var ise demo siparişler
Customers: @example.com mailler
Admin Users: Test kullanıcıları
...
```

### Temizlik Sonrası
```
Categories: 0 demo kayıt
Products: 0 demo kayıt
Sellers: 0 demo kayıt
Orders: 0 demo kayıt
Customers: 0 demo kayıt
Admin Users: 1 (sadece ana admin)
✅ Sistem temiz ve kullanıma hazır!
```

## 🎯 Temizlik Sonrası Yapılacaklar

### 1. Kontrol ✅
```sql
-- check-demo-data.sql scriptini tekrar çalıştırın
-- Tüm demo sayıları 0 olmalı
```

### 2. Admin Paneli Kontrolü ✅
```
1. Admin paneline giriş yapın (bentahasarii@gmail.com)
2. Tüm menüleri kontrol edin
3. Ürünler, kategoriler, siparişler boş olmalı
4. Hiçbir demo veri görmemelisiniz
```

### 3. Güvenlik ✅
```
1. Ana admin şifresini değiştirin (varsayılan: 35sandalye)
2. 2FA aktif edin
3. Yeni admin kullanıcıları ekleyin (gerçek mailler)
4. Güvenlik ayarlarını gözden geçirin
```

### 4. Gerçek Verileri Eklemeye Başlayın 🎉
```
1. Kategorilerinizi oluşturun
2. Ürünlerinizi ekleyin
3. Satıcıları tanımlayın
4. Sistemi test edin
5. Canlıya alın!
```

## 🆘 Sorun mu Yaşıyorsunuz?

### Tablo bulunamadı hatası
```
➡️ Normal. Bazı tablolar veritabanınızda olmayabilir.
   Script otomatik olarak atlar.
```

### is_demo alanı yok hatası
```
➡️ Önce add-is-demo-columns.sql scriptini çalıştırın
```

### Ana admin silindi!
```
➡️ Yedeği geri yükleyin
➡️ clean-demo-data.sql scriptinde bentahasarii@gmail.com korunuyor mu kontrol edin
```

### Timeout hatası
```
➡️ Script'i bölümlere ayırarak çalıştırın
➡️ Önce e-commerce, sonra kullanıcılar, sonra diğerleri
```

## 📞 İletişim

Herhangi bir sorun yaşarsanız:
1. Yedekten geri yükleyin
2. DEMO-DATA-CLEANUP-GUIDE.md dosyasını okuyun
3. Log mesajlarını kontrol edin
4. Gerekirse teknik destek alın

## 📝 Notlar

- ⏱️ İşlem süresi: 30 saniye - 2 dakika (veri miktarına göre)
- 💾 Yedek boyutu: Veritabanı büyüklüğünüze bağlı
- 🔄 Geri alınabilir mi: Hayır, sadece yedekten
- 🚀 Production'da kullanılabilir mi: Evet, ama dikkatli olun

---

## ✅ Hazır mısınız?

1. ✅ Yedek aldınız mı?
2. ✅ check-demo-data.sql ile kontrol ettiniz mi?
3. ✅ Ana admin şifrenizi biliyor musunuz?
4. ✅ Sonuçları incelemeye hazır mısınız?

**Evet ise → clean-demo-data.sql scriptini çalıştırın!** 🚀

---

**Hazırlayan:** AI Assistant  
**Tarih:** 2024-01-01  
**Versiyon:** 1.0


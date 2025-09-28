# 🚀 TDC Platform - Başlangıç Rehberi

## 📋 İçindekiler

1. [Platforma Genel Bakış](#platforma-genel-bakış)
2. [İlk Kurulum](#ilk-kurulum)
3. [Gerçek Veri Ekleme](#gerçek-veri-ekleme)
4. [Admin Paneli Kullanımı](#admin-paneli-kullanımı)
5. [Ürün Yönetimi](#ürün-yönetimi)
6. [Kategori Yönetimi](#kategori-yönetimi)
7. [Sipariş Takibi](#sipariş-takibi)
8. [Ödeme Sistemi](#ödeme-sistemi)
9. [Analitik ve Raporlar](#analitik-ve-raporlar)
10. [Sık Sorulan Sorular](#sık-sorulan-sorular)

---

## 🎯 Platforma Genel Bakış

TDC Platform, Türkiye'de Etsy benzeri bir e-ticaret platformudur. El yapımı ürünler, sanat eserleri ve özel tasarımlar için gelişmiş admin modülü ile donatılmıştır.

### 🌟 Özellikler

- **Hibrit Veri Sistemi**: Hem local hem cloud storage
- **Gelişmiş Admin Paneli**: Kapsamlı yönetim araçları
- **AI Destekli Öneriler**: Yapay zeka ile ürün önerileri
- **Çoklu Ödeme Sistemi**: Kredi kartı, havale, mobil ödeme
- **Gerçek Zamanlı Analitik**: Detaylı satış raporları
- **Responsive Tasarım**: Mobil uyumlu arayüz

---

## 🛠️ İlk Kurulum

### 1. Projeyi Çalıştırma

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Tarayıcıda aç
http://localhost:3000
```

### 2. Admin Paneli Erişimi

```bash
# Admin paneline git
http://localhost:3000/admin/login

# Varsayılan giriş bilgileri
Email: admin@tdc.com
Şifre: admin123
```

---

## 📊 Gerçek Veri Ekleme

### 🎨 Ürün Ekleme

#### Adım 1: Kategori Oluştur
1. Admin panelinde **"Ürünler"** sekmesine git
2. **"Kategori Ekle"** butonuna tıkla
3. Kategori bilgilerini doldur:
   - **Ad**: Kategori adı (örn: "El Yapımı Seramikler")
   - **Açıklama**: Kategori hakkında kısa bilgi
   - **Emoji**: Görsel tanımlayıcı (örn: 🏺)
   - **Renk**: Kategori rengi (hex kod)
   - **İkon**: Remix icon adı

#### Adım 2: Ürün Ekle
1. **"Ürün Ekle"** butonuna tıkla
2. Ürün bilgilerini doldur:

```
Başlık: "Özel Tasarım Seramik Vazo"
Fiyat: 250.00
Kategori: El Yapımı Seramikler
Alt Kategori: Vazolar (opsiyonel)
Stok: 5
Durum: Aktif
Açıklama: "El yapımı, özel tasarım seramik vazo. 
Her parça benzersizdir ve özenle hazırlanmıştır."
Resim: Yüksek kaliteli ürün fotoğrafı
```

#### Adım 3: Ürün Detayları
- **SEO Slug**: Otomatik oluşturulur
- **Çoklu Resimler**: Birden fazla fotoğraf ekle
- **Stok Takibi**: Gerçek stok sayısını güncelle
- **Durum**: Aktif/Pasif/Taslak

### 📦 Kategori Yönetimi

#### Ana Kategoriler
```
🎨 El Sanatları
🏺 Seramik & Çömlek
🧵 Dikiş & Örgü
💎 Takı & Aksesuar
🏠 Ev Dekorasyonu
📚 Kitap & Sanat
🎵 Müzik Aletleri
```

#### Alt Kategoriler
- Ana kategorilerin altında alt kategoriler oluşturun
- Hiyerarşik yapı için parent_id kullanın
- Her kategori için benzersiz renk ve ikon seçin

### 🛒 Sipariş Yönetimi

#### Sipariş Durumları
- **Beklemede**: Yeni gelen sipariş
- **İşleniyor**: Hazırlanıyor
- **Kargoya Verildi**: Gönderildi
- **Teslim Edildi**: Tamamlandı
- **İptal Edildi**: İptal

#### Sipariş İşleme
1. **Sipariş Detayları**: Müşteri bilgileri, ürünler, tutar
2. **Ödeme Kontrolü**: Ödeme durumunu kontrol et
3. **Stok Güncelleme**: Satılan ürünlerin stoğunu düş
4. **Kargo Takibi**: Kargo numarası ekle

---

## 💳 Ödeme Sistemi

### Desteklenen Ödeme Yöntemleri

1. **Kredi Kartı**
   - Visa, Mastercard, Amex
   - 3D Secure güvenlik
   - Otomatik komisyon hesaplama

2. **Banka Havalesi**
   - IBAN ile transfer
   - Manuel onay sistemi
   - Komisyonsuz işlem

3. **Mobil Ödeme**
   - Papara, PayTR, İyzico
   - Anında işlem
   - Düşük komisyon

4. **Kripto Para**
   - Bitcoin, Ethereum
   - Otomatik dönüşüm
   - Güvenli cüzdan

### Ödeme İzleme
- **Gerçek Zamanlı Durum**: Anlık güncelleme
- **Komisyon Hesaplama**: Otomatik hesaplama
- **İşlem Geçmişi**: Detaylı log
- **Geri Ödeme**: Kolay iade sistemi

---

## 📈 Analitik ve Raporlar

### Satış Raporları
- **Günlük/Haftalık/Aylık**: Zaman bazlı analiz
- **Kategori Performansı**: Hangi kategoriler daha çok satıyor
- **Ürün Başarısı**: En çok satan ürünler
- **Müşteri Analizi**: Müşteri davranışları

### AI İçgörüleri
- **Trend Analizi**: Yükselen trendler
- **Fiyat Optimizasyonu**: Optimal fiyat önerileri
- **Stok Yönetimi**: Stok uyarıları
- **Müşteri Segmentasyonu**: Hedef kitle analizi

---

## 🔧 Teknik Detaylar

### Veri Depolama
- **Local Storage**: `data/` klasöründe JSON dosyaları
- **Cloud Sync**: Supabase ile otomatik senkronizasyon
- **Backup**: Otomatik yedekleme sistemi
- **Export/Import**: Veri aktarım araçları

### API Endpoints
```
GET  /api/products          - Ürünleri listele
POST /api/products          - Yeni ürün ekle
PUT  /api/products/:id      - Ürün güncelle
DELETE /api/products/:id    - Ürün sil

GET  /api/categories        - Kategorileri listele
POST /api/categories        - Yeni kategori ekle
PUT  /api/categories/:id    - Kategori güncelle
DELETE /api/categories/:id  - Kategori sil

GET  /api/orders            - Siparişleri listele
POST /api/orders            - Yeni sipariş ekle
PUT  /api/orders/:id        - Sipariş güncelle
```

---

## ❓ Sık Sorulan Sorular

### Q: Ürün eklerken hata alıyorum?
**A**: Kategori seçtiğinizden emin olun. Kategori yoksa önce kategori ekleyin.

### Q: Resim yükleyemiyorum?
**A**: Resim boyutu 5MB'dan küçük olmalı. JPG, PNG formatlarını destekler.

### Q: Ödeme sistemi çalışmıyor?
**A**: Ödeme API anahtarlarınızı kontrol edin. Test modunda çalıştığınızdan emin olun.

### Q: Verilerim kayboldu?
**A**: `data/` klasöründe backup dosyaları var. Restore işlemi yapabilirsiniz.

### Q: Admin paneline giriş yapamıyorum?
**A**: `localStorage`'ı temizleyin ve tekrar giriş yapmayı deneyin.

---

## 🎯 Başarı İpuçları

### 1. Ürün Fotoğrafları
- **Yüksek Kalite**: En az 800x800 piksel
- **Doğal Işık**: Yapay ışık kullanmayın
- **Çoklu Açı**: Farklı açılardan fotoğraf
- **Tutarlı Stil**: Marka kimliğinizi yansıtın

### 2. Ürün Açıklamaları
- **Detaylı Bilgi**: Malzeme, boyut, renk
- **Hikaye Anlatın**: Ürünün hikayesini paylaşın
- **SEO Dostu**: Anahtar kelimeler kullanın
- **Müşteri Soruları**: Sık sorulan soruları yanıtlayın

### 3. Fiyatlandırma
- **Maliyet Analizi**: Malzeme + işçilik + kar marjı
- **Rekabet Analizi**: Benzer ürünlerin fiyatları
- **Psikolojik Fiyatlar**: 99, 95 ile biten fiyatlar
- **İndirim Stratejisi**: Mevsimsel kampanyalar

### 4. Stok Yönetimi
- **Gerçek Zamanlı**: Stokları anlık güncelleyin
- **Uyarı Sistemi**: Düşük stok uyarıları
- **Sezonsal Planlama**: Yüksek talep dönemleri
- **Yedek Tedarikçi**: Alternatif tedarikçiler

---

## 🚀 Sonraki Adımlar

1. **İlk Ürünlerinizi Ekleyin**: 5-10 ürünle başlayın
2. **Kategorilerinizi Oluşturun**: Net kategoriler tanımlayın
3. **Ödeme Sistemini Test Edin**: Test işlemleri yapın
4. **Analitikleri İnceleyin**: Verilerinizi takip edin
5. **Müşteri Geri Bildirimlerini Alın**: Sürekli gelişim

---

## 📞 Destek

- **Teknik Destek**: admin@tdc.com
- **Dokümantasyon**: [docs/](./)
- **GitHub Issues**: [Repository Issues](https://github.com/TahasCreations/tdc-products-website/issues)
- **Discord**: [TDC Community](https://discord.gg/tdc)

---

**🎉 Tebrikler! Artık TDC Platform'u kullanmaya hazırsınız!**

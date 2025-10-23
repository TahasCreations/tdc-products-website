# 🗄️ Veritabanı Temizliği - Adım Adım Rehber

## 🎯 Şimdi Yapacağımız

Supabase veritabanınızdaki tüm demo verileri güvenli bir şekilde temizleyeceğiz.

---

## 📋 ADIM 1: Supabase'e Giriş Yapın

1. Tarayıcınızda [Supabase Dashboard](https://app.supabase.com) açın
2. Projenize giriş yapın
3. Sol menüden **SQL Editor** sekmesine tıklayın

---

## 📋 ADIM 2: Veritabanı Yedeği Alın (ÇOK ÖNEMLİ!)

⚠️ **Bu adımı atlamayın!**

1. Sol menüden **Settings** → **Database** sekmesine gidin
2. **Backups** bölümünü bulun
3. **Download backup** butonuna tıklayın
4. Yedeği güvenli bir yere kaydedin

---

## 📋 ADIM 3: Mevcut Demo Verileri Kontrol Edin

1. SQL Editor'da **yeni bir query** açın
2. Aşağıdaki dosyanın içeriğini kopyalayın: `check-demo-data.sql`
3. SQL Editor'a yapıştırın
4. **Run** butonuna tıklayın
5. Sonuçları inceleyin

### Göreceğiniz:
```
🏷️ E-COMMERCE VERİLERİ
├─ categories       Toplam: 50+   Demo: 50+   Gerçek: 0
├─ products         Toplam: 10+   Demo: 10+   Gerçek: 0
├─ sellers          Toplam: 5+    Demo: 5+    Gerçek: 0
└─ product_reviews  Toplam: 6+    Demo: 6+    Gerçek: 0

👥 KULLANICI VERİLERİ
├─ admin_users      Toplam: 1     Demo: 0     Gerçek: 1
├─ site_users       Toplam: 0     Demo: 0     Gerçek: 0
└─ customers        Toplam: 0     Demo: 0     Gerçek: 0

💼 MUHASEBE VERİLERİ
├─ companies        Toplam: 1     Demo: 1     Gerçek: 0
├─ accounts         Toplam: 40+   Demo: 40+   Gerçek: 0
└─ journal_entries  Toplam: 1     Demo: 1     Gerçek: 0
```

**✅ Ana admin korunacak:** bentahasarii@gmail.com

---

## 📋 ADIM 4: Demo Verileri Temizleyin

1. SQL Editor'da **yeni bir query** daha açın
2. Aşağıdaki dosyanın içeriğini kopyalayın: `clean-demo-data.sql`
3. SQL Editor'a yapıştırın
4. **Run** butonuna tıklayın (⚠️ Yedek aldığınızdan emin olun!)
5. İşlemin tamamlanmasını bekleyin (30 saniye - 2 dakika)

### Göreceğiniz:
```
NOTICE: Ürün yorumları temizlendi
NOTICE: Ürün filtreleri temizlendi
NOTICE: Demo ürünler temizlendi
NOTICE: Demo satıcılar temizlendi
NOTICE: Demo kategoriler temizlendi
NOTICE: Demo müşteriler temizlendi
NOTICE: Demo site kullanıcıları temizlendi
NOTICE: Demo admin kullanıcıları temizlendi (Ana admin korundu)
...
NOTICE: ✅ Demo veri temizliği tamamlandı!
```

---

## 📋 ADIM 5: Sonuçları Doğrulayın

1. Tekrar `check-demo-data.sql` scriptini çalıştırın
2. Sonuçları kontrol edin

### Beklenen Sonuç:
```
🏷️ E-COMMERCE VERİLERİ
├─ categories       Toplam: 0     Demo: 0     Gerçek: 0  ✅
├─ products         Toplam: 0     Demo: 0     Gerçek: 0  ✅
├─ sellers          Toplam: 0     Demo: 0     Gerçek: 0  ✅
└─ product_reviews  Toplam: 0     Demo: 0     Gerçek: 0  ✅

👥 KULLANICI VERİLERİ
├─ admin_users      Toplam: 1     Demo: 0     Gerçek: 1  ✅
└─ Ana Admin Durumu: ✅ Korunacak (bentahasarii@gmail.com)

💼 MUHASEBE VERİLERİ
├─ companies        Toplam: 0     Demo: 0     Gerçek: 0  ✅
├─ accounts         Toplam: 0     Demo: 0     Gerçek: 0  ✅
└─ journal_entries  Toplam: 0     Demo: 0     Gerçek: 0  ✅

✅ Temizlik tamamlandı!
```

---

## ⚠️ SORUN GİDERME

### Hata: "table does not exist"
**Çözüm:** Normal, o tablo veritabanınızda yok. Script devam eder.

### Hata: "column is_demo does not exist"
**Çözüm:** Önce `add-is-demo-columns.sql` scriptini çalıştırın.

### Hata: "timeout"
**Çözüm:** Script'i bölümlere ayırın:
1. E-commerce verilerini temizleyin
2. Kullanıcı verilerini temizleyin
3. Muhasebe verilerini temizleyin

### Ana admin silindi!
**Çözüm:** Yedeği geri yükleyin. Script'te koruma var, bir şeyler yanlış gitmiş.

---

## 🎯 TEMİZLİK SONRASI

### 1. Admin Panele Giriş Yapın
```
URL: /admin
Email: bentahasarii@gmail.com
Şifre: 35sandalye
```

### 2. Kontrol Edin
- [ ] Dashboard boş mu?
- [ ] Ürünler boş mu?
- [ ] Kategoriler boş mu?
- [ ] Siparişler boş mu?
- [ ] Blog yazıları boş mu?

### 3. Şifre Değiştirin
```
Admin Panel → Profil → Şifre Değiştir
Yeni şifre: [güçlü bir şifre]
```

### 4. Gerçek Veri Eklemeye Başlayın!
```
1. Kategoriler oluşturun
2. Ürünler ekleyin
3. Satıcıları tanımlayın
4. Canlıya alın! 🚀
```

---

## 📞 YARDIM

Her bir adımda sorun yaşarsanız:
1. Önce yedekten geri yükleyin
2. Hata mesajını okuyun
3. Sorun giderme bölümüne bakın
4. Gerekirse adımları tekrarlayın

---

**Hazır mısınız? Yukarıdaki adımları sırasıyla takip edin!** ✨


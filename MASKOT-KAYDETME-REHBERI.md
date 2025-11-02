# 🦸‍♂️ TDC Maskot Kaydetme Rehberi

## ✅ Kod Hazır! Sadece Görseli Kaydedin

### Adım 1: Görseli İndirin
Gönderdiğiniz TDC süper kahraman görselini bilgisayarınıza kaydedin.

### Adım 2: Dosya Adını Düzenleyin
Görselin adını şu şekilde değiştirin:
```
tdc-maskot.png
```

### Adım 3: Görseli Şu Klasöre Taşıyın
```
C:\Users\taha\tdc-products-website\public\images\hero\
```

**Tam Yol:**
```
C:\Users\taha\tdc-products-website\public\images\hero\tdc-maskot.png
```

### Adım 4: Windows Dosya Gezgini ile (En Kolay)

1. Windows tuşu + E (Dosya Gezgini)
2. Şu adrese gidin:
   ```
   C:\Users\taha\tdc-products-website\public\images\hero
   ```
3. TDC süper kahraman görselini buraya kopyalayın
4. Dosya adı: `tdc-maskot.png` olmalı

### Adım 5: Kontrol Edin
```powershell
# PowerShell'de kontrol:
Test-Path "C:\Users\taha\tdc-products-website\public\images\hero\tdc-maskot.png"

# True dönmeli
```

### Adım 6: Sayfayı Yenileyin
```
http://localhost:3000
```

**Maskot hemen görünecek!** 🎉

---

## 🎨 Maskot Özellikleri (Kodda Hazır)

### Animasyonlar:
- ✅ **Entrance**: Dönerek ve büyüyerek giriş yapıyor
- ✅ **Floating**: Yukarı aşağı hafif hareket ediyor
- ✅ **Hover**: Fareyle üzerine gelince sallanıyor
- ✅ **Glow**: Sarı/turuncu ışıltı efekti
- ✅ **Sparkles**: ⭐💫✨ Parıltı efektleri
- ✅ **Badge**: "🛡️ Güvenli Alışveriş" rozeti

### Responsive Boyutlar:
- **Mobil**: 192x192px (48 x 4)
- **Tablet**: 256x256px (64 x 4)
- **Desktop**: 320x320px (80 x 4)
- **Büyük Ekran**: 400x400px

### Optimizasyonlar:
- ✅ Priority loading (ilk görünen element)
- ✅ Quality: 100 (maximum)
- ✅ Object-contain (orantılı görünüm)
- ✅ Drop shadow efekti

---

## 🔍 Dosya Kontrolü

### Komut Satırından:
```powershell
# Dosya var mı?
Get-ChildItem "C:\Users\taha\tdc-products-website\public\images\hero"

# Dosya boyutu?
(Get-Item "C:\Users\taha\tdc-products-website\public\images\hero\tdc-maskot.png").Length / 1KB

# Görüntüle
ii "C:\Users\taha\tdc-products-website\public\images\hero\tdc-maskot.png"
```

---

## 💡 İpuçları

### Görsel Optimizasyonu
Eğer dosya çok büyükse (>500KB):

1. **TinyPNG** kullanın:
   - https://tinypng.com
   - Görseli sürükleyin
   - Optimize versiyonu indirin

2. **Veya online PNG compressor**:
   - https://compresspng.com

### En İyi Sonuç İçin:
- Dosya boyutu: 100-300KB ideal
- Boyut: 800x800 - 1200x1200 px
- Format: PNG (transparan arka plan)
- Renk modu: RGB

---

## ✅ Kontrol Listesi

Görsel kaydedildikten sonra:
- [ ] Dosya yolu doğru mu?
- [ ] Dosya adı `tdc-maskot.png` mi?
- [ ] Sayfa yenilendi mi?
- [ ] Maskot görünüyor mu?
- [ ] Animasyonlar çalışıyor mu?
- [ ] Mobilde güzel görünüyor mu?

---

## 🎯 Sonuç

Kod tamamen hazır! Sadece görseli kaydetmeniz yeterli:

```
public/images/hero/tdc-maskot.png
```

**Kaydettikten sonra sayfa otomatik yenilenecek!** 🚀


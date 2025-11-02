# 🦸‍♂️ TDC Maskot Görseli Kaydetme Talimatı

## ❗ SORUN

Maskot görseli **local'de yok** çünkü siz kaydetmediniz!

```
Dosya: public/images/hero/tdc-maskot.png
Durum: ❌ YOK (Git'e eklendi ama local'de dosya yok)
Sonuç: Vercel'de de görünmüyor
```

---

## ✅ ÇÖZÜM (3 Adım)

### Adım 1: Görseli İndirin/Kaydedin

Gönderdiğiniz **TDC Süper Kahraman** görselini (sarı, siyah, beyaz kostümlü) bilgisayarınıza kaydedin.

**Görsel özellikleri:**
- Sarı kare kafa
- Siyah maske
- Beyaz kostüm, sarı detaylar
- Göğsünde "TDC" logosu
- Siyah pelerin
- Thumbs up pozu

---

### Adım 2: Dosya Adını Ayarlayın

Görseli **tam olarak** şu isimle kaydedin:
```
tdc-maskot.png
```

**DİKKAT:**
- ✅ Küçük harfler: `tdc-maskot.png`
- ❌ Büyük harfler: `TDC-maskot.png` (YANLIŞ)
- ❌ Farklı format: `tdc-maskot.jpg` (YANLIŞ)

---

### Adım 3: Doğru Klasöre Kopyalayın

**Windows Dosya Gezgini ile (En Kolay):**

1. **Windows tuşu + E** (Dosya Gezgini)

2. Şu adrese gidin:
   ```
   C:\Users\taha\tdc-products-website\public\images\hero
   ```

3. Görseli buraya **kopyalayın** veya **taşıyın**

4. Dosya adı mutlaka: `tdc-maskot.png`

---

### Adım 4: Klasör Yoksa Oluşturun

Eğer `hero` klasörü yoksa:

**PowerShell'de:**
```powershell
cd C:\Users\taha\tdc-products-website
New-Item -ItemType Directory -Path "public\images\hero" -Force
```

**Veya Manuel:**
1. `public\images` klasörüne gidin
2. Sağ tık → Yeni → Klasör
3. İsim: `hero`

---

## 🎯 Görsel Kaydedildikten Sonra

### 1. Git'e Ekleyin
```powershell
cd C:\Users\taha\tdc-products-website

# Görseli ekle
git add public/images/hero/tdc-maskot.png

# Commit
git commit -m "feat: TDC maskot gorseli eklendi"

# Push
git push origin main
```

### 2. Kod Güncellemesi (Otomatik Yapacağım)
Geçici emoji yerine gerçek görseli kullanacak şekilde kodu güncelleyeceğim.

---

## 📁 Dosya Yapısı (Olması Gereken)

```
tdc-products-website/
├── public/
│   └── images/
│       └── hero/
│           └── tdc-maskot.png  ← BURASI!
```

---

## 🔍 Dosya Kontrolü

Görseli kaydettikten sonra kontrol edin:

**PowerShell'de:**
```powershell
# Dosya var mı?
Test-Path "C:\Users\taha\tdc-products-website\public\images\hero\tdc-maskot.png"

# True dönmeli
```

**Dosya Gezgini'nde:**
```
C:\Users\taha\tdc-products-website\public\images\hero\tdc-maskot.png

Sağ tık → Özellikler
Boyut: ~2 MB civarı olmalı
Tür: PNG Image
```

---

## ⚠️ Yaygın Hatalar

### ❌ Hata 1: Yanlış Klasör
```
❌ C:\Users\taha\Desktop\tdc-maskot.png
❌ C:\Users\taha\Downloads\tdc-maskot.png
✅ C:\Users\taha\tdc-products-website\public\images\hero\tdc-maskot.png
```

### ❌ Hata 2: Yanlış Dosya Adı
```
❌ TDC-Maskot.png
❌ tdc-maskot.PNG
❌ tdc_maskot.png
✅ tdc-maskot.png
```

### ❌ Hata 3: Yanlış Format
```
❌ tdc-maskot.jpg
❌ tdc-maskot.jpeg
❌ tdc-maskot.webp
✅ tdc-maskot.png
```

---

## 🎨 Görsel Optimizasyonu (İsteğe Bağlı)

Eğer dosya 2 MB'dan büyükse, optimize edin:

### TinyPNG (Önerilen):
```
1. https://tinypng.com aç
2. Görseli sürükle
3. Optimize edilmiş versiyonu indir
4. Aynı isimle kaydet: tdc-maskot.png
```

**Hedef Boyut:** 200-500 KB
**Avantaj:** %70-80 daha küçük, performans artışı

---

## 🚀 Adım Adım Checklist

Sırayla yapın:

- [ ] Görseli bilgisayara kaydet
- [ ] Dosya adını `tdc-maskot.png` yap
- [ ] `hero` klasörü var mı kontrol et (yoksa oluştur)
- [ ] Görseli `public\images\hero\` klasörüne kopyala
- [ ] PowerShell'de dosya varlığını kontrol et
- [ ] Git'e ekle (`git add`)
- [ ] Commit yap (`git commit`)
- [ ] Push yap (`git push`)
- [ ] Bana "kaydettim" de, kodu güncelleyeyim

---

## 💡 Alternatif: URL'den İndirme

Eğer görseli bir URL'de tutuyorsanız:

**PowerShell'de:**
```powershell
# Örnek (URL'inizi koyun)
$url = "https://your-image-url.com/tdc-maskot.png"
$output = "C:\Users\taha\tdc-products-website\public\images\hero\tdc-maskot.png"

# Klasörü oluştur
New-Item -ItemType Directory -Path "C:\Users\taha\tdc-products-website\public\images\hero" -Force

# İndir
Invoke-WebRequest -Uri $url -OutFile $output
```

---

## 🎯 Özet

```
1. Görseli kaydet: tdc-maskot.png
2. Konuma kopyala: public\images\hero\
3. Git'e ekle: git add, commit, push
4. Bana haber ver, kodu güncellerim
```

**Şu an geçici emoji var (🦸‍♂️), gerçek görseli kaydettiğinizde güncelleyeceğim!**

---

## 📞 Yardım

Görseli kaydettikten sonra şunu yazın:
```
"Görseli kaydettim"
```

Ben de hemen:
1. Kodu güncelleyeceğim (emoji → gerçek görsel)
2. Git'e commit edeceğim
3. Production'a push edeceğim

**Beklemedeyim!** 🦸‍♂️


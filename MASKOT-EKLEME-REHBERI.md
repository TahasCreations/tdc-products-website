# 🎨 Maskot Görsel Ekleme Rehberi

## 📍 Şu An Ne Görünüyor?

Anasayfada geçici olarak **güzel bir emoji placeholder** (🎨) görünüyor.
Kendi maskotunuzu eklemek için aşağıdaki adımları izleyin.

---

## 🚀 Maskot Görselini Ekleme (3 Adım)

### Adım 1: Görseli Hazırlayın

#### Önerilen Format:
- **Format**: PNG (şeffaf arka plan)
- **Boyut**: 800x800px - 1200x1200px
- **Dosya Adı**: `tdc-maskot.png`
- **Arka Plan**: Transparan (şeffaf)
- **Dosya Boyutu**: Max 500KB (optimize edilmiş)

#### Görsel Optimizasyonu:
```bash
# TinyPNG kullanın (online):
https://tinypng.com

# Veya ImageMagick ile:
magick convert maskot.png -resize 1000x1000 -quality 85 tdc-maskot.png
```

---

### Adım 2: Görseli Yükleyin

#### Yöntem 1: Manuel (Windows)
```
1. Dosya Gezgini'ni açın
2. Şu klasöre gidin:
   C:\Users\taha\tdc-products-website\public\images\hero\

3. Görselinizi buraya kopyalayın
4. Dosya adı: tdc-maskot.png olmalı
```

#### Yöntem 2: Komut Satırı
```bash
# PowerShell veya CMD:
cd C:\Users\taha\tdc-products-website
copy C:\path\to\your\maskot.png public\images\hero\tdc-maskot.png
```

---

### Adım 3: Sayfayı Yenileyin

```bash
# Dev server çalışıyorsa otomatik yenilenecek
# Değilse başlatın:
npm run dev

# Tarayıcıda:
http://localhost:3000
```

**Hemen görünecek!** 🎉

---

## 🎨 Alternatif Maskot Çözümleri

### Seçenek 1: AI ile Maskot Oluştur

#### DALL-E / Midjourney Prompt:
```
"Cute mascot character for TDC Market and Sarıkare Agency, 
friendly shopping assistant, modern minimalist style, 
vibrant colors (indigo, coral, yellow), 
holding shopping bags, smiling, 
transparent background, 3D render style"

Türkçe:
"TDC Market ve Sarıkare Ajans için sevimli maskot karakteri, 
arkadaş canlısı alışveriş asistanı, modern minimalist stil, 
canlı renkler (indigo, mercan, sarı), 
alışveriş çantaları tutuyor, gülümseyen, 
şeffaf arka plan, 3D render tarzı"
```

### Seçenek 2: Fiverr'da Sipariş Edin

```
1. fiverr.com'a gidin
2. "mascot design transparent background" araması
3. 5-25$ arası fiyatlarla profesyonel tasarım
4. 1-3 gün içinde teslim
```

### Seçenek 3: Canva ile Kendiniz Yapın

```
1. canva.com → Hesap oluştur (ücretsiz)
2. "Mascot" veya "Character" template'leri
3. Özelleştirin (renkler: indigo, coral, sarı)
4. Download → PNG (transparent background)
```

---

## 💡 Geçici Çözüm Güzel Görünüyor

Şu an kullandığımız placeholder aslında çok modern ve şık:
- ✅ Animasyonlu emoji (🎨)
- ✅ Sparkle efektleri (✨💫)
- ✅ Glow ve floating animasyonlar
- ✅ Hover efektleri

**İsterseniz şimdilik bu şekilde de kalabilir!**

---

## 🔧 Kod Detayları

### Şu An Kullanılan (Placeholder):
```tsx
<motion.div className="text-9xl sm:text-[12rem]">
  🎨
</motion.div>
```

### Görsel Eklendikten Sonra (Otomatik Değişecek):
```tsx
<Image
  src="/images/hero/tdc-maskot.png"
  alt="TDC Market Maskotu"
  fill
  className="object-contain drop-shadow-2xl"
  priority
/>
```

---

## 📐 Görsel Spesifikasyonları

### Teknik Gereksinimler:
```yaml
Format: PNG (WebP de olabilir)
Dimensions: 800x800 - 1200x1200 px
Aspect Ratio: 1:1 (kare)
Background: Transparent
Color Mode: RGB
File Size: < 500KB
Resolution: 72-150 DPI

Önerilen:
- Sharp edges (net kenarlar)
- High contrast (yüksek kontrast)
- Centered composition (merkeze hizalı)
```

### Renk Paleti (Uyumlu Olması İçin):
```css
Primary: #6366F1 (Indigo)
Secondary: #F97316 (Coral/Orange)
Accent: #F59E0B (Yellow)
Background: Transparent
Shadows: Soft drop shadow
```

---

## 🎯 Kontrol Listesi

Maskot görseliniz için:
- [ ] PNG formatında mı?
- [ ] Arka plan şeffaf mı?
- [ ] Boyut 800x800 ile 1200x1200 arası mı?
- [ ] Dosya 500KB'dan küçük mü?
- [ ] Dosya adı `tdc-maskot.png` mı?
- [ ] `public/images/hero/` klasöründe mi?
- [ ] Sayfa yenilendiğinde görünüyor mu?

---

## 🐛 Sorun Giderme

### Görsel Görünmüyorsa:

#### 1. Dosya Yolunu Kontrol Edin
```bash
# PowerShell:
Test-Path "C:\Users\taha\tdc-products-website\public\images\hero\tdc-maskot.png"

# True dönmeli
```

#### 2. Dosya Adını Kontrol Edin
```
✅ Doğru: tdc-maskot.png
❌ Yanlış: TDC-Maskot.png
❌ Yanlış: tdc_maskot.png
❌ Yanlış: maskot.png
```

#### 3. Browser Cache Temizleyin
```
Ctrl + Shift + R (Hard Refresh)
veya
F12 → Network → Disable cache ✓
```

#### 4. Dev Server'ı Yeniden Başlatın
```bash
# Ctrl+C ile durdurun, sonra:
npm run dev
```

#### 5. Konsolu Kontrol Edin
```
F12 → Console
# Görsel yükleme hatası var mı?
```

---

## 🎨 Örnek Maskot Stilleri

### Stil 1: Modern Minimalist
- Basit geometrik şekiller
- Az detay
- Canlı renkler
- Örnek: Duolingo'nun baykuşu

### Stil 2: Kawaii/Cute
- Büyük gözler
- Yumuşak hatlar
- Pastel renkler
- Örnek: Hello Kitty tarzı

### Stil 3: 3D Render
- Gerçekçi gölgeler
- Derinlik hissi
- Parlak yüzeyler
- Örnek: Pixar karakterleri

### Stil 4: Flat Design
- 2D görünüm
- Sade renkler
- Minimal gölge
- Örnek: Google ikonu tarzı

---

## 🚀 Hızlı Test

Görselinizi test etmek için:

```bash
# 1. Görseli ekleyin
copy maskot.png public\images\hero\tdc-maskot.png

# 2. Sayfayı açın
# Tarayıcıda: http://localhost:3000

# 3. Kontrol edin:
# - Görsel yükleniyor mu?
# - Animasyonlar çalışıyor mu?
# - Hover efekti var mı?
# - Mobilde güzel görünüyor mu?
```

---

## 📞 Yardım

Sorun yaşarsanız:
1. Konsol hatalarını kontrol edin (F12)
2. Dosya yolu doğru mu kontrol edin
3. Görsel formatı PNG mi kontrol edin
4. Cache temizleyin ve yeniden deneyin

**Şu anki placeholder da güzel görünüyor, acele etmeyin!** 🎨✨

---

**Son Güncelleme**: 01 Kasım 2025  
**Durum**: ✅ Geçici placeholder aktif  
**Görsel Konumu**: `public/images/hero/tdc-maskot.png`  
**Otomatik Yüklenecek**: Evet, dosya eklendiğinde


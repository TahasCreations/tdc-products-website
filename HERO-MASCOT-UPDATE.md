# 🎨 TDC MASKOT - HERO GÜNCELLEME

## ✅ TAMAMLANDI: Hareketli Maskot Eklendi!

**Tarih:** 31 Ekim 2025 - 03:45  
**Durum:** Görsel Bekleniyor → Kod Hazır ✅  
**Animasyonlar:** 6 farklı hareket  

---

## 📋 YAPILAN DEĞİŞİKLİKLER

### Güncellenen Dosya
```
✅ src/components/home/Hero.tsx
```

---

## 🎨 EKLENENANİMASYONLAR

### 1. Giriş Animasyonu
```typescript
initial={{ scale: 0, rotate: -180 }}
animate={{ scale: 1, rotate: 0 }}
transition={{ duration: 0.8, delay: 0.5 }}
```
**Efekt:** Maskot dönerek ve büyüyerek giriş yapar

### 2. Sürekli Yüzme Hareketi
```typescript
animate={{ y: [0, -15, 0] }}
transition={{ duration: 3, repeat: Infinity }}
```
**Efekt:** Yukarı aşağı yavaşça hareket eder (süper kahraman uçuşu)

### 3. Hover Animasyonu
```typescript
whileHover={{ 
  scale: 1.1,
  rotate: [0, -5, 5, -5, 0]
}}
```
**Efekt:** Üzerine gelindiğinde büyür ve sallanır

### 4. Glow Efekti
```typescript
animate={{ 
  opacity: [0.3, 0.6, 0.3],
  scale: [0.95, 1.05, 0.95]
}}
```
**Efekt:** Arkadan parlayan sarı-turuncu ışık

### 5. Dönen Gradient 1
```typescript
animate={{ rotate: 360 }}
transition={{ duration: 20, repeat: Infinity }}
```
**Efekt:** Saat yönünde yavaş dönen mor gradient

### 6. Dönen Gradient 2
```typescript
animate={{ rotate: -360 }}
transition={{ duration: 25, repeat: Infinity }}
```
**Efekt:** Ters yönde dönen turuncu gradient

---

## 📁 GÖRSEL YERLEŞTIRME

### Adım 1: Görseli Kaydet
Görseli şu konuma kaydedin:
```
/public/images/hero/tdc-maskot.png
```

### Dizin Oluşturma
```bash
# PowerShell'de
New-Item -ItemType Directory -Force -Path "public\images\hero"

# Görseli buraya kopyalayın
Copy-Item "C:\path\to\your\image.png" "public\images\hero\tdc-maskot.png"
```

---

## 🎨 GÖRSEL ÖZELLİKLERİ

### Responsive Boyutlar
```
Mobile:   w-48 h-48  (192px × 192px)
Tablet:   w-64 h-64  (256px × 256px)
Desktop:  w-80 h-80  (320px × 320px)
Large:    w-96 h-96  (384px × 384px)
```

### Optimizasyonlar
- ✅ `priority` → İlk yüklemede öncelik
- ✅ `object-contain` → Oranını koru
- ✅ `drop-shadow-2xl` → Gölge efekti
- ✅ Lazy loading hazır
- ✅ Next.js Image optimize

---

## 🎯 GÖRÜNÜM

### Desktop
```
┌─────────────────────────────────────────────┐
│                                             │
│  [Metin]              [Hareketli Arka Plan]│
│  TDC Market            🌀 Dönen gradients   │
│  Başlık...             💫 Floating orbs     │
│                                             │
│  [Butonlar]                  [MASKOT]       │
│                              🦸 TDC Hero    │
│                              ↕️ Yüzme       │
│                              ✨ Glow        │
│                                             │
└─────────────────────────────────────────────┘
```

### Mobile
```
┌──────────────────────┐
│   [Metin Üstte]      │
│   TDC Market         │
│   Başlık...          │
│   [Butonlar]         │
│                      │
│   [Maskot Alta]      │
│      🦸 TDC          │
│      (küçük)         │
└──────────────────────┘
```

---

## ✨ ANİMASYON DETAYLARI

### Timeline
```
0.0s: Sayfa yüklenir
      ↓
0.5s: Maskot dönerek giriş yapar
      (scale: 0→1, rotate: -180°→0°)
      ↓
1.3s: Yerleşir
      ↓
∞:    Sürekli yüzme hareketi
      (yukarı-aşağı 15px, 3 saniye)
      ↓
Hover: Büyür ve sallanır
       (scale: 1.1, rotate: ±5°)
```

### Background Layers
```
Layer 1: Gradient background (indigo→coral)
         ↓
Layer 2: Dönen gradient orb 1 (sağ üst)
         20 saniye, saat yönü
         ↓
Layer 3: Dönen gradient orb 2 (sol alt)
         25 saniye, ters yön
         ↓
Layer 4: Floating orbs (sarı, mor)
         8-10 saniye dalgalı hareket
         ↓
Layer 5: MASKOT (z-10)
         Yukarı-aşağı hareket
         Glow efekti
```

---

## 🚀 KULLANIM

### Görsel Hazırlama
1. Görseli PNG formatında kaydedin
2. Arka planı transparent olsun (önerilir)
3. Boyut: 1000×1000px veya üzeri (optimize edilecek)
4. Dosya adı: `tdc-maskot.png`

### Yerleştirme
```
public/
└── images/
    └── hero/
        └── tdc-maskot.png  ← Buraya kaydedin
```

---

## 🎊 SONUÇ

```
╔═══════════════════════════════════════════╗
║                                           ║
║  ✅ MASKOT SİSTEMİ HAZIR!                ║
║                                           ║
║  🎨 6 Farklı Animasyon                    ║
║  ✨ Glow Efekti                           ║
║  🔄 Dönen Arka Planlar                    ║
║  💫 Floating Orbs                         ║
║  📱 Responsive                            ║
║  ⚡ Optimized                             ║
║                                           ║
║  GÖRSELI YERLEŞTİRİN, HAZIR! 🚀          ║
║                                           ║
╚═══════════════════════════════════════════╝
```

---

## 📸 SONRAKİ ADIM

Görseli şu konuma kaydedin:
```
C:\Users\taha\tdc-products-website\public\images\hero\tdc-maskot.png
```

**Eğer klasör yoksa:**
```powershell
# PowerShell'de
New-Item -ItemType Directory -Force -Path "public\images\hero"

# Görseli kopyalayın (sağ tık → kopyala)
# Sonra public\images\hero\ klasörüne yapıştırın
# Dosya adı: tdc-maskot.png
```

**Kaydettiğinizde maskot otomatik olarak:**
- ✅ Dönerek giriş yapacak
- ✅ Yukarı-aşağı yüzecek
- ✅ Hover'da büyüyüp sallanacak
- ✅ Arkadan parlayacak
- ✅ Hareketli gradientler içinde olacak

**HAZIRIM! Görseli yerleştirin ve harika görünsün! 🎨✨**

---

*Hero.tsx güncellendi ✅*  
*31 Ekim 2025 - 03:45*  
*TDC Market - Maskot Edition*



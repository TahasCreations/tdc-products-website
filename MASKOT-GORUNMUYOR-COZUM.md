# 🔧 Maskot Görünmüyor - Çözüm Adımları

## ✅ Yapılan Düzeltmeler

### 1. Image Component Güncellendi
```tsx
// Önceki (fill mode)
<Image src="..." fill />

// Yeni (width/height + unoptimized)
<Image 
  src="/images/hero/tdc-maskot.png" 
  width={400} 
  height={400}
  unoptimized
/>
```

### 2. Dev Server Yeniden Başlatıldı
```bash
taskkill /F /IM node.exe  # Eski server'ı durdur
npm run dev               # Yeni server başlat
```

---

## 🎯 Şimdi Yapın

### Adım 1: Tarayıcı Cache Temizleyin
```
Ctrl + Shift + R (Hard Refresh)
veya
Ctrl + F5
```

### Adım 2: Sayfayı Yeniden Açın
```
http://localhost:3000
```

### Adım 3: Browser Console Kontrol
```
F12 → Console sekmesi
Hata var mı bakın
```

---

## 🐛 Hala Görünmüyorsa

### Çözüm 1: Dosya Adını Kontrol Edin
```powershell
# PowerShell'de:
Get-ChildItem "C:\Users\taha\tdc-products-website\public\images\hero"

# Çıktıda "tdc-maskot.png" görmeli
# DİKKAT: Büyük/küçük harf önemli!
```

Dosya adı MUTLAKA:
```
✅ tdc-maskot.png
❌ TDC-maskot.png
❌ tdc-Maskot.png
❌ TDC-MASKOT.PNG
```

### Çözüm 2: Dosyayı Yeniden Adlandırın
```powershell
# Eğer dosya adı farklıysa:
cd "C:\Users\taha\tdc-products-website\public\images\hero"
Rename-Item "MEVCUT-DOSYA-ADI.png" "tdc-maskot.png"
```

### Çözüm 3: Alternatif Görsel Yolu
Eğer hala çalışmazsa, görseli direkt public klasörüne koyalım:

```powershell
# Görseli buraya kopyalayın:
C:\Users\taha\tdc-products-website\public\tdc-maskot.png
```

Sonra kodu değiştirelim:
```tsx
src="/tdc-maskot.png"  // images/hero/ yerine
```

### Çözüm 4: Browser Developer Tools
```
F12 → Network sekmesi
Sayfayı yenileyin (Ctrl+R)
"tdc-maskot" araması yapın
404 hatası var mı?
```

---

## 🔍 Debug Checklist

### Dosya Sistemi:
- [ ] Dosya `public/images/hero/` içinde mi?
- [ ] Dosya adı tam olarak `tdc-maskot.png` mi?
- [ ] Dosya boyutu 2.1 MB civarında mı?
- [ ] Dosya bozuk değil mi? (Windows Photo ile açılıyor mu?)

### Dev Server:
- [ ] Dev server çalışıyor mu?
- [ ] Port 3000 kullanımda mı?
- [ ] Konsol'da hata var mı?

### Browser:
- [ ] Cache temizlendi mi?
- [ ] Hard refresh yapıldı mı?
- [ ] F12 Console'da hata var mı?
- [ ] F12 Network'te 404 var mı?

---

## 🚨 Acil Çözüm (Test İçin)

Geçici olarak emoji geri koyalım, sorun nerde görelim:

```tsx
// Görselin yerine:
<div className="text-9xl">🦸‍♂️</div>
```

Bu görünüyorsa → Sorun görsel yolunda
Bu da görünmüyorsa → Sorun component'te

---

## 📞 Yardım

Şunları paylaşın:
1. Browser console'daki hata mesajları (F12)
2. Dosya listesi: `Get-ChildItem "public\images\hero"`
3. Dev server çıktısı (terminalden)

Birlikte hallederiz! 🛠️

---

**Sonraki Adım**: Hard refresh yapın (Ctrl + Shift + R) ve tekrar bakın!


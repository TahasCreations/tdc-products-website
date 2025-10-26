# 🎨 Wix Tarzı Tam Sayfa Site Editor - Tamamlandı!

## 🎉 Yeni Site Builder Sistemi

Site builder'ınız artık **Wix benzeri** tam sayfa önizleme editörü olarak çalışıyor!

## ✨ Ana Özellikler

### 1. 🪟 Yeni Sekmede Açılma
- ✅ **Tam sayfa editör** her zaman yeni sekmede açılır
- ✅ Admin paneli açık kalır
- ✅ Güvenli açılma (`noopener,noreferrer`)

### 2. 📱 Sol Sidebar - Sayfa Yönetimi

**Özellikler:**
- ✅ **Sayfa listesi** - Tüm sayfalarınızı görün
- ✅ **Builder sayfaları** ve **mevcut sayfalar** ayrı gruplarda
- ✅ **Arama** - Sayfaları hızlıca bulun
- ✅ **İstatistikler** - Toplam sayfa ve yayında olan sayfa sayısı
- ✅ **Yeni sayfa oluştur** butonu
- ✅ **Hızlı erişim** - Medya ve ayarlar için butonlar
- ✅ **Gizle/Göster** - Panel toggle butonu

**UI Özellikleri:**
- 📊 Gradient header
- 🔍 Arama kutusu
- 📈 Hızlı istatistikler
- 🎨 Modern card tasarımı
- ⚡ Smooth animasyonlar
- 🎯 Tıklanabilir sayfa öğeleri

### 3. 🎨 Merkez - Tam Sayfa Önizleme

**Wix benzeri deneyim:**
- ✅ **Gerçek site görünümü** - Site tam olarak görünür
- ✅ **Tam genişlik** - Maksimum canvas alanı
- ✅ **Responsive önizleme** - Mobile/Tablet/Desktop görünümleri
- ✅ **Canlı düzenleme** - Component'lere tıklayarak düzenle
- ✅ **Empty state** - Boş sayfalar için rehber

### 4. ⚙️ Sağ Panel - Özellikler

**İçerik:**
- ✅ **Properties Panel** - Seçili component'in özellikleri
- ✅ **Layout kontrolleri** - Width, height, display
- ✅ **Spacing** - Margin, padding
- ✅ **Typography** - Font, size, weight
- ✅ **Colors** - Text, background, gradients
- ✅ **Borders & Effects** - Radius, shadow, opacity
- ✅ **Animations** - Transform, transition

**Özellikler:**
- 🎚️ Dinamik ayarlar
- 🎨 Real-time önizleme
- 💾 Otomatik kaydetme
- ⚡ Hızlı değişiklikler

### 5. 🎛️ Üst Toolbar

**Butonlar:**
- ✅ **Geri/Kaydet** - Undo/Redo/Save
- ✅ **Önizleme** - Tam sayfa önizleme
- ✅ **Responsive** - Mobile/Tablet/Desktop toggle
- ✅ **Yayınla** - Publish butonu
- ✅ **Panel toggle** - Sol/sağ panel aç/kapa

## 🚀 Kullanım

### Adım 1: Editörü Açın

**Seçenek 1: Yeni Sayfa**
```
Admin Panel → Site Builder → Sayfalar
→ "Yeni Sayfa" butonuna tıkla
→ Tam sayfa editör YENİ SEKMEDE açılır ✨
```

**Seçenek 2: Mevcut Sayfa**
```
Sayfalar listesinden bir sayfa seç
→ "Düzenle" butonuna tıkla
→ Tam sayfa editör YENİ SEKMEDE açılır ✨
```

**Seçenek 3: Doğrudan Erişim**
```
/admin/site-builder/editor-full
```

### Adım 2: Sayfa Seçin

**Sol sidebar'dan:**
- Builder sayfaları listesinden bir sayfa seçin
- Veya mevcut sayfalar bölümünden bir sayfa seçin
- Yeni sayfa oluşturmak için "+" butonuna tıklayın

### Adım 3: Düzenleyin

**Merkez alanda:**
- Sayfa tam görünümde açılır
- Component'lere tıklayarak seçin
- Sağ panelden özellikleri düzenleyin
- Real-time değişiklikleri görün

### Adım 4: Kaydedin

- **Ctrl+S** - Hızlı kaydetme
- **Kaydet** butonu - Toolbar'dan
- **Yayınla** - Canlıya almak için

## 📊 Layout Yapısı

```
┌─────────────────────────────────────────────────────────┐
│ Toolbar (Panel Toggle + Page Title + Actions)          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────┐  ┌─────────────────────────┐  ┌────────┐ │
│  │        │  │                         │  │        │ │
│  │  SOL   │  │                         │  │  SAĞ   │ │
│  │ SIDEBAR│  │                         │  │  PANEL │ │
│  │        │  │    CANVAS (TAM SAYFA)   │  │        │ │
│  │ •Pages │  │                         │  │•Props  │ │
│  │ •Search│  │   Gerçek site görünümü  │  │•Layout │ │
│  │ •Stats │  │                         │  │•Style  │ │
│  │        │  │   Tam genişlik önizleme │  │        │ │
│  │[Toggle]│  │                         │  │[Toggle]│ │
│  └────────┘  └─────────────────────────┘  └────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🎯 Öncesi / Sonrası

### ÖNCE ❌
- Editör admin panel içinde açılıyordu
- Dar panel alanları
- Sayfa yönetimi yoktu
- Mevcut sayfalar düzenlenemiyordu
- Canvas küçüktü

### SONRA ✅
- **Yeni sekmede tam sayfa editör**
- **Geniş sol sidebar** - Tüm sayfalar liste halinde
- **Tam genişlik canvas** - Gerçek site görünümü
- **Mevcut sayfalar düzenlenebilir**
- **Wix benzeri deneyim**

## 📁 Yeni Dosyalar

### 1. `components/site-builder/SiteEditorSidebar.tsx`
**Boyut:** ~400 satır  
**Amaç:** Sol sidebar - sayfa yönetimi  
**Özellikler:**
- Sayfa listesi (builder + mevcut)
- Arama
- İstatistikler
- Yeni sayfa oluşturma
- Hızlı erişim butonları
- Smooth animasyonlar

### 2. `app/admin/site-builder/editor-full/page.tsx`
**Boyut:** ~250 satır  
**Amaç:** Tam sayfa editör ana sayfası  
**Özellikler:**
- Wix benzeri layout
- Sol/sağ panel toggle
- URL parametre desteği
- Loading states
- Keyboard shortcuts
- Modern UI

## 🔄 Değiştirilen Dosyalar

### `app/admin/site-builder/pages/page.tsx`
- ✅ Yeni editör URL'lerine yönlendirme
- ✅ `editor-full` route kullanımı
- ✅ Query parametre desteği

## 💡 Teknik Detaylar

### URL Yapısı
```
# Yeni sayfa
/admin/site-builder/editor-full

# Mevcut sayfa
/admin/site-builder/editor-full?page=PAGE_ID
```

### State Management
```typescript
const { 
  currentPage,      // Seçili sayfa
  showLayers,       // Layers panel görünürlüğü
  showComponentLibrary, // Component library görünürlüğü
  showProperties,   // Properties panel görünürlüğü
  loadPage,        // Sayfa yükleme fonksiyonu
  selectComponent  // Component seçme fonksiyonu
} = useEditorStore();
```

### Panel Toggle
```typescript
const [showLeftPanel, setShowLeftPanel] = useState(true);
const [showRightPanel, setShowRightPanel] = useState(true);
```

## 🎨 UI/UX Özellikleri

### Sol Sidebar
- 📱 **320px genişlik** (w-80)
- 🎨 **Modern card tasarımı**
- 🔍 **Arama özelliği**
- 📊 **İstatistikler**
- ⚡ **Smooth animasyonlar**
- 🎯 **Hover efektleri**

### Canvas
- 🖥️ **Maksimum genişlik** (flex-1)
- 📱 **Responsive önizleme**
- 🎨 **Gradient arka plan**
- ✨ **Empty state**
- 🖱️ **Click to select**

### Sağ Panel
- 📐 **384px genişlik** (w-96)
- 🎚️ **Dinamik içerik**
- 💾 **Auto-save**
- 🎨 **Real-time preview**

## ⌨️ Klavye Kısayolları

| Kısayol | İşlev |
|---------|-------|
| `Ctrl+Z` | Geri Al |
| `Ctrl+Y` | Yinele |
| `Ctrl+S` | Kaydet |
| `Ctrl+C` | Kopyala |
| `Ctrl+V` | Yapıştır |
| `Delete` | Sil |
| `Ctrl+D` | Çoğalt |

## 🎯 Kullanım Senaryoları

### Senaryo 1: Yeni Landing Page
```
1. Admin Panel → Site Builder → Sayfalar
2. "Yeni Sayfa" → Yeni sekmede açılır
3. Sol sidebar'dan component seç
4. Canvas'a ekle
5. Sağ panelden özellikleri düzenle
6. Ctrl+S ile kaydet
7. Yayınla!
```

### Senaryo 2: Mevcut Sayfayı Düzenle
```
1. Sol sidebar'dan sayfa listesine bak
2. Düzenlemek istediğin sayfaya tıkla
3. Sayfa canvas'da açılır
4. Component'e tıkla ve düzenle
5. Kaydet ve yayınla
```

### Senaryo 3: Hızlı İçerik Güncelleme
```
1. Editör zaten açık
2. Sol sidebar'dan sayfa değiştir
3. İçeriği düzenle
4. Ctrl+S
5. Tamamlandı!
```

## ✅ Kontrol Listesi

- [x] Sol sidebar oluşturuldu
- [x] Tam sayfa canvas entegrasyonu
- [x] Sağ properties panel
- [x] Yeni sekmede açılma
- [x] Sayfa yönetimi
- [x] Mevcut sayfaları düzenleme
- [x] URL parametre desteği
- [x] Smooth animasyonlar
- [x] Keyboard shortcuts
- [x] Modern UI/UX

## 🎉 Sonuç

Artık site builder'ınız:
- ✅ **Wix benzeri** tam sayfa editör
- ✅ **Yeni sekmede** açılıyor
- ✅ **Tüm sayfalar** düzenlenebilir
- ✅ **Geniş canvas** alanı
- ✅ **Modern ve profesyonel** görünüm
- ✅ **Akıcı kullanıcı deneyimi**

**Tamamlandı ve kullanıma hazır! 🚀**

---

**Tarih:** 2025-10-25  
**Versiyon:** 3.0.0 (Wix-Style)  
**Durum:** ✅ Tamamlandı


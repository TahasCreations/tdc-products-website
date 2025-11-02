# 🎨 Visual Page Editor System - Tam Teşekküllü

## 🎯 Sistem Özellikleri

### Ana Özellik:
```
✅ SİTENİZDEKİ HER SAYFA → Admin'den TAM KONTROL
✅ Canlı önizleme (WYSIWYG - What You See Is What You Get)
✅ Click to edit (sayfada tıklayıp direkt düzenleme)
✅ Tüm sayfalar aynı editörde
✅ Gerçek zamanlı değişiklik görme
✅ Mobile/Desktop preview
```

---

## 📋 Düzenlenebilecek Tüm Sayfalar

### 1. Anasayfa (`/`)
- Hero section (başlık, alt başlık, CTA)
- Kategori strip
- Collection strips
- Product grid
- Maskot & animasyonlar
- Trust badges
- Newsletter

### 2. Kategori Lansman Sayfaları
- `/categories/figur-koleksiyon`
- `/categories/moda-aksesuar`
- `/categories/elektronik`
- `/categories/ev-yasam`
- `/categories/sanat-hobi`
- `/categories/hediyelik`

**Her birinde:**
- Hero banner
- Promo sections
- Featured products
- Content blocks
- SEO metadata

### 3. Ürün Listeleme (`/products`)
- Page header
- Filter sidebar
- Product grid layout
- Sorting options
- Pagination

### 4. Ürün Detay (`/products/[slug]`)
- Product images gallery
- Description sections
- Reviews section
- Related products
- Add to cart CTA

### 5. Statik Sayfalar
- `/about` - Hakkımızda
- `/contact` - İletişim
- `/faq` - SSS
- `/privacy` - Gizlilik
- `/terms` - Kullanım Şartları
- `/shipping` - Kargo & İade

### 6. Blog Sayfaları
- `/blog` - Blog listesi
- `/blog/[slug]` - Blog yazısı
- Blog kategorileri

### 7. E-commerce Sayfaları
- `/cart` - Sepet
- `/checkout` - Ödeme
- `/orders` - Siparişlerim
- `/profile` - Profil

### 8. Footer & Header
- Header navigation
- Footer kolonları
- Announcement bar

---

## 🎨 Visual Editor Interface

### Ana Ekran Layout:

```
┌─────────────────────────────────────────────────────────────┐
│  🎨 Visual Page Editor                    [Save] [Publish]   │
├───────────┬─────────────────────────────────┬───────────────┤
│           │                                 │               │
│  PAGES    │       LIVE PREVIEW             │   SETTINGS    │
│  TREE     │      (Tam teşekküllü)          │   PANEL       │
│           │                                 │               │
│  📁 Home  │   ┌─────────────────────────┐  │ ✏️ Edit Mode  │
│  📁 Cats  │   │  [HEADER]               │  │               │
│    - Fig  │   │  ────────────────────   │  │ 📱 Device:   │
│    - Moda │   │  🦸‍♂️ TDC Maskot         │  │  □ Desktop   │
│  📁 Prods │   │  Welcome to TDC!        │  │  □ Tablet    │
│  📁 Pages │   │  [CTA Buttons]          │  │  ☑ Mobile    │
│    - About│   │  ────────────────────   │  │               │
│    - Blog │   │  [Category Strip]       │  │ 🎨 Selected: │
│  📁 Foot. │   │  [Products Grid]        │  │  Hero Text   │
│           │   │  [Footer]               │  │               │
│  [+ New]  │   └─────────────────────────┘  │ 📝 Content:  │
│           │                                 │  [Editor]    │
└───────────┴─────────────────────────────────┴───────────────┘
```

---

## 🔧 Editor Modus (3 Mod)

### 1. **Navigator Mode** (Varsayılan)
```
- Sayfada gezinme
- Componentlere tıklayıp seçme
- Hover ile highlight
- Quick actions (edit, delete, duplicate)
```

### 2. **Edit Mode** (Element seçildiğinde)
```
- Inline text editing
- Image replacement
- Style adjustments
- Content changes
```

### 3. **Structure Mode** (Layout değişiklikleri)
```
- Drag & drop reordering
- Add/remove sections
- Layout changes
- Component nesting
```

---

## 🎯 Click-to-Edit Özelliği

### Nasıl Çalışır:

1. **Sayfa Seçimi:**
   ```
   Admin → Editor → "Anasayfa" seç
   → Sayfa tam teşekküllü yüklenir
   ```

2. **Element Seçimi:**
   ```
   Sayfada herhangi bir yere tıkla
   → Element highlight olur
   → Sağ panelde ayarlar açılır
   ```

3. **Düzenleme:**
   ```
   Text: Direkt yazabilirsin
   Image: Tıkla → Upload/Select
   Button: Text, link, style düzenle
   ```

4. **Kaydet:**
   ```
   Save → Draft (taslak)
   Publish → Canlıya al
   ```

---

## 🗂️ Page Tree (Sayfa Ağacı)

### Sol Panel - Tüm Sayfalar:

```
📂 TDC Market Site
│
├── 🏠 Homepage
│   ├── Hero Section
│   ├── Announcement Bar
│   ├── Category Strip
│   ├── Collection Strip
│   ├── Product Grid
│   ├── Testimonials
│   └── Newsletter
│
├── 📁 Categories
│   ├── 🎭 Figür & Koleksiyon
│   │   ├── Hero Banner
│   │   ├── Promo Banners
│   │   ├── Featured Products
│   │   └── Content Blocks
│   ├── 👔 Moda & Aksesuar
│   ├── 💻 Elektronik
│   ├── 🏠 Ev & Yaşam
│   ├── 🎨 Sanat & Hobi
│   └── 🎁 Hediyelik
│
├── 📁 Products
│   ├── Product List Page
│   │   ├── Filters
│   │   ├── Sort Options
│   │   └── Grid Layout
│   └── Product Detail Template
│       ├── Image Gallery
│       ├── Info Section
│       ├── Reviews
│       └── Related Products
│
├── 📁 Static Pages
│   ├── 📖 Hakkımızda
│   ├── 📞 İletişim
│   ├── ❓ SSS
│   ├── 🔒 Gizlilik
│   └── 📜 Şartlar
│
├── 📁 Blog
│   ├── Blog List
│   └── Blog Post Template
│
├── 📁 E-commerce
│   ├── 🛒 Cart
│   ├── 💳 Checkout
│   └── 📦 Orders
│
├── 🔝 Header
│   ├── Logo
│   ├── Navigation
│   ├── Search
│   └── User Menu
│
└── 🔽 Footer
    ├── Column 1
    ├── Column 2
    ├── Column 3
    └── Social Links
```

---

## 🎨 Element Editing Panel

### Sağ Panel - Element Seçildiğinde:

#### Text Element:
```
┌─────────────────────────┐
│ TEXT SETTINGS           │
├─────────────────────────┤
│ Content:                │
│ ┌─────────────────────┐ │
│ │ Hoş Geldiniz TDC!   │ │
│ └─────────────────────┘ │
│                         │
│ Style:                  │
│ Font: [Inter ▼]        │
│ Size: [32px ▼]         │
│ Weight: [Bold ▼]       │
│ Color: [#000000 ⬛]    │
│ Align: [L|C|R]         │
│                         │
│ Spacing:                │
│ Margin: [16px]          │
│ Padding: [8px]          │
│                         │
│ [Save Changes]          │
└─────────────────────────┘
```

#### Image Element:
```
┌─────────────────────────┐
│ IMAGE SETTINGS          │
├─────────────────────────┤
│ Current:                │
│ ┌─────────────────────┐ │
│ │   🖼️ Preview       │ │
│ └─────────────────────┘ │
│                         │
│ [📤 Upload New]        │
│ [📂 Media Library]     │
│                         │
│ Alt Text:               │
│ ┌─────────────────────┐ │
│ │ TDC Maskot          │ │
│ └─────────────────────┘ │
│                         │
│ Dimensions:             │
│ Width: [400px]          │
│ Height: [Auto]          │
│ Fit: [Contain ▼]       │
│                         │
│ [Save Changes]          │
└─────────────────────────┘
```

#### Button Element:
```
┌─────────────────────────┐
│ BUTTON SETTINGS         │
├─────────────────────────┤
│ Text:                   │
│ ┌─────────────────────┐ │
│ │ Alışverişe Başla    │ │
│ └─────────────────────┘ │
│                         │
│ Link:                   │
│ ┌─────────────────────┐ │
│ │ /products           │ │
│ └─────────────────────┘ │
│                         │
│ Style:                  │
│ Type: [Primary ▼]      │
│ Size: [Large ▼]        │
│ Color: [#CBA135 ⬛]    │
│                         │
│ Icon:                   │
│ [🛍️ Shop Icon ▼]       │
│ Position: [Left|Right]  │
│                         │
│ [Save Changes]          │
└─────────────────────────┘
```

#### Section Element:
```
┌─────────────────────────┐
│ SECTION SETTINGS        │
├─────────────────────────┤
│ Layout:                 │
│ [Grid|Flex|Stack]       │
│                         │
│ Columns: [3 ▼]         │
│ Gap: [24px]             │
│                         │
│ Background:             │
│ Type: [Color|Image|Gradient]
│ Color: [#FFFFFF ⬛]     │
│                         │
│ Padding:                │
│ Top: [64px]             │
│ Bottom: [64px]          │
│ Left: [16px]            │
│ Right: [16px]           │
│                         │
│ [+ Add Component]       │
│ [Delete Section]        │
└─────────────────────────┘
```

---

## 🎯 Component Library

### Eklenebilir Componentler:

#### Layout:
- Container
- Grid (2, 3, 4, 6 columns)
- Flex Row/Column
- Section Divider
- Spacer

#### Content:
- Heading (H1-H6)
- Paragraph
- Rich Text Block
- Image
- Image Gallery
- Video (YouTube, Vimeo)
- Icon

#### Interactive:
- Button
- Link
- Form
- Input Field
- Dropdown
- Checkbox
- Radio Button

#### E-commerce:
- Product Card
- Product Grid
- Product Slider
- Category Card
- Cart Summary
- Checkout Form

#### Marketing:
- Hero Banner
- Call to Action
- Testimonial
- Feature Grid
- Pricing Table
- FAQ Accordion
- Newsletter Form
- Social Proof

#### Advanced:
- Countdown Timer
- Progress Bar
- Tabs
- Modal/Popup
- Tooltip
- Badge
- Alert/Notice

---

## 🔄 Live Preview Modes

### Device Preview:

```
┌─────────────────────────────────────┐
│ 🖥️ Desktop | 📱 Tablet | 📱 Mobile │
├─────────────────────────────────────┤
│                                     │
│  Desktop (1920x1080)                │
│  ┌─────────────────────────────┐   │
│  │   Full page preview         │   │
│  │   All features visible      │   │
│  └─────────────────────────────┘   │
│                                     │
│  Tablet (768x1024)                  │
│  ┌─────────────────┐               │
│  │ Responsive view │               │
│  └─────────────────┘               │
│                                     │
│  Mobile (375x667)                   │
│  ┌───────────┐                     │
│  │ Mobile    │                     │
│  │ Layout    │                     │
│  └───────────┘                     │
└─────────────────────────────────────┘
```

### Interaction Modes:

1. **Edit Mode:** Düzenleme aktif
2. **Preview Mode:** Gerçek görünüm (tıklama kapalı)
3. **Mobile Mode:** Touch simulation
4. **Compare Mode:** Before/After

---

## 📱 Responsive Editing

### Her Cihaz İçin Ayrı Ayarlar:

```typescript
interface ResponsiveSettings {
  desktop: {
    fontSize: '24px',
    padding: '64px',
    columns: 4,
    display: true
  },
  tablet: {
    fontSize: '20px',
    padding: '32px',
    columns: 2,
    display: true
  },
  mobile: {
    fontSize: '16px',
    padding: '16px',
    columns: 1,
    display: true
  }
}
```

---

## 💾 Auto-Save & Versioning

### Auto-Save:
```
Her 30 saniyede → Otomatik draft kaydet
Manuel save → Ctrl+S
Publish → Canlıya al
```

### Version History:
```
v1.0 - 01.11.2025 15:30 - Initial
v1.1 - 01.11.2025 16:00 - Hero updated
v1.2 - 01.11.2025 16:30 - Products added

[Restore] [Preview] [Compare]
```

---

## 🎨 Visual Indicators

### Sayfa Elementlerinde:

```
┌─────────────────────────────┐
│ [EDITABLE] Hero Section     │  ← Hover'da mavi border
│                             │
│  🖱️ Click to edit          │  ← Tıklanabilir
│  ✏️ Currently editing       │  ← Aktif element
│  ✅ Saved                   │  ← Kaydedildi
│  ⚠️ Unsaved changes        │  ← Kaydedilmemiş
└─────────────────────────────┘
```

---

## 🔧 Teknik Implementasyon

### Database Schema:

```prisma
model PageContent {
  id        String   @id @default(cuid())
  pageType  String   // 'home', 'category', 'about', etc.
  pageSlug  String?  // For dynamic pages
  sections  Json     // All editable sections
  metadata  Json     // SEO, og tags, etc.
  status    String   @default("draft")
  version   Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([pageType, pageSlug])
}

model PageVersion {
  id          String   @id @default(cuid())
  pageId      String
  version     Int
  sections    Json
  comment     String?
  createdAt   DateTime @default(now())
  createdById String
  
  @@unique([pageId, version])
}
```

### Content Structure (JSON):

```json
{
  "pageType": "home",
  "sections": [
    {
      "id": "hero-1",
      "type": "hero",
      "editable": true,
      "content": {
        "title": {
          "text": "Hoş Geldiniz TDC Market'e",
          "style": {
            "fontSize": "48px",
            "color": "#000000",
            "fontWeight": "bold"
          }
        },
        "subtitle": {
          "text": "Türkiye'nin en iyi figür mağazası",
          "style": {
            "fontSize": "24px",
            "color": "#666666"
          }
        },
        "cta": {
          "text": "Alışverişe Başla",
          "link": "/products",
          "style": "primary"
        },
        "backgroundImage": "/images/hero-bg.jpg"
      },
      "responsive": {
        "mobile": {
          "title": { "fontSize": "32px" },
          "subtitle": { "fontSize": "18px" }
        }
      }
    },
    {
      "id": "categories-1",
      "type": "category-strip",
      "editable": true,
      "content": {
        "title": "Kategoriler",
        "categories": [...],
        "layout": "grid",
        "columns": 6
      }
    }
  ],
  "metadata": {
    "title": "TDC Market - Anasayfa",
    "description": "...",
    "keywords": ["figür", "koleksiyon"]
  }
}
```

---

## 🚀 Admin Panel Sayfası

### Route: `/admin/editor`

```
┌──────────────────────────────────────────────────────────┐
│  🎨 Visual Page Editor                                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Select Page to Edit:                                    │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 🔍 Search pages...                                 │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  Recent Pages:                                           │
│  ┌──────┬──────┬──────┬──────┬──────┐                  │
│  │ Home │ Cat  │ About│ Blog │ Cont │                  │
│  │ 🏠   │ 📁   │ 📖   │ 📝   │ 📞   │                  │
│  └──────┴──────┴──────┴──────┴──────┘                  │
│                                                          │
│  All Pages:                                              │
│  ┌────────────────────────────────────────────────────┐ │
│  │ 📁 Homepage              [Edit] [Preview]          │ │
│  │ 📁 Categories (6)        [Expand ▼]               │ │
│  │ 📁 Products             [Edit] [Preview]          │ │
│  │ 📁 Static Pages (5)      [Expand ▼]               │ │
│  │ 📁 Blog                 [Edit] [Preview]          │ │
│  │ 📁 Header               [Edit] [Preview]          │ │
│  │ 📁 Footer               [Edit] [Preview]          │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  [+ Create New Page]                                     │
└──────────────────────────────────────────────────────────┘
```

---

## ✅ Özellikler Checklist

Sistem şunları yapabilecek:

- [x] Her sayfayı listele
- [x] Sayfayı tam teşekküllü göster
- [x] Click-to-edit
- [x] Inline editing
- [x] Image upload/replace
- [x] Component add/remove
- [x] Drag & drop reorder
- [x] Responsive preview
- [x] Auto-save
- [x] Version control
- [x] Publish/Draft
- [x] SEO settings
- [x] Mobile optimization

---

## 🎯 Kullanım Senaryosu

### Örnek: Anasayfa Hero Düzenleme

```
1. Admin → Editor → "Homepage" seç
2. Sayfa tam teşekküllü yüklenir
3. Hero section'a tıkla
4. Sağ panel açılır:
   - Title text değiştir
   - Background image değiştir
   - CTA button text/link düzenle
5. Live preview'da anında görürsün
6. Save → Publish
7. Canlı sitede görünür
```

---

**Bu sistemi şimdi oluşturalım mı?** 🎨🚀

Tüm sayfalar tam teşekküllü editörde görünecek ve her element düzenlenebilir olacak!


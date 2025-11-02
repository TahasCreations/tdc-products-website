# 🎨 Admin Full Control System - Detaylı Plan

## 🎯 Amaç

Admin panelinden:
- ✅ **Tüm sayfalarda** görsel ekleyebilme
- ✅ **Kategori lansman sayfalarını** düzenleyebilme
- ✅ **Hakkımızda, Blog, İletişim** sayfalarını özelleştirebilme
- ✅ **Site builder** ile drag-drop sayfa oluşturma
- ✅ **Media library** ile tüm görselleri yönetme
- ✅ **Tam kontrol** tüm içerikler üzerinde

---

## 📊 Sistem Modülleri

### 1. **Media Manager** (Görsel Yönetimi)
### 2. **Page Builder** (Sayfa Oluşturucu)
### 3. **Category Page Manager** (Kategori Sayfası Düzenleyici)
### 4. **Content Manager** (İçerik Yönetimi)
### 5. **Template System** (Şablon Sistemi)

---

## 🎨 1. MEDIA MANAGER

### Özellikler:
```
✅ Görsel yükleme (drag & drop)
✅ Klasör/kategori organizasyonu
✅ Görsel düzenleme (crop, resize, filter)
✅ Toplu işlemler (upload, delete, move)
✅ Arama ve filtreleme
✅ Alt text & SEO metadata
✅ CDN entegrasyonu
✅ Otomatik optimizasyon
```

### Admin Panel Sayfaları:

#### `/admin/media/library`
- Tüm görsellerin grid/list görünümü
- Klasör yapısı (categories, products, pages, blog, etc.)
- Drag-drop upload
- Bulk operations

#### `/admin/media/upload`
- Multi-file upload
- URL'den görsel çekme
- Clipboard'dan yapıştırma
- Otomatik resize/optimize

#### `/admin/media/folders`
- Klasör oluşturma/düzenleme
- Hiyerarşik yapı
- İzinler ve erişim kontrolü

---

## 🏗️ 2. PAGE BUILDER

### Özellikler:
```
✅ Drag & drop interface
✅ Pre-built components (hero, features, testimonials, etc.)
✅ Responsive preview (mobile, tablet, desktop)
✅ Live editing
✅ Version control (taslak, yayında, geçmiş)
✅ Template library
✅ Custom CSS/JS injection
✅ SEO settings per page
```

### Componentler:

#### Layout Components:
- Container
- Grid (2, 3, 4 columns)
- Flex layout
- Section divider

#### Content Components:
- Text block (rich editor)
- Image
- Image gallery
- Video embed
- Button/CTA
- Icon

#### Advanced Components:
- Hero section
- Features grid
- Testimonials
- Pricing table
- FAQ accordion
- Contact form
- Product showcase
- Blog post grid

#### E-commerce Components:
- Product card
- Category showcase
- Product slider
- Reviews section
- Brand logos
- Countdown timer

### Admin Panel Sayfaları:

#### `/admin/pages/builder`
- Visual editor (canvas)
- Component sidebar
- Settings panel
- Preview modes

#### `/admin/pages/list`
- Tüm sayfalar listesi
- Durum (draft, published, scheduled)
- Hızlı düzenleme

#### `/admin/pages/templates`
- Hazır şablonlar
- Kendi şablonlarınızı kaydetme
- Import/export

---

## 📄 3. CATEGORY PAGE MANAGER

### Özellikler:
```
✅ Her kategori için özel landing page
✅ Dinamik içerik blokları
✅ Hero banner düzenleme
✅ Promosyon alanları
✅ Ürün grid özelleştirme
✅ SEO settings
✅ A/B testing
```

### Düzenlenebilir Bölümler:

#### Hero Section:
- Background image/video
- Başlık ve açıklama
- CTA buttons
- Overlay effects

#### Promo Banners:
- Sliding banners
- Static banners
- Countdown timers

#### Product Grid:
- Sıralama (featured, newest, bestseller)
- Grid layout (2, 3, 4, 5 columns)
- Filtreleme seçenekleri

#### Content Blocks:
- Text blocks
- Image galleries
- Video embeds
- Custom HTML

### Admin Panel Sayfaları:

#### `/admin/categories/[id]/page-editor`
- Kategori landing page builder
- Preview mode
- Mobile optimization

#### `/admin/categories/bulk-edit`
- Toplu kategori düzenleme
- Template uygulama

---

## 📝 4. CONTENT MANAGER

### Özellikler:
```
✅ Hakkımızda sayfası düzenleme
✅ İletişim sayfası özelleştirme
✅ Blog yazıları yönetimi
✅ SSS düzenleme
✅ Yasal sayfalar (gizlilik, kullanım şartları)
✅ Footer/Header içeriği
```

### Düzenlenebilir Sayfalar:

#### Hakkımızda (`/about`):
- Şirket hikayesi
- Ekip üyeleri
- Değerlerimiz
- Milestones/Timeline
- Galeri

#### İletişim (`/contact`):
- İletişim formu özelleştirme
- Harita konumu
- İletişim bilgileri
- Çalışma saatleri
- Sosyal medya linkleri

#### Blog:
- Yazı oluşturma/düzenleme
- Kategori yönetimi
- Etiket yönetimi
- Featured images
- SEO metadata

### Admin Panel Sayfaları:

#### `/admin/content/pages`
- Tüm içerik sayfaları listesi
- Hızlı düzenleme

#### `/admin/content/blog`
- Blog yazıları
- Rich text editor
- Featured image seçimi
- Yayınlama planlaması

#### `/admin/content/footer`
- Footer kolonları
- Link grupları
- Sosyal medya
- Newsletter form

---

## 🎨 5. TEMPLATE SYSTEM

### Özellikler:
```
✅ Hazır şablonlar
✅ Özel şablon oluşturma
✅ Şablon kategorileri
✅ Import/Export
✅ Preview before apply
```

### Şablon Tipleri:

#### Landing Pages:
- Product launch
- Category showcase
- Sale/Promo page
- Coming soon

#### Content Pages:
- About us variations
- Contact page layouts
- Blog post layouts
- Help center

#### E-commerce:
- Product detail templates
- Collection pages
- Cart page variations
- Checkout layouts

---

## 🛠️ Teknik Altyapı

### Database Schema:

```prisma
model Page {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  type        PageType
  content     Json     // Page builder content
  status      PageStatus
  seoTitle    String?
  seoDesc     String?
  ogImage     String?
  template    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  publishedAt DateTime?
  createdBy   User     @relation(fields: [createdById], references: [id])
  createdById String
  versions    PageVersion[]
}

enum PageType {
  LANDING
  CATEGORY
  CONTENT
  BLOG
  CUSTOM
}

enum PageStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
  ARCHIVED
}

model PageVersion {
  id        String   @id @default(cuid())
  pageId    String
  page      Page     @relation(fields: [pageId], references: [id])
  content   Json
  version   Int
  createdAt DateTime @default(now())
  createdBy User     @relation(fields: [createdById], references: [id])
  createdById String
}

model Media {
  id          String   @id @default(cuid())
  filename    String
  originalName String
  path        String
  url         String
  mimeType    String
  size        Int
  width       Int?
  height      Int?
  alt         String?
  title       String?
  description String?
  folderId    String?
  folder      MediaFolder? @relation(fields: [folderId], references: [id])
  tags        String[]
  createdAt   DateTime @default(now())
  uploadedBy  User     @relation(fields: [uploadedById], references: [id])
  uploadedById String
}

model MediaFolder {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  parentId  String?
  parent    MediaFolder? @relation("FolderHierarchy", fields: [parentId], references: [id])
  children  MediaFolder[] @relation("FolderHierarchy")
  media     Media[]
  createdAt DateTime @default(now())
}

model Template {
  id          String   @id @default(cuid())
  name        String
  description String?
  category    String
  preview     String?
  content     Json
  isPublic    Boolean  @default(false)
  createdAt   DateTime @default(now())
  createdBy   User     @relation(fields: [createdById], references: [id])
  createdById String
}
```

### Tech Stack:

#### Frontend (Admin):
- **React** + **TypeScript**
- **TailwindCSS** için styling
- **Framer Motion** animasyonlar
- **React DnD** drag & drop
- **TipTap** rich text editing
- **Uppy** file uploads
- **React Query** data fetching

#### Backend:
- **Next.js API Routes**
- **Prisma ORM**
- **PostgreSQL** database
- **Cloudinary/AWS S3** media storage
- **Sharp** image processing

#### Page Builder:
- **GrapesJS** veya **Craft.js** (React-based)
- Custom component library
- JSON-based content storage

---

## 🎯 Admin Panel Sayfaları (Tam Liste)

### Media Management:
```
/admin/media
├── /library          → Tüm görseller
├── /upload           → Yükleme
├── /folders          → Klasör yönetimi
└── /settings         → CDN, optimization settings
```

### Page Builder:
```
/admin/pages
├── /list             → Tüm sayfalar
├── /create           → Yeni sayfa
├── /[id]/edit        → Sayfa düzenle
├── /templates        → Şablonlar
└── /settings         → Global settings
```

### Category Pages:
```
/admin/categories
├── /list             → Tüm kategoriler
├── /[id]/page        → Kategori sayfası düzenle
├── /bulk-edit        → Toplu düzenleme
└── /templates        → Kategori şablonları
```

### Content Management:
```
/admin/content
├── /pages            → İçerik sayfaları
│   ├── /about        → Hakkımızda
│   ├── /contact      → İletişim
│   └── /legal        → Yasal sayfalar
├── /blog             → Blog yönetimi
├── /footer           → Footer düzenleme
└── /header           → Header düzenleme
```

### Templates:
```
/admin/templates
├── /library          → Tüm şablonlar
├── /create           → Yeni şablon
├── /import           → Şablon import
└── /export           → Şablon export
```

---

## 🚀 Özellik Öncelikleri

### Faz 1 (Temel) - 1 Hafta:
- ✅ Media Manager (upload, list, delete)
- ✅ Basit Page Editor (text, image, button)
- ✅ Hakkımızda/İletişim düzenleme

### Faz 2 (Orta) - 2 Hafta:
- ✅ Advanced Page Builder (drag & drop)
- ✅ Category Page Manager
- ✅ Template System
- ✅ Blog Management

### Faz 3 (İleri) - 2 Hafta:
- ✅ Version control
- ✅ A/B testing
- ✅ Advanced SEO tools
- ✅ Analytics integration
- ✅ Multi-language support

---

## 💡 Kullanım Senaryoları

### Senaryo 1: Yeni Kategori Landing Page
```
1. Admin → Categories → "Figür & Koleksiyon"
2. "Edit Landing Page" tıkla
3. Drag & drop ile:
   - Hero banner ekle (görsel + text)
   - Promo banners (3 adet)
   - Featured products grid
   - Testimonials section
4. Preview → Publish
```

### Senaryo 2: Hakkımızda Sayfası Güncelleme
```
1. Admin → Content → About Page
2. Page Builder açılır
3. Sections düzenle:
   - Company story (text block)
   - Team members (grid + images)
   - Values (icon grid)
   - Timeline (custom component)
4. SEO metadata güncelle
5. Save & Publish
```

### Senaryo 3: Blog Yazısı
```
1. Admin → Content → Blog → New Post
2. Rich text editor ile yaz
3. Featured image upload
4. Categories & tags seç
5. SEO optimize et
6. Schedule veya instant publish
```

### Senaryo 4: Görsel Ekleme
```
1. Admin → Media → Upload
2. Drag & drop multiple files
3. Alt text & tags ekle
4. Klasöre organize et
5. Sayfalarda kullan (URL kopyala)
```

---

## 🎨 UI/UX Özellikleri

### Media Library:
- Grid/List view toggle
- Search & filter
- Bulk select & actions
- Folder tree navigation
- Quick preview
- Right-click context menu

### Page Builder:
- Left sidebar: Components
- Center: Canvas (WYSIWYG)
- Right sidebar: Settings
- Top bar: Actions (save, preview, publish)
- Device preview (mobile/tablet/desktop)
- Undo/Redo
- Keyboard shortcuts

### Content Editor:
- Rich text toolbar
- Image insertion
- Link management
- Code view
- Markdown support
- Auto-save

---

## 📊 Dashboard Widgets

### Admin Dashboard'a Eklenecek:
```
✅ Recent pages edited
✅ Media storage usage
✅ Page performance metrics
✅ Popular pages
✅ Pending publications
✅ Quick actions (New page, Upload media)
```

---

## 🔒 Güvenlik & İzinler

### Role-based Access:
```typescript
enum Permission {
  MEDIA_VIEW
  MEDIA_UPLOAD
  MEDIA_DELETE
  PAGE_VIEW
  PAGE_CREATE
  PAGE_EDIT
  PAGE_PUBLISH
  PAGE_DELETE
  TEMPLATE_MANAGE
  CONTENT_MANAGE
}

// Admin roles
SUPER_ADMIN: All permissions
CONTENT_MANAGER: Page & content edit/publish
MEDIA_MANAGER: Media upload/organize
EDITOR: Content edit only (no publish)
```

---

## ✅ Başlangıç Checklist

Şimdi oluşturulacaklar:

- [ ] Database schema (Prisma)
- [ ] API routes (upload, CRUD)
- [ ] Media Manager UI
- [ ] Basic Page Builder
- [ ] Category Page Manager
- [ ] Content Editor
- [ ] Template System

**Hepsini oluşturayım mı?** 🚀


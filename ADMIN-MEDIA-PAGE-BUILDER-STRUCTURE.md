# 🏗️ Admin Media & Page Builder - Dosya Yapısı

## 📁 Klasör Yapısı

```
app/
└── (admin)/
    └── admin/
        ├── media/
        │   ├── page.tsx                    → Media library main
        │   ├── upload/
        │   │   └── page.tsx                → Upload interface
        │   ├── folders/
        │   │   └── page.tsx                → Folder management
        │   └── [id]/
        │       └── page.tsx                → Single media edit
        │
        ├── pages/
        │   ├── page.tsx                    → All pages list
        │   ├── create/
        │   │   └── page.tsx                → Create new page
        │   ├── [id]/
        │   │   ├── edit/
        │   │   │   └── page.tsx            → Page builder
        │   │   └── versions/
        │   │       └── page.tsx            → Version history
        │   └── templates/
        │       ├── page.tsx                → Template library
        │       └── create/
        │           └── page.tsx            → Create template
        │
        ├── categories/
        │   ├── page.tsx                    → Category list
        │   ├── [id]/
        │   │   └── landing/
        │   │       └── page.tsx            → Category landing editor
        │   └── bulk-edit/
        │       └── page.tsx                → Bulk category edit
        │
        └── content/
            ├── about/
            │   └── page.tsx                → About page editor
            ├── contact/
            │   └── page.tsx                → Contact page editor
            ├── blog/
            │   ├── page.tsx                → Blog posts list
            │   ├── create/
            │   │   └── page.tsx            → New post
            │   └── [id]/
            │       └── edit/
            │           └── page.tsx        → Edit post
            ├── footer/
            │   └── page.tsx                → Footer editor
            └── header/
                └── page.tsx                → Header editor

components/
└── admin/
    ├── media/
    │   ├── MediaLibrary.tsx               → Main media grid
    │   ├── MediaUploader.tsx              → Upload component
    │   ├── MediaGrid.tsx                  → Grid view
    │   ├── MediaList.tsx                  → List view
    │   ├── MediaFolderTree.tsx            → Folder navigation
    │   ├── MediaPreview.tsx               → Preview modal
    │   ├── MediaEditor.tsx                → Image editor
    │   └── BulkActions.tsx                → Bulk operations
    │
    ├── page-builder/
    │   ├── PageBuilder.tsx                → Main builder
    │   ├── Canvas.tsx                     → Editable canvas
    │   ├── ComponentSidebar.tsx           → Components list
    │   ├── SettingsSidebar.tsx            → Settings panel
    │   ├── Toolbar.tsx                    → Top toolbar
    │   ├── DevicePreview.tsx              → Responsive preview
    │   ├── VersionControl.tsx             → Version history
    │   │
    │   └── components/
    │       ├── layout/
    │       │   ├── Container.tsx
    │       │   ├── Grid.tsx
    │       │   ├── Flex.tsx
    │       │   └── Section.tsx
    │       │
    │       ├── content/
    │       │   ├── TextBlock.tsx
    │       │   ├── Image.tsx
    │       │   ├── ImageGallery.tsx
    │       │   ├── Video.tsx
    │       │   ├── Button.tsx
    │       │   └── Icon.tsx
    │       │
    │       ├── advanced/
    │       │   ├── Hero.tsx
    │       │   ├── Features.tsx
    │       │   ├── Testimonials.tsx
    │       │   ├── Pricing.tsx
    │       │   ├── FAQ.tsx
    │       │   └── ContactForm.tsx
    │       │
    │       └── ecommerce/
    │           ├── ProductCard.tsx
    │           ├── ProductSlider.tsx
    │           ├── CategoryShowcase.tsx
    │           └── Reviews.tsx
    │
    ├── content-editor/
    │   ├── RichTextEditor.tsx             → TipTap editor
    │   ├── BlogEditor.tsx                 → Blog post editor
    │   ├── SEOEditor.tsx                  → SEO metadata
    │   └── SchedulePublish.tsx            → Publishing scheduler
    │
    ├── category-editor/
    │   ├── CategoryPageBuilder.tsx        → Category page editor
    │   ├── HeroEditor.tsx                 → Hero section edit
    │   ├── PromoBanners.tsx               → Promo banners
    │   └── ProductGridSettings.tsx        → Grid settings
    │
    └── templates/
        ├── TemplateLibrary.tsx            → Template browser
        ├── TemplateCard.tsx               → Template preview
        ├── TemplateImport.tsx             → Import UI
        └── TemplateExport.tsx             → Export UI

lib/
├── media/
│   ├── upload.ts                          → Upload handlers
│   ├── storage.ts                         → S3/Cloudinary
│   ├── image-processing.ts                → Sharp utilities
│   └── cdn.ts                             → CDN integration
│
├── page-builder/
│   ├── renderer.ts                        → Render JSON to HTML
│   ├── serializer.ts                      → Convert HTML to JSON
│   ├── components-registry.ts             → Component definitions
│   └── validation.ts                      → Content validation
│
└── content/
    ├── markdown.ts                        → Markdown processing
    ├── seo.ts                             → SEO utilities
    └── versioning.ts                      → Version control

prisma/
└── schema.prisma                          → Database models

api/
└── admin/
    ├── media/
    │   ├── upload/
    │   │   └── route.ts                   → POST /api/admin/media/upload
    │   ├── [id]/
    │   │   └── route.ts                   → GET, PUT, DELETE
    │   ├── folders/
    │   │   └── route.ts                   → Folder CRUD
    │   └── bulk/
    │       └── route.ts                   → Bulk operations
    │
    ├── pages/
    │   ├── route.ts                       → GET (list), POST (create)
    │   ├── [id]/
    │   │   ├── route.ts                   → GET, PUT, DELETE
    │   │   └── publish/
    │   │       └── route.ts               → POST publish
    │   └── versions/
    │       └── route.ts                   → Version management
    │
    ├── templates/
    │   ├── route.ts                       → Template CRUD
    │   └── apply/
    │       └── route.ts                   → Apply template to page
    │
    └── content/
        ├── blog/
        │   └── route.ts                   → Blog CRUD
        └── settings/
            └── route.ts                   → Footer/Header settings
```

---

## 🎨 Component Hierarchy

### Media Library:
```
MediaLibrary
├── MediaUploader
├── MediaFolderTree
├── SearchBar
└── MediaGrid / MediaList
    └── MediaCard
        ├── MediaPreview
        └── MediaActions
```

### Page Builder:
```
PageBuilder
├── Toolbar
│   ├── SaveButton
│   ├── PublishButton
│   ├── PreviewButton
│   └── VersionHistory
│
├── ComponentSidebar
│   ├── LayoutComponents
│   ├── ContentComponents
│   ├── AdvancedComponents
│   └── EcommerceComponents
│
├── Canvas
│   └── [Dynamic Components]
│       └── ComponentWrapper
│           ├── DragHandle
│           ├── EditButton
│           └── DeleteButton
│
└── SettingsSidebar
    ├── ComponentSettings
    ├── StyleSettings
    ├── ResponsiveSettings
    └── SEOSettings
```

---

## 🗄️ Database Models

```prisma
// Page Management
model Page {
  id            String        @id @default(cuid())
  slug          String        @unique
  title         String
  type          PageType
  content       Json          // Builder content
  status        PageStatus
  template      String?
  seoTitle      String?
  seoDescription String?
  seoKeywords   String[]
  ogImage       String?
  publishedAt   DateTime?
  scheduledAt   DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  createdBy     User          @relation("PageCreator", fields: [createdById], references: [id])
  createdById   String
  versions      PageVersion[]
  
  @@index([slug])
  @@index([status])
  @@index([type])
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

// Version Control
model PageVersion {
  id          String   @id @default(cuid())
  pageId      String
  page        Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)
  version     Int
  content     Json
  comment     String?
  createdAt   DateTime @default(now())
  createdBy   User     @relation(fields: [createdById], references: [id])
  createdById String
  
  @@unique([pageId, version])
}

// Media Management
model Media {
  id           String       @id @default(cuid())
  filename     String
  originalName String
  path         String
  url          String
  cdnUrl       String?
  mimeType     String
  size         Int
  width        Int?
  height       Int?
  alt          String?
  title        String?
  description  String?
  folderId     String?
  folder       MediaFolder? @relation(fields: [folderId], references: [id])
  tags         String[]
  metadata     Json?
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  uploadedBy   User         @relation(fields: [uploadedById], references: [id])
  uploadedById String
  
  @@index([folderId])
  @@index([uploadedById])
}

// Folder Organization
model MediaFolder {
  id          String         @id @default(cuid())
  name        String
  slug        String         @unique
  parentId    String?
  parent      MediaFolder?   @relation("FolderHierarchy", fields: [parentId], references: [id])
  children    MediaFolder[]  @relation("FolderHierarchy")
  media       Media[]
  permissions Json?
  createdAt   DateTime       @default(now())
  createdBy   User           @relation(fields: [createdById], references: [id])
  createdById String
  
  @@index([slug])
  @@index([parentId])
}

// Templates
model Template {
  id          String   @id @default(cuid())
  name        String
  description String?
  category    String
  preview     String?
  thumbnail   String?
  content     Json
  isPublic    Boolean  @default(false)
  isSystem    Boolean  @default(false)
  usageCount  Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   User     @relation(fields: [createdById], references: [id])
  createdById String
  
  @@index([category])
  @@index([isPublic])
}

// Blog Posts
model BlogPost {
  id          String     @id @default(cuid())
  title       String
  slug        String     @unique
  excerpt     String?
  content     Json
  coverImage  String?
  status      PageStatus
  publishedAt DateTime?
  author      User       @relation(fields: [authorId], references: [id])
  authorId    String
  categories  BlogCategory[]
  tags        BlogTag[]
  views       Int        @default(0)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  @@index([slug])
  @@index([status])
}

model BlogCategory {
  id    String     @id @default(cuid())
  name  String
  slug  String     @unique
  posts BlogPost[]
}

model BlogTag {
  id    String     @id @default(cuid())
  name  String
  slug  String     @unique
  posts BlogPost[]
}

// Content Settings
model ContentSettings {
  id          String   @id @default(cuid())
  key         String   @unique
  value       Json
  description String?
  updatedAt   DateTime @updatedAt
  updatedBy   User     @relation(fields: [updatedById], references: [id])
  updatedById String
}
```

---

## 🚀 İlk Adımlar

Bu sistemi oluşturmak için:

1. **Database schema** oluştur
2. **API routes** hazırla
3. **Media Manager** UI
4. **Page Builder** components
5. **Admin pages** oluştur

Hepsini şimdi oluşturalım mı? 🎨


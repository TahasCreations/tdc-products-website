# 🏗️ TDC Market - Modern Architecture

## Genel Bakış

Bu proje Supabase'den modern bir stack'e geçiş yaparak oluşturulmuştur:

- **Authentication**: NextAuth.js (Google OAuth + Credentials)
- **Database**: Prisma + PostgreSQL (Neon)
- **Storage**: Opsiyonel (Vercel Blob/R2 hazır arayüz)
- **Deployment**: Vercel (Hobby plan uyumlu)

## Mimari Diyagramı

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │    │   (API Routes)  │    │   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ • Admin Panel   │◄──►│ • Server Actions│◄──►│ • Users         │
│ • Auth Pages    │    │ • API Routes    │    │ • Categories    │
│ • Public Pages  │    │ • Middleware    │    │ • Products      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Authentication│    │   Storage       │    │   External      │
│   (NextAuth.js) │    │   (Optional)    │    │   Services      │
│                 │    │                 │    │                 │
│ • Google OAuth  │    │ • Vercel Blob   │    │ • Google OAuth  │
│ • Credentials   │    │ • Cloudflare R2 │    │ • Neon DB       │
│ • JWT Sessions  │    │ • Mock (Dev)    │    │ • Vercel        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Authentication Akışı

### 1. Google OAuth Akışı
```
User → Login Page → Google OAuth → Callback → Session → Admin Panel
```

### 2. Credentials Akışı
```
User → Login Page → Email/Password → bcrypt Verify → Session → Admin Panel
```

### 3. Middleware Koruması
```typescript
// /admin ve /api/admin rotaları korunur
if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
  if (!isLoggedIn) redirect('/login')
  if (role !== 'ADMIN') redirect('/login')
}
```

## Database Schema

### Users Tablosu
```sql
CREATE TABLE users (
  id        TEXT PRIMARY KEY,
  email     TEXT UNIQUE,
  password  TEXT,           -- Sadece credentials için
  role      Role DEFAULT 'USER',
  name      TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Categories Tablosu
```sql
CREATE TABLE categories (
  id        TEXT PRIMARY KEY,
  name      TEXT NOT NULL,
  slug      TEXT UNIQUE NOT NULL,
  enabled   BOOLEAN DEFAULT TRUE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## Category CRUD İşlemleri

### 1. Create Category
```typescript
// Server Action
export async function createCategory(formData: FormData) {
  // 1. Auth kontrolü
  const session = await auth()
  if (session.user.role !== 'ADMIN') throw new Error('Unauthorized')
  
  // 2. Validation
  const { name } = createCategorySchema.parse(formData)
  
  // 3. Unique slug oluştur
  let slug = slugify(name)
  let counter = 1
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${originalSlug}-${counter++}`
  }
  
  // 4. Database'e kaydet
  await prisma.category.create({ data: { name, slug } })
  
  // 5. Cache'i yenile
  revalidatePath('/admin/categories')
}
```

### 2. List Categories
```typescript
// Server Component
export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' }
  })
  
  return <CategoryList categories={categories} />
}
```

## Storage Service

### Interface
```typescript
interface StorageService {
  put(key: string, file: File | Buffer): Promise<string>
  get(key: string): Promise<Buffer | null>
  delete(key: string): Promise<void>
  signUrl(key: string, expiresIn?: number): Promise<string>
}
```

### Implementasyonlar
- **MockStorageService**: Development için
- **VercelBlobStorageService**: Production için
- **R2StorageService**: Cloudflare R2 için

## Deployment

### Vercel Hobby Plan
- **Build Command**: `npm run build`
- **Install Command**: `npm ci`
- **Output Directory**: `.next`

### Environment Variables
```bash
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=secure-password
```

### Database Migration
```bash
npm run prisma:generate
npm run prisma:deploy
npm run db:seed
```

## Güvenlik

### 1. Authentication
- JWT tokens with secure secret
- bcrypt password hashing
- Google OAuth 2.0

### 2. Authorization
- Role-based access control (RBAC)
- Middleware protection
- Server-side validation

### 3. Data Validation
- Zod schemas
- Server-side validation
- SQL injection protection (Prisma)

## Performance

### 1. Caching
- Next.js ISR (Incremental Static Regeneration)
- Server-side caching
- Static generation where possible

### 2. Database
- Connection pooling (Prisma)
- Indexed queries
- Efficient pagination

### 3. Bundle Optimization
- Tree shaking
- Code splitting
- Image optimization

## Monitoring

### 1. Logging
- Structured logging
- Error tracking
- Performance monitoring

### 2. Analytics
- User behavior tracking
- Performance metrics
- Error rates

## Geliştirme

### 1. Local Development
```bash
npm install
npm run prisma:migrate
npm run db:seed
npm run dev
```

### 2. Testing
```bash
npm run test          # Unit tests
npm run test:coverage # Coverage report
npm run test:watch    # Watch mode
```

### 3. Code Quality
```bash
npm run lint          # ESLint
npm run type-check    # TypeScript
npm run build         # Build check
```

## Migration Notes

### Supabase'den Gelen Değişiklikler
1. **Database**: Supabase → Prisma + PostgreSQL
2. **Auth**: Supabase Auth → NextAuth.js
3. **Storage**: Supabase Storage → Vercel Blob/R2
4. **API**: Supabase Client → Server Actions + API Routes

### Breaking Changes
- Tüm Supabase client kodları kaldırıldı
- Auth flow tamamen değişti
- Database queries Prisma'ya geçti
- Storage API'si yeniden tasarlandı

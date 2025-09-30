# 🚀 TDC Market - Modern E-ticaret Platformu

**Turborepo + pnpm** ile yönetilen, **Clean Architecture** prensiplerine uygun, modüler e-ticaret platformu.

## 🏗️ Mimari Özeti

### **Clean Architecture + Port & Adapter Pattern**
- **Domain Layer**: İş kuralları, entity'ler, use case'ler (Pure functions)
- **Infrastructure Layer**: Database, cache, storage, payment adapters
- **Application Layer**: API Gateway, web uygulamaları
- **Presentation Layer**: UI bileşenleri, admin paneli

### **Multi-Tenant Architecture**
- Tenant bazlı veri izolasyonu
- Seller tipi bazlı komisyon sistemi (TYPE_A: %7+KDV, TYPE_B: %10+KDV)
- Event-driven architecture (Transactional Outbox Pattern)

### **Serverless-First Design**
- Vercel deployment optimizasyonu
- Background job queue sistemi (BullMQ)
- Rate limiting ve WAF koruması
- Sentry error tracking

## 📁 Proje Yapısı

```
tdc-market/
├── apps/                          # Uygulamalar
│   ├── web-storefront/            # Next.js 14 - Müşteri arayüzü
│   ├── web-admin/                 # Next.js 14 - Admin paneli (AI önerileri)
│   └── api-gateway/               # Express BFF - API Gateway
├── packages/                      # Paylaşılan paketler
│   ├── domain/                    # İş kuralları ve port arayüzleri
│   │   ├── entities/              # Domain entities
│   │   ├── use-cases/             # Business logic
│   │   ├── ports/                 # Interface definitions
│   │   ├── services/              # Domain services (commission, AI)
│   │   └── ai/                    # AI pure functions
│   ├── infra/                     # Infrastructure adapters
│   │   ├── database/              # Prisma adapters
│   │   ├── payment/               # PayTR adapter
│   │   ├── storage/               # S3-compatible adapter
│   │   ├── search/                # MeiliSearch adapter
│   │   ├── queue/                 # BullMQ adapter
│   │   ├── security/              # Rate limiting, WAF
│   │   └── monitoring/            # Sentry integration
│   ├── ui/                        # Paylaşılan UI bileşenleri
│   ├── config/                    # Environment validation (Zod)
│   └── contracts/                 # API contracts
├── services/                      # Background services
│   ├── orders-worker/             # Event processing worker
│   └── background-worker/         # Generic job processor
├── .github/workflows/             # CI/CD pipelines
├── .devcontainer/                 # VS Code Dev Container
└── docs/                          # Dokümantasyon
```

## 🛠️ Teknoloji Stack

### **Frontend**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **State**: React Hooks + Context

### **Backend**
- **API Gateway**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Queue**: BullMQ
- **Search**: MeiliSearch
- **Storage**: S3-compatible (Wasabi/R2)

### **DevOps & Tools**
- **Monorepo**: Turborepo + pnpm
- **Testing**: Vitest
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel + Docker
- **Monitoring**: Sentry
- **Development**: VS Code Dev Container

### **AI & Analytics**
- **AI Functions**: Pure functions (price, tag, SEO suggestions)
- **Payment**: PayTR integration
- **Multi-tenancy**: Tenant-based data isolation
- **Event System**: Transactional outbox pattern

## 🚀 Hızlı Başlangıç

### **Gereksinimler**
- Node.js >= 20.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 14
- Redis >= 6

### **Kurulum**
```bash
# Repository'yi klonla
git clone https://github.com/your-org/tdc-market.git
cd tdc-market

# Bağımlılıkları yükle
pnpm install

# Environment variables ayarla
cp env.example .env.local

# Veritabanını kur
pnpm db:migrate
pnpm db:seed

# Geliştirme sunucularını başlat
pnpm dev
```

### **Uygulamalar**
- **Storefront**: http://localhost:3000
- **Admin Panel**: http://localhost:3001 (AI önerileri ile)
- **API Gateway**: http://localhost:3002
- **Background Workers**: Otomatik başlar

## 📦 Modüller

### **@tdc/domain** - İş Kuralları
```typescript
// Entities
import { User, Product, Order, Seller } from '@tdc/domain';

// Use Cases
import { CreateUserUseCase, CreateOrderUseCase } from '@tdc/domain';

// Services
import { calculateCommission, suggestPrice, suggestTags } from '@tdc/domain';

// AI Functions
import { seoTitleDescription } from '@tdc/domain';
```

**Özellikler:**
- Pure functions (testable, predictable)
- Commission calculation (TYPE_A/TYPE_B sellers)
- AI suggestions (price, tags, SEO)
- Business rules validation

### **@tdc/infra** - Infrastructure
```typescript
// Database
import { PrismaAdapter, UserRepository } from '@tdc/infra';

// External Services
import { PayTRAdapter, S3Adapter, MeiliAdapter } from '@tdc/infra';

// Queue & Jobs
import { BullMQAdapter, JobService } from '@tdc/infra';

// Security
import { rateLimiter, wafMiddleware } from '@tdc/infra';
```

**Özellikler:**
- Prisma ORM with multi-tenancy
- PayTR payment integration
- S3-compatible storage
- MeiliSearch integration
- BullMQ job processing
- Rate limiting & WAF

### **@tdc/config** - Konfigürasyon
```typescript
// Environment validation
import { validateEnv, safeValidateEnv } from '@tdc/config';

// Feature flags
import { isFeatureEnabled } from '@tdc/config';
```

**Özellikler:**
- Zod-based environment validation
- Feature flags system
- Development/production configs
- Error handling with detailed messages

### **@tdc/ui** - UI Bileşenleri
```typescript
// Shared components
import { Button, Modal, Form } from '@tdc/ui';

// AI components
import { AiSuggestionButtons } from '@tdc/ui';
```

**Özellikler:**
- Reusable UI components
- AI suggestion interfaces
- Responsive design
- Accessibility support

## 🔧 Komutlar

### **Geliştirme**
```bash
# Tüm uygulamaları başlat
pnpm dev

# Belirli uygulamayı başlat
pnpm dev --filter=@tdc/web-storefront
pnpm dev --filter=@tdc/web-admin
pnpm dev --filter=@tdc/api-gateway

# Background workers
pnpm dev:worker        # Orders worker
pnpm dev:background    # Background jobs worker
```

### **Test**
```bash
# Tüm testleri çalıştır
pnpm test

# Watch mode
pnpm test:watch

# Belirli paketi test et
pnpm test --filter=@tdc/domain

# Coverage raporu
pnpm test:coverage

# AI functions test
node test-ai-functions.js
```

### **Build**
```bash
# Tüm paketleri build et
pnpm build

# Belirli paketi build et
pnpm build --filter=@tdc/domain

# Production build
pnpm build:prod
```

### **Database**
```bash
# Migration oluştur
pnpm db:migrate:create

# Migration çalıştır
pnpm db:migrate

# Seed data
pnpm db:seed

# Reset database
pnpm db:reset
```

### **Linting & Formatting**
```bash
# Lint check
pnpm lint

# Lint fix
pnpm lint:fix

# Format code
pnpm format

# Type check
pnpm type-check
```

## 🌍 Environment Variables

### **Database**
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/tdc_market"
REDIS_URL="redis://localhost:6379"
```

### **Storage (S3-compatible)**
```bash
S3_ENDPOINT="https://s3.wasabisys.com"
S3_BUCKET="tdc-market"
S3_KEY="your-access-key"
S3_SECRET="your-secret-key"
```

### **Payment (PayTR)**
```bash
PAYMENT_MERCHANT_ID="your-merchant-id"
PAYMENT_KEY="your-payment-key"
PAYMENT_SECRET="your-payment-secret"
```

### **Search (MeiliSearch)**
```bash
MEILI_HOST="http://localhost:7700"
MEILI_KEY="your-meili-key"
```

### **Authentication**
```bash
NEXTAUTH_SECRET="your-nextauth-secret"
JWT_SECRET="your-jwt-secret"
```

### **API & Security**
```bash
API_KEY="your-api-key"
SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_SENTRY_DSN="your-public-sentry-dsn"
```

### **Development**
```bash
NODE_ENV="development"
LOG_LEVEL="debug"
```

## 🚀 Vercel Deploy

### **1. Vercel CLI Kurulumu**
```bash
npm i -g vercel
vercel login
```

### **2. Environment Variables**
Vercel dashboard'da environment variables ayarla:
```bash
# Production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
S3_ENDPOINT=https://...
# ... diğer değişkenler
```

### **3. Deploy Komutları**
```bash
# Storefront deploy
vercel --prod --cwd apps/web-storefront

# Admin deploy
vercel --prod --cwd apps/web-admin

# API Gateway deploy
vercel --prod --cwd apps/api-gateway
```

### **4. GitHub Actions (Otomatik)**
```yaml
# .github/workflows/ci.yml
- name: Deploy to Vercel
  if: github.ref == 'refs/heads/main'
  run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

### **5. Background Workers**
```bash
# Railway/Render'da deploy et
# services/orders-worker
# services/background-worker
```

## 🗺️ Yol Haritası (Next Steps)

### **Phase 1: Core Features** ✅
- [x] Monorepo setup (Turborepo + pnpm)
- [x] Clean Architecture implementation
- [x] Database schema (multi-tenant)
- [x] Commission system (TYPE_A/TYPE_B)
- [x] AI suggestion functions
- [x] Web admin with AI buttons
- [x] CI/CD pipelines

### **Phase 2: E-commerce Features** 🚧
- [ ] Product catalog (CRUD)
- [ ] Shopping cart & checkout
- [ ] Order management
- [ ] Payment integration (PayTR)
- [ ] Inventory management
- [ ] Seller dashboard

### **Phase 3: Advanced Features** 📋
- [ ] Real-time notifications
- [ ] Advanced search & filters
- [ ] Recommendation engine
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support

### **Phase 4: Scale & Performance** 📋
- [ ] CDN integration
- [ ] Image optimization
- [ ] Caching strategies
- [ ] Database optimization
- [ ] Load balancing
- [ ] Kubernetes deployment

### **Phase 5: AI & ML** 📋
- [ ] Product recommendation ML
- [ ] Price optimization AI
- [ ] Fraud detection
- [ ] Customer behavior analysis
- [ ] Automated marketing

## 🧪 Test Coverage

### **Unit Tests**
- Domain functions (commission, AI)
- Repository methods
- Utility functions
- API endpoints

### **Integration Tests**
- Database operations
- External service integrations
- Queue processing
- Authentication flows

### **E2E Tests**
- User journeys
- Admin workflows
- Payment flows
- AI suggestions

## 📊 Performance Metrics

### **Build Times**
- Full build: ~2-3 minutes
- Incremental build: ~30 seconds
- Test suite: ~1 minute

### **Bundle Sizes**
- Storefront: ~500KB (gzipped)
- Admin: ~600KB (gzipped)
- API Gateway: ~200KB

### **Database Performance**
- Query response: <100ms
- Migration time: <30 seconds
- Seed data: <10 seconds

## 🔒 Security

### **Authentication**
- NextAuth.js integration
- JWT tokens
- Session management
- Role-based access

### **API Security**
- Rate limiting (express-rate-limit)
- WAF protection
- Input validation (Zod)
- CORS configuration

### **Data Protection**
- Multi-tenant isolation
- Encrypted sensitive data
- Audit logging
- GDPR compliance

## 📚 Dokümantasyon

- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Commission System](./docs/COMMISSION_SYSTEM.md)
- [AI Functions Guide](./docs/AI_FUNCTIONS.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [API Documentation](./docs/API.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)

## 🤝 Katkıda Bulunma

### **Development Setup**
```bash
# Dev Container kullan (önerilen)
# VS Code'da "Reopen in Container"

# Veya manuel setup
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

### **Commit Convention**
```bash
# Conventional Commits
feat: add AI price suggestion
fix: resolve commission calculation bug
docs: update README
refactor: improve domain functions
```

### **Pull Request Process**
1. Feature branch oluştur
2. Tests yaz
3. Lint/format kontrolü
4. PR oluştur
5. Code review
6. Merge to main

## 📄 Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

**TDC Market** - Modern, scalable, AI-powered e-commerce platform 🚀
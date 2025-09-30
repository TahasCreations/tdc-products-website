# Veri Katmanı Analizi ve Multi-Tenant Hazırlık

## ❌ Mevcut Sorunlar

### 1. **Multi-Tenant Eksikliği**
```sql
-- ❌ Sorunlu: Tenant bilgisi yok
CREATE TABLE products (
    id UUID PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    -- tenant_id eksik!
);

-- ✅ Çözüm: Tenant-aware schema
CREATE TABLE products (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    title VARCHAR(200) NOT NULL,
    -- RLS policies gerekli
);
```

### 2. **Soft Delete Eksikliği**
```sql
-- ❌ Sorunlu: Hard delete
DELETE FROM products WHERE id = $1;

-- ✅ Çözüm: Soft delete
UPDATE products 
SET deleted_at = NOW(), updated_at = NOW() 
WHERE id = $1;
```

### 3. **Audit Trail Eksikliği**
```sql
-- ❌ Sorunlu: Değişiklik takibi yok
-- ✅ Çözüm: Audit table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    operation VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Refactor Önerileri

### 1. Multi-Tenant Schema
```sql
-- Tenant management
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(255) UNIQUE,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenant-aware products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id UUID REFERENCES categories(id),
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Composite unique constraint
    UNIQUE(tenant_id, slug),
    UNIQUE(tenant_id, title)
);

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view products from their tenant" ON products
    FOR SELECT USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenants 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage products in their tenant" ON products
    FOR ALL USING (
        tenant_id IN (
            SELECT tenant_id FROM user_tenants 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
```

### 2. Event Sourcing Hazırlığı
```sql
-- Event store for event sourcing
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_id UUID NOT NULL,
    aggregate_type VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    version INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(aggregate_id, version)
);

-- Outbox pattern for reliable messaging
CREATE TABLE outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Optimized Prisma Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Tenant {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  domain    String?  @unique
  settings  Json     @default("{}")
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  products     Product[]
  categories   Category[]
  orders       Order[]
  userTenants  UserTenant[]

  @@map("tenants")
}

model User {
  id        String   @id @default(cuid())
  email     String?  @unique
  name      String?
  password  String?
  role      Role     @default(USER)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  accounts     Account[]
  sessions     Session[]
  userTenants  UserTenant[]
  orders       Order[]

  @@map("users")
}

model UserTenant {
  id       String @id @default(cuid())
  userId   String @map("user_id")
  tenantId String @map("tenant_id")
  role     String @default("member")

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([userId, tenantId])
  @@map("user_tenants")
}

model Product {
  id            String    @id @default(cuid())
  tenantId      String    @map("tenant_id")
  title         String
  slug          String
  description   String?
  price         Decimal   @db.Decimal(10, 2)
  categoryId    String?   @map("category_id")
  stockQuantity Int       @default(0) @map("stock_quantity")
  isActive      Boolean   @default(true) @map("is_active")
  deletedAt     DateTime? @map("deleted_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relations
  tenant   Tenant    @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  category Category? @relation(fields: [categoryId], references: [id])

  @@unique([tenantId, slug])
  @@map("products")
}

model Event {
  id            String   @id @default(cuid())
  aggregateId   String   @map("aggregate_id")
  aggregateType String   @map("aggregate_type")
  eventType     String   @map("event_type")
  eventData     Json     @map("event_data")
  version       Int
  createdAt     DateTime @default(now()) @map("created_at")

  @@unique([aggregateId, version])
  @@map("events")
}

model OutboxEvent {
  id          String   @id @default(cuid())
  aggregateId String   @map("aggregate_id")
  eventType   String   @map("event_type")
  eventData   Json     @map("event_data")
  processed   Boolean  @default(false)
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("outbox_events")
}
```

## 🚀 Migration Stratejisi

### 1. Aşamalı Migration
```typescript
// packages/infrastructure/database/migrations/001-add-tenant-support.ts
export class AddTenantSupportMigration {
  async up(prisma: PrismaClient) {
    // 1. Create tenants table
    await prisma.$executeRaw`
      CREATE TABLE tenants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    // 2. Create default tenant
    await prisma.$executeRaw`
      INSERT INTO tenants (id, name, slug) 
      VALUES ('default-tenant', 'Default Tenant', 'default');
    `

    // 3. Add tenant_id to existing tables
    await prisma.$executeRaw`
      ALTER TABLE products ADD COLUMN tenant_id UUID DEFAULT 'default-tenant';
    `

    // 4. Add foreign key constraints
    await prisma.$executeRaw`
      ALTER TABLE products 
      ADD CONSTRAINT fk_products_tenant 
      FOREIGN KEY (tenant_id) REFERENCES tenants(id);
    `
  }
}
```

### 2. Data Seeding
```typescript
// packages/infrastructure/database/seeders/tenant.seeder.ts
export class TenantSeeder {
  async seed(prisma: PrismaClient) {
    const tenants = [
      {
        id: 'default-tenant',
        name: 'TDC Market',
        slug: 'tdc-market',
        domain: 'tdcmarket.com',
        settings: {
          currency: 'TRY',
          timezone: 'Europe/Istanbul',
          features: ['ecommerce', 'analytics', 'crm']
        }
      }
    ]

    for (const tenant of tenants) {
      await prisma.tenant.upsert({
        where: { id: tenant.id },
        update: tenant,
        create: tenant
      })
    }
  }
}
```




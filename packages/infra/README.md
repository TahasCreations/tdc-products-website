# @tdc/infra

Infrastructure layer for TDC Market - Database, Storage, Payment, Search, and Queue adapters.

## Features

- 🗄️ **Prisma ORM** with PostgreSQL
- 🏢 **Multi-tenant** architecture support
- 📦 **Transactional Outbox** pattern for event sourcing
- 💳 **Payment adapters** (PayTR, Stripe)
- 📁 **Storage adapters** (S3-compatible)
- 🔍 **Search adapters** (MeiliSearch)
- 📋 **Queue adapters** (BullMQ)
- 🧪 **Comprehensive testing**

## Database Schema

### Core Models

- **Tenant** - Multi-tenant support
- **User** - User management with roles
- **Seller** - Seller profiles and business info
- **Product** - Product catalog with variants
- **Order** - Order management system
- **Payment** - Payment processing
- **CommissionRule** - Dynamic commission rates
- **EventOutbox** - Transactional outbox pattern

### Key Features

- **Multi-tenancy** - Isolated data per tenant
- **Soft deletes** - Data preservation
- **Audit trails** - Created/updated timestamps
- **Event sourcing** - Outbox pattern for reliability
- **Commission system** - Flexible rate management

## Quick Start

### 1. Environment Setup

```bash
# Copy environment file
cp env.example .env.local

# Set database URL
DATABASE_URL="postgresql://username:password@localhost:5432/tdc_market"
```

### 2. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed with sample data
pnpm db:seed
```

### 3. Development

```bash
# Start Prisma Studio
pnpm db:studio

# Reset database
pnpm db:migrate:reset

# Push schema changes
pnpm db:push
```

## Usage

### Database Access

```typescript
import { prisma } from '@tdc/infra';

// Direct Prisma access
const users = await prisma.user.findMany();

// Using repositories
import { PrismaUserRepository } from '@tdc/infra';
const userRepo = new PrismaUserRepository();
const user = await userRepo.findById('user-id');
```

### Repository Pattern

```typescript
import { 
  PrismaUserRepository,
  PrismaProductRepository,
  PrismaOrderRepository,
  PrismaOutboxRepository 
} from '@tdc/infra';

// User operations
const userRepo = new PrismaUserRepository();
const user = await userRepo.findByEmail('user@example.com');

// Product operations
const productRepo = new PrismaProductRepository();
const products = await productRepo.search('tenant-id', 'naruto');

// Order operations
const orderRepo = new PrismaOrderRepository();
const orders = await orderRepo.findByCustomer('tenant-id', 'user-id');

// Event outbox
const outboxRepo = new PrismaOutboxRepository();
const events = await outboxRepo.findUnprocessed();
```

### Multi-tenant Queries

```typescript
// All queries are tenant-scoped
const products = await productRepo.findByCategory('tenant-id', 'category-id');
const orders = await orderRepo.findBySeller('tenant-id', 'seller-id');
```

### Event Outbox

```typescript
// Create event
await outboxRepo.create({
  aggregateId: 'user-123',
  aggregateType: 'User',
  eventType: 'UserCreated',
  payload: { userId: 'user-123', email: 'user@example.com' },
});

// Process events
const events = await outboxRepo.findUnprocessed();
for (const event of events) {
  // Process event
  await processEvent(event);
  await outboxRepo.markAsProcessed(event.id);
}
```

## Database Schema

### Tenant Model
```prisma
model Tenant {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  domain      String?  @unique
  isActive    Boolean  @default(true)
  settings    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### User Model
```prisma
model User {
  id          String   @id @default(cuid())
  tenantId    String
  email       String
  name        String?
  role        UserRole @default(CUSTOMER)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Product Model
```prisma
model Product {
  id              String        @id @default(cuid())
  tenantId        String
  sellerId        String
  name            String
  slug            String
  description     String?
  price           Float
  isActive        Boolean       @default(true)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

### Order Model
```prisma
model Order {
  id              String        @id @default(cuid())
  tenantId        String
  orderNumber     String        @unique
  customerId      String
  status          OrderStatus   @default(PENDING)
  totalAmount     Float
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

### EventOutbox Model
```prisma
model EventOutbox {
  id            String    @id @default(cuid())
  aggregateId   String
  aggregateType String
  eventType     String
  payload       Json
  processed     Boolean   @default(false)
  createdAt     DateTime  @default(now())
}
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:migrate` | Run migrations (dev) |
| `pnpm db:migrate:deploy` | Deploy migrations (prod) |
| `pnpm db:migrate:reset` | Reset database |
| `pnpm db:seed` | Seed with sample data |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:push` | Push schema changes |

## Testing

```bash
# Run all tests
pnpm test

# Run specific test
pnpm test user.repository.test.ts

# Run with coverage
pnpm test --coverage
```

## Migration Strategy

### Development
```bash
# Make schema changes in schema.prisma
# Generate migration
pnpm db:migrate

# This creates a new migration file
```

### Production
```bash
# Deploy migrations
pnpm db:migrate:deploy

# This applies pending migrations
```

## Multi-tenancy

All data is tenant-scoped:

```typescript
// Always include tenantId in queries
const products = await prisma.product.findMany({
  where: { tenantId: 'tenant-123' }
});

// Use repositories for automatic tenant scoping
const productRepo = new PrismaProductRepository();
const products = await productRepo.findByCategory('tenant-123', 'cat-456');
```

## Event Sourcing

The outbox pattern ensures reliable event processing:

1. **Create Event** - Add to outbox within transaction
2. **Process Event** - Background worker processes events
3. **Mark Processed** - Update outbox after successful processing
4. **Retry Failed** - Retry failed events with exponential backoff

## Commission System

Dynamic commission rates based on business type:

- **Individual**: 7% + 18% KDV
- **Company**: 10% + 18% KDV  
- **Corporate**: 5% + 18% KDV (for orders > 10,000 TL)

## Performance

- **Indexes** - Optimized for common queries
- **Pagination** - Built-in limit/offset support
- **Caching** - Redis integration for frequently accessed data
- **Connection Pooling** - Efficient database connections

## Security

- **Row Level Security** - Tenant data isolation
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Prisma ORM protection
- **Audit Logging** - All changes tracked

## Monitoring

- **Query Logging** - Development mode query logging
- **Performance Metrics** - Query execution times
- **Error Tracking** - Comprehensive error handling
- **Health Checks** - Database connectivity monitoring

## Troubleshooting

### Common Issues

1. **Migration Conflicts**
   ```bash
   # Reset and regenerate
   pnpm db:migrate:reset
   pnpm db:seed
   ```

2. **Connection Issues**
   ```bash
   # Check DATABASE_URL
   echo $DATABASE_URL
   
   # Test connection
   pnpm db:studio
   ```

3. **Schema Sync Issues**
   ```bash
   # Push schema changes
   pnpm db:push
   
   # Or generate migration
   pnpm db:migrate
   ```

### Getting Help

- Check Prisma documentation
- Review migration files
- Use Prisma Studio for data inspection
- Check database logs

## License

MIT License - see LICENSE file for details.


# @tdc/orders-worker

Event processing worker service for TDC Market - processes events from EventOutbox table using BullMQ.

## Features

- 🔄 **EventOutbox Scanner** - Cron-based scanning of unprocessed events
- 📤 **BullMQ Integration** - Reliable event processing with retry logic
- 🎯 **Event Handlers** - Specific handlers for different event types
- 📊 **Monitoring** - Real-time stats and health monitoring
- 🛡️ **Error Handling** - Comprehensive error handling and retry mechanisms
- ⚡ **Concurrent Processing** - Process multiple events simultaneously

## Architecture

```
EventOutbox Table → OutboxScanner → BullMQ Queue → EventProcessor → Event Handlers
```

### Components

1. **OutboxScanner** - Scans EventOutbox table every 5-30 seconds
2. **QueueManager** - Manages BullMQ queues and job processing
3. **EventProcessor** - Routes events to specific handlers
4. **Event Handlers** - Process specific event types (OrderCreated, etc.)

## Quick Start

### 1. Environment Setup

```bash
# Copy environment file
cp ../../env.example .env.local

# Set required environment variables
DATABASE_URL="postgresql://username:password@localhost:5432/tdc_market"
REDIS_URL="redis://localhost:6379"
```

### 2. Installation

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build
```

### 3. Development

```bash
# Start in development mode
pnpm dev

# Or start with turbo
pnpm dev:worker
```

### 4. Production

```bash
# Build and start
pnpm build
pnpm start
```

## Event Types

### OrderCreated
```typescript
{
  orderId: string;
  orderNumber: string;
  tenantId: string;
  customerId: string;
  customerEmail: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  createdAt: Date;
}
```

### OrderCancelled
```typescript
{
  orderId: string;
  reason: string;
  cancelledAt: Date;
}
```

### PaymentProcessed
```typescript
{
  paymentId: string;
  orderId: string;
  amount: number;
  status: string;
  processedAt: Date;
}
```

### UserCreated
```typescript
{
  userId: string;
  email: string;
  role: string;
  createdAt: Date;
}
```

### ProductCreated
```typescript
{
  productId: string;
  name: string;
  sellerId: string;
  categoryId: string;
  price: number;
  createdAt: Date;
}
```

### TenantCreated
```typescript
{
  tenantId: string;
  name: string;
  slug: string;
  createdAt: Date;
}
```

## Event Handlers

### OrderCreated Handler
- Send order confirmation email
- Update inventory levels
- Notify seller
- Create shipping label
- Update analytics
- Send to external systems

### OrderCancelled Handler
- Process refund
- Restore inventory
- Send cancellation email
- Update analytics

### PaymentProcessed Handler
- Update order status
- Send payment confirmation
- Trigger fulfillment
- Update seller earnings

### UserCreated Handler
- Send welcome email
- Create user profile
- Set up preferences
- Add to marketing lists

### ProductCreated Handler
- Index in search engine
- Update category counts
- Send to external marketplaces
- Update analytics

### TenantCreated Handler
- Set up tenant resources
- Configure default settings
- Send onboarding email
- Create initial data

## Configuration

### Cron Patterns
- **Development**: Every 5 seconds (`*/5 * * * * *`)
- **Production**: Every 30 seconds (`*/30 * * * * *`)

### BullMQ Settings
- **Concurrency**: 5 jobs simultaneously
- **Retry Attempts**: 3 with exponential backoff
- **Job Retention**: 100 completed, 50 failed

### Queue Priorities
- **OrderCreated**: 10 (highest)
- **OrderCancelled**: 9
- **PaymentProcessed**: 8
- **UserCreated**: 7
- **ProductCreated**: 6
- **TenantCreated**: 5
- **Generic**: 1 (lowest)

## Monitoring

### Stats Logging
Every 30 seconds, the worker logs:
- Scanner running status
- Cron pattern
- Outbox stats (total, pending, processed, failed)
- Queue stats (waiting, active, completed, failed)

### Health Checks
- Database connectivity
- Redis connectivity
- Queue health
- Event processing status

## Error Handling

### Retry Logic
- **Exponential Backoff**: 2s, 4s, 8s delays
- **Max Retries**: 3 attempts
- **Dead Letter Queue**: Failed jobs after max retries

### Error Types
- **Validation Errors**: Invalid event data
- **Processing Errors**: Handler failures
- **Infrastructure Errors**: Database/Redis issues
- **Timeout Errors**: Long-running operations

### Error Recovery
- **Automatic Retry**: BullMQ handles retries
- **Manual Recovery**: Admin can retry failed jobs
- **Dead Letter Processing**: Manual intervention for failed jobs

## API Integration

### Order Creation Flow
1. **API Gateway** receives order creation request
2. **Order Repository** creates order in database
3. **Outbox Repository** adds OrderCreated event
4. **Worker** scans outbox and processes event
5. **Event Handler** executes order creation logic

### Example API Call
```bash
curl -X POST http://localhost:3002/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "tenant-123",
    "customerId": "customer-456",
    "items": [
      {
        "productId": "product-789",
        "quantity": 2,
        "unitPrice": 100.00
      }
    ],
    "customerEmail": "customer@example.com",
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "address1": "123 Main St",
      "city": "Istanbul",
      "postalCode": "34000",
      "country": "TR"
    }
  }'
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start in development mode |
| `pnpm build` | Build the project |
| `pnpm start` | Start in production mode |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run tests |
| `pnpm clean` | Clean build artifacts |

## Dependencies

### Core Dependencies
- **@tdc/domain** - Domain models and interfaces
- **@tdc/config** - Environment configuration
- **@tdc/infra** - Infrastructure adapters
- **bullmq** - Queue management
- **ioredis** - Redis client
- **cron** - Cron job scheduling

### Development Dependencies
- **typescript** - TypeScript compiler
- **eslint** - Code linting
- **vitest** - Testing framework
- **tsx** - TypeScript execution

## Troubleshooting

### Common Issues

1. **Worker Not Starting**
   ```bash
   # Check environment variables
   echo $DATABASE_URL
   echo $REDIS_URL
   
   # Check logs
   pnpm dev
   ```

2. **Events Not Processing**
   ```bash
   # Check outbox table
   SELECT * FROM event_outbox WHERE processed = false;
   
   # Check Redis connection
   redis-cli ping
   ```

3. **High Memory Usage**
   ```bash
   # Check job retention settings
   # Reduce concurrency if needed
   # Monitor queue sizes
   ```

4. **Database Connection Issues**
   ```bash
   # Check DATABASE_URL
   # Verify database is running
   # Check network connectivity
   ```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* pnpm dev

# Or specific modules
DEBUG=bullmq,outbox-scanner pnpm dev
```

### Performance Tuning

1. **Adjust Concurrency**
   ```typescript
   // In index.ts
   concurrency: 10, // Increase for more parallel processing
   ```

2. **Optimize Cron Frequency**
   ```typescript
   // In outbox-scanner.ts
   const cronPattern = '*/10 * * * * *'; // Every 10 seconds
   ```

3. **Batch Size**
   ```typescript
   // In outbox-scanner.ts
   const events = await this.outboxRepo.findUnprocessed(100); // Larger batches
   ```

## Security

- **Environment Variables** - Sensitive data in env vars
- **Database Access** - Read-only access to outbox table
- **Redis Access** - Queue management only
- **Error Logging** - No sensitive data in logs

## Scaling

### Horizontal Scaling
- Run multiple worker instances
- Use Redis for shared state
- Load balance across instances

### Vertical Scaling
- Increase concurrency
- Optimize batch sizes
- Use faster hardware

### Monitoring
- Queue depth monitoring
- Processing rate metrics
- Error rate tracking
- Resource utilization

## License

MIT License - see LICENSE file for details.


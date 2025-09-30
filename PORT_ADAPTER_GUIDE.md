# 🏗️ Port & Adapter Pattern Implementation

Bu dokümantasyon, TDC Market projesinde Clean Architecture prensiplerine uygun olarak uygulanan Port & Adapter pattern'ini açıklar.

## 📋 İçindekiler

- [Port & Adapter Pattern Nedir?](#port--adapter-pattern-nedir)
- [Domain Ports](#domain-ports)
- [Infrastructure Adapters](#infrastructure-adapters)
- [Dependency Injection](#dependency-injection)
- [API Endpoints](#api-endpoints)
- [Kullanım Örnekleri](#kullanım-örnekleri)
- [Test Stratejisi](#test-stratejisi)

## 🎯 Port & Adapter Pattern Nedir?

Port & Adapter pattern (Hexagonal Architecture), domain katmanını dış dünyadan izole ederek:
- **Test edilebilirlik** artırır
- **Bağımlılıkları tersine çevirir** (Dependency Inversion)
- **Esneklik** sağlar (farklı implementasyonlar kolayca değiştirilebilir)
- **Clean Architecture** prensiplerini uygular

## 🔌 Domain Ports

### PaymentPort
```typescript
interface PaymentPort {
  createCheckoutSession(request: PaymentRequest): Promise<CheckoutSession>;
  capturePayment(transactionId: string): Promise<PaymentResult>;
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
  refundPayment(transactionId: string, amount?: number): Promise<RefundResult>;
  getPaymentStatus(transactionId: string): Promise<PaymentStatus>;
  verifyWebhook(payload: any, signature: string): Promise<boolean>;
}
```

### StoragePort
```typescript
interface StoragePort {
  putObject(buffer: Buffer, options: UploadOptions): Promise<PutObjectResult>;
  getSignedUrl(options: SignedUrlOptions): Promise<GetSignedUrlResult>;
  deleteObject(bucket: string, key: string): Promise<DeleteObjectResult>;
  getObjectMetadata(bucket: string, key: string): Promise<StorageObject | null>;
  listObjects(bucket: string, prefix?: string, maxKeys?: number): Promise<StorageObject[]>;
  copyObject(sourceBucket: string, sourceKey: string, destBucket: string, destKey: string): Promise<PutObjectResult>;
}
```

### SearchPort
```typescript
interface SearchPort {
  indexDocument(document: SearchDocument): Promise<IndexResult>;
  indexDocuments(documents: SearchDocument[]): Promise<IndexResult>;
  search(query: SearchQuery): Promise<SearchResult>;
  deleteDocument(index: string, id: string): Promise<IndexResult>;
  updateDocument(document: SearchDocument): Promise<IndexResult>;
  createIndex(options: IndexOptions): Promise<IndexResult>;
  deleteIndex(index: string): Promise<IndexResult>;
  getIndexStats(index: string): Promise<Record<string, any>>;
  healthCheck(): Promise<boolean>;
}
```

### QueuePort
```typescript
interface QueuePort {
  publish(job: QueueJob): Promise<QueueJobResult>;
  publishBulk(jobs: QueueJob[]): Promise<QueueJobResult[]>;
  consume(queueName: string, processor: (job: QueueJob) => Promise<any>): Promise<void>;
  getJobStatus(jobId: string): Promise<QueueJob | null>;
  retryJob(jobId: string): Promise<QueueJobResult>;
  removeJob(jobId: string): Promise<QueueJobResult>;
  getQueueStats(queueName: string): Promise<QueueStats>;
  pauseQueue(queueName: string): Promise<void>;
  resumeQueue(queueName: string): Promise<void>;
  cleanQueue(queueName: string, grace: number): Promise<void>;
}
```

### DbPort
```typescript
interface DbPort {
  findOne<T extends DbEntity>(table: string, query: DbQuery): Promise<T | null>;
  findMany<T extends DbEntity>(table: string, query: DbQuery): Promise<DbResult<T>>;
  create<T extends DbEntity>(table: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  createMany<T extends DbEntity>(table: string, data: Array<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T[]>;
  update<T extends DbEntity>(table: string, id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<T>;
  updateMany<T extends DbEntity>(table: string, query: DbQuery, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): Promise<number>;
  delete(table: string, id: string): Promise<boolean>;
  deleteMany(table: string, query: DbQuery): Promise<number>;
  count(table: string, query?: DbQuery): Promise<number>;
  transaction<T>(operation: (tx: DbTransaction) => Promise<T>): Promise<T>;
  rawQuery<T>(query: string, params?: any[]): Promise<T[]>;
  healthCheck(): Promise<boolean>;
  close(): Promise<void>;
}
```

## 🔧 Infrastructure Adapters

### PayTRAdapter (Payment)
```typescript
export class PayTRAdapter implements PaymentPort {
  // PayTR API entegrasyonu
  // Environment variables ile konfigürasyon
  // Error handling ve retry logic
}
```

### S3Adapter (Storage)
```typescript
export class S3Adapter implements StoragePort {
  // S3-compatible storage (Wasabi, R2, AWS S3)
  // Signed URL generation
  // Metadata management
}
```

### MeiliAdapter (Search)
```typescript
export class MeiliAdapter implements SearchPort {
  // MeiliSearch entegrasyonu
  // Document indexing
  // Advanced search queries
}
```

### BullMQAdapter (Queue)
```typescript
export class BullMQAdapter implements QueuePort {
  // Redis-based job queue
  // Job scheduling ve retry
  // Queue monitoring
}
```

### PrismaAdapter (Database)
```typescript
export class PrismaAdapter implements DbPort {
  // Prisma ORM entegrasyonu
  // Transaction support
  // Generic CRUD operations
}
```

## 🏗️ Dependency Injection

### DIContainer
```typescript
export class DIContainer {
  private services: Map<string, any> = new Map();

  public getPaymentService(): PaymentPort {
    return this.get<PaymentPort>('payment');
  }

  public getStorageService(): StoragePort {
    return this.get<StoragePort>('storage');
  }

  // ... diğer servisler
}

// Singleton instance
export const container = DIContainer.getInstance();
```

### Kullanım
```typescript
import { container } from '@tdc/infra';

// Service'leri al
const paymentService = container.getPaymentService();
const storageService = container.getStorageService();

// Kullan
const session = await paymentService.createCheckoutSession(request);
const result = await storageService.putObject(buffer, options);
```

## 🌐 API Endpoints

### API Gateway (Express)
- **Port**: 3002
- **Checkout**: `/api/checkout/*`
- **Upload**: `/api/upload/*`
- **Search**: `/api/search/*`

### Web Storefront (Next.js)
- **Port**: 3000
- **Checkout**: `/api/checkout`
- **Upload**: `/api/upload`
- **Search**: `/api/search`

### Örnek Kullanım

#### Checkout Session Oluşturma
```bash
curl -X POST http://localhost:3002/api/checkout/create-session \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.50,
    "currency": "TRY",
    "orderId": "order-123",
    "customerId": "customer-456",
    "paymentMethod": "credit_card",
    "metadata": {
      "email": "test@example.com",
      "userName": "Test User"
    }
  }'
```

#### Dosya Yükleme
```bash
curl -X POST http://localhost:3002/api/upload/file \
  -F "file=@image.jpg" \
  -F "bucket=tdc-market" \
  -F "key=products/image.jpg" \
  -F "acl=public-read"
```

#### Arama Yapma
```bash
curl -X POST http://localhost:3002/api/search/query \
  -H "Content-Type: application/json" \
  -d '{
    "index": "products",
    "query": "3d figür",
    "limit": 20,
    "filters": {
      "category": "anime"
    }
  }'
```

## 🧪 Test Stratejisi

### Unit Tests
```typescript
// Her adapter için ayrı test
describe('PayTRAdapter', () => {
  it('should create checkout session', async () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
// Port & Adapter entegrasyonu
describe('Port & Adapter Integration', () => {
  it('should work with DI container', async () => {
    const paymentService = container.getPaymentService();
    // Test integration
  });
});
```

### Contract Tests
```typescript
// Port interface'lerini test et
describe('PaymentPort Contract', () => {
  it('should implement all required methods', () => {
    // Contract validation
  });
});
```

## 🚀 Geliştirme Workflow

### 1. Yeni Port Ekleme
```typescript
// 1. Domain port'u tanımla
interface NewPort {
  method(): Promise<Result>;
}

// 2. Adapter'ı implement et
export class NewAdapter implements NewPort {
  // Implementation
}

// 3. DI container'a ekle
container.register('new-service', new NewAdapter());
```

### 2. Yeni Adapter Ekleme
```typescript
// 1. Mevcut port'u implement et
export class NewProviderAdapter implements ExistingPort {
  // New provider implementation
}

// 2. Environment'da provider'ı seç
const provider = process.env.PROVIDER_TYPE || 'default';
const adapter = provider === 'new' ? new NewProviderAdapter() : new DefaultAdapter();
```

### 3. Environment Configuration
```bash
# .env.local
PAYTR_MERCHANT_ID="your-merchant-id"
S3_BUCKET="tdc-market"
MEILI_HOST="http://localhost:7700"
REDIS_URL="redis://localhost:6379"
```

## 📊 Monitoring & Logging

### Health Checks
```typescript
// Her servis için health check
const isHealthy = await paymentService.healthCheck();
const isStorageHealthy = await storageService.healthCheck();
```

### Error Handling
```typescript
try {
  const result = await paymentService.createCheckoutSession(request);
} catch (error) {
  logger.error('Payment failed', { error, request });
  // Fallback strategy
}
```

### Metrics
```typescript
// Performance monitoring
const startTime = Date.now();
const result = await service.method();
const duration = Date.now() - startTime;
metrics.record('service.method.duration', duration);
```

## 🔄 Migration Strategy

### Mevcut Koddan Geçiş
1. **Adım 1**: Port interface'lerini tanımla
2. **Adım 2**: Mevcut implementasyonları adapter'a çevir
3. **Adım 3**: DI container'ı kur
4. **Adım 4**: Kademeli olarak yeni yapıya geç
5. **Adım 5**: Eski kodu temizle

### Backward Compatibility
```typescript
// Eski API'yi yeni yapıya yönlendir
export const legacyPaymentAPI = {
  async createPayment(data: any) {
    const paymentService = container.getPaymentService();
    return await paymentService.createCheckoutSession(data);
  }
};
```

## 🎯 Best Practices

### 1. Port Design
- **Single Responsibility**: Her port tek bir sorumluluğa sahip olmalı
- **Interface Segregation**: Küçük, odaklanmış interface'ler
- **Dependency Inversion**: Domain, infrastructure'a bağımlı olmamalı

### 2. Adapter Implementation
- **Error Handling**: Robust error handling ve retry logic
- **Configuration**: Environment variables ile konfigürasyon
- **Logging**: Detaylı logging ve monitoring
- **Testing**: Comprehensive test coverage

### 3. DI Container
- **Singleton Pattern**: Tek instance kullan
- **Lazy Loading**: Servisleri ihtiyaç duyulduğunda yükle
- **Type Safety**: TypeScript ile type safety sağla

### 4. API Design
- **RESTful**: RESTful API design principles
- **Validation**: Request/response validation
- **Documentation**: OpenAPI/Swagger documentation
- **Rate Limiting**: API rate limiting

## 📚 Kaynaklar

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture - Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Port & Adapter Pattern](https://herbertograca.com/2017/09/14/ports-adapters-architecture/)
- [Dependency Injection](https://martinfowler.com/articles/injection.html)

---

Bu implementasyon, Clean Architecture prensiplerine uygun, test edilebilir ve esnek bir yapı sağlar. Port & Adapter pattern sayesinde domain katmanı dış dünyadan izole edilir ve farklı implementasyonlar kolayca değiştirilebilir.


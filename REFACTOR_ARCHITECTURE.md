# TDC Market - Clean Architecture Refactor Plan

## 🏗️ Yeni Paket Yapısı

```
packages/
├── domain/                    # Business logic (entities, use cases)
│   ├── entities/
│   │   ├── user/
│   │   ├── product/
│   │   ├── order/
│   │   └── payment/
│   ├── use-cases/
│   │   ├── user/
│   │   ├── product/
│   │   ├── order/
│   │   └── payment/
│   ├── ports/                 # Interfaces (Ports)
│   │   ├── repositories/
│   │   ├── services/
│   │   └── events/
│   └── value-objects/
├── infrastructure/            # External concerns (Adapters)
│   ├── database/
│   │   ├── prisma/
│   │   └── migrations/
│   ├── cache/
│   │   └── redis/
│   ├── messaging/
│   │   └── pusher/
│   ├── storage/
│   │   └── supabase-storage/
│   └── external-apis/
│       ├── payment/
│       └── shipping/
├── application/               # Application services
│   ├── services/
│   ├── handlers/
│   └── middleware/
├── contracts/                 # API contracts
│   ├── api/
│   ├── events/
│   └── types/
├── ui/                       # Shared UI components
│   ├── components/
│   ├── hooks/
│   └── utils/
└── config/                   # Configuration
    ├── database/
    ├── cache/
    └── environment/

apps/
├── storefront/               # Customer-facing app
├── admin/                    # Admin panel
├── api-gateway/              # API Gateway
└── worker/                   # Background jobs
```

## 🔄 Port & Adapter Örnekleri

### Payment Port & Adapter
```typescript
// packages/domain/ports/payment.port.ts
export interface PaymentPort {
  processPayment(request: PaymentRequest): Promise<PaymentResult>
  refundPayment(paymentId: string): Promise<RefundResult>
  getPaymentStatus(paymentId: string): Promise<PaymentStatus>
}

// packages/infrastructure/external-apis/payment/paytr.adapter.ts
export class PayTRAdapter implements PaymentPort {
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // PayTR specific implementation
  }
}

// packages/infrastructure/external-apis/payment/stripe.adapter.ts
export class StripeAdapter implements PaymentPort {
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Stripe specific implementation
  }
}
```

### Repository Port & Adapter
```typescript
// packages/domain/ports/repositories/product.repository.ts
export interface ProductRepository {
  findById(id: string): Promise<Product | null>
  save(product: Product): Promise<void>
  findByCategory(categoryId: string): Promise<Product[]>
}

// packages/infrastructure/database/prisma/product.repository.ts
export class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: string): Promise<Product | null> {
    // Prisma implementation
  }
}
```




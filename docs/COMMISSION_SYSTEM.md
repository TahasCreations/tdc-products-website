# Commission System Documentation

## Overview

TDC Market uses a two-tier commission system based on seller type:

- **TYPE_A (Company Sellers)**: 7% + 18% KDV = 8.26% total commission
- **TYPE_B (Individual/IG Sellers)**: 10% + 18% KDV = 11.8% total commission

## Seller Types

### TYPE_A - Company Sellers
- **Commission Rate**: 7% + 18% KDV = 8.26% total
- **Invoice Eligibility**: Can issue invoices
- **Invoice Issuer**: Seller
- **Requirements**:
  - Tax number (Vergi numarası)
  - Tax office (Vergi dairesi)
  - Address information
  - Invoice issuing capability

### TYPE_B - Individual/IG Sellers
- **Commission Rate**: 10% + 18% KDV = 11.8% total
- **Invoice Eligibility**: Cannot issue invoices
- **Invoice Issuer**: Platform
- **Requirements**:
  - Instagram handle
  - Bank account/IBAN
  - Identity information
  - Platform handles invoicing

## Database Schema

### Seller Model
```prisma
model Seller {
  id              String        @id @default(cuid())
  tenantId        String
  userId          String        @unique
  businessName    String
  sellerType      SellerType    @default(TYPE_B)
  businessType    BusinessType
  taxNumber       String?       // Required for TYPE_A
  taxOffice       String?       // Required for TYPE_A
  address         String?       // Required for TYPE_A
  phone           String?
  email           String?
  instagramHandle String?       // For TYPE_B
  bankAccount     String?
  iban            String?
  commissionRate  Float         @default(0.0) // Calculated based on type
  isActive        Boolean       @default(true)
  isVerified      Boolean       @default(false)
  isInvoiceEligible Boolean     @default(false) // TYPE_A only
  rating          Float         @default(0.0)
  totalSales      Float         @default(0.0)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
}
```

### SellerType Enum
```prisma
enum SellerType {
  TYPE_A  // Company with tax number - 7% + KDV commission
  TYPE_B  // Individual/IG seller - 10% + KDV commission, invoicing by platform
}
```

## Commission Calculation

### Pure Functions

All commission calculations are implemented as pure functions in `packages/domain/src/services/commission.service.ts`:

```typescript
// Calculate commission for a single order
calculateCommission(input: CommissionCalculationInput): CommissionCalculationResult

// Calculate commission for multiple items
calculateCommissionForItems(items: Array<...>, taxRate?: number): CommissionCalculationResult

// Get base commission rate by seller type
getBaseCommissionRate(sellerType: SellerType): number

// Check invoice eligibility
isInvoiceEligible(sellerType: SellerType): boolean
```

### Calculation Formula

```
Base Amount = Order Amount
Commission Amount = Base Amount × Commission Rate
Tax Amount = Commission Amount × Tax Rate (18%)
Total Commission = Commission Amount + Tax Amount
Seller Amount = Base Amount - Total Commission
Platform Amount = Total Commission
```

### Examples

#### TYPE_A Seller - 1000 TL Order
```
Base Amount: 1000 TL
Commission Rate: 7%
Commission Amount: 70 TL
Tax Rate: 18%
Tax Amount: 12.6 TL
Total Commission: 82.6 TL
Seller Amount: 917.4 TL
Platform Amount: 82.6 TL
```

#### TYPE_B Seller - 1000 TL Order
```
Base Amount: 1000 TL
Commission Rate: 10%
Commission Amount: 100 TL
Tax Rate: 18%
Tax Amount: 18 TL
Total Commission: 118 TL
Seller Amount: 882 TL
Platform Amount: 118 TL
```

## API Endpoints

### 1. Calculate Commission
**POST** `/api/commission/calculate`

```json
{
  "orderAmount": 1000,
  "sellerType": "TYPE_A",
  "customCommissionRate": 0.05, // Optional
  "taxRate": 0.18 // Optional, defaults to 18%
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "baseAmount": 1000,
    "commissionRate": 0.07,
    "commissionAmount": 70,
    "taxRate": 0.18,
    "taxAmount": 12.6,
    "totalCommission": 82.6,
    "sellerAmount": 917.4,
    "platformAmount": 82.6,
    "isInvoiceEligible": true,
    "invoiceIssuer": "SELLER"
  }
}
```

### 2. Calculate Multiple Items
**POST** `/api/commission/calculate-multiple`

```json
{
  "items": [
    { "amount": 500, "sellerType": "TYPE_A" },
    { "amount": 300, "sellerType": "TYPE_B" },
    { "amount": 200, "sellerType": "TYPE_A" }
  ],
  "taxRate": 0.18
}
```

### 3. Calculate Order Commission
**POST** `/api/commission/calculate-order`

```json
{
  "sellerType": "TYPE_A",
  "orderItems": [
    {
      "productId": "prod-1",
      "productName": "Ürün 1",
      "quantity": 2,
      "unitPrice": 250
    },
    {
      "productId": "prod-2",
      "productName": "Ürün 2",
      "quantity": 1,
      "unitPrice": 500
    }
  ]
}
```

### 4. Get Commission Rates
**GET** `/api/commission/rates`

### 5. Get Examples
**GET** `/api/commission/examples`

## Usage in Order Processing

### Order Creation Flow
1. Validate seller type
2. Calculate commission using pure functions
3. Store commission details in order
4. Update seller's total sales
5. Handle invoicing based on seller type

### Example Integration
```typescript
import { calculateCommission, SellerType } from '@tdc/domain';

// In order creation
const commission = calculateCommission({
  orderAmount: order.totalAmount,
  sellerType: seller.sellerType
});

// Store in order
order.commissionAmount = commission.totalCommission;
order.sellerAmount = commission.sellerAmount;
order.platformAmount = commission.platformAmount;
order.invoiceIssuer = commission.invoiceIssuer;
```

## Testing

Run the commission API tests:

```bash
# Start the API Gateway
pnpm dev --filter=@tdc/api-gateway

# In another terminal, run tests
node test-commission-api.js
```

## Migration

To apply the database changes:

```bash
# Navigate to infra package
cd packages/infra

# Create and apply migration
npx prisma migrate dev --name add-seller-type-and-commission-fields

# Generate Prisma client
npx prisma generate
```

## Business Rules

1. **TYPE_A sellers** must have tax number and can issue invoices
2. **TYPE_B sellers** cannot issue invoices - platform handles invoicing
3. Commission rates are fixed per seller type
4. Tax rate is 18% KDV for Turkey
5. All calculations are deterministic and pure functions
6. Commission is calculated on the total order amount
7. Multiple items from different seller types are calculated separately

## Error Handling

- Invalid seller types are rejected
- Negative order amounts are rejected
- Commission rates must be between 0 and 1
- Tax rates must be between 0 and 1
- All errors include detailed messages and timestamps


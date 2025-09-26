# Demo Data Cleanup & Refactor Plan

## 1. Repo Taraması Sonuçları

### Mock Data İçeren Dosyalar:
- **API Routes (131 dosya):** Tüm API route'larında fallback mock data
- **Admin Pages:** Performance, Security, AI, HR, CRM, Accounting, E-commerce
- **Components:** SecurityIssues, SecurityMonitoring, AdvancedFeaturesModal
- **Seed Files:** accounting-seed-data.sql

### Demo Data Pattern'leri:
- `mock*` değişkenleri
- `Fallback: Mock data` yorumları
- `demo-*` prefix'li ID'ler
- `@example.com` email'leri
- `DEMO-` prefix'li SKU'lar
- `demo` içeren açıklamalar

## 2. Refactor Stratejisi

### A. Environment Configuration
- `.env` dosyasına `DEMO_MODE=true|false` ekle
- `ALLOW_DESTRUCTIVE=true|false` güvenlik bayrağı
- `NODE_ENV` kontrolü

### B. Database Schema Updates
- Tüm tablolara `is_demo BOOLEAN DEFAULT false` alanı ekle
- Mevcut demo verileri `is_demo=true` ile işaretle
- Pattern-based identification:
  - `sku LIKE 'DEMO-%'`
  - `email LIKE '%@example.com'`
  - `title LIKE '%demo%' OR title LIKE '%test%' OR title LIKE '%sample%'`
  - `seeded_by = 'demo'`

### C. Clean Script
- `scripts/clean-demo.ts` oluştur
- Production safety checks
- Selective deletion based on patterns
- Summary reporting

### D. Seed Refactor
- `scripts/seed.ts` oluştur
- DEMO_MODE kontrolü
- Demo data flagging
- Production safety

### E. Admin UI Updates
- Empty state components
- Placeholder states
- No data messages

## 3. Implementation Order

1. ✅ Environment configuration
2. ✅ Database schema updates
3. ✅ Clean script creation
4. ✅ Seed script refactor
5. ✅ Admin UI updates
6. ✅ Documentation
7. ✅ Testing & validation

## 4. Safety Measures

- Production environment checks
- Destructive operation flags
- Backup recommendations
- Rollback procedures
- Audit logging

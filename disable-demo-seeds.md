# Demo Seed Verilerini Devre Dışı Bırakma

## 🎯 Amaç

Veritabanını temizledikten sonra, projeyi yeniden deploy ettiğinizde veya seed komutlarını çalıştırdığınızda demo verilerin tekrar eklenmemesini sağlamak.

## 📁 Güncellenen Dosyalar

### 1. `prisma/seed.ts` ✅
- Demo veri üretimi devre dışı bırakıldı
- SEED_DEMO=true bile olsa demo veri eklenmez
- Sadece gerekli admin kullanıcısı oluşturulur

## 🚫 Devre Dışı Bırakılması Gereken Diğer Dosyalar

Aşağıdaki dosyaları projenizden silebilir veya yorum satırına alabilirsiniz:

### SQL Dosyaları (Silmeyi Düşünün)
```
✅ database/ecommerce-seed-data.sql → Demo e-ticaret verileri
✅ accounting-seed-data.sql → Demo muhasebe verileri
✅ database/add-demo-flags.sql → Demo flag'leri (artık gerekli değil)
```

### Prisma Seed Dosyaları
```
⚠️ prisma/seed.js → Eski seed dosyası (kullanılmıyor mu kontrol edin)
⚠️ packages/infra/src/database/seed.ts → Eğer kullanılıyorsa güncelleyin
```

### Test/Demo Script Dosyaları (Opsiyonel)
```
test-ad-campaign-system.js
test-ai-functions.js
test-bigquery-analytics.js
test-commission-api.js
test-invoice-system.js
test-media-system.js
test-promotion-system.js
test-queue-system.js
test-rbac-system.js
test-risk-system.js
test-seo-system.js
test-settlement-system.js
test-shipping-system.js
test-store-domains-system.js
test-store-pages-system.js
test-store-theme-system.js
test-subscription-system.js
test-webhook-system.js
```

## 🔧 Manuel Güncelleme Gerekebilecek Dosyalar

### `packages/infra/src/database/seed.ts`

Eğer bu dosya kullanılıyorsa, şu şekilde güncelleyin:

```typescript
async function main() {
  console.log('🌱 Starting database seed...');

  // Validate environment
  if (!env.isDevelopment()) {
    console.log('⚠️  This script should only be run in development mode');
    process.exit(1);
  }

  // DEMO SEED DEVRESİ DIŞI
  console.log('ℹ️  Demo data seeding is disabled');
  console.log('💡 Production hazırlığı için demo veriler temizlendi');
  return;

  // ... rest of the code commented out or removed
}
```

### `prisma/seed.js`

Eğer hala kullanılıyorsa:

```javascript
async function main() {
  console.log("🌱 Seeding database...");
  
  // DEMO SEED DEVRE DIŞI
  console.log("ℹ️  Demo data seeding is disabled");
  console.log("💡 Production hazırlığı için demo veriler temizlendi");
  return;
  
  // ... rest of the code commented out
}
```

## 📋 Kontrol Listesi

Seed dosyalarını devre dışı bıraktıktan sonra:

- [ ] `npm run db:seed` veya `pnpm db:seed` komutunu çalıştırın
- [ ] Hiçbir demo veri eklenmediğini doğrulayın
- [ ] Sadece gerekli sistem kayıtlarının oluşturulduğunu kontrol edin
- [ ] Git'e commit edin

## 🎯 Sonuç

Bu değişikliklerden sonra:
- ✅ Veritabanını seed ettiğinizde demo veri eklenmez
- ✅ Deploy sırasında demo veri eklenmez
- ✅ Sadece gerçek verilerle çalışırsınız
- ✅ Production'a hazır temiz bir sistem

## 🔄 Gelecekte Demo Verilere İhtiyaç Duyarsanız

Eğer development/staging ortamında demo verilere ihtiyaç duyarsanız:

1. Ayrı bir `seed.demo.ts` dosyası oluşturun
2. Package.json'a `db:seed:demo` script'i ekleyin
3. Manuel olarak sadece gerektiğinde çalıştırın

```json
{
  "scripts": {
    "db:seed": "tsx prisma/seed.ts",
    "db:seed:demo": "tsx prisma/seed.demo.ts"
  }
}
```

---

**Not:** Bu değişiklikler production hazırlığı içindir. Development ortamında test verilerine ihtiyacınız varsa yukarıdaki yaklaşımı kullanın.


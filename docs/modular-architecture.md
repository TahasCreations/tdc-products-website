# TDC Market - Modüler Mimari Rehberi

## Genel Bakış

TDC Market, modüler plug-in mimarisine sahip bir e-ticaret platformudur. Her modül bağımsız olarak geliştirilebilir, test edilebilir ve başka projelere entegre edilebilir.

## Mimari Yapı

```
tdc-market/
├── apps/
│   ├── web/                 # Ana web uygulaması
│   └── admin/               # Admin paneli
├── packages/
│   ├── core/                # Çekirdek modül sistemi
│   ├── ui/                  # Ortak UI bileşenleri
│   ├── sdk/                 # SDK ve API client'ları
│   ├── shared/              # Paylaşılan tipler ve utilities
│   └── feature-*/           # Özellik modülleri
│       ├── feature-pricing/
│       ├── feature-accounting/
│       ├── feature-loyalty/
│       └── feature-automation/
```

## Kurulum

### Gereksinimler

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL veya Supabase

### Kurulum Adımları

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/tdc/market.git
cd market
```

2. **Bağımlılıkları yükleyin:**
```bash
pnpm install
```

3. **Environment variables'ları ayarlayın:**
```bash
cp env.example .env.local
# .env.local dosyasını düzenleyin
```

4. **Veritabanını kurun:**
```bash
pnpm db:migrate
pnpm db:seed
```

5. **Uygulamaları başlatın:**
```bash
pnpm dev
```

## Modül Geliştirme

### Yeni Modül Oluşturma

1. **Modül dizinini oluşturun:**
```bash
mkdir packages/feature-your-module
cd packages/feature-your-module
```

2. **package.json oluşturun:**
```json
{
  "name": "@tdc/feature-your-module",
  "version": "1.0.0",
  "description": "Your module description",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "dependencies": {
    "@tdc/core": "workspace:*",
    "@tdc/ui": "workspace:*"
  }
}
```

3. **plugin.manifest.json oluşturun:**
```json
{
  "name": "your-module",
  "version": "1.0.0",
  "description": "Your module description",
  "permissions": ["your-module.read", "your-module.write"],
  "routes": [
    {
      "path": "/api/your-module/endpoint",
      "method": "GET",
      "handler": "yourHandler"
    }
  ],
  "navigation": [
    {
      "id": "your-module",
      "label": "Your Module",
      "path": "/admin/your-module",
      "icon": "YourIcon",
      "permissions": ["your-module.read"]
    }
  ],
  "widgets": [
    {
      "id": "your-widget",
      "component": "YourWidget",
      "position": "dashboard",
      "permissions": ["your-module.read"]
    }
  ]
}
```

4. **Ana modül sınıfını oluşturun:**
```typescript
import { FeatureModule, ModuleManifest } from '@tdc/core';

export class YourModule implements FeatureModule {
  public manifest: ModuleManifest;
  
  constructor(manifest: ModuleManifest, eventBus: EventBus, rbac: RBAC, config: ModuleConfig) {
    this.manifest = manifest;
    // ...
  }

  async install(): Promise<void> {
    // Modül kurulum işlemleri
  }

  async uninstall(): Promise<void> {
    // Modül kaldırma işlemleri
  }

  async activate(): Promise<void> {
    // Modül etkinleştirme işlemleri
  }

  async deactivate(): Promise<void> {
    // Modül deaktive etme işlemleri
  }

  getRoutes(): ModuleRoute[] {
    // API route'ları
  }

  getNavigation(): ModuleNavigation[] {
    // Navigation öğeleri
  }

  getWidgets(): ModuleWidget[] {
    // Dashboard widget'ları
  }

  getHooks(): ModuleHook[] {
    // UI hook'ları
  }
}

export default YourModule;
```

### Modül Entegrasyonu

Modülünüzü admin uygulamasına entegre etmek için:

1. **apps/admin/src/modules.ts** dosyasına modül adını ekleyin:
```typescript
export const activeModules = [
  'pricing',
  'accounting',
  'loyalty',
  'automation',
  'your-module' // Yeni modülünüzü ekleyin
];
```

2. **apps/admin/package.json** dosyasına bağımlılığı ekleyin:
```json
{
  "dependencies": {
    "@tdc/feature-your-module": "workspace:*"
  }
}
```

## API Geliştirme

### Route Handler'ları

Modül route'ları Next.js API route'ları olarak çalışır:

```typescript
// packages/feature-your-module/src/api/yourHandler.ts
import { NextRequest, NextResponse } from 'next/server';

export async function yourHandler(request: NextRequest): Promise<NextResponse> {
  try {
    // İş mantığınızı buraya yazın
    const data = await processRequest(request);
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
```

### Veritabanı İşlemleri

Modülünüzde veritabanı işlemleri için Supabase kullanın:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Veri okuma
const { data, error } = await supabase
  .from('your_table')
  .select('*');

// Veri ekleme
const { data, error } = await supabase
  .from('your_table')
  .insert([{ field: 'value' }]);

// Veri güncelleme
const { data, error } = await supabase
  .from('your_table')
  .update({ field: 'new_value' })
  .eq('id', id);

// Veri silme
const { data, error } = await supabase
  .from('your_table')
  .delete()
  .eq('id', id);
```

## UI Geliştirme

### React Bileşenleri

Modül bileşenlerinizi React ile geliştirin:

```typescript
// packages/feature-your-module/src/components/YourWidget.tsx
import React from 'react';

interface YourWidgetProps {
  // Props tanımlarınız
}

export default function YourWidget({ }: YourWidgetProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Your Widget
      </h3>
      {/* Widget içeriğiniz */}
    </div>
  );
}
```

### Tema Sistemi

UI bileşenlerinizde Tailwind CSS kullanın ve dark mode'u destekleyin:

```css
/* Light mode */
.text-primary { @apply text-gray-900; }
.bg-primary { @apply bg-white; }

/* Dark mode */
.dark .text-primary { @apply text-gray-100; }
.dark .bg-primary { @apply bg-gray-800; }
```

## Veritabanı Yönetimi

### Migration'lar

Modül migration'larınızı oluşturun:

```sql
-- packages/feature-your-module/migrations/001_create_your_tables.sql
CREATE TABLE IF NOT EXISTS your_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_demo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Seed Verileri

Demo verilerinizi oluşturun:

```typescript
// packages/feature-your-module/seeds/your_seed.ts
import { createClient } from '@supabase/supabase-js';

export default async function seedYourData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const demoData = [
    { name: 'Demo Item 1', description: 'Demo description', is_demo: true },
    { name: 'Demo Item 2', description: 'Demo description', is_demo: true }
  ];

  for (const item of demoData) {
    await supabase.from('your_table').insert([item]);
  }
}
```

## Test

### Unit Testler

Modülünüz için unit testler yazın:

```typescript
// packages/feature-your-module/src/__tests__/YourModule.test.ts
import { YourModule } from '../index';

describe('YourModule', () => {
  let module: YourModule;

  beforeEach(() => {
    // Test setup
  });

  it('should install successfully', async () => {
    await module.install();
    expect(module.manifest.name).toBe('your-module');
  });

  it('should activate successfully', async () => {
    await module.activate();
    // Assertions
  });
});
```

### Integration Testler

API endpoint'lerinizi test edin:

```typescript
// packages/feature-your-module/src/__tests__/api.test.ts
import { yourHandler } from '../api/yourHandler';

describe('Your API', () => {
  it('should handle GET requests', async () => {
    const request = new Request('http://localhost:3000/api/your-module/endpoint');
    const response = await yourHandler(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
```

## Paketleme ve Paylaşım

### NPM Paketi Olarak Yayınlama

Modülünüzü NPM paketi olarak yayınlamak için:

1. **package.json** dosyasını güncelleyin:
```json
{
  "name": "@tdc/feature-your-module",
  "version": "1.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "publishConfig": {
    "access": "public"
  }
}
```

2. **Modülü build edin:**
```bash
pnpm build
```

3. **NPM'e yayınlayın:**
```bash
npm publish
```

### Başka Projeye Entegrasyon

Modülünüzü başka bir projeye entegre etmek için:

1. **Paketi yükleyin:**
```bash
npm install @tdc/feature-your-module
```

2. **Modülü import edin:**
```typescript
import { YourModule } from '@tdc/feature-your-module';
```

3. **Modülü yapılandırın:**
```typescript
const module = new YourModule(manifest, eventBus, rbac, config);
await module.install();
await module.activate();
```

## Güvenlik

### İzin Yönetimi

Modülünüzde RBAC kullanın:

```typescript
// İzin kontrolü
const hasPermission = await rbac.hasPermission(userId, 'your-module.read');
if (!hasPermission) {
  throw new Error('Permission denied');
}
```

### Veri Doğrulama

Giriş verilerini doğrulayın:

```typescript
import { z } from 'zod';

const YourSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
});

const result = YourSchema.safeParse(data);
if (!result.success) {
  throw new Error('Validation failed');
}
```

## Performans

### Lazy Loading

Büyük modülleri lazy load edin:

```typescript
const YourModule = lazy(() => import('@tdc/feature-your-module'));
```

### Caching

Veritabanı sorgularını cache'leyin:

```typescript
import { cache } from 'react';

export const getCachedData = cache(async (id: string) => {
  // Expensive database operation
  return await supabase.from('table').select('*').eq('id', id);
});
```

## Sorun Giderme

### Yaygın Sorunlar

1. **Modül yüklenmiyor:**
   - `plugin.manifest.json` dosyasının doğru formatta olduğundan emin olun
   - Modül bağımlılıklarının yüklendiğinden emin olun

2. **API route'ları çalışmıyor:**
   - Route handler'ların doğru export edildiğinden emin olun
   - Next.js API route formatını takip ettiğinizden emin olun

3. **UI bileşenleri render olmuyor:**
   - React bileşenlerinin default export edildiğinden emin olun
   - Tailwind CSS sınıflarının doğru kullanıldığından emin olun

### Debug

Modül yükleme sürecini debug etmek için:

```typescript
// Event listener ekleyin
eventBus.on('module:loaded', (data) => {
  console.log('Module loaded:', data);
});

eventBus.on('module:error', (data) => {
  console.error('Module error:', data);
});
```

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

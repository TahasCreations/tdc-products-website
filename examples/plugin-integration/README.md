# Plugin Integration Example

Bu örnek, TDC Market platformundaki plugin sistemini başka bir projeye nasıl entegre edeceğinizi gösterir.

## 📋 Gereksinimler

- Node.js >= 18.0.0
- TypeScript
- Next.js 14+

## 🚀 Hızlı Başlangıç

### 1. Proje Kurulumu

```bash
# Yeni bir Next.js projesi oluşturun
npx create-next-app@latest my-ecommerce-site --typescript --tailwind --app

cd my-ecommerce-site

# TDC plugin sistemini yükleyin
npm install @tdc/plugin-system
```

### 2. Plugin Sistemini Başlatma

```typescript
// src/lib/plugin-system.ts
import { pluginSystem } from '@tdc/plugin-system';

export async function initializePluginSystem() {
  await pluginSystem.initialize({
    app: {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    },
    services: {
      storage: createStorageService(),
      api: createApiService(),
      events: createEventService(),
      logger: createLoggerService(),
      config: createConfigService()
    }
  });

  return pluginSystem;
}
```

### 3. E-Commerce Plugin'ini Yükleme

```typescript
// src/app/layout.tsx
import { initializePluginSystem } from '@/lib/plugin-system';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pluginSystem = await initializePluginSystem();
  const registry = await pluginSystem.getRegistry();

  // E-commerce plugin'ini yükle
  await registry.load('ecommerce', {
    enabled: true,
    settings: {
      currency: 'TRY',
      taxRate: 0.18,
      allowGuestCheckout: true
    }
  });

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
```

### 4. Plugin API'lerini Kullanma

```typescript
// src/components/ProductList.tsx
'use client';

import { useEffect, useState } from 'react';
import { pluginSystem } from '@/lib/plugin-system';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const registry = await pluginSystem.getRegistry();
        const ecommercePlugin = registry.get('ecommerce');
        
        if (ecommercePlugin) {
          const api = ecommercePlugin.getPublicAPI();
          const productList = await api.products.list();
          setProducts(productList);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-gray-600">{product.category}</p>
          <p className="text-lg font-bold">{product.price} TL</p>
        </div>
      ))}
    </div>
  );
}
```

### 5. Plugin Bileşenlerini Kullanma

```typescript
// src/components/CartSidebar.tsx
'use client';

import { useEffect, useState } from 'react';
import { pluginSystem } from '@/lib/plugin-system';

export default function CartSidebar() {
  const [CartComponent, setCartComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    async function loadCartComponent() {
      try {
        const registry = await pluginSystem.getRegistry();
        const ecommercePlugin = registry.get('ecommerce');
        
        if (ecommercePlugin) {
          const components = ecommercePlugin.getComponents();
          if (components.CartSidebar) {
            setCartComponent(() => components.CartSidebar);
          }
        }
      } catch (error) {
        console.error('Failed to load cart component:', error);
      }
    }

    loadCartComponent();
  }, []);

  if (!CartComponent) {
    return <div>Loading cart...</div>;
  }

  return <CartComponent />;
}
```

## 🔧 Konfigürasyon

### Çevre Değişkenleri

```bash
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
PLUGIN_ECOMMERCE_ENABLED=true
PLUGIN_ECOMMERCE_CURRENCY=TRY
PLUGIN_ECOMMERCE_TAX_RATE=0.18
```

### Plugin Konfigürasyonu

```typescript
// src/config/plugins.ts
export const pluginConfigs = {
  ecommerce: {
    enabled: process.env.PLUGIN_ECOMMERCE_ENABLED === 'true',
    settings: {
      currency: process.env.PLUGIN_ECOMMERCE_CURRENCY || 'USD',
      taxRate: parseFloat(process.env.PLUGIN_ECOMMERCE_TAX_RATE || '0.0'),
      allowGuestCheckout: true,
      requireEmailVerification: false
    },
    features: {
      advancedInventory: true,
      bulkOperations: true,
      categoryManagement: true,
      orderTracking: true,
      analytics: true
    }
  },
  
  analytics: {
    enabled: true,
    settings: {
      trackingEnabled: true,
      dataRetentionDays: 365,
      realTimeUpdates: true
    }
  }
};
```

## 🧪 Test Etme

### Plugin Sistemini Test Etme

```typescript
// src/test/plugin-system.test.ts
import { describe, it, expect } from 'vitest';
import { initializePluginSystem } from '@/lib/plugin-system';

describe('Plugin System Integration', () => {
  it('should initialize plugin system', async () => {
    const pluginSystem = await initializePluginSystem();
    expect(pluginSystem.isInitialized()).toBe(true);
  });

  it('should load ecommerce plugin', async () => {
    const pluginSystem = await initializePluginSystem();
    const registry = await pluginSystem.getRegistry();
    
    await registry.load('ecommerce', {
      enabled: true,
      settings: { currency: 'TRY' }
    });

    const plugin = registry.get('ecommerce');
    expect(plugin).toBeDefined();
    expect(plugin.meta.name).toBe('ecommerce');
  });
});
```

## 📦 Özelleştirme

### Kendi Plugin'inizi Oluşturma

```typescript
// src/plugins/custom-feature/index.ts
import { Plugin, PluginMeta } from '@tdc/plugin-system/types';

const meta: PluginMeta = {
  name: 'custom-feature',
  version: '1.0.0',
  description: 'Custom feature for my site',
  category: 'utility',
  supportedPlatforms: ['web', 'admin']
};

const customPlugin: Plugin = {
  meta,
  
  validateConfig(config: unknown) {
    // Konfigürasyon doğrulama
    return { valid: true };
  },
  
  async init(context, config) {
    console.log('Custom feature plugin initialized');
  },
  
  getPublicAPI() {
    return {
      doSomething: () => 'Hello from custom feature!'
    };
  }
};

export default customPlugin;
```

### Plugin'i Kaydetme ve Kullanma

```typescript
// src/lib/plugin-registry.ts
import { pluginSystem } from '@/lib/plugin-system';
import customPlugin from '@/plugins/custom-feature';

export async function registerCustomPlugins() {
  const registry = await pluginSystem.getRegistry();
  
  // Kendi plugin'inizi kaydedin
  await registry.register(customPlugin);
  
  // Plugin'i yükleyin
  await registry.load('custom-feature', {
    enabled: true,
    settings: { customSetting: 'value' }
  });
}
```

## 🚀 Deployment

### Vercel Deployment

```bash
# Vercel'e deploy edin
vercel --prod
```

### Docker ile Deployment

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 🔍 Troubleshooting

### Plugin Yüklenmiyor

```bash
# Plugin doğrulama scriptini çalıştırın
npm run plugin:validate

# Test'leri çalıştırın
npm run test:plugin
```

### Bağımlılık Hataları

```bash
# Bağımlılıkları kontrol edin
npm ls

# Node modules'ı temizleyin
rm -rf node_modules package-lock.json
npm install
```

## 📚 Daha Fazla Bilgi

- [Plugin Kataloğu](../docs/PLUGIN_CATALOG.md)
- [Plugin Kılavuzu](../docs/PLUGIN_GUIDE.md)
- [API Referansı](../docs/API_REFERENCE.md)

## 🤝 Destek

Sorularınız için:
- 📧 E-posta: support@tdc.com
- 📚 Dokümantasyon: [docs.tdc.com](https://docs.tdc.com)
- 🐛 Bug Raporu: [GitHub Issues](https://github.com/tdc/issues)

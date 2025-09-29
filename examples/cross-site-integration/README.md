# Cross-Site Plugin Integration Example

Bu örnek, TDC plugin sistemini herhangi bir web sitesine nasıl entegre edeceğinizi gösterir.

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
import { enhancedPluginRegistry } from '@tdc/plugin-system';

export async function initializePluginSystem() {
  const context = {
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
  };

  await enhancedPluginRegistry.setContext(context);
  return enhancedPluginRegistry;
}
```

### 3. Plugin Konfigürasyonu

```json
// config/plugins.json
{
  "ecommerce": {
    "enabled": true,
    "settings": {
      "currency": "TRY",
      "taxRate": 0.18
    }
  },
  "pricing-plugin": {
    "enabled": true,
    "settings": {
      "currency": "TRY"
    }
  }
}
```

### 4. Plugin'leri Yükleme

```typescript
// src/app/layout.tsx
import { initializePluginSystem } from '@/lib/plugin-system';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const registry = await initializePluginSystem();

  // Plugin'leri keşfet ve yükle
  await registry.discoverPlugins();
  
  // E-commerce plugin'ini etkinleştir
  await registry.enable('ecommerce', {
    enabled: true,
    settings: { currency: 'TRY', taxRate: 0.18 }
  });

  // Pricing plugin'ini etkinleştir
  await registry.enable('pricing-plugin', {
    enabled: true,
    settings: { currency: 'TRY' }
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

## 🔌 Plugin Kullanımı

### E-Commerce Plugin

```typescript
// src/components/ProductList.tsx
'use client';

import { useEffect, useState } from 'react';
import { enhancedPluginRegistry } from '@/lib/plugin-system';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const registry = await enhancedPluginRegistry;
        const ecommercePlugin = registry.get('ecommerce');
        
        if (ecommercePlugin) {
          const api = ecommercePlugin.getPublicAPI();
          const productList = await api.products.list();
          setProducts(productList);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    }

    loadProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-lg font-bold">{product.price} TL</p>
        </div>
      ))}
    </div>
  );
}
```

### Pricing Plugin

```typescript
// src/components/PriceCalculator.tsx
'use client';

import { useState } from 'react';
import { enhancedPluginRegistry } from '@/lib/plugin-system';

export default function PriceCalculator() {
  const [basePrice, setBasePrice] = useState(100);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  const calculatePrice = async () => {
    try {
      const registry = await enhancedPluginRegistry;
      const pricingPlugin = registry.get('pricing-plugin');
      
      if (pricingPlugin) {
        const api = pricingPlugin.getPublicAPI();
        const price = await api.getPrice({
          basePrice,
          currency: 'TRY',
          includeTax: true
        });
        setCalculatedPrice(price);
      }
    } catch (error) {
      console.error('Failed to calculate price:', error);
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Fiyat Hesaplayıcı</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Temel Fiyat:
        </label>
        <input
          type="number"
          value={basePrice}
          onChange={(e) => setBasePrice(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={calculatePrice}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Fiyat Hesapla
      </button>

      {calculatedPrice > 0 && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-lg font-semibold">
            Hesaplanan Fiyat: {calculatedPrice} TL
          </p>
        </div>
      )}
    </div>
  );
}
```

## 🎛️ Plugin Yönetim Paneli

```typescript
// src/components/PluginManager.tsx
'use client';

import { useEffect, useState } from 'react';
import { enhancedPluginRegistry } from '@/lib/plugin-system';

interface PluginStatus {
  name: string;
  loaded: boolean;
  enabled: boolean;
  config?: any;
}

export default function PluginManager() {
  const [plugins, setPlugins] = useState<PluginStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPluginStatus() {
      try {
        const registry = await enhancedPluginRegistry;
        const pluginList = registry.list();
        setPlugins(pluginList);
      } catch (error) {
        console.error('Failed to load plugin status:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPluginStatus();
  }, []);

  const togglePlugin = async (pluginName: string, enabled: boolean) => {
    try {
      const registry = await enhancedPluginRegistry;
      
      if (enabled) {
        await registry.enable(pluginName, { enabled: true });
      } else {
        await registry.disable(pluginName);
      }

      // Refresh plugin list
      const pluginList = registry.list();
      setPlugins(pluginList);
    } catch (error) {
      console.error(`Failed to ${enabled ? 'enable' : 'disable'} plugin:`, error);
    }
  };

  if (loading) {
    return <div>Loading plugin status...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Plugin Yöneticisi</h1>
      
      <div className="grid gap-4">
        {plugins.map((plugin) => (
          <div key={plugin.name} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold capitalize">
                  {plugin.name.replace(/-/g, ' ')}
                </h3>
                <p className="text-sm text-gray-600">
                  Durum: {plugin.enabled ? 'Aktif' : 'Pasif'} | 
                  Yüklenmiş: {plugin.loaded ? 'Evet' : 'Hayır'}
                </p>
              </div>
              
              <button
                onClick={() => togglePlugin(plugin.name, !plugin.enabled)}
                className={`px-4 py-2 rounded ${
                  plugin.enabled
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {plugin.enabled ? 'Devre Dışı Bırak' : 'Etkinleştir'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 📝 Adım Adım Entegrasyon Rehberi

### Adım 1: Kurulum

1. **Proje oluşturun:**
   ```bash
   npx create-next-app@latest my-site --typescript --tailwind --app
   cd my-site
   ```

2. **Plugin sistemini yükleyin:**
   ```bash
   npm install @tdc/plugin-system
   ```

3. **Konfigürasyon dosyasını oluşturun:**
   ```bash
   mkdir config
   cp config/plugins.json config/
   ```

### Adım 2: Plugin Sistemini Entegre Edin

1. **Plugin sistem başlatıcısını oluşturun:**
   ```typescript
   // src/lib/plugin-system.ts
   import { enhancedPluginRegistry } from '@tdc/plugin-system';
   
   export async function initializePluginSystem() {
     // Context ve servisleri yapılandırın
     // Plugin'leri keşfedin ve yükleyin
   }
   ```

2. **Ana layout'ta başlatın:**
   ```typescript
   // src/app/layout.tsx
   import { initializePluginSystem } from '@/lib/plugin-system';
   
   export default async function RootLayout({ children }) {
     await initializePluginSystem();
     // ...
   }
   ```

### Adım 3: Plugin'leri Kullanın

1. **Plugin API'lerini kullanın:**
   ```typescript
   const registry = await enhancedPluginRegistry;
   const plugin = registry.get('plugin-name');
   const api = plugin.getPublicAPI();
   const result = await api.someMethod();
   ```

2. **Plugin bileşenlerini kullanın:**
   ```typescript
   const components = plugin.getComponents();
   const MyComponent = components.SomeComponent;
   ```

### Adım 4: Plugin'leri Yönetin

1. **Plugin durumunu kontrol edin:**
   ```typescript
   const status = registry.getStatus('plugin-name');
   console.log(status.enabled, status.loaded);
   ```

2. **Plugin'leri etkinleştirin/devre dışı bırakın:**
   ```typescript
   await registry.enable('plugin-name', config);
   await registry.disable('plugin-name');
   ```

### Adım 5: Özelleştirin

1. **Kendi plugin'inizi oluşturun:**
   ```typescript
   // src/plugins/my-plugin/index.ts
   import { Plugin } from '@tdc/plugin-system/types';
   
   const myPlugin: Plugin = {
     meta: { name: 'my-plugin', version: '1.0.0', category: 'utility' },
     validateConfig: (config) => ({ valid: true }),
     init: async (context, config) => { /* ... */ },
     getPublicAPI: () => ({ /* ... */ })
   };
   
   export default myPlugin;
   ```

2. **Plugin'i kaydedin:**
   ```typescript
   await registry.register(myPlugin);
   await registry.enable('my-plugin', config);
   ```

## 🔧 Konfigürasyon Örnekleri

### Environment Variables

```bash
# .env.local
PLUGIN_ECOMMERCE_ENABLED=true
PLUGIN_ECOMMERCE_CURRENCY=TRY
PLUGIN_ECOMMERCE_TAX_RATE=0.18
PLUGIN_PRICING_PLUGIN_ENABLED=true
PLUGIN_PRICING_PLUGIN_CURRENCY=TRY
```

### Runtime Konfigürasyonu

```typescript
// src/lib/plugin-config.ts
export const getPluginConfig = () => {
  return {
    ecommerce: {
      enabled: process.env.PLUGIN_ECOMMERCE_ENABLED === 'true',
      settings: {
        currency: process.env.PLUGIN_ECOMMERCE_CURRENCY || 'USD',
        taxRate: parseFloat(process.env.PLUGIN_ECOMMERCE_TAX_RATE || '0.0')
      }
    },
    'pricing-plugin': {
      enabled: process.env.PLUGIN_PRICING_PLUGIN_ENABLED === 'true',
      settings: {
        currency: process.env.PLUGIN_PRICING_PLUGIN_CURRENCY || 'USD'
      }
    }
  };
};
```

## 🚀 Deployment

### Vercel Deployment

```bash
# Vercel'e deploy edin
vercel --prod
```

### Docker Deployment

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

```typescript
// Bağımlılıkları kontrol edin
const status = registry.getStatus('plugin-name');
console.log('Dependencies:', status.dependencies);
console.log('Dependents:', status.dependents);
```

### Konfigürasyon Hataları

```typescript
// Konfigürasyonu doğrulayın
const plugin = registry.get('plugin-name');
const validation = plugin.validateConfig(config);
if (!validation.valid) {
  console.error('Config errors:', validation.errors);
}
```

## 📚 Daha Fazla Bilgi

- [Plugin Kataloğu](../../docs/PLUGIN_CATALOG.md)
- [Plugin Kılavuzu](../../docs/PLUGIN_GUIDE.md)
- [API Referansı](../../docs/API_REFERENCE.md)

## 🤝 Destek

Sorularınız için:
- 📧 E-posta: support@tdc.com
- 📚 Dokümantasyon: [docs.tdc.com](https://docs.tdc.com)
- 🐛 Bug Raporu: [GitHub Issues](https://github.com/tdc/issues)

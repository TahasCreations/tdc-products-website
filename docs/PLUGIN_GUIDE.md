# TDC Plugin System Kullanım Kılavuzu

Bu kılavuz, TDC Market platformundaki plugin sistemini nasıl kullanacağınızı, yeni plugin'ler nasıl oluşturacağınızı ve mevcut plugin'leri nasıl yapılandıracağınızı açıklar.

## 📚 İçindekiler

1. [Hızlı Başlangıç](#hızlı-başlangıç)
2. [Plugin Yaşam Döngüsü](#plugin-yaşam-döngüsü)
3. [Konfigürasyon](#konfigürasyon)
4. [Yeni Plugin Oluşturma](#yeni-plugin-oluşturma)
5. [API Referansı](#api-referansı)
6. [Örnekler](#örnekler)
7. [Troubleshooting](#troubleshooting)

## 🚀 Hızlı Başlangıç

### Plugin Sistemini Başlatma

```typescript
import { pluginSystem, pluginRegistry, pluginLoader } from '@/lib/plugin-system';

// Plugin sistemini başlat
await pluginSystem.initialize({
  app: {
    version: '1.0.0',
    environment: 'production',
    baseUrl: 'https://your-app.com'
  },
  services: {
    storage: storageService,
    api: apiService,
    events: eventService,
    logger: loggerService,
    config: configService
  }
});

// Plugin yükle
const registry = await pluginSystem.getRegistry();
await registry.load('ecommerce', {
  enabled: true,
  settings: {
    currency: 'TRY',
    taxRate: 0.18
  }
});
```

### Mevcut Plugin'i Kullanma

```typescript
// E-commerce plugin'ini al
const ecommercePlugin = registry.get('ecommerce');
const api = ecommercePlugin.getPublicAPI();

// Ürün oluştur
const product = await api.products.create({
  name: 'Yeni Ürün',
  price: 100,
  category: 'electronics'
});

// Kategori listesi al
const categories = await api.categories.list();
```

## 🔄 Plugin Yaşam Döngüsü

### 1. Kayıt (Registration)
Plugin'ler sisteme kaydedilir ancak henüz yüklenmez.

```typescript
await registry.register(myPlugin);
```

### 2. Yükleme (Loading)
Plugin'ler bağımlılıklarıyla birlikte yüklenir ve başlatılır.

```typescript
await registry.load('plugin-name', configuration);
```

### 3. Hazır (Ready)
Plugin tüm bağımlılıkları yüklendikten sonra hazır hale gelir.

```typescript
// Plugin otomatik olarak ready() metodunu çağırır
```

### 4. Çalışır (Running)
Plugin aktif olarak çalışır ve API'leri kullanılabilir.

### 5. Durdurma (Stopping)
Plugin durdurulur ancak kayıtlı kalır.

```typescript
await registry.unload('plugin-name');
```

### 6. Kaldırma (Disposal)
Plugin sistemden tamamen kaldırılır.

```typescript
await registry.unregister('plugin-name');
```

## ⚙️ Konfigürasyon

### Temel Konfigürasyon Yapısı

```json
{
  "enabled": true,
  "priority": 50,
  "settings": {
    "customSetting": "value"
  },
  "features": {
    "feature1": true,
    "feature2": false
  },
  "integrations": {
    "externalService": {
      "enabled": true,
      "apiKey": "secret-key"
    }
  }
}
```

### Konfigürasyon Doğrulama

```typescript
// Plugin'inizde konfigürasyon şeması tanımlayın
const configSchema = z.object({
  enabled: z.boolean().default(true),
  priority: z.number().min(0).max(100).default(50),
  settings: z.object({
    mySetting: z.string().min(1)
  })
});

const myPlugin: Plugin = {
  // ... diğer özellikler
  configSchema,
  
  validateConfig(config: unknown) {
    try {
      configSchema.parse(config);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        errors: ['Configuration validation failed']
      };
    }
  }
};
```

### Çevre Değişkenleri

```typescript
// .env dosyasında
PLUGIN_ECOMMERCE_ENABLED=true
PLUGIN_ECOMMERCE_CURRENCY=TRY
PLUGIN_ECOMMERCE_TAX_RATE=0.18

// Kodda kullanım
const config = {
  enabled: process.env.PLUGIN_ECOMMERCE_ENABLED === 'true',
  settings: {
    currency: process.env.PLUGIN_ECOMMERCE_CURRENCY || 'USD',
    taxRate: parseFloat(process.env.PLUGIN_ECOMMERCE_TAX_RATE || '0.0')
  }
};
```

## 🛠️ Yeni Plugin Oluşturma

### 1. Temel Plugin Yapısı

```typescript
// src/plugins/my-plugin/index.ts
import { Plugin, PluginMeta } from '@/lib/plugin-system/types';
import { z } from 'zod';

const meta: PluginMeta = {
  name: 'my-plugin',
  version: '1.0.0',
  description: 'My custom plugin',
  author: 'Your Name',
  license: 'MIT',
  category: 'utility',
  keywords: ['custom', 'utility'],
  supportedPlatforms: ['web', 'admin'],
  dependencies: ['storage', 'api']
};

const configSchema = z.object({
  enabled: z.boolean().default(true),
  priority: z.number().default(50),
  settings: z.object({
    mySetting: z.string().default('default-value')
  })
});

const myPlugin: Plugin = {
  meta,
  configSchema,
  
  validateConfig(config: unknown) {
    try {
      configSchema.parse(config);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        errors: ['Invalid configuration']
      };
    }
  },
  
  async init(context, config) {
    console.log('Initializing My Plugin...');
    this.context = context;
    this.config = configSchema.parse(config);
    // Plugin başlatma işlemleri
  },
  
  getPublicAPI() {
    return {
      doSomething: this.doSomething,
      getData: this.getData
    };
  },
  
  async healthCheck() {
    return {
      status: 'healthy',
      details: {
        uptime: Date.now() - this.startTime
      }
    };
  },
  
  // Private methods
  private doSomething() {
    return 'Hello from My Plugin!';
  },
  
  private getData() {
    return { data: 'sample data' };
  }
};

export default myPlugin;
```

### 2. Plugin'i Kaydetme

```typescript
// src/plugins/index.ts
import myPlugin from './my-plugin';
import { pluginRegistry } from '@/lib/plugin-system';

// Plugin'i kaydet
await pluginRegistry.register(myPlugin);
```

### 3. Plugin'i Kullanma

```typescript
// Uygulamanızda
const registry = await pluginSystem.getRegistry();
await registry.load('my-plugin', {
  enabled: true,
  settings: {
    mySetting: 'custom-value'
  }
});

const plugin = registry.get('my-plugin');
const api = plugin.getPublicAPI();
const result = await api.doSomething();
```

## 📖 API Referansı

### PluginRegistry

#### `register(plugin: Plugin): Promise<void>`
Plugin'i sisteme kaydeder.

#### `load(pluginName: string, config?: unknown): Promise<void>`
Plugin'i yükler ve başlatır.

#### `unload(pluginName: string): Promise<void>`
Plugin'i durdurur ve kaldırır.

#### `get(pluginName: string): Plugin | undefined`
Plugin'i adına göre getirir.

#### `getAll(): Plugin[]`
Tüm kayıtlı plugin'leri getirir.

#### `getByCategory(category: string): Plugin[]`
Kategoriye göre plugin'leri getirir.

#### `validate(plugin: Plugin): { valid: boolean; errors?: string[] }`
Plugin'i doğrular.

### Plugin Interface

#### `meta: PluginMeta`
Plugin metadata'sı.

#### `validateConfig(config: unknown): { valid: boolean; errors?: string[] }`
Konfigürasyon doğrulama.

#### `init(context: PluginContext, config: unknown): Promise<void> | void`
Plugin başlatma.

#### `ready?(): Promise<void> | void`
Plugin hazır olduğunda çağrılır.

#### `start?(): Promise<void> | void`
Plugin başlatıldığında çağrılır.

#### `stop?(): Promise<void> | void`
Plugin durdurulduğunda çağrılır.

#### `dispose?(): Promise<void> | void`
Plugin temizlendiğinde çağrılır.

#### `getPublicAPI?(): Record<string, unknown>`
Public API'leri döner.

#### `getRoutes?(): Route[]`
API route'larını döner.

#### `getComponents?(): Record<string, React.ComponentType>`
React bileşenlerini döner.

#### `healthCheck?(): Promise<HealthStatus>`
Plugin sağlık durumunu kontrol eder.

## 💡 Örnekler

### Basit Utility Plugin

```typescript
// src/plugins/logger/index.ts
const loggerPlugin: Plugin = {
  meta: {
    name: 'logger',
    version: '1.0.0',
    description: 'Enhanced logging system',
    category: 'utility'
  },
  
  async init(context) {
    this.logger = context.services.logger;
  },
  
  getPublicAPI() {
    return {
      log: (message: string, level: 'info' | 'warn' | 'error') => {
        this.logger[level](`[Logger Plugin] ${message}`);
      }
    };
  }
};
```

### API Route'lu Plugin

```typescript
// src/plugins/weather/index.ts
const weatherPlugin: Plugin = {
  meta: {
    name: 'weather',
    version: '1.0.0',
    description: 'Weather information plugin',
    category: 'utility'
  },
  
  getRoutes() {
    return [
      {
        path: '/api/weather',
        method: 'GET',
        handler: async (req) => {
          const city = req.query.city;
          const weather = await this.getWeather(city);
          return { success: true, data: weather };
        }
      }
    ];
  },
  
  private async getWeather(city: string) {
    // Weather API çağrısı
    return { city, temperature: '22°C', condition: 'Sunny' };
  }
};
```

### React Bileşenli Plugin

```typescript
// src/plugins/dashboard-widget/index.ts
import React from 'react';

const DashboardWidget: React.FC = () => {
  return (
    <div className="dashboard-widget">
      <h3>My Widget</h3>
      <p>This is a custom dashboard widget!</p>
    </div>
  );
};

const widgetPlugin: Plugin = {
  meta: {
    name: 'dashboard-widget',
    version: '1.0.0',
    description: 'Custom dashboard widget',
    category: 'ui'
  },
  
  getComponents() {
    return {
      DashboardWidget
    };
  }
};
```

## 🔧 Troubleshooting

### Plugin Yükleme Hataları

**Problem**: Plugin yüklenmiyor
```
Error: Plugin validation failed: Metadata validation failed
```

**Çözüm**: Plugin metadata'sını kontrol edin
```typescript
const meta: PluginMeta = {
  name: 'my-plugin', // Geçerli isim
  version: '1.0.0', // Semver formatında
  category: 'utility' // Geçerli kategori
};
```

### Bağımlılık Hataları

**Problem**: Bağımlılık bulunamıyor
```
Error: Plugin 'my-plugin' has missing dependencies: storage
```

**Çözüm**: Bağımlılıkları önce yükleyin
```typescript
await registry.load('storage');
await registry.load('my-plugin');
```

### Konfigürasyon Hataları

**Problem**: Konfigürasyon doğrulama başarısız
```
Error: Configuration validation failed: settings.mySetting is required
```

**Çözüm**: Konfigürasyon şemasını kontrol edin
```typescript
const configSchema = z.object({
  settings: z.object({
    mySetting: z.string().min(1) // Zorunlu alan
  })
});
```

### Circular Dependency

**Problem**: Döngüsel bağımlılık
```
Error: Circular dependency detected involving plugin 'plugin-a'
```

**Çözüm**: Bağımlılık grafiğini gözden geçirin
```typescript
// plugin-a plugin-b'ye bağımlı
// plugin-b plugin-a'ya bağımlı
// Bu durumda birini kaldırın veya yeniden yapılandırın
```

## 📞 Destek

Plugin sistemi ile ilgili sorularınız için:

- 📧 E-posta: support@tdc.com
- 📚 Dokümantasyon: [docs.tdc.com](https://docs.tdc.com)
- 🐛 Bug Raporu: [GitHub Issues](https://github.com/tdc/issues)
- 💬 Topluluk: [Discord](https://discord.gg/tdc)

---

**Son Güncelleme**: 2024-12-19  
**Versiyon**: 1.0.0

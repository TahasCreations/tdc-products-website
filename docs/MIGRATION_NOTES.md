# Migration Notes

Bu doküman, TDC Market platformunun plugin sistemi ile ilgili geriye dönük uyumluluk notlarını ve migration rehberini içerir.

## 📋 Versiyon Geçmişi

### v1.0.0 (2024-12-19)
- Plugin sistemi ilk sürümü
- E-commerce modülü plugin arayüzüne dönüştürüldü
- Plugin registry ve loader sistemi eklendi
- Kapsamlı test framework'ü oluşturuldu

## 🔄 Geriye Dönük Uyumluluk

### ✅ Uyumlu Olan Değişiklikler

#### 1. Mevcut API Endpoint'leri
Tüm mevcut API endpoint'leri çalışmaya devam eder:
- `/api/products` - Ürün yönetimi
- `/api/categories` - Kategori yönetimi
- `/api/orders` - Sipariş yönetimi
- `/api/ecommerce/stats` - E-ticaret istatistikleri

#### 2. Mevcut Bileşenler
Tüm mevcut React bileşenleri çalışmaya devam eder:
- `ProductCard` - Ürün kartı
- `CategoryTree` - Kategori ağacı
- `CartSidebar` - Sepet kenar çubuğu
- `OrderSummary` - Sipariş özeti

#### 3. Mevcut Konfigürasyonlar
Mevcut konfigürasyonlar korunur:
- Supabase bağlantı ayarları
- Veritabanı şemaları
- Environment değişkenleri

### ⚠️ Dikkat Edilmesi Gerekenler

#### 1. Import Path'leri
Bazı import path'leri değişti:

**Eski:**
```typescript
import { ecommerceService } from '@/services/ecommerce';
```

**Yeni:**
```typescript
import { pluginSystem } from '@/lib/plugin-system';
const registry = await pluginSystem.getRegistry();
const ecommercePlugin = registry.get('ecommerce');
```

#### 2. Servis Erişimi
Servislere erişim yöntemi değişti:

**Eski:**
```typescript
const products = await ecommerceService.getProducts();
```

**Yeni:**
```typescript
const plugin = registry.get('ecommerce');
const api = plugin.getPublicAPI();
const products = await api.products.list();
```

#### 3. Event Handling
Event handling yöntemi değişti:

**Eski:**
```typescript
eventBus.on('order:created', handleOrderCreated);
```

**Yeni:**
```typescript
context.hooks.subscribe('order:created', handleOrderCreated);
```

## 🚀 Migration Rehberi

### Adım 1: Plugin Sistemini Kurma

```bash
# Yeni bağımlılıkları yükleyin
npm install vitest @vitest/ui @vitest/coverage-v8 jsdom @vitejs/plugin-react

# Test scriptlerini ekleyin
npm run test:setup
```

### Adım 2: Mevcut Kodunuzu Güncelleme

#### E-Commerce Servislerini Plugin API'sine Geçirme

**Önce:**
```typescript
// src/services/ecommerce.ts
export class EcommerceService {
  async getProducts() {
    // Implementation
  }
  
  async createProduct(productData) {
    // Implementation
  }
}

// Kullanım
const service = new EcommerceService();
const products = await service.getProducts();
```

**Sonra:**
```typescript
// src/hooks/useEcommerce.ts
import { pluginSystem } from '@/lib/plugin-system';

export function useEcommerce() {
  const [plugin, setPlugin] = useState(null);
  
  useEffect(() => {
    async function loadPlugin() {
      const registry = await pluginSystem.getRegistry();
      const ecommercePlugin = registry.get('ecommerce');
      setPlugin(ecommercePlugin);
    }
    loadPlugin();
  }, []);
  
  const api = plugin?.getPublicAPI();
  
  return {
    getProducts: api?.products.list,
    createProduct: api?.products.create,
    // ... diğer metodlar
  };
}

// Kullanım
const { getProducts, createProduct } = useEcommerce();
const products = await getProducts?.();
```

#### Bileşenleri Plugin Sistemine Geçirme

**Önce:**
```typescript
// src/components/ProductList.tsx
import { EcommerceService } from '@/services/ecommerce';

export function ProductList() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const service = new EcommerceService();
    service.getProducts().then(setProducts);
  }, []);
  
  // Render logic
}
```

**Sonra:**
```typescript
// src/components/ProductList.tsx
import { useEcommerce } from '@/hooks/useEcommerce';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const { getProducts } = useEcommerce();
  
  useEffect(() => {
    if (getProducts) {
      getProducts().then(setProducts);
    }
  }, [getProducts]);
  
  // Render logic
}
```

### Adım 3: Konfigürasyonları Güncelleme

#### Environment Variables

```bash
# .env.local - Yeni plugin konfigürasyonları
PLUGIN_ECOMMERCE_ENABLED=true
PLUGIN_ECOMMERCE_CURRENCY=TRY
PLUGIN_ECOMMERCE_TAX_RATE=0.18
PLUGIN_ECOMMERCE_ALLOW_GUEST_CHECKOUT=true

PLUGIN_ANALYTICS_ENABLED=true
PLUGIN_ANALYTICS_TRACKING_ENABLED=true

PLUGIN_SECURITY_ENABLED=true
PLUGIN_SECURITY_MULTI_FACTOR_AUTH=true
```

#### Next.js Konfigürasyonu

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mevcut konfigürasyonlarınız
  experimental: {
    // Plugin sistemi için gerekli ayarlar
    serverComponentsExternalPackages: ['@tdc/plugin-system']
  }
};

module.exports = nextConfig;
```

### Adım 4: Test'leri Güncelleme

#### Mevcut Test'leri Plugin Sistemine Geçirme

**Önce:**
```typescript
// src/services/__tests__/ecommerce.test.ts
import { EcommerceService } from '../ecommerce';

describe('EcommerceService', () => {
  it('should get products', async () => {
    const service = new EcommerceService();
    const products = await service.getProducts();
    expect(products).toBeDefined();
  });
});
```

**Sonra:**
```typescript
// src/plugins/ecommerce/__tests__/ecommerce.test.ts
import { pluginSystem } from '@/lib/plugin-system';
import { createMockContext } from '@/test/setup';

describe('Ecommerce Plugin', () => {
  beforeEach(async () => {
    const context = createMockContext();
    await pluginSystem.initialize(context);
  });

  it('should load and provide products API', async () => {
    const registry = await pluginSystem.getRegistry();
    await registry.load('ecommerce');
    
    const plugin = registry.get('ecommerce');
    const api = plugin.getPublicAPI();
    
    expect(api.products.list).toBeDefined();
  });
});
```

## 🔧 Feature Flags

Geriye dönük uyumluluğu sağlamak için feature flag'ler kullanılır:

### Plugin Sistemini Etkinleştirme/Devre Dışı Bırakma

```typescript
// src/lib/feature-flags.ts
export const FEATURE_FLAGS = {
  PLUGIN_SYSTEM_ENABLED: process.env.PLUGIN_SYSTEM_ENABLED === 'true',
  PLUGIN_ECOMMERCE_ENABLED: process.env.PLUGIN_ECOMMERCE_ENABLED === 'true',
  PLUGIN_ANALYTICS_ENABLED: process.env.PLUGIN_ANALYTICS_ENABLED === 'true',
};

// src/lib/plugin-system/index.ts
import { FEATURE_FLAGS } from '../feature-flags';

export async function initializePluginSystem() {
  if (!FEATURE_FLAGS.PLUGIN_SYSTEM_ENABLED) {
    // Eski sistemi kullan
    return legacySystem;
  }
  
  // Yeni plugin sistemini kullan
  return pluginSystem;
}
```

### Aşamalı Geçiş

```typescript
// src/hooks/useEcommerce.ts
import { FEATURE_FLAGS } from '@/lib/feature-flags';

export function useEcommerce() {
  if (!FEATURE_FLAGS.PLUGIN_SYSTEM_ENABLED) {
    // Eski servisi kullan
    return useLegacyEcommerce();
  }
  
  // Yeni plugin sistemini kullan
  return usePluginEcommerce();
}
```

## 🐛 Bilinen Sorunlar ve Çözümleri

### 1. Plugin Yüklenmiyor

**Sorun:** Plugin yüklenirken hata alıyorsunuz
```
Error: Plugin validation failed: Metadata validation failed
```

**Çözüm:**
```typescript
// Plugin metadata'sını kontrol edin
const meta: PluginMeta = {
  name: 'plugin-name', // Geçerli isim
  version: '1.0.0', // Semver formatında
  category: 'utility' // Geçerli kategori
};
```

### 2. Bağımlılık Çakışması

**Sorun:** Bağımlılık çakışması
```
Error: Cannot resolve dependency: storage
```

**Çözüm:**
```typescript
// Bağımlılıkları sırayla yükleyin
await registry.load('storage');
await registry.load('api');
await registry.load('ecommerce');
```

### 3. TypeScript Hataları

**Sorun:** TypeScript hataları
```
Property 'getPublicAPI' does not exist on type 'Plugin'
```

**Çözüm:**
```typescript
// Plugin type'ını kontrol edin
const plugin = registry.get('ecommerce');
if (plugin && plugin.getPublicAPI) {
  const api = plugin.getPublicAPI();
  // API'yi kullanın
}
```

## 📊 Performance İyileştirmeleri

### 1. Lazy Loading

```typescript
// Plugin'leri ihtiyaç duyulduğunda yükleyin
const loadPluginWhenNeeded = async (pluginName: string) => {
  const registry = await pluginSystem.getRegistry();
  if (!registry.isLoaded(pluginName)) {
    await registry.load(pluginName);
  }
  return registry.get(pluginName);
};
```

### 2. Plugin Caching

```typescript
// Plugin'leri cache'leyin
const pluginCache = new Map();

export async function getCachedPlugin(pluginName: string) {
  if (pluginCache.has(pluginName)) {
    return pluginCache.get(pluginName);
  }
  
  const registry = await pluginSystem.getRegistry();
  const plugin = registry.get(pluginName);
  pluginCache.set(pluginName, plugin);
  
  return plugin;
}
```

## 🔄 Gelecek Planları

### v1.1.0 (Planlanan)
- Plugin hot-reloading desteği
- Plugin marketplace entegrasyonu
- Gelişmiş plugin debugging araçları
- Plugin performans metrikleri

### v1.2.0 (Planlanan)
- Multi-tenant plugin desteği
- Plugin versioning sistemi
- Otomatik plugin güncelleme
- Plugin dependency resolver

## 📞 Destek

Migration ile ilgili sorularınız için:

- 📧 E-posta: migration@tdc.com
- 📚 Dokümantasyon: [docs.tdc.com/migration](https://docs.tdc.com/migration)
- 🐛 Bug Raporu: [GitHub Issues](https://github.com/tdc/issues/migration)
- 💬 Topluluk: [Discord #migration](https://discord.gg/tdc-migration)

---

**Son Güncelleme**: 2024-12-19  
**Versiyon**: 1.0.0

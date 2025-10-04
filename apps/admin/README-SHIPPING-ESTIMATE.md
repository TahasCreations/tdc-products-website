# TDC Market - Kargo & ETA Yönetim Sistemi

## Genel Bakış

TDC Market için geliştirilmiş kapsamlı kargo süresi yönetim sistemi. Stoklu ve el yapımı ürünler için farklı hazırlık sürelerini yönetir, bölge/taşıyıcı SLA'larını dikkate alır ve müşterilere doğru teslimat bilgileri sunar.

## Özellikler

### 🚚 Temel Kargo Yönetimi
- **Üretim Tipi**: Stoklu vs El Yapımı ürünler için farklı süreler
- **Tahmin Modu**: Sabit, Aralık veya Kural bazlı hesaplama
- **İş Günü Desteği**: Hafta sonu ve resmi tatil yönetimi
- **Cutoff Saati**: Günlük sipariş kesim saati kontrolü
- **Bölge Override**: Bölge bazlı özel kargo süreleri

### 📦 Varyant Yönetimi
- **Varyant ETA**: Her ürün varyantı için özel kargo ayarları
- **Inherit/Override**: Varyant bazlı ayar devralma veya geçersiz kılma
- **Toplu Düzenleme**: Çoklu varyant seçimi ve toplu ayar uygulama

### 🗺️ SLA Matris Sistemi
- **Bölge Bazlı**: TR-Domestic, EU, MENA, US, Other
- **Taşıyıcı Bazlı**: Yurtiçi, Aras, UPS, DHL, FedEx, PTT, MNG, Sürat
- **Posta Kodu Desteği**: Detaylı posta kodu pattern eşleştirme
- **Uzak Bölge Faktörü**: Uzak bölgeler için ek süre çarpanı

### 🏢 Çok Depo Sistemi
- **Depo Yönetimi**: Konum, cutoff saati, hafta sonu sevkiyat
- **Akıllı Tahsis**: En yakın/stoğu olan depo seçimi
- **Split Shipment**: Birden fazla paket ile gönderim
- **Stok Takibi**: Depo bazlı ürün stok yönetimi

### 📅 Tatil & Kampanya Takvimi
- **Resmi Tatiller**: Türkiye resmi tatil günleri
- **Özel Günler**: Şirket tatilleri ve özel etkinlikler
- **Kampanya Günleri**: Yoğunluk faktörü ile kapasite yönetimi
- **Tekrarlayan**: Yıllık tekrarlanan tatiller

### 📊 Analitik & Raporlama
- **On-time Delivery**: Zamanında teslimat oranı
- **Ortalama Sapma**: Gerçek vs tahmin edilen süre farkı
- **Taşıyıcı Performansı**: Kargo firması bazlı analiz
- **Bölgesel Analiz**: Bölge bazlı teslimat performansı

## Teknik Yapı

### Veritabanı Şeması

```prisma
model ShippingEstimate {
  id              String   @id @default(cuid())
  productId       String   @unique
  productionType  String   // stoklu | elyapimi
  estimateMode    String   // sabit | aralik | kural
  businessDays    Boolean  @default(true)
  weekendDispatch Boolean  @default(false)
  cutoffHour      Int      @default(16)
  fixedDays       Int?
  minDays         Int?
  maxDays         Int?
  regionOverrides Json?    // RegionOverride[]
  blackoutDates   Json?    // string[]
  capacityFactor  Float?   // 0.5-2.0
  dailyCapacity   Int?     // el yapımı için
  backlogUnits    Int?     // el yapımı için
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  product         Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model ProductVariant {
  id                        String   @id @default(cuid())
  productId                 String
  sku                       String
  name                      String
  attributes                Json?    // Renk, beden, malzeme vb.
  price                     Float?
  stock                     Int      @default(0)
  images                    Json?    // string[]
  shippingEstimateVariant   String   @default("inherit") // inherit | override
  shippingEstimate          Json?    // ShippingEstimateConfig
  isActive                  Boolean  @default(true)
  createdAt                 DateTime @default(now())
  updatedAt                 DateTime @updatedAt
  
  product                   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  orderItems                OrderItem[] @relation("OrderItemVariant")
}

model SlaMatrix {
  id        String   @id @default(cuid())
  scope     Json     // postalPattern/il/ilce/region
  carrier   String
  transitMin Int
  transitMax Int
  remoteAreaFactor Float?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Warehouse {
  id              String  @id @default(cuid())
  name            String
  code            String  @unique
  lat             Float
  lon             Float
  address         String
  city            String
  postalCode      String
  cutoffHour      Int     @default(16)
  weekendDispatch Boolean @default(false)
  isActive        Boolean @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  inventory       WarehouseInventory[]
  shipments       Shipment[]
}

model Holiday {
  id              String   @id @default(cuid())
  name            String
  date            String   // YYYY-MM-DD
  type            String   // resmi | özel | kampanya
  isRecurring     Boolean  @default(false)
  capacityFactor  Float    @default(1.0)
  description     String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### Ana Bileşenler

#### 1. ShippingEstimatePlugin
- **Dosya**: `apps/admin/components/product/ShippingEstimatePlugin.tsx`
- **Amaç**: Ürün formuna entegre kargo ayarları
- **Özellikler**: 
  - Üretim tipi seçimi
  - Tahmin modu konfigürasyonu
  - Bölge bazlı override'lar
  - Anlık önizleme

#### 2. VariantEtaEditor
- **Dosya**: `apps/admin/components/product/VariantEtaEditor.tsx`
- **Amaç**: Varyant bazlı ETA düzenleme
- **Özellikler**:
  - Inherit/Override seçimi
  - Toplu düzenleme
  - Preset uygulama

#### 3. SlaMatrixEditor
- **Dosya**: `apps/admin/components/shipping/SlaMatrixEditor.tsx`
- **Amaç**: SLA kuralları yönetimi
- **Özellikler**:
  - Bölge/taşıyıcı kombinasyonları
  - Posta kodu pattern'leri
  - CSV import/export

#### 4. WarehouseRulesEditor
- **Dosya**: `apps/admin/components/warehouse/WarehouseRulesEditor.tsx`
- **Amaç**: Depo yönetimi
- **Özellikler**:
  - Depo ekleme/düzenleme
  - Konum ve cutoff ayarları
  - Stok takibi

#### 5. HolidayCalendar
- **Dosya**: `apps/admin/components/shipping/HolidayCalendar.tsx`
- **Amaç**: Tatil takvimi yönetimi
- **Özellikler**:
  - Takvim görünümü
  - Tatil türleri
  - Kapasite faktörü ayarları

### API Endpoints

#### Kargo Ayarları
- `GET /api/shipping-estimate` - Tüm ayarları listele
- `POST /api/shipping-estimate` - Yeni ayar oluştur
- `PUT /api/shipping-estimate/[id]` - Ayar güncelle
- `DELETE /api/shipping-estimate/[id]` - Ayar sil

#### SLA Matrisi
- `GET /api/shipping/sla-matrix` - SLA kurallarını listele
- `POST /api/shipping/sla-matrix` - Yeni kural ekle
- `PUT /api/shipping/sla-matrix/[id]` - Kural güncelle
- `DELETE /api/shipping/sla-matrix/[id]` - Kural sil

#### Depo Yönetimi
- `GET /api/shipping/warehouses` - Depoları listele
- `POST /api/shipping/warehouses` - Yeni depo ekle
- `PUT /api/shipping/warehouses/[id]` - Depo güncelle
- `DELETE /api/shipping/warehouses/[id]` - Depo sil

#### Tatil Takvimi
- `GET /api/shipping/holidays` - Tatilleri listele
- `POST /api/shipping/holidays` - Yeni tatil ekle
- `PUT /api/shipping/holidays/[id]` - Tatil güncelle
- `DELETE /api/shipping/holidays/[id]` - Tatil sil

## Kullanım

### 1. Ürün Ekleme/Düzenleme
```typescript
// Ürün formunda ShippingEstimatePlugin kullanımı
<ShippingEstimatePlugin
  initialConfig={shippingConfig}
  onConfigChange={setShippingConfig}
  productName="Ürün Adı"
/>
```

### 2. Varyant Yönetimi
```typescript
// Varyant ETA düzenleme
<VariantEtaEditor
  variants={variants}
  onVariantsChange={setVariants}
  productName="Ürün Adı"
/>
```

### 3. SLA Matrisi
```typescript
// SLA kuralları yönetimi
<SlaMatrixEditor
  initialRules={slaRules}
  onRulesChange={setSlaRules}
/>
```

### 4. Depo Yönetimi
```typescript
// Depo yönetimi
<WarehouseRulesEditor
  initialWarehouses={warehouses}
  onWarehousesChange={setWarehouses}
/>
```

### 5. Tatil Takvimi
```typescript
// Tatil takvimi yönetimi
<HolidayCalendar
  initialHolidays={holidays}
  onHolidaysChange={setHolidays}
/>
```

## Hesaplama Mantığı

### Temel ETA Hesaplama
1. **Üretim Tipi Kontrolü**: Stoklu vs El Yapımı
2. **Tahmin Modu**: Sabit, Aralık veya Kural bazlı
3. **İş Günü Hesaplama**: Hafta sonu ve tatil kontrolü
4. **Cutoff Saati**: Günlük kesim saati kontrolü
5. **Bölge Override**: Özel bölge ayarları
6. **SLA Transit**: Taşıyıcı bazlı transit süresi
7. **Final ETA**: Tüm faktörlerin birleşimi

### Çok Depo Tahsisi
1. **Stok Kontrolü**: Hangi depoda stok var
2. **Konum Analizi**: Müşteriye en yakın depo
3. **Cutoff Kontrolü**: Depo bazlı cutoff saati
4. **Split Shipment**: Gerekirse birden fazla paket
5. **ETA Hesaplama**: Her paket için ayrı ETA

### Tatil Yönetimi
1. **Tatil Kontrolü**: Sipariş tarihinde tatil var mı
2. **Kapasite Faktörü**: Tatil günlerinde kapasite artışı
3. **İş Günü Hesaplama**: Tatilleri atlayarak hesaplama
4. **Tekrarlayan Tatiller**: Yıllık tekrarlanan tatiller

## Demo Sayfası

Tüm özellikleri test etmek için demo sayfası:
- **URL**: `/shipping-management`
- **Özellikler**: Tüm bileşenlerin canlı demo'su
- **Test Verisi**: Örnek ürünler, varyantlar, SLA kuralları
- **Interaktif**: Gerçek zamanlı değişiklik ve önizleme

## Gelecek Geliştirmeler

### Kısa Vadeli
- [ ] Storefront PDP bileşenleri
- [ ] Sepet/Checkout entegrasyonu
- [ ] Sipariş e-postalarında ETA
- [ ] JSON-LD SEO optimizasyonu

### Orta Vadeli
- [ ] Analitik dashboard
- [ ] Otomatik kalibrasyon
- [ ] Bildirim sistemi
- [ ] Mobile optimizasyon

### Uzun Vadeli
- [ ] AI destekli ETA tahmini
- [ ] Gerçek zamanlı takip
- [ ] Müşteri bildirimleri
- [ ] Performans optimizasyonu

## Destek

Herhangi bir sorun veya öneri için:
- **E-posta**: admin@tdcmarket.com
- **Dokümantasyon**: Bu README dosyası
- **Demo**: `/shipping-management` sayfası

---

**TDC Market Kargo Yönetim Sistemi v2.0**  
*Gelişmiş kargo süresi yönetimi ve müşteri memnuniyeti için tasarlandı*
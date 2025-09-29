# TDC Market - Real-time Sync Architecture

Bu dokümantasyon, TDC Market platformunun çift yönlü gerçek zamanlı senkronizasyon sisteminin mimarisini açıklar.

## Genel Bakış

Sistem, cloud (Vercel) ve local makine arasında sürekli, çift yönlü ve dayanıklı bir senkronizasyon sağlar:

- **Cloud → Local**: Admin panelinden yapılan değişiklikler anında local makineye yazılır
- **Local → Cloud**: Local'deki dosya/DB değişiklikleri anında siteye yansır
- **Dayanıklılık**: Tünel kapansa bile kuyruklayıp sonra işler
- **Çakışma Yönetimi**: LWW (Last Write Wins) + RevisionLog

## Mimari Bileşenler

### 1. Monorepo Yapısı

```
tdc-market/
├── apps/
│   ├── web/                 # Next.js Cloud App (Vercel)
│   └── agent/               # Local Sync Agent (Node.js)
├── packages/
│   └── sync-protocol/       # Ortak Sync Protokolü
└── docs/
```

### 2. Sync Protokolü (`packages/sync-protocol`)

#### Temel Tipler

```typescript
// Base entity
EntityBase = {
  id: string
  updatedAt: string (ISO datetime)
  rev: number (revision counter)
  updatedBy: 'cloud' | 'local'
  checksum: string (SHA256)
  deletedAt?: string | null
}

// Change operation
Change = {
  entity: 'product' | 'category'
  op: 'upsert' | 'delete'
  data: EntityBase & SpecificFields
}

// Batch of changes
ChangeBatch = {
  clientRev: number
  changes: Change[]
  clientId?: string
}
```

#### Çakışma Yönetimi

- **LWW (Last Write Wins)**: `updatedAt` zamanına göre karar
- **RevisionLog**: Tüm çakışmaları audit için kaydet
- **Checksum**: Veri bütünlüğü kontrolü

### 3. Cloud API (`apps/web`)

#### Endpoints

- `POST /api/sync/push` - Local'den gelen değişiklikleri al
- `GET /api/sync/pull` - Cloud'daki değişiklikleri gönder

#### Server Actions

Tüm CRUD işlemleri (`createProductAction`, `updateProductAction`, vb.) otomatik olarak:
1. Database'e yazar
2. Local agent'a push eder
3. Realtime event yayınlar
4. Cache'i revalidate eder

### 4. Local Agent (`apps/agent`)

#### Bileşenler

- **Express Server**: Sync API endpoints
- **File Watcher**: `data/` klasörünü izler
- **File Manager**: JSON dosyalarını yönetir
- **Sync Service**: Cloud ile senkronizasyon

#### Endpoints

- `POST /sync/push` - Cloud'dan gelen değişiklikleri uygula
- `GET /sync/pull` - Local değişiklikleri cloud'a gönder
- `POST /sync/initiate` - Manuel sync başlat

### 5. Bağlantı Katmanı

#### Cloudflare Tunnel

Local agent'ı internet üzerinden erişilebilir yapar:
```
local-api.your-domain.com → localhost:3001
```

#### Pusher/Ably

Gerçek zamanlı bildirimler:
- Cloud değişiklikleri → Pusher events
- Local UI güncellemeleri

#### Upstash Queue (Opsiyonel)

Tünel kapalıyken dayanıklılık:
- Cloud → Local gidemeyen değişiklikler queue'ya
- Tünel açılınca otomatik işleme

## Veri Akışı

### Cloud → Local

1. Admin panelinde değişiklik yapılır
2. Server Action database'e yazar
3. `syncClient.pushChanges()` local agent'a gönderir
4. Local agent dosyaya yazar
5. Pusher event yayınlanır

### Local → Cloud

1. Dosya değişikliği algılanır (chokidar)
2. `WatcherService` değişikliği parse eder
3. `Change` objesi oluşturur
4. Cloud `/api/sync/push` endpoint'ine gönderir
5. Cloud database'i günceller
6. Realtime event yayınlanır

### Çakışma Durumu

1. Her iki tarafta aynı entity değiştirilir
2. `resolveConflict()` LWW kuralını uygular
3. RevisionLog'a her iki versiyon kaydedilir
4. UI en son sürümü gösterir

## Kurulum ve Konfigürasyon

### 1. Environment Variables

```bash
# Cloud (apps/web/.env.local)
SYNC_TOKEN="your-secure-token"
LOCAL_AGENT_BASE="http://your-tunnel-url"
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"

# Local Agent (apps/agent/.env)
SYNC_TOKEN="your-secure-token"
CLOUD_SYNC_BASE="https://your-app.vercel.app"
DATA_DIR="./data"
LOG_LEVEL="INFO"
```

### 2. Cloudflare Tunnel

```bash
# Install cloudflared
npm install -g cloudflared

# Create tunnel
cloudflared tunnel create local-agent

# Configure tunnel
cloudflared tunnel route dns local-agent local-api.your-domain.com

# Run tunnel
cloudflared tunnel run local-agent
```

### 3. Pusher Setup

1. Pusher hesabı oluştur
2. App oluştur
3. Credentials'ları environment variables'a ekle

### 4. Başlatma

```bash
# Build sync protocol
npm run build:sync

# Start local agent
npm run dev:agent

# Start web app
npm run dev:web
```

## Test Senaryoları

### 1. Cloud → Local Test

1. Admin panelinden ürün oluştur
2. Local `data/products/` klasöründe dosya görünür
3. Agent logunda "applied from cloud" mesajı

### 2. Local → Cloud Test

1. Local'de `data/products/xxx.json` dosyasını değiştir
2. 3 saniye içinde site listesinde değişiklik görünür
3. Pusher event tetiklenir

### 3. Tünel Kapalı Test

1. Cloudflare tunnel'ı kapat
2. Cloud'da değişiklik yap
3. Değişiklik queue'ya gider
4. Tunnel açılınca otomatik işlenir

### 4. Çakışma Testi

1. Aynı ürünü aynı anda iki tarafta değiştir
2. LWW kuralı uygulanır
3. RevisionLog kaydı oluşur
4. UI en son sürümü gösterir

## Monitoring ve Logging

### Log Seviyeleri

- **ERROR**: Kritik hatalar
- **WARN**: Uyarılar (çakışmalar, bağlantı sorunları)
- **INFO**: Genel bilgiler (sync işlemleri)
- **DEBUG**: Detaylı debug bilgileri

### Metrikler

- Sync başarı oranı
- Çakışma sayısı
- Ortalama sync süresi
- Queue boyutu

## Güvenlik

### Authentication

- `x-sync-token` header ile doğrulama
- Rate limiting
- Request size limits

### Data Integrity

- SHA256 checksum doğrulaması
- Transaction-based operations
- Conflict resolution logging

## Troubleshooting

### Yaygın Sorunlar

1. **Tunnel bağlantı sorunu**: Cloudflared loglarını kontrol et
2. **Sync token hatası**: Environment variables'ı kontrol et
3. **File permission hatası**: Data directory permissions'ı kontrol et
4. **Pusher connection hatası**: Pusher credentials'ı kontrol et

### Debug Komutları

```bash
# Agent health check
curl http://localhost:3001/health/detailed

# Manual sync initiation
curl -X POST http://localhost:3001/sync/initiate \
  -H "x-sync-token: your-token"

# Check local changes
curl http://localhost:3001/sync/pull?sinceRev=0 \
  -H "x-sync-token: your-token"
```

## Gelecek Geliştirmeler

1. **Field-level merging**: CRDT benzeri alan bazlı birleştirme
2. **Multi-master sync**: Birden fazla local agent
3. **Conflict resolution UI**: Manuel çakışma çözümü arayüzü
4. **Sync analytics**: Detaylı sync metrikleri
5. **Backup & restore**: Otomatik backup sistemi

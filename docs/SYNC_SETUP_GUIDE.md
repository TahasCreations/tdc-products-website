# TDC Market Sync - Kurulum Rehberi

Bu rehber, TDC Market'in gerçek zamanlı senkronizasyon sistemini adım adım kurmanızı sağlar.

## Gereksinimler

- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL database
- Cloudflare hesabı (tunnel için)
- Pusher hesabı (realtime için)

## 1. Proje Kurulumu

### Repository'yi klonlayın

```bash
git clone <repository-url>
cd tdc-market
```

### Bağımlılıkları yükleyin

```bash
# Root dependencies
npm install

# Build sync protocol
npm run build:sync
```

## 2. Environment Variables

### Cloud App (apps/web)

`.env.local` dosyası oluşturun:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/tdc_market"

# Authentication
AUTH_SECRET="your-very-secure-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="secure-admin-password"

# Sync Configuration
SYNC_TOKEN="your-super-secure-sync-token-here"
LOCAL_AGENT_BASE="https://your-tunnel-domain.com"

# Real-time
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="eu"

# Environment
NODE_ENV="development"
```

### Local Agent (apps/agent)

`.env` dosyası oluşturun:

```bash
# Sync Configuration
SYNC_TOKEN="your-super-secure-sync-token-here"
CLOUD_SYNC_BASE="https://your-app.vercel.app"

# Local Configuration
DATA_DIR="./data"
LOG_LEVEL="INFO"
PORT="3001"

# Environment
NODE_ENV="development"
```

## 3. Database Kurulumu

### PostgreSQL Setup

```bash
# Create database
createdb tdc_market

# Run migrations
cd apps/web
npx prisma migrate dev

# Seed initial data
npx prisma db seed
```

### Prisma Schema

Prisma şeması sync alanları ile güncellenmiştir:

```prisma
model Product {
  // ... existing fields
  
  // Sync fields
  rev         Int       @default(1)
  updatedBy   UpdatedBy @default(CLOUD)
  checksum    String    @default("")
  deletedAt   DateTime?
}

model Category {
  // ... existing fields
  
  // Sync fields
  rev         Int       @default(1)
  updatedBy   UpdatedBy @default(CLOUD)
  checksum    String    @default("")
  deletedAt   DateTime?
}
```

## 4. Cloudflare Tunnel Kurulumu

### cloudflared Kurulumu

```bash
# Windows (PowerShell)
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"

# macOS
brew install cloudflared

# Linux
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
chmod +x cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared
```

### Tunnel Oluşturma

```bash
# Cloudflare'e login
cloudflared tunnel login

# Tunnel oluştur
cloudflared tunnel create local-agent

# DNS kaydı ekle
cloudflared tunnel route dns local-agent local-api.your-domain.com
```

### Tunnel Konfigürasyonu

`~/.cloudflared/config.yml`:

```yaml
tunnel: local-agent
credentials-file: /path/to/your/credentials.json

ingress:
  - hostname: local-api.your-domain.com
    service: http://localhost:3001
  - service: http_status:404
```

### Tunnel Başlatma

```bash
# Development
cloudflared tunnel run local-agent

# Production (service olarak)
cloudflared tunnel --config ~/.cloudflared/config.yml run
```

## 5. Pusher Kurulumu

### Hesap Oluşturma

1. [Pusher](https://pusher.com) hesabı oluşturun
2. Yeni app oluşturun
3. Credentials'ları alın

### App Konfigürasyonu

```javascript
// Pusher client configuration
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER || 'eu',
  useTLS: true
})
```

## 6. Uygulamaları Başlatma

### Local Agent

```bash
# Terminal 1
cd apps/agent
npm install
npm run dev

# Output:
# 🚀 Local sync agent running on http://localhost:3001
# 👀 File watcher started
```

### Web App

```bash
# Terminal 2
cd apps/web
npm install
npm run dev

# Output:
# ▲ Next.js 14.2.33
# - Local: http://localhost:3000
```

### Tunnel

```bash
# Terminal 3
cloudflared tunnel run local-agent

# Output:
# 2024-01-01T12:00:00Z INF | Your tunnel is running! Visit it at (https://local-api.your-domain.com)
```

## 7. Test Etme

### Health Check

```bash
# Local agent health
curl http://localhost:3001/health

# Cloud app health
curl http://localhost:3000/api/health
```

### Sync Test

#### Cloud → Local Test

1. Admin paneline gidin: `http://localhost:3000/admin`
2. Yeni ürün oluşturun
3. `apps/agent/data/products/` klasöründe dosya oluştuğunu kontrol edin

#### Local → Cloud Test

1. `apps/agent/data/products/` klasöründe JSON dosyası oluşturun
2. 3 saniye içinde web sitesinde değişikliği gözlemleyin

#### Çakışma Testi

1. Aynı ürünü hem admin panelinde hem local'de değiştirin
2. LWW kuralının uygulandığını kontrol edin

## 8. Production Deployment

### Vercel Deployment

```bash
# Vercel CLI kurulumu
npm install -g vercel

# Deploy
cd apps/web
vercel --prod

# Environment variables'ı Vercel'de ayarlayın
```

### Local Agent as Service

#### Windows (PowerShell)

```powershell
# Service oluştur
New-Service -Name "TDC-Sync-Agent" -BinaryPathName "node C:\path\to\tdc-market\apps\agent\dist\index.js" -StartupType Automatic

# Service başlat
Start-Service "TDC-Sync-Agent"
```

#### Linux (systemd)

```bash
# Service dosyası oluştur
sudo nano /etc/systemd/system/tdc-sync-agent.service
```

```ini
[Unit]
Description=TDC Sync Agent
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/tdc-market/apps/agent
ExecStart=/usr/bin/node dist/index.js
Restart=always
Environment=NODE_ENV=production
Environment=DATA_DIR=/path/to/data
Environment=SYNC_TOKEN=your-token
Environment=CLOUD_SYNC_BASE=https://your-app.vercel.app

[Install]
WantedBy=multi-user.target
```

```bash
# Service'i etkinleştir
sudo systemctl enable tdc-sync-agent
sudo systemctl start tdc-sync-agent
```

## 9. Monitoring

### Log Monitoring

```bash
# Agent logs
tail -f apps/agent/logs/app.log

# Real-time sync status
curl http://localhost:3001/health/detailed
```

### Pusher Dashboard

1. Pusher dashboard'a gidin
2. App'inizi seçin
3. "Debug Console" sekmesinde events'leri izleyin

### Cloudflare Analytics

1. Cloudflare dashboard'a gidin
2. Tunnel'ınızı seçin
3. Analytics sekmesinde trafiği izleyin

## 10. Troubleshooting

### Yaygın Sorunlar

#### Tunnel Bağlantı Sorunu

```bash
# Tunnel status kontrol
cloudflared tunnel info local-agent

# Log kontrol
cloudflared tunnel run local-agent --loglevel debug
```

#### Sync Token Hatası

```bash
# Token'ların eşleştiğini kontrol edin
echo $SYNC_TOKEN  # Local
# Vercel dashboard'da CLOUD_SYNC_TOKEN'ı kontrol edin
```

#### File Permission Hatası

```bash
# Data directory permissions
chmod 755 apps/agent/data
chmod 644 apps/agent/data/products/*
chmod 644 apps/agent/data/categories/*
```

#### Database Connection Hatası

```bash
# Database connection test
cd apps/web
npx prisma db pull
npx prisma generate
```

### Debug Komutları

```bash
# Manual sync
curl -X POST http://localhost:3001/sync/initiate \
  -H "x-sync-token: your-token"

# Check local changes
curl "http://localhost:3001/sync/pull?sinceRev=0" \
  -H "x-sync-token: your-token"

# Test cloud endpoints
curl "https://your-app.vercel.app/api/sync/pull?sinceRev=0" \
  -H "x-sync-token: your-token"
```

## 11. Güvenlik

### Sync Token

- En az 32 karakter
- Random string oluşturun
- Her iki tarafta aynı olmalı

### Network Security

- HTTPS kullanın (Cloudflare tunnel otomatik sağlar)
- Rate limiting aktif
- Request size limits

### Data Security

- Checksum doğrulaması aktif
- Transaction-based operations
- Conflict resolution logging

## 12. Backup

### Otomatik Backup

```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "backup_$DATE.tar.gz" apps/agent/data/
```

### Cron Job

```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup-script.sh
```

Bu rehberi takip ederek TDC Market'in gerçek zamanlı senkronizasyon sistemini başarıyla kurabilirsiniz. Herhangi bir sorun yaşarsanız, troubleshooting bölümünü kontrol edin veya GitHub issues'da yardım isteyin.

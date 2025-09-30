# TDC Market Dev Container

Bu Dev Container yapılandırması, TDC Market projesini geliştirmek için gerekli tüm araçları ve bağımlılıkları içerir.

## 🚀 Özellikler

### Geliştirme Araçları
- **Node.js 20** - JavaScript runtime
- **pnpm 8** - Hızlı paket yöneticisi
- **Prisma CLI** - Database ORM
- **MeiliSearch CLI** - Arama motoru
- **AWS CLI** - AWS servisleri
- **PostgreSQL Client** - Veritabanı bağlantısı
- **Redis Tools** - Cache yönetimi

### VS Code Uzantıları
- **ESLint** - Kod kalitesi
- **Prettier** - Kod formatlama
- **Prisma** - Database yönetimi
- **GitHub Copilot** - AI kod asistanı
- **Tailwind CSS** - CSS framework
- **TypeScript** - Tip güvenliği
- **Docker** - Container yönetimi
- **Kubernetes** - K8s yönetimi
- **GitHub Actions** - CI/CD

## 📦 Kurulum

### 1. VS Code Dev Containers Uzantısı
```bash
code --install-extension ms-vscode-remote.remote-containers
```

### 2. Dev Container'ı Aç
1. VS Code'da projeyi aç
2. `Ctrl+Shift+P` → "Dev Containers: Reopen in Container"
3. Container otomatik olarak build edilir ve başlatılır

### 3. Otomatik Kurulum
Container açıldığında otomatik olarak:
- `pnpm install` - Tüm bağımlılıklar yüklenir
- `pnpm build` - Proje build edilir
- PostgreSQL ve Redis servisleri başlatılır

## 🔧 Kullanım

### Geliştirme Sunucuları
```bash
# Tüm servisleri başlat
pnpm dev

# Sadece API Gateway
pnpm dev --filter=@tdc/api-gateway

# Sadece Web Storefront
pnpm dev --filter=@tdc/web-storefront

# Sadece Web Admin
pnpm dev --filter=@tdc/web-admin
```

### Veritabanı İşlemleri
```bash
# Prisma migration oluştur
pnpm db:migrate

# Veritabanını sıfırla
pnpm db:migrate:reset

# Prisma Studio'yu aç
pnpm db:studio
```

### Test ve Lint
```bash
# Tüm testleri çalıştır
pnpm test

# Lint kontrolü
pnpm lint

# Kod formatla
pnpm format
```

## 🌐 Portlar

| Servis | Port | Açıklama |
|--------|------|----------|
| Web Storefront | 3000 | Müşteri arayüzü |
| Web Admin | 3001 | Yönetici paneli |
| API Gateway | 3002 | Backend API |
| PostgreSQL | 5432 | Veritabanı |
| Redis | 6379 | Cache |

## 🗄️ Veritabanı

### Bağlantı Bilgileri
```bash
Host: localhost
Port: 5432
Database: tdc_market
Username: postgres
Password: postgres
```

### Prisma Komutları
```bash
# Schema'yı veritabanına uygula
npx prisma db push

# Migration oluştur
npx prisma migrate dev --name init

# Veritabanını sıfırla
npx prisma migrate reset
```

## 🔍 Arama

### MeiliSearch
```bash
# MeiliSearch'i başlat
meilisearch --master-key=masterKey

# Index oluştur
curl -X POST 'http://localhost:7700/indexes' \
  -H 'Authorization: Bearer masterKey' \
  -H 'Content-Type: application/json' \
  --data-binary '{"uid": "products", "primaryKey": "id"}'
```

## ☁️ AWS CLI

### Yapılandırma
```bash
# AWS kimlik bilgilerini yapılandır
aws configure

# S3 bucket listele
aws s3 ls

# S3'e dosya yükle
aws s3 cp file.txt s3://bucket-name/
```

## 🐳 Docker

### Geliştirme
```bash
# Tüm servisleri başlat
docker-compose -f docker-compose.dev.yml up -d

# Logları görüntüle
docker-compose -f docker-compose.dev.yml logs -f

# Servisleri durdur
docker-compose -f docker-compose.dev.yml down
```

## 📝 Notlar

- Container her açıldığında `pnpm install && pnpm build` otomatik çalışır
- PostgreSQL ve Redis servisleri otomatik başlatılır
- Tüm portlar otomatik olarak forward edilir
- VS Code uzantıları otomatik yüklenir
- Kod formatlama ve linting otomatik çalışır

## 🚨 Sorun Giderme

### Container Build Hatası
```bash
# Container'ı temizle
docker system prune -a

# Dev container'ı yeniden build et
Ctrl+Shift+P → "Dev Containers: Rebuild Container"
```

### Port Çakışması
```bash
# Port kullanımını kontrol et
lsof -i :3000
lsof -i :3001
lsof -i :3002

# Port'u öldür
kill -9 <PID>
```

### Veritabanı Bağlantı Hatası
```bash
# PostgreSQL servisini kontrol et
docker-compose -f .devcontainer/docker-compose.yml ps

# Servisleri yeniden başlat
docker-compose -f .devcontainer/docker-compose.yml restart
```


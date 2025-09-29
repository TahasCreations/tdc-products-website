# 🚀 TDC Local Server Kurulum Rehberi

Bu rehber, TDC Market platformunu kendi bilgisayarınızda local server olarak çalıştırmanız için gerekli tüm adımları içerir.

## 📋 Ön Gereksinimler

### 1. Yazılım Gereksinimleri
- **Node.js**: v18.0.0 veya üzeri
- **Docker**: v20.0.0 veya üzeri
- **Docker Compose**: v2.0.0 veya üzeri
- **PostgreSQL**: v15.0.0 veya üzeri (Docker ile)
- **Git**: v2.30.0 veya üzeri

### 2. Sistem Gereksinimleri
- **RAM**: Minimum 4GB (Önerilen: 8GB)
- **Disk**: Minimum 10GB boş alan
- **İşletim Sistemi**: Windows 10+, macOS 10.15+, Ubuntu 18.04+

## 🛠️ Kurulum Adımları

### Adım 1: Projeyi İndirin
```bash
git clone https://github.com/TahasCreations/tdc-products-website.git
cd tdc-products-website
```

### Adım 2: Environment Dosyasını Hazırlayın
```bash
cp env.local.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
# Database Configuration
POSTGRES_DB=tdc_database
POSTGRES_USER=tdc_user
POSTGRES_PASSWORD=tdc_password_123
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# File Storage
DATA_DIR=./data
BACKUP_DIR=./backups
```

### Adım 3: Otomatik Kurulum (Önerilen)
```bash
npm run setup:local-server
```

Bu komut şunları yapar:
- Gerekli klasörleri oluşturur
- Docker servislerini başlatır
- Database migration'ı çalıştırır
- Dependencies'leri yükler
- Production build oluşturur

### Adım 4: Manuel Kurulum (Alternatif)

#### 4.1. Klasörleri Oluşturun
```bash
mkdir -p data logs backups public/uploads
```

#### 4.2. Docker Servislerini Başlatın
```bash
npm run docker:up
```

#### 4.3. Database Migration'ı Çalıştırın
```bash
npm run db:migrate
```

#### 4.4. Dependencies'leri Yükleyin
```bash
npm install
```

#### 4.5. Production Build Oluşturun
```bash
npm run build
```

## 🚀 Server'ı Başlatma

### Development Mode
```bash
npm run server:dev
```

### Production Mode
```bash
npm run server:start
```

### Docker ile Başlatma
```bash
docker-compose up -d
```

## 📊 Sistem Durumunu Kontrol Etme

```bash
npm run server:status
```

Bu komut şunları kontrol eder:
- Database bağlantısı
- File storage durumu
- Backup durumu
- Environment variables

## 💾 Backup ve Yedekleme

### Otomatik Backup
```bash
npm run backup
```

### Manuel Backup
```bash
tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz data/
```

### Backup Geri Yükleme
```bash
tar -xzf backup_20241229_143022.tar.gz
```

## 🔧 Yönetim Komutları

### Docker Servisleri
```bash
# Servisleri başlat
npm run docker:up

# Servisleri durdur
npm run docker:down

# Logları görüntüle
npm run docker:logs

# Servisleri yeniden başlat
npm run docker:restart
```

### Database İşlemleri
```bash
# Migration çalıştır
npm run db:migrate

# Database'i sıfırla
npm run db:reset

# Database'e bağlan
psql -h localhost -U tdc_user -d tdc_database
```

### Log İşlemleri
```bash
# Real-time logları görüntüle
npm run server:logs

# Log dosyasını temizle
> logs/app.log
```

## 🌐 Erişim Adresleri

- **Ana Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **API Endpoints**: http://localhost:3000/api
- **Database**: localhost:5432
- **Redis**: localhost:6379

## 📁 Klasör Yapısı

```
tdc-products-website/
├── data/                    # Veri dosyaları
│   ├── products.json
│   ├── categories.json
│   ├── orders.json
│   └── backups/
├── logs/                    # Log dosyaları
├── backups/                 # Yedek dosyaları
├── public/uploads/          # Yüklenen dosyalar
├── database/                # Database şemaları
├── scripts/                 # Yönetim scriptleri
└── docs/                    # Dokümantasyon
```

## 🔍 Sorun Giderme

### Database Bağlantı Hatası
```bash
# PostgreSQL'in çalıştığını kontrol et
docker-compose ps

# Database loglarını kontrol et
docker-compose logs postgres

# Database'i yeniden başlat
docker-compose restart postgres
```

### Port Çakışması
```bash
# Kullanılan portları kontrol et
netstat -tulpn | grep :3000
netstat -tulpn | grep :5432

# Farklı port kullan
PORT=3001 npm run start
```

### Disk Alanı Sorunu
```bash
# Disk kullanımını kontrol et
df -h

# Log dosyalarını temizle
find logs/ -name "*.log" -mtime +7 -delete

# Eski backup'ları sil
find backups/ -name "*.tar.gz" -mtime +30 -delete
```

### Memory Sorunu
```bash
# Memory kullanımını kontrol et
free -h

# Docker memory limit'i artır
# docker-compose.yml dosyasında:
# mem_limit: 2g
```

## 🔒 Güvenlik

### Firewall Ayarları
```bash
# Sadece localhost'tan erişim
sudo ufw allow from 127.0.0.1 to any port 3000
sudo ufw allow from 127.0.0.1 to any port 5432
```

### SSL Sertifikası (Opsiyonel)
```bash
# Let's Encrypt ile SSL
certbot certonly --standalone -d yourdomain.com
```

## 📈 Performans Optimizasyonu

### Database Optimizasyonu
```sql
-- Index'leri kontrol et
SELECT schemaname, tablename, indexname FROM pg_indexes;

-- Slow query'leri analiz et
SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC;
```

### Memory Optimizasyonu
```bash
# Node.js memory limit'i artır
NODE_OPTIONS="--max-old-space-size=4096" npm run start
```

## 🆘 Yardım ve Destek

### Log Dosyalarını İnceleme
```bash
# Application logları
tail -f logs/app.log

# Docker logları
docker-compose logs -f tdc-website

# System logları
journalctl -u docker -f
```

### Debug Mode
```bash
DEBUG=* npm run server:dev
```

### Performance Profiling
```bash
# CPU profiling
node --prof server.js

# Memory profiling
node --inspect server.js
```

## 📞 İletişim

Herhangi bir sorun yaşarsanız:
1. Önce bu rehberi tekrar okuyun
2. Log dosyalarını kontrol edin
3. GitHub Issues'da sorun bildirin
4. Discord sunucumuza katılın

---

**Not**: Bu local server sadece development ve test amaçlıdır. Production kullanımı için ek güvenlik önlemleri alınmalıdır.

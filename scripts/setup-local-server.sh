#!/bin/bash

# TDC Local Server Setup Script
# Bu script local server sistemini kurar ve başlatır

echo "🚀 TDC Local Server Kurulum Başlıyor..."

# Gerekli klasörleri oluştur
echo "📁 Klasörler oluşturuluyor..."
mkdir -p data
mkdir -p logs
mkdir -p backups
mkdir -p public/uploads

# Environment dosyasını kopyala
echo "⚙️ Environment dosyası hazırlanıyor..."
if [ ! -f .env.local ]; then
    cp env.local.example .env.local
    echo "✅ .env.local dosyası oluşturuldu"
    echo "⚠️ Lütfen .env.local dosyasındaki değerleri düzenleyin!"
else
    echo "ℹ️ .env.local dosyası zaten mevcut"
fi

# Docker Compose ile servisleri başlat
echo "🐳 Docker servisleri başlatılıyor..."
docker-compose up -d postgres redis

# PostgreSQL'in hazır olmasını bekle
echo "⏳ PostgreSQL'in hazır olması bekleniyor..."
sleep 10

# Database migration'ı çalıştır
echo "🗄️ Database migration çalıştırılıyor..."
if command -v psql &> /dev/null; then
    PGPASSWORD=tdc_password psql -h localhost -U tdc_user -d tdc_database -f database/schema.sql
    echo "✅ Database migration tamamlandı"
else
    echo "⚠️ psql bulunamadı. Manuel olarak migration çalıştırın:"
    echo "PGPASSWORD=tdc_password psql -h localhost -U tdc_user -d tdc_database -f database/schema.sql"
fi

# NPM dependencies'leri yükle
echo "📦 NPM dependencies yükleniyor..."
npm install

# Production build
echo "🔨 Production build oluşturuluyor..."
npm run build

echo "🎉 Local Server kurulumu tamamlandı!"
echo ""
echo "📋 Sonraki adımlar:"
echo "1. .env.local dosyasını düzenleyin"
echo "2. 'npm run start' ile serveri başlatın"
echo "3. http://localhost:3000 adresine gidin"
echo ""
echo "🔧 Yönetim komutları:"
echo "- Server başlat: npm run start"
echo "- Docker servisleri: docker-compose up -d"
echo "- Logları görüntüle: docker-compose logs -f"
echo "- Backup oluştur: npm run backup"
echo "- Database reset: npm run db:reset"

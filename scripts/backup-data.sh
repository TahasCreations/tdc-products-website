#!/bin/bash

# TDC Data Backup Script
# Verileri yedekler ve eski yedekleri temizler

BACKUP_DIR="./backups"
DATA_DIR="./data"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="tdc_backup_${TIMESTAMP}.tar.gz"

echo "💾 TDC Data Backup Başlıyor..."

# Backup klasörünü oluştur
mkdir -p "$BACKUP_DIR"

# Data klasörünü yedekle
if [ -d "$DATA_DIR" ]; then
    echo "📦 Veriler yedekleniyor..."
    tar -czf "$BACKUP_DIR/$BACKUP_FILE" -C . data/
    echo "✅ Backup oluşturuldu: $BACKUP_DIR/$BACKUP_FILE"
    
    # Backup boyutunu göster
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    echo "📊 Backup boyutu: $BACKUP_SIZE"
else
    echo "❌ Data klasörü bulunamadı: $DATA_DIR"
    exit 1
fi

# Eski yedekleri temizle (30 günden eski)
echo "🧹 Eski yedekler temizleniyor..."
find "$BACKUP_DIR" -name "tdc_backup_*.tar.gz" -type f -mtime +30 -delete
echo "✅ 30 günden eski yedekler silindi"

# Mevcut yedekleri listele
echo ""
echo "📋 Mevcut yedekler:"
ls -lah "$BACKUP_DIR"/tdc_backup_*.tar.gz 2>/dev/null || echo "Henüz yedek yok"

echo ""
echo "🎉 Backup işlemi tamamlandı!"

# 🚀 Hızlı Başlangıç - Veri Temizleme

## ⚡ 3 Adımda Temizlik

### Adım 1: Veritabanı Bağlantısını Kontrol Edin

`.env.local` dosyanızda aşağıdaki gibi bir bağlantı olmalı:

```env
DATABASE_URL=postgresql://user:password@host:port/database
# veya
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```

### Adım 2: Yedek Alın (ÖNEMLİ!)

**Supabase kullanıyorsanız:**
1. Supabase Dashboard → Settings → Database → Database Backups
2. "Start a backup" butonuna tıklayın

**Lokal PostgreSQL kullanıyorsanız:**
```bash
pg_dump -h localhost -U postgres -d tdc_database -F c -f backup_$(date +%Y%m%d_%H%M%S).dump
```

### Adım 3: Temizlemeyi Çalıştırın

#### Seçenek A: Supabase SQL Editor (EN KOLAY) ✨

1. **Supabase Dashboard'a gidin**
2. **SQL Editor'ı açın**
3. **`COMPREHENSIVE-DATA-CLEANUP.sql` dosyasını açın**
4. **Tüm içeriği kopyalayın ve SQL Editor'a yapıştırın**
5. **"Run" butonuna tıklayın**
6. **İşlemin tamamlanmasını bekleyin** (2-10 dakika)

#### Seçenek B: Node.js Script (İNTERAKTİF) 🤖

```bash
# 1. Bağımlılıkları kurun (gerekiyorsa)
npm install pg dotenv

# 2. Scripti çalıştırın
node cleanup-database.js

# 3. Ekrandaki talimatları takip edin
```

#### Seçenek C: Terminal Komutu (HIZLI) ⚡

**Windows PowerShell:**
```powershell
# Supabase
$env:PGPASSWORD="your_password"
psql -h db.xxxxx.supabase.co -U postgres -d postgres -f COMPREHENSIVE-DATA-CLEANUP.sql

# Lokal
$env:PGPASSWORD="your_password"
psql -h localhost -U postgres -d tdc_database -f COMPREHENSIVE-DATA-CLEANUP.sql
```

**Linux/Mac:**
```bash
# Supabase
PGPASSWORD='your_password' psql -h db.xxxxx.supabase.co -U postgres -d postgres -f COMPREHENSIVE-DATA-CLEANUP.sql

# Lokal
PGPASSWORD='your_password' psql -h localhost -U postgres -d tdc_database -f COMPREHENSIVE-DATA-CLEANUP.sql
```

## ✅ Doğrulama

Temizlik tamamlandıktan sonra:

```sql
-- Supabase SQL Editor'da veya psql'de çalıştırın
SELECT COUNT(*) FROM products; -- 0 olmalı
SELECT COUNT(*) FROM orders; -- 0 olmalı
SELECT COUNT(*) FROM customers; -- 0 olmalı
SELECT COUNT(*) FROM admin_users; -- 1 olmalı (sizin admin hesabınız)
```

## 🎉 Tamamlandı!

Artık veritabanınız tamamen temiz ve yeni veriler eklemeye hazır!

## ❓ Sorun mu Yaşıyorsunuz?

1. **"permission denied" hatası**
   - Süper kullanıcı (postgres) ile bağlanın
   
2. **"relation does not exist" hatası**
   - Normal, bazı tablolar mevcut değil
   - Script otomatik olarak atlar

3. **İşlem çok uzun sürüyor**
   - Normal, büyük veritabanları için 10-15 dakika sürebilir
   - Bağlantınızın kesilmediğinden emin olun

4. **Yardıma mı ihtiyacınız var?**
   - `EXECUTE-DATA-CLEANUP.md` dosyasına bakın
   - Detaylı sorun giderme rehberi içerir

---

**💡 İpucu:** İlk kez yapıyorsanız Seçenek A'yı (Supabase SQL Editor) öneririz!


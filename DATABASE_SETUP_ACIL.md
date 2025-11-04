# 🚨 ACİL: Database Bağlantı Hatası Çözümü

## SORUN
```
Invalid `prisma.user.findUnique()` invocation:
Error querying the database: Error code 14: Unable to open the database file
```

**Sebep:** Sistem şu anda SQLite kullanıyor ama Google Cloud SQL PostgreSQL'e geçmemiz gerekiyor.

---

## ✅ HIZLI ÇÖZÜM: Vercel'de DATABASE_URL Ekleyin

### ADIM 1: Vercel'de Environment Variable Ekleyin

1. **Vercel Dashboard'a gidin:**
   ```
   https://vercel.com/tahas-projects/tdc-products-website/settings/environment-variables
   ```

2. **Yeni Environment Variable Ekleyin:**
   ```
   Name: DATABASE_URL
   Value: postgresql://tdc_admin:[GOOGLE_CLOUD_SIFRE]@[GOOGLE_CLOUD_IP]:5432/tdc_products?sslmode=require&connection_limit=10
   
   ⚠️ [GOOGLE_CLOUD_SIFRE] ve [GOOGLE_CLOUD_IP] yerlerine gerçek değerlerinizi yazın!
   
   Örnek:
   postgresql://tdc_admin:MyStr0ng%23Pass@34.89.254.41:5432/tdc_products?sslmode=require&connection_limit=10
   ```

3. **Environment seçin:**
   - ✅ Production
   - ✅ Preview  
   - ✅ Development

4. **Save** butonuna tıklayın

### ADIM 2: Yeniden Deploy Tetikleyin

Vercel otomatik deploy başlatacak VEYA:

```bash
git commit --allow-empty -m "trigger: redeploy for database connection"
git push origin main
```

---

## 📋 GOOGLE CLOUD SQL BİLGİLERİNİZ (Hatırlama)

Daha önce kurduğunuz Google Cloud SQL instance bilgileri:

```
Database Name: tdc_products
User: tdc_admin
Password: [Google Cloud Console'da oluşturduğunuz şifre]
IP: [Google Cloud SQL instance'ınızın Public IP'si]
```

### Bilgileri Nasıl Bulursunuz?

1. **Google Cloud Console'a gidin:**
   ```
   https://console.cloud.google.com/sql
   ```

2. **SQL Instance'ınıza tıklayın** (örn: `tdc-products-db`)

3. **Overview** sekmesinde:
   - ✅ **Public IP address** → [IP]
   - ✅ **Database version** → PostgreSQL 15

4. **Users** sekmesinde:
   - ✅ `tdc_admin` kullanıcısı
   - ⚠️ Şifreyi unuttaysanız "Change password" ile sıfırlayın

---

## 🔧 LOKAL GELİŞTİRME İÇİN

Lokal bilgisayarınızda test etmek için `.env` dosyası oluşturun:

```bash
# Proje root dizininde:
echo DATABASE_URL="postgresql://tdc_admin:[SIFRE]@[IP]:5432/tdc_products?sslmode=require&connection_limit=10" > .env
```

Sonra migration çalıştırın:

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

---

## ✅ DOĞRULAMA

Database bağlantısı çalışıyor mu test edin:

```bash
npm run db:test
```

Çıktı:
```
✅ Database bağlantısı başarılı!
✅ User tablosu: X kayıt
✅ Product tablosu: X kayıt
🎉 TÜM TESTLER BAŞARILI!
```

---

## 🚨 SORUN DEVAM EDİYORSA

### 1️⃣ Google Cloud SQL Firewall Kontrolü

```bash
# Google Cloud Console → SQL → Connections → Networking
# Authorized networks'e ekleyin:
0.0.0.0/0  (tüm IP'ler - test için)

# Veya sadece Vercel IP'lerini:
76.76.21.0/24
```

### 2️⃣ Database User Yetkilerini Kontrol Edin

```sql
-- Google Cloud SQL Console → SQL Shell
GRANT ALL PRIVILEGES ON DATABASE tdc_products TO tdc_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tdc_admin;
```

### 3️⃣ Connection String Formatını Kontrol Edin

```bash
# ✅ DOĞRU:
postgresql://tdc_admin:MyPass123@34.89.254.41:5432/tdc_products?sslmode=require

# ❌ YANLIŞ (şifrede özel karakter varsa encode edin):
# → %23 (#)
# → %40 (@)
# → %21 (!)

# Özel karakterli şifre örneği:
# Şifre: MyPass#123
# Encoded: MyPass%23123
postgresql://tdc_admin:MyPass%23123@34.89.254.41:5432/tdc_products?sslmode=require
```

---

## 📞 HIZLI DESTEK

Hala sorun mu var?

1. **Vercel Logs kontrol edin:**
   ```
   https://vercel.com/tahas-projects/tdc-products-website/deployments
   → Son deployment → Runtime Logs
   ```

2. **Database bağlantı hatasını arayın:**
   ```
   "ECONNREFUSED"  → IP/Port yanlış veya firewall
   "authentication failed" → Kullanıcı adı/şifre yanlış
   "database does not exist" → Database adı yanlış
   ```

---

## 🎯 ŞİMDİ NE YAPMALISINIZ?

```
1. ✅ Vercel'de DATABASE_URL ekleyin (yukarıdaki format)
2. ✅ Save ve bekleyin (otomatik deploy)
3. ✅ 3-5 dakika sonra https://www.tdcproductsonline.com/kayit test edin
4. ✅ Kayıt ol → Artık çalışmalı!
```

**DATABASE_URL eklenmeden sistem çalışmaz!** 🚨


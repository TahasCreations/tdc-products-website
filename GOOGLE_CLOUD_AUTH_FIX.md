# 🔐 Google Cloud SQL Authentication Sorunu - Kesin Çözüm

## DURUM: SÜPER İYİ HABER!
```
✅ PostgreSQL'e bağlanıyor! (SQLite değil!)
✅ Firewall açık! (sunucuya ulaşıyor!)
✅ IP doğru: 34.230.67.57
❌ AMA: Kullanıcı adı/şifre veya yetki sorunu!
```

## HATA
```
Invalid `prisma.user.findUnique()` invocation:
User was denied access on the database `34.230.67.57`
```

**SEBEP:** 
1. Kullanıcı adı veya şifre yanlış
2. Veya kullanıcının database'e yetkisi yok
3. Veya DATABASE_URL'de yanlış bilgiler var

---

## ✅ KEİSN ÇÖZÜM - ADIM ADIM

### 1️⃣ Google Cloud SQL User Kontrolü

**A) Google Cloud Console'a Gidin:**
```
https://console.cloud.google.com/sql
```

**B) SQL Instance'ınızı Seçin:**
```
→ Instance'ınıza tıklayın
```

**C) USERS Sekmesine Gidin:**
```
Sol menüden: USERS
```

**D) Kullanıcıları Kontrol Edin:**
```
Listede şunlar olmalı:
✅ postgres (default user)
✅ tdc_admin (sizin user'ınız)

Eğer tdc_admin YOK ise:
→ CREATE USER ACCOUNT butonuna tıklayın
```

### 2️⃣ tdc_admin Kullanıcısını Oluşturun/Güncelleyin

**A) Yeni Kullanıcı Oluştur (Eğer Yok İse):**
```
1. CREATE USER ACCOUNT tıklayın
2. Bilgileri girin:

   Username: tdc_admin
   Password: [Güçlü bir şifre]
   
   Örnek şifre: TDCAdmin2024!Strong
   
3. CREATE tıklayın
```

**B) Var Olan Kullanıcının Şifresini Sıfırla:**
```
1. tdc_admin satırında "⋮" (3 nokta) tıklayın
2. "Change password" seçin
3. Yeni şifre girin: TDCAdmin2024!Strong
4. "Save" tıklayın
```

### 3️⃣ Database Yetkilerini Kontrol Edin

**A) DATABASES Sekmesine Gidin:**
```
Sol menüden: DATABASES
```

**B) tdc_products Database'ini Kontrol Edin:**
```
✅ tdc_products listelenmiş olmalı

❌ YOK İSE:
→ CREATE DATABASE
→ Database name: tdc_products
→ Character set: UTF8
→ Collation: en_US.UTF8
→ CREATE
```

**C) Kullanıcı Yetkilerini Verin (Cloud SQL Console):**
```
Google Cloud SQL Console'da doğrudan yetki veremezsiniz.
Bunun için Cloud Shell veya psql kullanmalısınız.
```

### 4️⃣ Cloud Shell ile Yetki Verin (ÖNEMLİ!)

**A) Cloud Shell'i Açın:**
```
Google Cloud Console → Sağ üstte terminal ikonu (>_)
veya: https://console.cloud.google.com/?cloudshell=true
```

**B) SQL Instance'a Bağlanın:**
```bash
# Instance connection name'i bulun:
# Format: PROJECT_ID:REGION:INSTANCE_NAME
# Örnek: my-project:europe-west1:tdc-products-db

gcloud sql connect tdc-products-db --user=postgres --quiet
```

**C) Postgres Şifresi Girin:**
```
Postgres user'ın şifresini girin (instance oluştururken belirlemiştiniz)
```

**D) Yetkileri Verin:**
```sql
-- Database'e bağlan
\c tdc_products

-- tdc_admin kullanıcısına tüm yetkileri ver
GRANT ALL PRIVILEGES ON DATABASE tdc_products TO tdc_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tdc_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tdc_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO tdc_admin;

-- Kontrol et
\du tdc_admin

-- Çıkış
\q
```

### 5️⃣ Vercel'de DATABASE_URL'i Güncelleyin

**A) Yeni Şifreyle DATABASE_URL Oluşturun:**
```bash
# Format:
postgresql://tdc_admin:YENİ_ŞİFRE@34.230.67.57:5432/tdc_products?sslmode=require

# Örnek (YENİ ŞİFRE: TDCAdmin2024!Strong):
postgresql://tdc_admin:TDCAdmin2024!Strong@34.230.67.57:5432/tdc_products?sslmode=require

# ⚠️ Şifrede özel karakter varsa URL encode edin:
# ! → %21
# Doğru: TDCAdmin2024%21Strong
postgresql://tdc_admin:TDCAdmin2024%21Strong@34.230.67.57:5432/tdc_products?sslmode=require
```

**B) Vercel'de Güncelleyin:**
```
1. https://vercel.com/tahas-projects/tdc-products-website/settings/environment-variables
2. DATABASE_URL → EDIT
3. Yeni değeri yapıştırın (yukarıdaki format)
4. SAVE
```

**C) Yeniden Deploy:**
```
Deployments → ⋯ → Redeploy
```

---

## 🚀 HIZLI ÇÖZÜM - ALTERNATİF (POSTGRES USER KULLAN)

Eğer yetki sorununu hızlı çözmek istiyorsanız, **postgres** (default admin user) kullanın:

### ADIM 1: postgres Şifresini Öğrenin/Sıfırlayın

```
Google Cloud Console → SQL → USERS
→ postgres → ⋮ → Change password
→ Yeni şifre: PostgresAdmin2024!
→ SAVE
```

### ADIM 2: DATABASE_URL'i Güncelleyin

```bash
# postgres user ile:
postgresql://postgres:PostgresAdmin2024%21@34.230.67.57:5432/tdc_products?sslmode=require
```

### ADIM 3: Vercel'de Kaydet

```
Settings → Environment Variables → DATABASE_URL → EDIT
→ Yeni URL → SAVE
→ Redeploy
```

### ADIM 4: Test Et

```
https://www.tdcproductsonline.com/kayit
→ Kayıt ol
→ ✅ Çalışmalı!
```

---

## 🔍 ŞİFRE URL ENCODING

**Şifrenizde özel karakter varsa mutlaka encode edin!**

```bash
# Özel Karakter Tablosu:
! → %21
# → %23
$ → %24
% → %25
& → %26
@ → %40
+ → %2B
= → %3D
? → %3F
/ → %2F

# ÖRNEK 1:
Şifre: MyPass#2024!
Encoded: MyPass%232024%21
URL: postgresql://user:MyPass%232024%21@IP:5432/...

# ÖRNEK 2:
Şifre: Admin@2024!
Encoded: Admin%402024%21
URL: postgresql://user:Admin%402024%21@IP:5432/...

# ÖRNEK 3:
Şifre: TDCAdmin2024!Strong
Encoded: TDCAdmin2024%21Strong
URL: postgresql://user:TDCAdmin2024%21Strong@IP:5432/...
```

---

## 🧪 BAĞLANTI TESTİ

### Test 1: Cloud Shell'den Test

```bash
# Google Cloud Console → Cloud Shell

# psql ile bağlan:
psql "host=34.230.67.57 port=5432 dbname=tdc_products user=tdc_admin password=SİZİN_ŞİFRENİZ sslmode=require"

# Başarılı bağlantı:
tdc_products=> 

# Test sorgusu:
\dt

# Çıkış:
\q
```

### Test 2: Lokal Bilgisayardan Test

```bash
# Windows'ta psql kurulu değilse: https://www.postgresql.org/download/

# Bağlan:
psql -h 34.230.67.57 -p 5432 -U tdc_admin -d tdc_products

# Şifre girin
Password: [ŞİFRENİZ]

# Başarılı:
tdc_products=>
```

---

## 📊 KULLANICI YETKİLERİNİ KONTROL ETME

```sql
-- Cloud Shell veya psql'de:

-- 1. Kullanıcıları listele:
\du

-- Çıktı şöyle olmalı:
--                                   List of roles
--  Role name |                         Attributes                         
-- -----------+------------------------------------------------------------
--  postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS
--  tdc_admin | [yetkiler]

-- 2. Database'leri listele:
\l

-- tdc_products görünmeli

-- 3. Database'e bağlan:
\c tdc_products

-- 4. Tabloları listele:
\dt

-- 5. Yetkileri kontrol et:
\dp

-- 6. Kullanıcı detayları:
SELECT * FROM pg_user WHERE usename = 'tdc_admin';
```

---

## 🛠️ SORUN GİDERME

### Sorun A: "Role does not exist"

**Çözüm:**
```sql
-- Cloud Shell → SQL Console

-- Kullanıcı oluştur:
CREATE USER tdc_admin WITH PASSWORD 'TDCAdmin2024!Strong';

-- Yetki ver:
GRANT ALL PRIVILEGES ON DATABASE tdc_products TO tdc_admin;

-- Kontrol:
\du
```

### Sorun B: "Database does not exist"

**Çözüm:**
```sql
-- Database oluştur:
CREATE DATABASE tdc_products WITH ENCODING 'UTF8';

-- Yetki ver:
GRANT ALL PRIVILEGES ON DATABASE tdc_products TO tdc_admin;

-- Kontrol:
\l
```

### Sorun C: "Password authentication failed"

**Çözüm:**
```
1. Google Cloud Console → SQL → USERS
2. tdc_admin → ⋮ → Change password
3. Yeni şifre: TDCAdmin2024!Strong
4. SAVE
5. DATABASE_URL'i güncelle (şifreyi encode et!)
6. Vercel → Save → Redeploy
```

### Sorun D: "SSL connection required"

**Çözüm:**
```
DATABASE_URL sonuna ekleyin:
?sslmode=require

Tam format:
postgresql://user:pass@IP:5432/db?sslmode=require
```

---

## ✅ BAŞARI KRİTERLERİ

Doğru yapılandırma:

```
1. Google Cloud SQL:
   ✅ Users: postgres ve tdc_admin var
   ✅ Databases: tdc_products var
   ✅ Permissions: tdc_admin'e GRANT ALL verilmiş
   
2. DATABASE_URL:
   ✅ Format: postgresql://...
   ✅ User: tdc_admin (veya postgres)
   ✅ Password: Doğru ve URL encoded
   ✅ IP: 34.230.67.57
   ✅ Database: tdc_products
   ✅ SSL: sslmode=require
   
3. Test:
   ✅ Cloud Shell'den bağlanabiliyor
   ✅ Vercel'den bağlanabiliyor
   ✅ Kayıt sayfası çalışıyor
```

---

## 🎯 ŞİMDİ YAPIN (5 DAKİKA)

### Yöntem 1: postgres User Kullan (EN HIZLI)

```bash
# 1. Google Cloud Console → SQL → USERS
#    postgres → Change password → PostgresAdmin2024!

# 2. Vercel DATABASE_URL:
postgresql://postgres:PostgresAdmin2024%21@34.230.67.57:5432/tdc_products?sslmode=require

# 3. Save → Redeploy

# 4. Test:
https://www.tdcproductsonline.com/kayit
```

### Yöntem 2: tdc_admin Düzelt (DAHA GÜVENLİ)

```bash
# 1. Cloud Shell aç
gcloud sql connect INSTANCE_ADI --user=postgres

# 2. Yetkileri ver:
GRANT ALL PRIVILEGES ON DATABASE tdc_products TO tdc_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tdc_admin;
\q

# 3. Vercel DATABASE_URL:
postgresql://tdc_admin:ŞİFRE@34.230.67.57:5432/tdc_products?sslmode=require

# 4. Save → Redeploy

# 5. Test
```

---

## 💡 IP ADRESİ DEĞİŞMİŞ!

```
Önceki IP: 34.89.254.41
Şimdiki IP: 34.230.67.57

Bu değişimin sebepleri:
- Google Cloud SQL instance'ı yeniden oluşturdunuz
- Farklı region'da instance var
- IP manual olarak değiştirildi

DATABASE_URL'de mutlaka yeni IP'yi kullanın:
postgresql://...@34.230.67.57:5432/...
```

---

## 📋 ÖZET

```
SORUN: User was denied access
SEBEP: Kullanıcı adı/şifre veya yetki sorunu

ÇÖZÜM 1 (Hızlı):
✅ postgres user kullan
✅ Şifreyi sıfırla
✅ DATABASE_URL güncelle
✅ Test et

ÇÖZÜM 2 (Güvenli):
✅ tdc_admin'e yetki ver (Cloud Shell)
✅ DATABASE_URL güncelle
✅ Test et

HER İKİ DURUMDA DA:
✅ Şifreyi URL encode et (! → %21)
✅ Yeni IP kullan: 34.230.67.57
✅ Vercel'de Save → Redeploy
```

---

## 🆘 YARDIM

Hala çalışmıyorsa bana şunları gönderin:

1. **Google Cloud SQL Users Listesi:**
   ```
   Console → SQL → USERS → Hangi kullanıcılar var?
   ```

2. **DATABASE_URL Formatı (şifre hariç):**
   ```
   Örnek: postgresql://postgres:***@34.230.x.x:5432/...
   ```

3. **Cloud Shell Test Sonucu:**
   ```bash
   gcloud sql connect INSTANCE --user=postgres
   Başarılı bağlandınız mı?
   ```

4. **Vercel Runtime Logs:**
   ```
   Son hata mesajı?
   ```

---

**ŞİMDİ:** `postgres` user'ı kullanarak DATABASE_URL'i güncelleyin! EN HIZLI ÇÖZÜM! 🚀


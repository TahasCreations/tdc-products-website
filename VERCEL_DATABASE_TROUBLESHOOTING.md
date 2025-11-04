# 🔧 Vercel Database Connection Troubleshooting

## DURUM: DATABASE_URL Eklendi Ama Hala Hata Var

Eğer Vercel'de `DATABASE_URL` eklediniz ama hala şu hatayı alıyorsanız:
```
Invalid `prisma.user.findUnique()` invocation:
Error querying the database: Error code 14: Unable to open the database file
```

Bu, eski SQLite konfigürasyonunun hala kullanıldığı anlamına gelir.

---

## 🚨 HIZLI KONTROL LİSTESİ

### 1️⃣ Vercel'de DATABASE_URL Var mı?

```bash
# Vercel Dashboard
https://vercel.com/tahas-projects/tdc-products-website/settings/environment-variables

Kontrol edin:
✅ Name: DATABASE_URL
✅ Value: postgresql://... (postgres ile başlamalı!)
✅ Environments: Production ✓, Preview ✓, Development ✓
```

### 2️⃣ Yeniden Deploy Ettiniz mi?

DATABASE_URL ekledikten sonra **MUTLAKA** yeniden deploy etmelisiniz:

**Seçenek A: Otomatik Deploy (Git Push)**
```bash
git commit --allow-empty -m "trigger: redeploy with DATABASE_URL"
git push origin main
```

**Seçenek B: Manuel Deploy**
```bash
# Vercel Dashboard
https://vercel.com/tahas-projects/tdc-products-website/deployments
→ "⋯" → "Redeploy"
```

### 3️⃣ Environment Doğru mu?

Vercel'de DATABASE_URL **her 3 environment** için de eklenmiş olmalı:

```
☑️ Production  → Canlı site için
☑️ Preview     → PR preview'lar için  
☑️ Development → Lokal development için
```

---

## 🔍 DETAYLI DEBUG

### ADIM 1: Vercel Deployment Logs Kontrol Edin

1. **Vercel Dashboard'a gidin:**
   ```
   https://vercel.com/tahas-projects/tdc-products-website/deployments
   ```

2. **En son deployment'a tıklayın**

3. **"Runtime Logs" sekmesine gidin**

4. **Şu hataları arayın:**
   ```
   ❌ "Error code 14: Unable to open the database file"
   → SQLite kullanmaya çalışıyor (DATABASE_URL yok veya yüklenmedi)
   
   ❌ "ECONNREFUSED"
   → IP veya Port yanlış
   
   ❌ "authentication failed"
   → Kullanıcı adı veya şifre yanlış
   
   ❌ "database does not exist"
   → Database adı yanlış
   
   ❌ "SSL connection"
   → SSL yapılandırma sorunu
   ```

### ADIM 2: DATABASE_URL Formatını Doğrulayın

Vercel'deki DATABASE_URL'niz şu formatta olmalı:

```bash
# DOĞRU FORMAT:
postgresql://tdc_admin:PASSWORD@IP_ADDRESS:5432/tdc_products?sslmode=require&connection_limit=10

# ÖRNEK:
postgresql://tdc_admin:MyPassword123@34.89.254.41:5432/tdc_products?sslmode=require&connection_limit=10
```

**Yaygın Hatalar:**

❌ `file:./dev.db` → SQLite (yanlış!)
❌ `postgres://` → `postgresql://` olmalı
❌ `[PASSWORD]` → Gerçek şifre yazılmalı, köşeli parantez kaldırılmalı!
❌ `localhost` → Google Cloud SQL IP'si olmalı
❌ Port eksik → `:5432` ekleyin

### ADIM 3: Google Cloud SQL Ayarlarını Kontrol Edin

#### A) Public IP Aktif mi?

```bash
# Google Cloud Console → SQL → Instance → Connections
✅ Public IP: Enabled olmalı
✅ Private IP: Opsiyonel
```

#### B) Authorized Networks Var mı?

```bash
# Google Cloud Console → SQL → Connections → Networking
# Authorized networks bölümüne ekleyin:

Name: Vercel
Network: 0.0.0.0/0

⚠️ Bu tüm IP'lere izin verir (test için).
Production'da Vercel IP'lerini ekleyin:
- 76.76.21.0/24
- 76.76.19.0/24
```

#### C) Database Var mı?

```bash
# Google Cloud Console → SQL → Databases
✅ "tdc_products" database'i listelenmiş olmalı

Yoksa oluşturun:
→ Create Database
→ Name: tdc_products
→ Character set: UTF8
→ Collation: en_US.UTF8
```

#### D) User Yetkileri Doğru mu?

```bash
# Google Cloud Console → SQL → Users
✅ Username: tdc_admin
✅ Host: % (any host)

Şifre kontrolü:
→ "⋮" → Change password
→ Yeni şifre girin
→ DATABASE_URL'i güncelleyin
```

---

## 🛠️ ÇÖZÜM SENARYOLARI

### SENARYO 1: DATABASE_URL Doğru Ama Hala SQLite Kullanıyor

**Sebep:** Prisma schema henüz güncellenmedi veya rebuild edilmedi.

**Çözüm:**
```bash
# Prisma client'ı yeniden generate edin
npx prisma generate

# Migration'ları çalıştırın
npx prisma migrate deploy

# Commit ve push
git add -A
git commit -m "fix: regenerate prisma client for postgresql"
git push origin main
```

### SENARYO 2: Connection Refused (ECONNREFUSED)

**Sebep:** Firewall veya yanlış IP/Port.

**Çözüm:**
1. **Google Cloud SQL Public IP'sini kontrol edin:**
   ```
   Google Cloud Console → SQL → Overview
   → Public IP address: X.X.X.X
   ```

2. **DATABASE_URL'de bu IP'yi kullanın:**
   ```
   postgresql://tdc_admin:PASSWORD@X.X.X.X:5432/...
   ```

3. **Firewall kurallarını ekleyin:**
   ```
   SQL → Connections → Authorized networks
   → Add network: 0.0.0.0/0
   ```

### SENARYO 3: Authentication Failed

**Sebep:** Yanlış kullanıcı adı veya şifre.

**Çözüm:**
1. **Şifreyi sıfırlayın:**
   ```
   Google Cloud Console → SQL → Users
   → tdc_admin → ⋮ → Change password
   → Yeni şifre: MyNewPassword123
   ```

2. **DATABASE_URL'i güncelleyin:**
   ```
   Vercel → Environment Variables → DATABASE_URL
   → Edit → Yeni şifre ile güncelle
   → Save
   ```

3. **Yeniden deploy:**
   ```bash
   git commit --allow-empty -m "trigger: updated database password"
   git push origin main
   ```

### SENARYO 4: Şifrede Özel Karakter Var

**Sebep:** URL'de özel karakterler encode edilmeli.

**Çözüm:**
```bash
# Şifreniz: MyPass#123@!
# Encode edilmiş: MyPass%23123%40%21

# Özel karakter tablosu:
# → %23
@ → %40
! → %21
$ → %24
& → %26
% → %25
+ → %2B
= → %3D
? → %3F

# DATABASE_URL:
postgresql://tdc_admin:MyPass%23123%40%21@34.89.254.41:5432/tdc_products?sslmode=require
```

### SENARYO 5: SSL Connection Error

**Sebep:** Google Cloud SQL SSL gerektiriyor ama bağlantıda sslmode yok.

**Çözüm:**
```bash
# DATABASE_URL sonuna ekleyin:
?sslmode=require

# Tam format:
postgresql://tdc_admin:PASSWORD@IP:5432/tdc_products?sslmode=require&connection_limit=10
```

---

## 🧪 TEST ARAÇLARI

### Test 1: Lokal Test (DATABASE_URL ile)

```bash
# .env dosyası oluşturun:
echo "DATABASE_URL=postgresql://..." > .env

# Test script'i çalıştırın:
npm run db:test-vercel

# Çıktı:
✅ Prisma bağlantısı başarılı!
✅ User sayısı: 0
✅ Product sayısı: 0
```

### Test 2: Vercel Deployment Test

```bash
# Deploy sonrası logs kontrol:
https://vercel.com/tahas-projects/tdc-products-website/deployments
→ En son deployment
→ Runtime Logs
→ "Prisma" veya "database" ara
```

### Test 3: Canlı Test

```bash
# Kayıt sayfasına gidin:
https://www.tdcproductsonline.com/kayit

# Test kullanıcısı oluşturun:
Ad: Test User
Email: test@example.com
Şifre: Test123456

# Submit → Eğer başarılı olursa:
✅ Database bağlantısı çalışıyor!
```

---

## 📊 DOĞRULAMA CHECKLİST

```
VERCEL AYARLARI:
□ DATABASE_URL environment variable eklendi
□ Value: postgresql:// ile başlıyor
□ Production, Preview, Development seçili
□ Yeniden deploy edildi

GOOGLE CLOUD SQL AYARLARI:
□ Public IP enabled
□ Authorized networks: 0.0.0.0/0 eklendi
□ Database: tdc_products var
□ User: tdc_admin var ve şifre doğru

PRISMA AYARLARI:
□ schema.prisma → provider = "postgresql"
□ prisma generate çalıştırıldı
□ Migration'lar deploy edildi

TEST:
□ npm run db:test-vercel → Başarılı
□ Vercel logs → Hata yok
□ Kayıt sayfası → Çalışıyor
```

---

## 🆘 HALA ÇALIŞMIYOR MU?

### Son Çare: Sıfırdan Kurulum

```bash
# 1. Yeni Google Cloud SQL Instance
Google Cloud Console → SQL → Create Instance
→ PostgreSQL 15
→ Instance ID: tdc-products-db-v2
→ Password: YeniGüçlüŞifre123
→ Region: europe-west1
→ Create

# 2. Database Oluştur
Databases → Create Database
→ Name: tdc_products
→ Create

# 3. Yeni DATABASE_URL
postgresql://postgres:YeniGüçlüŞifre123@[YENİ_IP]:5432/tdc_products?sslmode=require

# 4. Vercel'de Güncelle
Environment Variables → DATABASE_URL → Edit → Yeni URL → Save

# 5. Migration Çalıştır
npx prisma migrate deploy

# 6. Deploy
git push origin main
```

---

## 📞 DESTEK

Hala sorun mu var? Şu bilgileri paylaşın:

1. **Vercel Deployment Logs** (son 50 satır)
2. **DATABASE_URL formatı** (şifre hariç)
3. **Google Cloud SQL Public IP**
4. **Hangi hatayı aldığınız** (tam error message)

**Ben buradayım, birlikte çözeriz!** 💪


# 🚨 KRİTİK: Database Connection Hatası - Kesin Çözüm

## SORUN
```
Invalid `prisma.user.findUnique()` invocation:
Error querying the database: Error code 14: Unable to open the database file
```

**SEBEP:** Prisma Client, build sırasında SQLite için generate edilmiş ve hala onu kullanıyor!

---

## ✅ KEİSN ÇÖZÜM - ADIM ADIM

### 1️⃣ Vercel'de DATABASE_URL Kontrolü (ÇOK ÖNEMLİ!)

**MUTLAKA YAPIN:**

1. **Vercel Dashboard'a gidin:**
   ```
   https://vercel.com/tahas-projects/tdc-products-website/settings/environment-variables
   ```

2. **DATABASE_URL'i bulun ve kontrol edin:**
   ```
   ✅ Name: DATABASE_URL
   ✅ Value: postgresql://tdc_admin:SIFRE@IP:5432/tdc_products?sslmode=require
   ✅ Environments: Production ☑, Preview ☑, Development ☑
   ```

3. **EĞER YOK VEYA YANLIŞ İSE:**
   ```
   → Delete (varsa sil)
   → Add New
   → Name: DATABASE_URL
   → Value: (aşağıdaki formatı kullanın)
   → Tüm environmentları seçin
   → SAVE
   ```

### 2️⃣ Doğru DATABASE_URL Formatı

**Google Cloud SQL bilgilerinizle doldurun:**

```bash
postgresql://tdc_admin:[GOOGLE_CLOUD_SIFRENIZ]@[GOOGLE_CLOUD_IP]:5432/tdc_products?sslmode=require&connection_limit=10
```

**ÖRNEK (gerçek değerlerinizle doldurun):**
```bash
postgresql://tdc_admin:MyPassword123@34.89.254.41:5432/tdc_products?sslmode=require&connection_limit=10
```

**⚠️ DİKKAT:**
- `[GOOGLE_CLOUD_SIFRENIZ]` → Köşeli parantezleri kaldırın, gerçek şifre yazın!
- `[GOOGLE_CLOUD_IP]` → Google Cloud SQL instance'ınızın Public IP'si
- Şifrede özel karakter varsa encode edin: `#` → `%23`, `@` → `%40`

### 3️⃣ Google Cloud SQL Ayarlarını Kontrol Edin

**A) Public IP'yi Bulun:**
```
Google Cloud Console → SQL → Instance → Overview
→ Public IP address: X.X.X.X (bunu kopyalayın)
```

**B) Firewall'u Açın:**
```
Google Cloud Console → SQL → Connections → Networking
→ Authorized networks → Add network
→ Name: All IPs (test için)
→ Network: 0.0.0.0/0
→ Save
```

**C) Database'i Kontrol Edin:**
```
Google Cloud Console → SQL → Databases
→ "tdc_products" database var mı?
→ Yoksa: Create Database → Name: tdc_products
```

### 4️⃣ Prisma Client'ı Yeniden Generate Et

**Lokal bilgisayarınızda:**

```bash
# 1. Geçici .env dosyası oluştur (test için)
echo DATABASE_URL="postgresql://tdc_admin:SIFRE@IP:5432/tdc_products?sslmode=require" > .env

# 2. Prisma Client'ı yeniden generate et
npx prisma generate

# 3. Commit ve push
git add -A
git commit -m "fix: regenerate Prisma Client for PostgreSQL"
git push origin main
```

### 5️⃣ Vercel'de Cache Temizle ve Yeniden Deploy

**ÇOK ÖNEMLİ: Cache'siz deploy yapın!**

```
1. Vercel Dashboard → Deployments
2. En son deployment → "⋯" (3 nokta)
3. "Redeploy"
4. ⚠️ "Use existing Build Cache" kutusunu KAPATIN!
5. "Redeploy" butonuna tıklayın
```

**Veya terminal'den:**
```bash
git commit --allow-empty -m "trigger: force rebuild without cache"
git push origin main
```

---

## 🔍 HALA ÇALIŞMIYOR MU?

### Test 1: Vercel Logs Kontrol

```
Vercel Dashboard → Deployments → En son → Runtime Logs

Şunu arayın:
❌ "SQLite" kelimesi var mı?
❌ "Error code 14" var mı?
❌ "Unable to open database file" var mı?

Bu hatalardan biri varsa:
→ Prisma Client hala SQLite için generate edilmiş
→ DATABASE_URL build sırasında yüklenmiyor
```

### Test 2: Build Logs Kontrol

```
Vercel Dashboard → Deployments → En son → Build Logs

Şunu arayın:
✅ "Prisma schema loaded from prisma/schema.prisma"
✅ "Datasource: db"
✅ "Database provider: postgresql" ← Bu önemli!

Eğer "sqlite" görüyorsanız:
→ DATABASE_URL eksik veya yanlış
```

### Test 3: Environment Variables Kontrol

```
Vercel Dashboard → Settings → Environment Variables

DATABASE_URL için:
✅ Value: postgresql:// ile başlıyor mu?
✅ Production: Seçili mi?
✅ Preview: Seçili mi?
✅ Development: Seçili mi?

Hayır cevaplarınız varsa:
→ Edit → Düzelt → Save
→ Yeniden deploy et
```

---

## 🔧 SORUN GİDERME

### Problem A: "DATABASE_URL not found"

**Çözüm:**
```
1. Vercel → Settings → Environment Variables
2. Add New
3. Name: DATABASE_URL
4. Value: postgresql://...
5. Tüm environmentları seç
6. Save
7. Redeploy (cache'siz!)
```

### Problem B: "Error connecting to database"

**Çözüm:**
```
1. Google Cloud SQL → Connections
2. Public IP: Enabled olmalı
3. Authorized networks: 0.0.0.0/0 ekle
4. DATABASE_URL'deki IP'yi kontrol et
5. Vercel'de DATABASE_URL'i güncelle
6. Redeploy
```

### Problem C: "Authentication failed"

**Çözüm:**
```
1. Google Cloud SQL → Users
2. tdc_admin → Change password
3. Yeni şifre: MyNewPassword123
4. Vercel → DATABASE_URL'i güncelle
5. Şifrede özel karakter varsa encode et
6. Redeploy
```

### Problem D: "Database does not exist"

**Çözüm:**
```
1. Google Cloud SQL → Databases
2. Create Database
3. Name: tdc_products
4. Character set: UTF8
5. Create
6. Redeploy
```

---

## 📋 SON KONTROL LİSTESİ

Hepsini yapın, sırayla:

```
□ 1. Vercel'de DATABASE_URL var ve doğru
□ 2. DATABASE_URL: postgresql:// ile başlıyor
□ 3. Tüm environmentlar (Prod, Preview, Dev) seçili
□ 4. Google Cloud SQL Public IP doğru
□ 5. Google Cloud SQL Firewall açık (0.0.0.0/0)
□ 6. Google Cloud SQL'de tdc_products database var
□ 7. Lokal: npx prisma generate çalıştırıldı
□ 8. Git: commit ve push yapıldı
□ 9. Vercel: Cache'siz redeploy yapıldı
□ 10. 5 dakika beklendi (build için)
□ 11. Test: https://www.tdcproductsonline.com/kayit
```

---

## 🎯 ŞU AN YAPMANIZ GEREKENLER

### 1. VERCEl'DE DATABASE_URL EKLE/GÜNCELLE

```bash
# Şu formatı kullanın:
postgresql://tdc_admin:GERÇEK_ŞİFRE@GERÇEK_IP:5432/tdc_products?sslmode=require

# Örnek:
postgresql://tdc_admin:MyPass123@34.89.254.41:5432/tdc_products?sslmode=require
```

### 2. CACHE'SİZ YENİDEN DEPLOY

```bash
# Vercel Dashboard:
Deployments → ⋯ → Redeploy → "Use existing cache" KAPALI → Redeploy

# veya Terminal:
git commit --allow-empty -m "fix: force clean rebuild"
git push origin main
```

### 3. 5 DAKİKA BEKLE VE TEST ET

```
https://www.tdcproductsonline.com/kayit
→ Kayıt ol
→ Eğer "Error code 14" alıyorsanız:
   → Vercel logs kontrol et
   → Bana error mesajını gönder
```

---

## 💡 NEDEN BU SORUN OLUYOR?

Prisma Client, **build sırasında** hangi database kullanacağına karar verir:

```
BUILD SIRASINDA:
DATABASE_URL yoksa → SQLite client generate eder ❌
DATABASE_URL varsa → PostgreSQL client generate eder ✅

RUNTIME'DA:
SQLite client ile PostgreSQL'e bağlanamaz! ❌
```

**ÇÖZÜM:** Vercel'de DATABASE_URL **mutlaka** olmalı ve build sırasında yüklenmeli!

---

## 🆘 HALA ÇALIŞMIYOR MU?

**Bana şunları gönderin:**

1. **Vercel Build Logs (son 30 satır):**
   ```
   Deployments → En son → Build Logs
   → "prisma" kelimesini ara
   → Son 30 satırı kopyala
   ```

2. **Vercel Runtime Logs (son 20 satır):**
   ```
   Deployments → En son → Runtime Logs
   → "Error" kelimesini ara
   → İlgili hata mesajını kopyala
   ```

3. **DATABASE_URL Formatı (şifre hariç):**
   ```
   Örnek: postgresql://tdc_admin:***@34.89.x.x:5432/...
   ```

4. **Google Cloud SQL Status:**
   ```
   - Public IP: X.X.X.X
   - Database: tdc_products var mı?
   - User: tdc_admin var mı?
   ```

**Birlikte kesin çözüm bulalım!** 💪

---

## ✅ BAŞARI SENARYOSU

Eğer her şey doğru yapılırsa:

```
1. Vercel Build Logs:
   ✅ "Datasource: db, provider: postgresql"
   ✅ "✓ Generated Prisma Client"
   
2. Vercel Runtime Logs:
   ✅ Hata yok
   ✅ "Prisma client initialized"
   
3. Test:
   ✅ Kayıt sayfası açılıyor
   ✅ Form dolduruyorsunuz
   ✅ "Hesap Oluştur" tıklıyorsunuz
   ✅ Başarılı! → Yönlendiriliyor
   
4. Database:
   ✅ Google Cloud SQL'de yeni user kaydı var!
```

---

**ŞİMDİ YAPMANIZ GEREKEN:**
1. Vercel'de DATABASE_URL doğru formatta ekleyin
2. Cache'siz redeploy yapın
3. 5 dakika bekleyin
4. Test edin!

**Sonucu bana bildirin!** 🚀


# 🔧 VERCEL ENVIRONMENT VARIABLES KURULUMU

## ⚠️ "Secret does not exist" Hatası - ÇÖZÜLDÜ!

**Hata:** `Environment Variable "NEXT_PUBLIC_APP_URL" references Secret "app_url", which does not exist`

**Sebep:** `vercel.json` dosyasında secret referansı vardı.

**Çözüm:** ✅ `vercel.json` düzeltildi - artık secret referansı yok!

---

## 🎯 ENVIRONMENT VARIABLES NASIL EKLENİR?

### **Vercel Dashboard'dan:**

1. **Vercel Dashboard'a git:** https://vercel.com/dashboard
2. **Projenizi seçin**
3. **Settings → Environment Variables**
4. **Add Variable** butonuna tıklayın

---

## 📋 EKLENECEK DEĞERLER

### **🔴 ZORUNLU (3 değişken):**

#### **1. DATABASE_URL**
```
Key: DATABASE_URL
Value: postgresql://user:pass@host:5432/dbname
Environment: Production, Preview, Development
```

**Database Seçenekleri:**
- **Vercel Postgres** (önerilen): vercel.com/storage
- **Supabase:** supabase.com (ücretsiz)
- **PlanetScale:** planetscale.com
- **Railway:** railway.app

#### **2. NEXTAUTH_SECRET**
```
Key: NEXTAUTH_SECRET
Value: <32 karakterlik rastgele string>
Environment: Production, Preview, Development
```

**Nasıl oluşturulur?**
```bash
# Terminal'de çalıştır
openssl rand -base64 32
```

Veya online: https://generate-secret.vercel.app/32

#### **3. NEXTAUTH_URL**
```
Key: NEXTAUTH_URL
Value: https://your-project-name.vercel.app
Environment: Production

# Preview için ayrı
Value: https://your-project-name-git-main.vercel.app
Environment: Preview
```

⚠️ **Önce deploy edin, URL'yi alın, sonra bu değişkeni ekleyin!**

---

### **🟡 ÖNERİLEN (Temel özelliklerin çalışması için):**

#### **4. NEXT_PUBLIC_APP_URL**
```
Key: NEXT_PUBLIC_APP_URL
Value: https://your-project-name.vercel.app
Environment: Production, Preview
```

---

### **🟢 OPSIYONEL (Advanced features için):**

#### **Analytics:**
```
Key: NEXT_PUBLIC_GA_ID
Value: G-XXXXXXXXXX
Environment: Production

Key: NEXT_PUBLIC_MIXPANEL_TOKEN
Value: your_mixpanel_token
Environment: Production
```

#### **WhatsApp Business API:**
```
Key: WHATSAPP_API_URL
Value: https://graph.facebook.com/v18.0
Environment: Production

Key: WHATSAPP_ACCESS_TOKEN
Value: your_whatsapp_token
Environment: Production

Key: WHATSAPP_PHONE_NUMBER_ID
Value: your_phone_id
Environment: Production

Key: WHATSAPP_BUSINESS_NUMBER
Value: 905551234567
Environment: Production
```

#### **Email Marketing:**
```
Key: EMAIL_SERVICE
Value: sendgrid
Environment: Production

Key: SENDGRID_API_KEY
Value: SG.xxxxxxxxxxxxx
Environment: Production

Key: FROM_EMAIL
Value: info@yourdomain.com
Environment: Production
```

---

## 🚀 DEPLOY ADIMLARI (DÜZELTILMIŞ)

### **ADIM 1: İlk Deploy (Environment Variables OLMADAN)**

```bash
# İlk deploy
vercel --prod
```

**Sonuç:** 
- ✅ Build başarılı olur
- ✅ Site deploy edilir
- ✅ URL alırsınız: `https://your-project.vercel.app`
- ⚠️ Bazı özellikler çalışmayabilir (DB yok)

---

### **ADIM 2: Environment Variables Ekle**

1. Vercel Dashboard → Settings → Environment Variables
2. Yukarıdaki **ZORUNLU** değişkenleri ekle
3. `NEXTAUTH_URL` ve `NEXT_PUBLIC_APP_URL`'e deploy URL'ini yaz

---

### **ADIM 3: Redeploy**

```bash
# Environment variables eklendikten sonra
vercel --prod --force
```

Veya:
- Vercel Dashboard → Deployments
- Latest deployment → "..." menü → Redeploy

---

### **ADIM 4: Database Migration**

```bash
# Production database'e migrate
DATABASE_URL="your_prod_url" npx prisma migrate deploy
```

---

## 🎯 HIZLI BAŞLANGIÇ (Minimum Config)

**Sadece bu 2 değişkenle başlayın:**

```
1. DATABASE_URL = your_postgres_url
2. NEXTAUTH_SECRET = <random_32_chars>
```

Diğerlerini sonra ekleyin!

---

## 📝 ENVIRONMENT VARIABLES ŞABLONUhana

### **Vercel Dashboard'a kopyala-yapıştır:**

```
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_SECRET=your_32_char_secret_here
NEXTAUTH_URL=https://your-project.vercel.app
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

---

## 🔍 DATABASE SEÇENEKLERI

### **1. Vercel Postgres (ÖNERİLEN)**
```
1. Vercel Dashboard → Storage → Create Database
2. Select "Postgres"
3. Otomatik DATABASE_URL eklenir! ✅
```

### **2. Supabase (ÜCRETSİZ)**
```
1. supabase.com → New Project
2. Settings → Database → Connection String
3. Copy "Connection Pooling" URL
4. Vercel'e yapıştır
```

### **3. Railway (KOLAY)**
```
1. railway.app → New Project → PostgreSQL
2. Variables → DATABASE_URL kopyala
3. Vercel'e yapıştır
```

---

## ✅ DEPLOY KONTROLÜ

Deploy sonrası kontrol:

```bash
# Logs kontrol
vercel logs --follow

# Environment variables kontrol
vercel env ls
```

---

## 🎊 ÖZET

**Sorun:** `vercel.json`'da secret referansı
**Çözüm:** ✅ Düzeltildi! Artık secret kullanmıyor

**Yeni deploy:**
```bash
vercel --prod
```

**Minimum gerekli:** 
- DATABASE_URL
- NEXTAUTH_SECRET

**Sonuç:** Başarılı deploy! 🚀

---

## 💡 HIZLI START

```bash
# 1. Deploy (minimum config)
vercel --prod

# 2. URL'yi al (örn: my-project.vercel.app)

# 3. Vercel Dashboard'da ekle:
DATABASE_URL=<your_db>
NEXTAUTH_SECRET=<random_32_chars>
NEXTAUTH_URL=https://my-project.vercel.app
NEXT_PUBLIC_APP_URL=https://my-project.vercel.app

# 4. Redeploy
vercel --prod --force
```

**Tamamdır! 🎉**


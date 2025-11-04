# 🔧 GOOGLE CLOUD SQL - SORUN GİDERME REHBERİ

## ❌ SIK KARŞILAŞILAN SORUNLAR

### **1. "Connection timed out"**

**Sebep:** Authorized networks ayarları hatalı

**Çözüm:**
```
1. Google Cloud Console → SQL → tdc-products-db
2. Connections tab → Networking
3. Authorized networks kontrol edin

Ekleyin:
- Vercel IP: 76.76.21.21/32
- Kendi IP'niz: [YOUR-IP]/32 (test için)

Kaldırın:
- 0.0.0.0/0 (production'da güvenlik riski)
```

**Test:**
```bash
npm run db:test
# veya
curl https://www.tdcproductsonline.com/api/health/db
```

---

### **2. "SSL connection required"**

**Sebep:** Connection string'de SSL ayarı eksik

**Çözüm:**
```
DATABASE_URL sonuna ?sslmode=require ekleyin:

✅ Doğru:
postgresql://user:pass@IP:5432/db?sslmode=require

❌ Yanlış:
postgresql://user:pass@IP:5432/db
```

---

### **3. "Too many connections"**

**Sebep:** Connection pool limiti aşıldı

**Çözüm:**
```
Connection string'e limit ekleyin:

DATABASE_URL="postgresql://user:pass@IP:5432/db?sslmode=require&connection_limit=10&pool_timeout=20"
```

**Prisma Connection Pooling:**
```typescript
// lib/prisma.ts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
```

---

### **4. "Password authentication failed"**

**Sebep:** Şifre veya kullanıcı adı yanlış

**Çözüm:**
```
1. Cloud Console → SQL → Users tab
2. Kullanıcı adı: tdc_admin (kontrol edin)
3. "Change password" ile yeni şifre oluşturun
4. Vercel'de DATABASE_URL'i güncelleyin
```

---

### **5. "Database does not exist"**

**Sebep:** Database adı yanlış

**Çözüm:**
```
1. Cloud Console → SQL → Databases tab
2. Database adı: tdc_products (kontrol edin)
3. Yoksa "Create database" ile oluşturun
```

---

### **6. "Migration failed"**

**Sebep:** Prisma migrations uygulanamadı

**Çözüm:**
```bash
# 1. Migration durumunu kontrol edin
npx prisma migrate status

# 2. Migration uygulayın
npx prisma migrate deploy

# 3. Başarısız ise reset edin
npx prisma migrate reset --force

# 4. Yeni migration oluşturun
npx prisma migrate dev --name init
```

---

### **7. "Instance stopped"**

**Sebep:** Instance manuel olarak durdurulmuş

**Çözüm:**
```
Cloud Console → SQL → tdc-products-db
Status: Stopped → "Start" butonu → Tıklayın
```

---

### **8. Vercel Deploy Hatası**

**Sebep:** DATABASE_URL environment variable eksik

**Çözüm:**
```
Vercel Dashboard → Settings → Environment Variables

Kontrol edin:
- DATABASE_URL var mı?
- Production, Preview, Development için set edilmiş mi?
- Değer doğru mu?

Ekleyin ve Redeploy:
Settings → Deployments → Latest → "Redeploy"
```

---

## ✅ BAĞLANTI TEST ARAÇLARI

### **1. npm script ile:**
```bash
npm run db:test
```

### **2. API endpoint ile:**
```bash
curl https://www.tdcproductsonline.com/api/health/db
```

**Başarılı response:**
```json
{
  "status": "healthy",
  "database": {
    "provider": "Google Cloud SQL PostgreSQL",
    "host": "34.159.XXX.XXX",
    "database": "tdc_products",
    "ssl": "require"
  }
}
```

### **3. Prisma Studio ile:**
```bash
npx prisma studio
# → http://localhost:5555 açılır
# → Tüm tabloları görsel olarak görebilirsiniz
```

---

## 🔍 LOG İNCELEME

### **Google Cloud Logs:**
```
Cloud Console → SQL → tdc-products-db → Logs tab

Filtreler:
- Error logs: Hataları görün
- Slow query logs: Yavaş sorguları bulun
- Connection logs: Bağlantı sorunlarını tespit edin
```

### **Vercel Logs:**
```
Vercel Dashboard → Deployments → Latest → Function Logs

Arama:
"Prisma" veya "Database" veya "Connection"
```

---

## 📊 PERFORMANS İZLEME

### **Cloud SQL Metrics:**
```
Cloud Console → SQL → tdc-products-db → Monitoring

Metrikler:
- CPU utilization
- Memory utilization
- Disk utilization
- Read/Write IOPS
- Connection count
```

**Alarm Kurma:**
```
Monitoring → Alerting → Create Policy
Metric: Cloud SQL → CPU utilization
Condition: Above 80% for 5 minutes
Notification: Email
```

---

## 💡 PERFORMANS OPTİMİZASYONU

### **1. Connection Pooling:**
```typescript
// lib/prisma.ts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `${process.env.DATABASE_URL}?connection_limit=10&pool_timeout=20`,
    },
  },
});
```

### **2. Index Ekleme:**
```sql
-- Sık kullanılan sorgular için
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_product_seller ON "Product"("sellerId");
CREATE INDEX idx_order_user ON "Order"("userId");
CREATE INDEX idx_order_status ON "Order"(status);
```

### **3. Query Optimization:**
```typescript
// ❌ Yavaş
const users = await prisma.user.findMany({
  include: { orders: true, reviews: true }
});

// ✅ Hızlı
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true }
});
```

---

## 🚨 ACİL DURUM SENARYOLARI

### **Database Restore (Veri Kaybı):**
```
1. Cloud Console → SQL → Backups
2. Son backup'ı seçin
3. "Restore to new instance" (veya overwrite)
4. Vercel'de yeni DATABASE_URL'i güncelleyin
```

### **Instance Silindi:**
```
1. Cloud Console → SQL
2. "Create Instance" ile yeniden oluşturun
3. Son backup'tan restore edin
```

### **Too Many Failed Connections:**
```
1. Instance'ı yeniden başlatın
2. Password'u reset edin
3. Authorized networks'ü kontrol edin
```

---

## 📞 DESTEK

### **Google Cloud Support:**
```
https://cloud.google.com/support

Community Support: Ücretsiz
Basic Support: $29/ay
Standard Support: $150/ay
```

### **Prisma Support:**
```
https://github.com/prisma/prisma/issues
https://www.prisma.io/docs
```

### **Hızlı Test Komutları:**
```bash
# Connection test
npm run db:test

# Database durum kontrol
npx prisma migrate status

# Tablo listesi
npx prisma db execute --stdin <<< "SELECT tablename FROM pg_tables WHERE schemaname='public';"

# Kullanıcı sayısı
npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"User\";"
```

---

## ✅ BAŞARILI KURULUM KONTROL LİSTESİ

Tüm bunlar tamam mı?

- [ ] Google Cloud hesabı oluşturuldu
- [ ] $300 kredi alındı
- [ ] Cloud SQL instance oluşturuldu (Running durumda)
- [ ] Database oluşturuldu (tdc_products)
- [ ] User oluşturuldu (tdc_admin)
- [ ] Public IP alındı
- [ ] DATABASE_URL oluşturuldu
- [ ] Vercel'de DATABASE_URL eklendi (Production, Preview, Development)
- [ ] `npm run db:test` başarılı
- [ ] `/api/health/db` endpoint 200 dönüyor
- [ ] Test kullanıcısı oluşturuldu
- [ ] Database'de User kaydı görüldü

**HEPSİ ✅ İSE: SİSTEM TAM ÇALIŞIR DURUMDA! 🎉**

Sorun varsa bu rehbere göre adım adım kontrol edin!


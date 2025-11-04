# ⚡ GOOGLE CLOUD SQL - HIZLI BAŞLANGIÇ (15 DAKİKA)

## 🎯 ÖZET

Bu rehber, Google Cloud SQL PostgreSQL'i 15 dakikada kurmanızı sağlar.

---

## ✅ ÖN HAZIRLIK

Gereken bilgiler:
- [ ] Google hesabı
- [ ] Kredi kartı (doğrulama için, $300 ücretsiz kredi)
- [ ] Vercel hesabı

---

## 🚀 HIZLI KURULUM

### **1. GOOGLE CLOUD HESABI (3 dakika)**

```
1. https://console.cloud.google.com
2. Google hesabı ile giriş
3. "New Project" → Name: tdc-products → Create
4. Billing → Kredi kartı ekle → $300 ücretsiz kredi al
```

---

### **2. CLOUD SQL INSTANCE (5 dakika)**

```
1. Navigation menu → SQL
2. "Create Instance" → PostgreSQL
3. Ayarlar:
   Instance ID: tdc-products-db
   Password: [GÜÇLÜ ŞİFRE - KAYDET!]
   Region: europe-west3 (Frankfurt)
   Machine: Lightweight (db-f1-micro)
   Storage: 10 GB SSD
4. Connections:
   ☑️ Public IP
   Authorized networks: 0.0.0.0/0 (şimdilik)
5. Data Protection:
   ☑️ Automated backups
6. "CREATE INSTANCE" (5-10 dakika bekle)
```

---

### **3. DATABASE ve USER (2 dakika)**

```
1. SQL → tdc-products-db → Databases tab
2. "Create database" → Name: tdc_products → Create

3. Users tab → "Add user account"
4. User: tdc_admin
5. Password: [GÜÇLÜ ŞİFRE - KAYDET!]
6. "Add"
```

---

### **4. BAĞLANTI BİLGİLERİ (1 dakika)**

```
Overview tab'da:
Public IP: 34.159.XXX.XXX (NOT ALIN!)

Connection String FORMAT:
postgresql://tdc_admin:[PASSWORD]@34.159.XXX.XXX:5432/tdc_products?sslmode=require

⚠️ [PASSWORD] yazmayın! Gerçek şifrenizi yazın!

ÖRNEK (gerçek şifre: MyStr0ng#Pass123):
postgresql://tdc_admin:MyStr0ng#Pass123@34.89.254.41:5432/tdc_products?sslmode=require

⚠️ ÖNEMLİ: Şifrede özel karakter varsa encode edin!
# → %23
@ → %40
! → %21

Özel karakterli örnek (şifre: MyStr0ng#Pass!):
postgresql://tdc_admin:MyStr0ng%23Pass%21@34.89.254.41:5432/tdc_products?sslmode=require
```

---

### **5. VERCEL AYARLARI (2 dakika)**

```
Vercel Dashboard → Your Project → Settings → Environment Variables

Ekle:
Name: DATABASE_URL
Value: [Adım 4'teki connection string'inizi yapıştırın]

⚠️ [PASSWORD] yazmayın! Gerçek şifrenizi kullanın!

ÖRNEK (gerçek değerler ile):
postgresql://tdc_admin:MyStr0ng%23Pass%21@34.89.254.41:5432/tdc_products?sslmode=require

Environment:
☑️ Production
☑️ Preview
☐ Development (lokal SQLite kullanın)

"Save" tıklayın
```

---

### **6. DEPLOY (2 dakika)**

```bash
git add .
git commit -m "feat: Add Google Cloud SQL"
git push origin main
```

Vercel otomatik deploy eder!

---

## ✅ TEST

```
1. https://www.tdcproductsonline.com/kayit
2. Yeni kullanıcı oluştur
3. Giriş yap
4. ✅ Başarılı!

Google Cloud Console → SQL → Query insights
SELECT COUNT(*) FROM "User";
→ Kayıt sayısını göreceksiniz!
```

---

## 🎉 TAMAMLANDI!

**Aktif:**
- ✅ Google Cloud SQL PostgreSQL (Frankfurt)
- ✅ $7.67/ay (ilk 6 ay $300 kredi ile ücretsiz)
- ✅ Otomatik backup (günlük)
- ✅ 10 GB storage
- ✅ 99.95% uptime

**Tüm veriler Google Cloud'da güvenle saklanıyor!**

---

## 📞 SORUN GİDERME

**"Connection refused"**
```
Çözüm: Instance çalışıyor mu kontrol edin
SQL → tdc-products-db → Status: Running
```

**"Password authentication failed"**
```
Çözüm: Şifre ve kullanıcı adını kontrol edin
Users tab → tdc_admin mevcut mu?
```

**"Database does not exist"**
```
Çözüm: Database adını kontrol edin
Databases tab → tdc_products mevcut mu?
```

**"Too many connections"**
```
Çözüm: Connection limit ekleyin
?connection_limit=10
```

---

## 📚 DETAYLI DOKÜMANTASYON

Daha fazla bilgi için:
- `GOOGLE_CLOUD_SQL_KURULUM.md` (tam rehber)
- `PRODUCTION_DATABASE_SETUP.md` (alternatifler)

---

## 💰 MALİYET

```
db-f1-micro: $7.67/ay
Storage (10 GB): $1.70/ay
Toplam: ~$9.37/ay

İlk 6 ay: $300 kredi ile ÜCRETSIZ!
```

Hazırsınız! 🚀


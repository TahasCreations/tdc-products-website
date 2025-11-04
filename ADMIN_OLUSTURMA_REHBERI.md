# 🔐 Admin Kullanıcısı Oluşturma Rehberi

## 📧 Admin Bilgileri
```
Email: bentahasarii@gmail.com
Şifre: 35Sandalye
```

---

## 🚀 HIZLI YÖNTEM: Script ile Otomatik Oluşturma

### 1️⃣ Lokal Bilgisayarınızdan

```bash
# 1. Environment variable'ı ayarlayın (Google Cloud SQL bağlantı string'i)
# Windows (PowerShell):
$env:DATABASE_URL="postgresql://tdc_admin:[SIFRE]@[IP]:5432/tdc_products?sslmode=require"

# veya Linux/Mac:
export DATABASE_URL="postgresql://tdc_admin:[SIFRE]@[IP]:5432/tdc_products?sslmode=require"

# 2. Script'i çalıştırın
npm run admin:create
```

### ✅ Çıktı:
```
🔐 Admin Kullanıcısı Oluşturuluyor...

✅ Admin kullanıcısı oluşturuldu!

📧 Email: bentahasarii@gmail.com
🔑 Şifre: 35Sandalye
👤 ID: [UUID]
🎯 Role: ADMIN

🚀 Admin paneline giriş yapabilirsiniz!
   URL: https://www.tdcproductsonline.com/admin
```

---

## 🛠️ MANUEL YÖNTEM: Prisma Studio ile

### Adım 1: Prisma Studio Başlatın
```bash
npx prisma studio
```

### Adım 2: User Modelini Açın
1. Tarayıcıda `http://localhost:5555` açılır
2. Sol taraftan **User** modeline tıklayın
3. **Add record** butonuna tıklayın

### Adım 3: Admin Bilgilerini Girin
```json
{
  "id": "[otomatik oluşur]",
  "name": "Admin",
  "email": "bentahasarii@gmail.com",
  "password": "$2a$12$[BCrypt hash gerekli - aşağıya bakın]",
  "role": "ADMIN",
  "roles": "[\"ADMIN\",\"BUYER\"]",
  "emailVerified": "2024-01-15T00:00:00.000Z",
  "isActive": true
}
```

### 🔑 Şifre Hash'i Oluşturma

**Online Bcrypt Generator:**
1. https://bcrypt-generator.com/ adresine gidin
2. **Rounds:** 12 seçin
3. **Plain Text:** `35Sandalye` yazın
4. **Generate** tıklayın
5. Çıkan hash'i kopyalayın (örn: `$2a$12$...`)

**veya Node.js ile:**
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('35Sandalye', 12);
console.log(hash);
```

---

## 🎯 Giriş Testi

### 1. Admin Paneline Gidin
```
https://www.tdcproductsonline.com/admin
```

### 2. Giriş Yapın
```
Email: bentahasarii@gmail.com
Şifre: 35Sandalye
```

### 3. Dashboard'a Yönlendirileceksiniz
```
✅ Başarılı giriş!
→ https://www.tdcproductsonline.com/admin/dashboard
```

---

## 🔒 GÜVENLİK NOTLARI

### ✅ YAPILDI:
- ❌ Demo giriş bilgileri kaldırıldı
- ❌ "Otomatik Doldur" butonu kaldırıldı
- ✅ Şifre bcrypt ile hash'leniyor (12 rounds)
- ✅ ADMIN rolü atanıyor
- ✅ Multi-role desteği aktif: `["ADMIN", "BUYER"]`

### ⚠️ ÖNEMLİ:
1. **Şifre asla database'de plain text olarak saklanmaz**
2. **Admin kullanıcısı `emailVerified: true` olmalı**
3. **`isActive: true` olmalı (aktif kullanıcı)**
4. **`role: "ADMIN"` ve `roles: "[\"ADMIN\",\"BUYER\"]"` olmalı**

---

## 🐛 SORUN GİDERME

### ❌ "Invalid credentials" hatası
```bash
# Şifre hash'i doğru mu kontrol edin:
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.compareSync('35Sandalye', '[YOUR_HASH]'));"
# Çıktı: true olmalı
```

### ❌ "User not found" hatası
```bash
# Database'de kullanıcı var mı kontrol edin:
npx prisma studio
# User tablosunda bentahasarii@gmail.com arayın
```

### ❌ "Database connection error"
```bash
# DATABASE_URL doğru mu kontrol edin:
npm run db:test
```

### ❌ Script çalışmıyor
```bash
# Dependencies kurulu mu kontrol edin:
npm install bcryptjs @prisma/client

# Prisma Client güncel mi:
npx prisma generate
```

---

## 📋 KONTROL LİSTESİ

- [ ] Google Cloud SQL database aktif
- [ ] DATABASE_URL environment variable ayarlandı
- [ ] `npm run admin:create` çalıştırıldı
- [ ] Admin kullanıcısı oluşturuldu (✅ mesajı alındı)
- [ ] Admin paneline giriş yapıldı
- [ ] Dashboard açıldı
- [ ] Tüm menüler görünüyor

---

## 🚀 SİSTEM DURUMU

```
✅ Demo bilgiler kaldırıldı
✅ Production admin sistemi hazır
✅ Bcrypt şifreleme aktif
✅ Multi-role sistemi aktif
✅ Script hazır: npm run admin:create
✅ Deploy edildi: main branch

🎯 ŞİMDİ YAPILABİLECEKLER:
1. Admin kullanıcısını oluşturun
2. Admin paneline giriş yapın
3. Sistemi yönetmeye başlayın!
```

---

## 📞 DESTEK

Herhangi bir sorun yaşarsanız:
1. Database bağlantısını test edin: `npm run db:test`
2. Loglara bakın: `npm run dev` (local)
3. Vercel loglarına bakın (production)

**Admin paneli artık %100 production-ready!** 🎉


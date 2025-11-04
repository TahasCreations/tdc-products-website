# 🚨 "Database bağlantı hatası" - ÇÖZÜM

## Sorun
`Database bağlantı hatası. Lütfen database yöneticinizle iletişime geçin.`

Bu hata, **tablolarınızın henüz oluşturulmadığını** gösteriyor.

---

## ✅ ADIM ADIM ÇÖZÜM

### ADIM 1: Tabloları Kontrol Edin

**Google Cloud SQL Console'da Cloud Shell açın:**

```bash
gcloud sql connect [INSTANCE_ADI] --user=postgres
# Şifre: [postgres şifreniz]
```

**Database'e bağlanın:**
```bash
\c tdc_products
```

**Tabloları kontrol edin:**
```sql
-- Hangi tablolar var?
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

---

### ADIM 2A: Eğer Hiç Tablo Yoksa (Boş sonuç gelirse)

**CREATE_TABLES.sql dosyasını çalıştırın:**

1. `C:\Users\taha\tdc-products-website\CREATE_TABLES.sql` dosyasını açın
2. Tüm içeriği kopyalayın (Ctrl+A, Ctrl+C)
3. Cloud Shell'de yapıştırın ve çalıştırın

**Beklenen sonuç:**
```
CREATE TABLE
CREATE TABLE
CREATE TABLE
...
CREATE INDEX
CREATE INDEX
```

Her "CREATE TABLE" ve "CREATE INDEX" için başarı mesajı görmelisiniz.

---

### ADIM 2B: Eğer Tablo Oluştururken Hata Aldıysanız

**Muhtemelen "already exists" hatası aldınız. Tabloları temizleyin ve tekrar oluşturun:**

```sql
-- ÖNCE: Mevcut tabloları silin (eğer varsa)
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "VerificationToken" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- SONRA: CREATE_TABLES.sql'i tekrar çalıştırın
```

---

### ADIM 3: Admin Kullanıcısını Oluşturun

**Tablolar başarıyla oluşturulduktan sonra:**

1. `C:\Users\taha\tdc-products-website\CREATE_ADMIN.sql` dosyasını açın
2. Tüm içeriği kopyalayın
3. Cloud Shell'de yapıştırın ve çalıştırın

**Beklenen sonuç:**
```
INSERT 0 1

   id    |  name  |         email          | role  |      createdAt
---------+--------+------------------------+-------+---------------------
admin-... | Admin | bentahasarii@gmail.com | ADMIN | 2024-...
```

Eğer `INSERT 0 0` veya hiçbir satır görmüyorsanız, muhtemelen "ON CONFLICT DO NOTHING" devreye girmiş (admin zaten var).

---

### ADIM 4: Kontrol Edin

**CHECK_TABLES.sql dosyasını çalıştırın:**

1. `C:\Users\taha\tdc-products-website\CHECK_TABLES.sql` dosyasını açın
2. İçeriği kopyalayın
3. Cloud Shell'de çalıştırın

**Beklenen sonuç:**
```
current_database
-----------------
tdc_products

table_name
-----------------
Account
Order
Product
Session
User
VerificationToken

user_table_exists
------------------
t

user_count
-----------
1

(Admin kullanıcı bilgileri görünmeli)
```

---

### ADIM 5: Giriş Yapın

**Vercel'e gidin ve environment variable'ı kontrol edin:**

1. Vercel Dashboard → Projeniz → Settings → Environment Variables
2. `DATABASE_URL` değişkenini kontrol edin
3. **ÖNEMLİ:** Değer şu formatta olmalı:
   ```
   postgresql://postgres:[ŞİFRENİZ]@[IP]:5432/tdc_products?schema=public
   ```

**Değişiklik yaptıysanız, yeniden deploy edin:**
```
Vercel Dashboard → Deployments → Redeploy
```

**Giriş yapın:**
```
https://www.tdcproductsonline.com/admin
Email: bentahasarii@gmail.com
Şifre: 35Sandalye
```

---

## 🔍 HATA AYIKLAMA

### "psql: error: connection to server ... failed" hatası
- **Çözüm:** Google Cloud SQL'de "Connections" → "Authorized networks" → `0.0.0.0/0` ekleyin

### "password authentication failed" hatası
- **Çözüm:** Postgres şifresini sıfırlayın (Google Cloud Console → Users → postgres → Change password)

### "database tdc_products does not exist" hatası
- **Çözüm:** Database oluşturun:
  ```sql
  CREATE DATABASE tdc_products;
  ```

### Tablolar var ama admin yok
- **Çözüm:** CREATE_ADMIN.sql'i tekrar çalıştırın

### Admin var ama giriş yapamıyorum
- **Çözüm:** Password hash'ini kontrol edin:
  ```sql
  UPDATE "User" 
  SET "password" = '$2b$12$U/ADCZNDQcHsuiAPxyZBmOhmnejzDzVCgPnZgxPJXiOk4e8dCutJC'
  WHERE "email" = 'bentahasarii@gmail.com';
  ```

---

## 📊 ÖZET KONTROL LİSTESİ

- [ ] Cloud Shell'de `tdc_products` database'ine bağlandım
- [ ] `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';` çalıştırdım
- [ ] Eğer tablo yoksa: CREATE_TABLES.sql çalıştırdım
- [ ] Tüm tablolar başarıyla oluşturuldu (Account, Order, Product, Session, User, VerificationToken)
- [ ] CREATE_ADMIN.sql çalıştırdım
- [ ] Admin kullanıcısı oluşturuldu (bentahasarii@gmail.com)
- [ ] Vercel'de DATABASE_URL doğru (tdc_products database'i işaret ediyor)
- [ ] Vercel'de yeniden deploy ettim (eğer değişiklik yaptıysam)
- [ ] Admin paneline giriş yapabiliyorum ✅

---

## 🆘 SON ÇARE: TAM TEMİZLİK

Eğer hiçbir şey çalışmazsa, sıfırdan başlayın:

```sql
-- Cloud Shell'de:
\c postgres

-- tdc_products database'ini sil ve yeniden oluştur
DROP DATABASE IF EXISTS tdc_products;
CREATE DATABASE tdc_products;

-- Yeni database'e bağlan
\c tdc_products

-- CREATE_TABLES.sql'i çalıştır (tüm içeriği yapıştır)

-- CREATE_ADMIN.sql'i çalıştır (tüm içeriği yapıştır)

-- Kontrol et
SELECT * FROM "User" WHERE "role" = 'ADMIN';
```

---

**Şimdi CHECK_TABLES.sql'i çalıştırın ve sonuçları bana gönderin!**


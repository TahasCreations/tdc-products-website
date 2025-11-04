# 🎯 DATABASE KURULUMU - HER ADIM TEK TEK

## 📋 ÖNEMLİ BİLGİLER

**Database Adı:** `tdc_products`
**Instance Adı:** `tdc-products-db`
**Admin Email:** `bentahasarii@gmail.com`
**Admin Şifre:** `35Sandalye`

---

## 🚀 ADIM 1: GOOGLE CLOUD CONSOLE'A GİRİN

### 1.1 Tarayıcınızı Açın
- Chrome veya Edge açın

### 1.2 Google Cloud Console'a Gidin
1. Şu adresi açın: `https://console.cloud.google.com/sql`
2. Google hesabınızla giriş yapın (`bentahasarii@gmail.com`)

### 1.3 Projenizi Seçin
1. Üst kısımda proje adı yazan yere tıklayın
2. `tdc-market` projesini seçin

### 1.4 SQL Instance'ınızı Bulun
1. Sayfada "SQL instances" listesi görünmeli
2. `tdc-products-db` adlı instance'ı bulun
3. **Üzerine tıklayın** (açmayın, sadece tıklayın)

---

## 🔧 ADIM 2: CLOUD SHELL'İ AÇIN

### 2.1 Cloud Shell Butonunu Bulun
1. Sayfanın **sağ üst köşesinde** bir terminal ikonu arayın ( `>_` )
2. Bu butona tıklayın
3. Ekranın **alt kısmında** siyah bir terminal açılacak

### 2.2 Bekleyin
- "Welcome to Cloud Shell!" mesajı görünene kadar bekleyin
- Birkaç saniye sürebilir

---

## 🔌 ADIM 3: DATABASE'E BAĞLANIN

### 3.1 Bağlantı Komutunu Yazın

Cloud Shell terminalinde şunu yazın (**TEK SATIR**):

```bash
gcloud sql connect tdc-products-db --user=postgres
```

**ENTER tuşuna basın**

### 3.2 Şifre İsteğini Bekleyin

Ekranda şöyle bir mesaj görünecek:
```
Allowlisting your IP for incoming connection for 5 minutes...
Password:
```

### 3.3 Postgres Şifrenizi Girin

1. Postgres şifrenizi yazın (Google Cloud'da oluşturduğunuz şifre)
2. **ÖNEMLI:** Şifre görünmeyecek (bu normal)
3. **ENTER tuşuna basın**

### 3.4 Bağlantıyı Doğrulayın

Başarılı olursa şöyle bir prompt görünecek:
```
postgres=>
```

✅ **BAŞARILI! Database'e bağlandınız!**

---

## 📂 ADIM 4: TDC_PRODUCTS DATABASE'İNE GEÇİN

### 4.1 Database'i Değiştirin

Cloud Shell'de şunu yazın:

```sql
\c tdc_products
```

**ENTER tuşuna basın**

### 4.2 Sonucu Kontrol Edin

Başarılı olursa şunu görmelisiniz:
```
You are now connected to database "tdc_products" as user "postgres".
tdc_products=>
```

✅ **BAŞARILI! tdc_products database'indesiniz!**

---

### ⚠️ HATA: "database tdc_products does not exist"

Eğer bu hatayı aldıysanız, database'i oluşturun:

```sql
CREATE DATABASE tdc_products;
```

**ENTER tuşuna basın**

Sonra tekrar bağlanın:

```sql
\c tdc_products
```

---

## 🗂️ ADIM 5: TABLOARI KONTROL EDİN

### 5.1 Tablo Listesini Görüntüleyin

Cloud Shell'de şunu yazın:

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

**ENTER tuşuna basın**

### 5.2 Sonucu İnceleyin

**SENARYO A: Hiçbir Tablo Yok (Boş Liste)**
```
 table_name
------------
(0 rows)
```

➡️ **ADIM 6A'ya gidin** (Tabloları oluşturacağız)

**SENARYO B: Tablolar Var**
```
 table_name
-----------------
 Account
 Order
 Product
 Session
 User
 VerificationToken
(6 rows)
```

➡️ **ADIM 7'ye gidin** (Admin kullanıcısını oluşturacağız)

---

## 🏗️ ADIM 6A: TABLOLARI OLUŞTURUN (Eğer Tablo Yoksa)

### 6A.1 SQL Dosyasını Açın

1. Windows Explorer açın
2. Şu klasöre gidin: `C:\Users\taha\tdc-products-website`
3. `CREATE_TABLES.sql` dosyasını **Visual Studio Code** ile açın

### 6A.2 İçeriği Kopyalayın

1. Dosya açıkken **Ctrl+A** tuşuna basın (Tümünü Seç)
2. **Ctrl+C** tuşuna basın (Kopyala)

### 6A.3 Cloud Shell'e Yapıştırın

1. Tarayıcıya geri dönün (Cloud Shell'in olduğu sekme)
2. Cloud Shell terminaline tıklayın
3. **Sağ tıklayın** → **Paste** veya **Ctrl+V**
4. **ENTER tuşuna basın**

### 6A.4 Sonuçları Kontrol Edin

Her satır için şunu görmelisiniz:
```
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE INDEX
CREATE INDEX
CREATE INDEX
CREATE INDEX
```

✅ **BAŞARILI! Tablolar oluşturuldu!**

### 6A.5 Tabloları Yeniden Kontrol Edin

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
```

**ENTER tuşuna basın**

6 tablo görmelisiniz:
- Account
- Order
- Product
- Session
- User
- VerificationToken

---

## 👤 ADIM 7: ADMIN KULLANICISINI OLUŞTURUN

### 7.1 SQL Dosyasını Açın

1. Windows Explorer açın
2. Şu klasöre gidin: `C:\Users\taha\tdc-products-website`
3. `CREATE_ADMIN.sql` dosyasını **Visual Studio Code** ile açın

### 7.2 İçeriği Kopyalayın

1. Dosya açıkken **Ctrl+A** tuşuna basın
2. **Ctrl+C** tuşuna basın

### 7.3 Cloud Shell'e Yapıştırın

1. Tarayıcıya geri dönün
2. Cloud Shell terminaline tıklayın
3. **Sağ tıklayın** → **Paste** veya **Ctrl+V**
4. **ENTER tuşuna basın**

### 7.4 Sonucu Kontrol Edin

Başarılı olursa şunu görmelisiniz:
```
INSERT 0 1

   id    |  name  |         email          | role  | createdAt
---------+--------+------------------------+-------+-----------
admin-...| Admin  | bentahasarii@gmail.com | ADMIN | 2024-...
```

✅ **BAŞARILI! Admin kullanıcısı oluşturuldu!**

### 7.5 Admin Kullanıcısını Doğrulayın

Cloud Shell'de şunu yazın:

```sql
SELECT "id", "email", "role" FROM "User" WHERE "role" = 'ADMIN';
```

**ENTER tuşuna basın**

`bentahasarii@gmail.com` görmelisiniz.

---

## 🌐 ADIM 8: VERCEL'DE DATABASE URL'İ KONTROL EDİN

### 8.1 Vercel Dashboard'a Gidin

1. Yeni sekme açın
2. `https://vercel.com` adresine gidin
3. Giriş yapın
4. `tdc-products-website` projesini bulun ve tıklayın

### 8.2 Environment Variables'a Gidin

1. Üst menüden **Settings** tıklayın
2. Sol menüden **Environment Variables** tıklayın

### 8.3 DATABASE_URL'i Bulun

1. Listede `DATABASE_URL` arayın
2. Sağ tarafta **Edit** (Düzenle) butonuna tıklayın

### 8.4 Değeri Kontrol Edin

DATABASE_URL şu formatta olmalı:

```
postgresql://postgres:[ŞİFRENİZ]@34.89.254.41:5432/tdc_products?schema=public
```

**ÖNEMLİ KONTROLLER:**
- ✅ `tdc_products` yazıyor mu? (sonunda)
- ✅ IP adresi doğru mu? (Google Cloud SQL instance'ınızın IP'si)
- ✅ Şifre doğru mu?

### 8.5 Değişiklik Yaptıysanız

1. **Save** butonuna tıklayın
2. Üst menüden **Deployments** tıklayın
3. En üstteki deployment'ın sağında **⋮** (3 nokta) → **Redeploy** tıklayın
4. **Redeploy** butonuna tekrar tıklayın (onay)
5. Deployment tamamlanana kadar bekleyin (1-2 dakika)

---

## 🎉 ADIM 9: ADMIN PANELİNE GİRİŞ YAPIN

### 9.1 Admin Sayfasını Açın

Yeni sekme açın ve şu adrese gidin:

```
https://www.tdcproductsonline.com/admin
```

### 9.2 Giriş Bilgilerini Girin

**Email:** `bentahasarii@gmail.com`
**Şifre:** `35Sandalye`

### 9.3 Giriş Butonuna Tıklayın

**"Admin Paneline Giriş"** butonuna tıklayın

### 9.4 Sonuç

✅ **BAŞARILI!** Dashboard açılmalı!

❌ **BAŞARISIZ?** Hata mesajı alıyorsanız:

---

## 🆘 ADIM 10: SORUN ÇÖZME (Eğer Giriş Yapamadıysanız)

### 10.1 Vercel Loglarını Kontrol Edin

1. Vercel Dashboard → Projeniz
2. Üst menüden **Logs** tıklayın
3. Sayfayı **Refresh** edin (F5)
4. Admin paneline tekrar giriş yapmayı deneyin
5. Logs sayfasında yeni hatalar arayın

### 10.2 En Son Çare: Password Hash'ini Güncelleyin

Cloud Shell'de şunu çalıştırın:

```sql
UPDATE "User" 
SET "password" = '$2b$12$U/ADCZNDQcHsuiAPxyZBmOhmnejzDzVCgPnZgxPJXiOk4e8dCutJC'
WHERE "email" = 'bentahasarii@gmail.com';
```

**ENTER tuşuna basın**

Sonucu kontrol edin:

```sql
SELECT "id", "email", "role", "password" IS NOT NULL as has_password 
FROM "User" 
WHERE "email" = 'bentahasarii@gmail.com';
```

`has_password` sütununda `t` (true) görmelisiniz.

---

## 📝 ÖZET KONTROL LİSTESİ

Sırayla işaretleyin:

- [ ] Google Cloud Console'a giriş yaptım
- [ ] Cloud Shell açtım (sağ üstteki terminal ikonu)
- [ ] `gcloud sql connect tdc-products-db --user=postgres` çalıştırdım
- [ ] Postgres şifremi girdim
- [ ] `\c tdc_products` ile database'e bağlandım
- [ ] `SELECT table_name...` ile tabloları kontrol ettim
- [ ] CREATE_TABLES.sql'i kopyalayıp Cloud Shell'e yapıştırdım
- [ ] 6 tablo oluştu (User, Account, Session, VerificationToken, Product, Order)
- [ ] CREATE_ADMIN.sql'i kopyalayıp Cloud Shell'e yapıştırdım
- [ ] Admin kullanıcısı oluştu (bentahasarii@gmail.com)
- [ ] Vercel'de DATABASE_URL'i kontrol ettim (`tdc_products` var)
- [ ] Vercel'de redeploy yaptım (eğer değişiklik yaptıysam)
- [ ] https://www.tdcproductsonline.com/admin adresine gittim
- [ ] bentahasarii@gmail.com + 35Sandalye ile giriş yaptım
- [ ] ✅ Dashboard açıldı!

---

## 💡 HATIRLATMA

Eğer **herhangi bir adımda takıldıysanız**:

1. O adımı bana söyleyin
2. Ekranda ne yazdığını kopyalayıp gönderin
3. Birlikte çözeriz!

**BAŞARILI OLACAKSINIZ! 🚀**


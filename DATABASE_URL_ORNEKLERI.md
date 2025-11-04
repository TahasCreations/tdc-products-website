# 🔗 DATABASE_URL OLUŞTURMA REHBERİ

## ⚠️ ÖNEMLİ UYARI

**[PASSWORD], [IP], [USER] gibi köşeli parantezli ifadeler PLACEHOLDER'dır!**

**Gerçek değerlerinizi köşeli parantez OLMADAN yazın!**

---

## ✅ DOĞRU ÖRNEKLER

### **Örnek 1: Basit Şifre (özel karakter yok)**

**Google Cloud SQL Bilgileriniz:**
```
User: tdc_admin
Password: SimplePass123
IP: 34.89.254.41
Database: tdc_products
```

**DATABASE_URL:**
```
postgresql://tdc_admin:SimplePass123@34.89.254.41:5432/tdc_products?sslmode=require
```

**Vercel'de:**
```
Name: DATABASE_URL
Value: postgresql://tdc_admin:SimplePass123@34.89.254.41:5432/tdc_products?sslmode=require
```

---

### **Örnek 2: Özel Karakterli Şifre (encode gerekli)**

**Google Cloud SQL Bilgileriniz:**
```
User: tdc_admin
Password: MyStr0ng#Pass!
IP: 34.89.254.41
Database: tdc_products
```

**Özel Karakter Encode Tablosu:**
```
# → %23
! → %21
@ → %40
$ → %24
% → %25
& → %26
( → %28
) → %29
```

**Şifre encode:**
```
MyStr0ng#Pass! → MyStr0ng%23Pass%21
```

**DATABASE_URL:**
```
postgresql://tdc_admin:MyStr0ng%23Pass%21@34.89.254.41:5432/tdc_products?sslmode=require
```

**Vercel'de:**
```
Name: DATABASE_URL
Value: postgresql://tdc_admin:MyStr0ng%23Pass%21@34.89.254.41:5432/tdc_products?sslmode=require
```

---

### **Örnek 3: Gerçek Kurulum (Sizin Değerleriniz)**

**Adım 1: Google Cloud SQL'den alın:**
```
SQL → tdc-products-db → Overview tab

Public IP address: [NOT ALIN]
Örnek: 34.159.123.45
```

**Adım 2: User bilgileriniz:**
```
User: tdc_admin (oluşturduğunuz)
Password: [Oluşturduğunuz güçlü şifre]
Database: tdc_products (oluşturduğunuz)
```

**Adım 3: Connection String oluşturun:**
```
Format:
postgresql://[USER]:[PASSWORD]@[IP]:5432/[DATABASE]?sslmode=require

Sizinki:
postgresql://tdc_admin:[GERÇEKŞİFRENİZ]@[GERÇEK-IP-ADRESİNİZ]:5432/tdc_products?sslmode=require
```

**Adım 4: Vercel'e yapıştırın:**
```
DATABASE_URL = [Adım 3'teki string'i aynen yapıştırın]
```

---

## ❌ YANLIŞ ÖRNEKLER

### **Yanlış 1: Köşeli parantezleri yazmak**
```
❌ postgresql://tdc_admin:[MyPassword123]@34.89.254.41:5432/tdc_products
                        ↑             ↑
                    BUNLAR OLMAYACAK!

✅ postgresql://tdc_admin:MyPassword123@34.89.254.41:5432/tdc_products
```

### **Yanlış 2: Özel karakterleri encode etmemek**
```
❌ postgresql://tdc_admin:MyPass#123!@34.89.254.41:5432/tdc_products
                               ↑    ↑
                         # ve ! sorun çıkarır!

✅ postgresql://tdc_admin:MyPass%23123%21@34.89.254.41:5432/tdc_products
```

### **Yanlış 3: IP adresini placeholder olarak bırakmak**
```
❌ postgresql://tdc_admin:MyPass123@34.159.XXX.XXX:5432/tdc_products
                                         ↑↑↑ ↑↑↑
                                    Gerçek IP yazın!

✅ postgresql://tdc_admin:MyPass123@34.89.254.41:5432/tdc_products
```

---

## 🔧 ADIM ADIM OLUŞTURMA

### **1. Template ile başlayın:**
```
postgresql://[USER]:[PASSWORD]@[IP]:5432/[DATABASE]?sslmode=require&connection_limit=10
```

### **2. Placeholder'ları doldurun:**
```
[USER] → tdc_admin
[PASSWORD] → MyStr0ng%23Pass%21 (encode edilmiş)
[IP] → 34.89.254.41
[DATABASE] → tdc_products
```

### **3. Final string:**
```
postgresql://tdc_admin:MyStr0ng%23Pass%21@34.89.254.41:5432/tdc_products?sslmode=require&connection_limit=10
```

### **4. Vercel'e yapıştır:**
```
DATABASE_URL = [Yukarıdaki string'i AYNEN yapıştırın]
```

---

## 🧪 TEST ETME

### **Doğru mu kontrol edin:**

**URL Parse Test:**
```javascript
const url = new URL('postgresql://tdc_admin:MyPass123@34.89.254.41:5432/tdc_products');

console.log(url.username); // "tdc_admin" ✅
console.log(url.password); // "MyPass123" ✅
console.log(url.hostname); // "34.89.254.41" ✅
console.log(url.pathname); // "/tdc_products" ✅
```

**Hata alırsanız:**
- Şifrede özel karakter var mı? → Encode edin
- Tırnak işareti kullandınız mı? → Kullanmayın
- Boşluk var mı? → Kaldırın

---

## 📋 CHEAT SHEET

### **Özel Karakter Encode Tablosu:**
```
Karakter → Encoded
─────────────────
!  →  %21
"  →  %22
#  →  %23
$  →  %24
%  →  %25
&  →  %26
'  →  %27
(  →  %28
)  →  %29
*  →  %2A
+  →  %2B
,  →  %2C
/  →  %2F
:  →  %3A
;  →  %3B
=  →  %3D
?  →  %3F
@  →  %40
[  →  %5B
]  →  %5D
```

### **Online Encoder Tool:**
```
https://www.urlencoder.org/
→ Şifrenizi yapıştırın
→ "Encode" tıklayın
→ Sonucu kopyalayın
```

---

## ✅ DOĞRU KURULUM ÖRNEĞİ

**1. Google Cloud'da oluşturdunuz:**
```
Instance: tdc-products-db
IP: 34.89.254.41
User: tdc_admin
Password: TdC2024#Secure!
Database: tdc_products
```

**2. Şifreyi encode edin:**
```
TdC2024#Secure! → TdC2024%23Secure%21
```

**3. Connection string oluşturun:**
```
postgresql://tdc_admin:TdC2024%23Secure%21@34.89.254.41:5432/tdc_products?sslmode=require&connection_limit=10
```

**4. Vercel'e ekleyin:**
```
Vercel Dashboard → Settings → Environment Variables

Name: DATABASE_URL
Value: postgresql://tdc_admin:TdC2024%23Secure%21@34.89.254.41:5432/tdc_products?sslmode=require&connection_limit=10

Environment:
☑️ Production
☑️ Preview

Save
```

**5. Deploy edin:**
```bash
git push origin main
```

**6. Test edin:**
```bash
curl https://www.tdcproductsonline.com/api/health/db
```

---

## 🎯 ÖZET

**YANLIŞ:**
```
postgresql://tdc_admin:[MyPassword]@[IP]:5432/tdc_products
                       ↑          ↑   ↑↑↑
                  Köşeli parantez OLMAYACAK!
```

**DOĞRU:**
```
postgresql://tdc_admin:MyPassword@34.89.254.41:5432/tdc_products
                       ↑         ↑ ↑          ↑
                  Dümdüz, gerçek değerler!
```

**Rehberlerdeki [PASSWORD], [IP] notasyonu:**
- ✅ Sadece yer tutucu
- ✅ Kendi değerlerinizi yazın
- ❌ Köşeli parantezleri yazmayın!

Anlaşıldı mı? 🎯


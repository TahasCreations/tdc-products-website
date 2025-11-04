# 🗄️ TDC PRODUCTS - DATABASE DOKÜMANTASYONU

## 📚 MEVCUT REHBERLER

Sisteminiz için 3 farklı database rehberi hazırladım:

### **1. GOOGLE_CLOUD_SQL_TAM_ENTEGRASYON.md** ⭐ ÖNERİLEN
```
📖 İçerik:
- Kapsamlı Google Cloud SQL kurulumu
- Sistem mimarisi diyagramları
- Veri akış şemaları
- 18 bölümlük detaylı adımlar
- Güvenlik sertleştirme
- Performans optimizasyonu
- Backup stratejisi
- Troubleshooting

🎯 Kime önerilir: İlk defa Google Cloud kullanacaklar
⏱️ Okuma süresi: 20 dakika
```

### **2. GOOGLE_CLOUD_SQL_HIZLI_BASLANGIC.md** ⚡
```
📖 İçerik:
- Hızlı kurulum (15 dakika)
- Sadece gerekli adımlar
- Test prosedürü
- Sorun giderme özeti

🎯 Kime önerilir: Hızlıca başlamak isteyenler
⏱️ Okuma süresi: 5 dakika
```

### **3. GOOGLE_CLOUD_SQL_KURULUM.md** 📚
```
📖 İçerik:
- Orta seviye detay
- Fiyatlandırma bilgileri
- Alternatif seçenekler
- Best practices

🎯 Kime önerilir: Karar aşamasındakiler
⏱️ Okuma süresi: 10 dakika
```

### **4. GOOGLE_CLOUD_SQL_TROUBLESHOOTING.md** 🔧
```
📖 İçerik:
- Sık karşılaşılan hatalar
- Çözüm adımları
- Debug komutları
- Performance tuning

🎯 Kime önerilir: Sorun yaşayanlar
⏱️ Okuma süresi: 8 dakika
```

### **5. PRODUCTION_DATABASE_SETUP.md** 🔄
```
📖 İçerik:
- Alternatif database seçenekleri
- Vercel Postgres
- Supabase
- PlanetScale
- Karşılaştırma tablosu

🎯 Kime önerilir: Alternatif arayanlar
⏱️ Okuma süresi: 12 dakika
```

---

## ⚡ HIZLI BAŞLANGIÇ

**Google Cloud SQL ile başlamak için:**

```bash
# 1. Rehberi okuyun
cat GOOGLE_CLOUD_SQL_HIZLI_BASLANGIC.md

# 2. Google Cloud'da instance oluşturun (10 dakika)
# 3. DATABASE_URL'i Vercel'e ekleyin
# 4. Deploy edin
git push origin main

# 5. Test edin
curl https://www.tdcproductsonline.com/api/health/db
```

---

## 🎯 DATABASE DURUMU

### **Mevcut:**
```
Development: SQLite (./dev.db)
Production: Henüz yapılandırılmadı
```

### **Kurulum Sonrası:**
```
Development: SQLite (./dev.db)
Production: Google Cloud SQL PostgreSQL (europe-west3)
```

---

## 📊 VERİ MODELİ

### **Kullanıcı Sistemi:**
```
User (kullanıcılar)
├─ SellerProfile (satıcılar)
├─ InfluencerProfile (influencerlar)
├─ Order (siparişler)
├─ Review (yorumlar)
└─ Address (adresler)
```

### **E-ticaret:**
```
Product (ürünler)
├─ Category (kategoriler)
├─ OrderItem (sipariş kalemleri)
└─ Review (ürün yorumları)
```

### **Partner Sistemi:**
```
SellerProfile
├─ Products (satıcının ürünleri)
├─ Orders (satıcının siparişleri)
└─ SellerReview (satıcı yorumları)

InfluencerProfile
├─ Collaboration (işbirlikleri)
└─ Commission (komisyonlar)
```

### **Destek Sistemi:**
```
SupportTicket (destek talepleri)
├─ SupportMessage (mesajlar)
├─ SupportAgent (temsilciler)
└─ CannedResponse (hazır cevaplar)
```

**Toplam:** 50+ model/tablo

---

## 🔧 TOOLS & SCRIPTS

### **Database Test:**
```bash
npm run db:test
```

### **Health Check Endpoint:**
```bash
curl https://www.tdcproductsonline.com/api/health/db
```

### **Prisma Studio:**
```bash
npx prisma studio
# → http://localhost:5555
```

### **Migration Status:**
```bash
npx prisma migrate status
```

---

## 💰 MALİYET TAHMİNİ

### **Google Cloud SQL (Önerilen):**
```
db-f1-micro: $7.67/ay
Storage (10 GB): $1.70/ay
Backup: $0.50/ay
Toplam: ~$10/ay

İlk 6 ay: $300 kredi ile ÜCRETSIZ!
```

### **Alternatifler:**
```
Vercel Postgres: İlk 256 MB ücretsiz, sonra $5/ay
Supabase: İlk 500 MB ücretsiz, sonra $25/ay
PlanetScale: İlk 5 GB ücretsiz, sonra $29/ay
```

---

## 📞 DESTEK

Sorun mu yaşıyorsunuz?

1. `GOOGLE_CLOUD_SQL_TROUBLESHOOTING.md` okuyun
2. `npm run db:test` çalıştırın
3. `/api/health/db` endpoint'ini kontrol edin
4. Vercel logs'u inceleyin

---

## 🚀 BAŞLAMAYA HAZIR!

**Önce okuyun:**
→ `GOOGLE_CLOUD_SQL_HIZLI_BASLANGIC.md` (15 dakika kurulum)

**Detay istiyorsanız:**
→ `GOOGLE_CLOUD_SQL_TAM_ENTEGRASYON.md` (tüm bilgiler)

**Sorun varsa:**
→ `GOOGLE_CLOUD_SQL_TROUBLESHOOTING.md` (çözümler)

Başarılar! 🎉


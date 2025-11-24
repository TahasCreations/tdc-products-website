# 🏪 Çok Satıcılı Sistem (Multi-Vendor Marketplace) Analizi

**Tarih:** 2025-01-XX  
**Durum:** ✅ Sistem Çok Satıcılı Yapıya Uygun - Bazı İyileştirmeler Önerilir

---

## 📊 MEVCUT DURUM ANALİZİ

### ✅ **TAM DESTEKLENEN ÖZELLİKLER**

#### 1. **Satıcı Yönetimi**
- ✅ `SellerProfile` modeli mevcut
- ✅ Satıcı başvuru sistemi (`SellerApplication`)
- ✅ Satıcı onay/red sistemi
- ✅ Satıcı profili (storeName, storeSlug, taxNumber, iban)
- ✅ Satıcı durumu (pending, approved, rejected)

#### 2. **Ürün-Satıcı İlişkisi**
- ✅ Her ürün bir satıcıya ait (`Product.sellerId`)
- ✅ Satıcı bazlı ürün yönetimi
- ✅ Satıcı bazlı stok yönetimi

#### 3. **Sipariş-Satıcı İlişkisi**
- ✅ **Her sipariş kalemi bir satıcıya ait** (`OrderItem.sellerId`)
- ✅ Bir siparişte birden fazla satıcıdan ürün olabilir
- ✅ Satıcı bazlı sipariş durumu güncelleme (`/api/seller/orders/[orderId]/status`)

#### 4. **Komisyon Sistemi**
- ✅ İki seviyeli komisyon sistemi:
  - **TYPE_A (Şirket)**: %7 + KDV = %8.26
  - **TYPE_B (Bireysel/IG)**: %10 + KDV = %11.8
- ✅ Komisyon hesaplama servisi (`commission.service.ts`)
- ✅ Satıcı tipine göre otomatik komisyon

#### 5. **Ödeme Yönetimi (Payout)**
- ✅ `Payout` modeli mevcut
- ✅ Satıcı bazlı ödeme takibi
- ✅ Settlement (mutabakat) sistemi
- ✅ Payout durumları (PENDING, PROCESSING, PAID, FAILED)

#### 6. **Satıcı Paneli**
- ✅ Satıcı dashboard (`/seller/dashboard`)
- ✅ Satıcı ürün yönetimi (`/seller/products`)
- ✅ Satıcı sipariş yönetimi (`/seller/orders`)
- ✅ Satıcı raporları (`/seller/reports`)
- ✅ Satıcı ayarları

#### 7. **Fatura Yönetimi**
- ✅ Satıcı tipine göre fatura:
  - TYPE_A: Satıcı faturalar
  - TYPE_B: Platform faturalar
- ✅ E-Fatura entegrasyonu hazır

#### 8. **Kargo Yönetimi**
- ✅ Satıcı bazlı kargo oluşturma
- ✅ Her satıcı kendi kargosunu yönetir

---

## ⚠️ **İYİLEŞTİRİLMESİ GEREKEN ALANLAR**

### 1. **Sipariş Bölme (Order Splitting)**

**Mevcut Durum:**
- ✅ Bir siparişte birden fazla satıcıdan ürün olabilir
- ✅ Her `OrderItem` kendi `sellerId`'sine sahip

**Eksik:**
- ⚠️ Sipariş otomatik olarak satıcılara bölünmüyor
- ⚠️ Her satıcı için ayrı "sub-order" oluşturulmuyor
- ⚠️ Satıcılar sadece kendi ürünlerini görebiliyor (bu aslında iyi)

**Öneri:**
```typescript
// Yeni model: SellerOrder (Sub-Order)
model SellerOrder {
  id          String   @id @default(cuid())
  orderId     String   // Ana sipariş
  sellerId    String   // Satıcı
  status      String   // Satıcı bazlı durum
  total       Float    // Bu satıcının toplamı
  commission  Float    // Komisyon
  payoutAmount Float   // Ödenecek tutar
  items       OrderItem[] // Bu satıcının ürünleri
  
  order  Order         @relation(...)
  seller SellerProfile @relation(...)
}
```

### 2. **Satıcı Bazlı Ödeme Takibi**

**Mevcut Durum:**
- ✅ Payout sistemi var
- ✅ Settlement sistemi var

**Eksik:**
- ⚠️ Satıcı bazlı ödeme durumu takibi eksik
- ⚠️ Satıcı ne zaman ödeme alacağını göremiyor

**Öneri:**
- Satıcı dashboard'da "Bekleyen Ödemeler" bölümü
- Ödeme takvimi (haftalık/aylık)
- Ödeme geçmişi

### 3. **Satıcı Bazlı İade Yönetimi**

**Mevcut Durum:**
- ✅ `ReturnRequest` modeli var
- ✅ İade sistemi çalışıyor

**Eksik:**
- ⚠️ İade talebi hangi satıcıya ait olduğu net değil
- ⚠️ Satıcı kendi iadelerini göremiyor olabilir

**Öneri:**
```prisma
model ReturnRequest {
  // ... mevcut alanlar
  sellerId String? // Hangi satıcıya ait
  seller   SellerProfile? @relation(...)
}
```

### 4. **Satıcı Bazlı Stok Rezervasyonu**

**Mevcut Durum:**
- ✅ `StockReservation` modeli var
- ✅ Stok yönetimi çalışıyor

**Eksik:**
- ⚠️ Rezervasyon satıcı bazlı değil (ürün bazlı)
- ⚠️ Satıcı kendi stok rezervasyonlarını göremiyor

**Öneri:**
- Satıcı dashboard'da "Rezerve Edilen Stok" görünümü
- Satıcı bazlı stok uyarıları

### 5. **Satıcı Bazlı Kupon Yönetimi**

**Mevcut Durum:**
- ✅ `Coupon` modeli var
- ✅ Kupon sistemi çalışıyor

**Eksik:**
- ⚠️ Kuponlar platform bazlı (satıcı bazlı değil)
- ⚠️ Satıcı kendi kuponlarını oluşturamıyor

**Öneri:**
```prisma
model Coupon {
  // ... mevcut alanlar
  sellerId String? // Hangi satıcıya ait (null = platform kuponu)
  seller   SellerProfile? @relation(...)
}
```

### 6. **Satıcı Bazlı Müşteri Desteği**

**Mevcut Durum:**
- ✅ `SupportTicket` modeli var
- ✅ Destek sistemi çalışıyor

**Eksik:**
- ⚠️ Destek talebi hangi satıcıya ait olduğu net değil
- ⚠️ Satıcı kendi destek taleplerini göremiyor

**Öneri:**
```prisma
model SupportTicket {
  // ... mevcut alanlar
  sellerId String? // Hangi satıcıya ait
  seller   SellerProfile? @relation(...)
}
```

---

## ✅ **SONUÇ: SİSTEM ÇOK SATICILI YAPIYA UYGUN**

### Güçlü Yönler:
1. ✅ **Temel mimari hazır** - SellerProfile, OrderItem.sellerId, Payout
2. ✅ **Komisyon sistemi çalışıyor** - TYPE_A ve TYPE_B desteği
3. ✅ **Satıcı paneli mevcut** - Dashboard, ürün, sipariş yönetimi
4. ✅ **Ödeme sistemi hazır** - Payout ve Settlement
5. ✅ **Fatura yönetimi** - Satıcı tipine göre otomatik

### İyileştirme Önerileri:
1. ⚠️ **SellerOrder (Sub-Order) modeli** - Siparişleri satıcılara böl
2. ⚠️ **Satıcı bazlı iade yönetimi** - ReturnRequest'e sellerId ekle
3. ⚠️ **Satıcı bazlı kupon sistemi** - Coupon'a sellerId ekle
4. ⚠️ **Satıcı bazlı destek sistemi** - SupportTicket'e sellerId ekle
5. ⚠️ **Satıcı ödeme takibi** - Dashboard'da ödeme durumu

---

## 🚀 **ÖNERİLEN GELİŞTİRMELER**

### Öncelik 1: SellerOrder Modeli
```prisma
model SellerOrder {
  id          String   @id @default(cuid())
  orderId     String
  sellerId    String
  status      String   @default("pending")
  total       Float
  commission  Float
  payoutAmount Float
  paidAt      DateTime?
  
  order  Order         @relation(fields: [orderId], references: [id])
  seller SellerProfile @relation(fields: [sellerId], references: [id])
  items  OrderItem[]   // Bu satıcının ürünleri
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([orderId])
  @@index([sellerId])
  @@index([status])
}
```

### Öncelik 2: Satıcı Bazlı İlişkiler
- `ReturnRequest.sellerId`
- `Coupon.sellerId`
- `SupportTicket.sellerId`

### Öncelik 3: Satıcı Dashboard İyileştirmeleri
- Bekleyen ödemeler
- İade talepleri
- Destek talepleri
- Stok uyarıları

---

## 📈 **MEVCUT SİSTEMİN ÇOK SATICILI YAPIDA ÇALIŞMA ŞEKLİ**

### Senaryo: Müşteri 3 Farklı Satıcıdan Ürün Sipariş Ediyor

1. **Sipariş Oluşturma:**
   - 1 adet Order oluşturulur
   - 3 adet OrderItem oluşturulur (her biri farklı sellerId ile)

2. **Ödeme:**
   - Müşteri tek seferde ödeme yapar
   - Platform toplam tutarı alır

3. **Satıcı Görünümü:**
   - Her satıcı sadece kendi OrderItem'larını görür
   - Satıcı kendi ürünlerinin durumunu güncelleyebilir

4. **Komisyon:**
   - Her satıcı için ayrı komisyon hesaplanır
   - Satıcı tipine göre (TYPE_A veya TYPE_B)

5. **Ödeme (Payout):**
   - Her satıcı için ayrı payout oluşturulur
   - Settlement sistemi ile toplu ödeme yapılır

6. **Kargo:**
   - Her satıcı kendi kargosunu oluşturur
   - Müşteri 3 farklı kargo takip numarası alabilir

---

## ✅ **SONUÇ**

**Sistem şu anda çok satıcılı yapıya uygun!** 

Temel mimari hazır ve çalışıyor. Sadece bazı iyileştirmeler yapılarak daha iyi bir kullanıcı deneyimi sağlanabilir.

**Öncelikli İyileştirmeler:**
1. SellerOrder modeli (sub-order)
2. Satıcı bazlı ilişkiler (ReturnRequest, Coupon, SupportTicket)
3. Satıcı dashboard iyileştirmeleri

---

**Son Güncelleme:** 2025-01-XX


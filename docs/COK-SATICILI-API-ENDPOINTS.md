# 🏪 Çok Satıcılı Sistem - API Endpoint'leri

**Tarih:** 2025-01-XX  
**Durum:** ✅ Tamamlandı

---

## 📋 OLUŞTURULAN API ENDPOINT'LERİ

### 1. ✅ **İade Talepleri API**

#### `GET /api/seller/returns`
Satıcıya ait iade taleplerini listeler.

**Query Parameters:**
- `status` - İade durumu (pending, approved, rejected, processing, completed, cancelled)
- `page` - Sayfa numarası (default: 1)
- `limit` - Sayfa başına kayıt (default: 20)

**Response:**
```json
{
  "success": true,
  "returnRequests": [...],
  "pagination": {...},
  "stats": {
    "pending": 5,
    "approved": 3,
    "total": 10
  }
}
```

#### `GET /api/seller/returns/[returnId]`
Belirli bir iade talebinin detaylarını getirir.

#### `PATCH /api/seller/returns/[returnId]`
Satıcı iade talebi durumunu günceller (sadece onaylama/reddetme).

**Body:**
```json
{
  "status": "approved" | "rejected",
  "adminNotes": "Notlar..."
}
```

---

### 2. ✅ **Kupon Yönetimi API**

#### `GET /api/seller/coupons`
Satıcıya ait kuponları listeler.

**Query Parameters:**
- `status` - Kupon durumu (active, expired, inactive)
- `search` - Arama terimi
- `page` - Sayfa numarası
- `limit` - Sayfa başına kayıt

#### `POST /api/seller/coupons`
Satıcı yeni kupon oluşturur.

**Body:**
```json
{
  "code": "KUPON20",
  "name": "Yüzde 20 İndirim",
  "type": "percentage",
  "discountValue": 20,
  "minOrderAmount": 100,
  "validFrom": "2025-01-01T00:00:00Z",
  "validUntil": "2025-12-31T23:59:59Z"
}
```

#### `GET /api/seller/coupons/[couponId]`
Belirli bir kuponun detaylarını getirir.

#### `PATCH /api/seller/coupons/[couponId]`
Kuponu günceller.

#### `DELETE /api/seller/coupons/[couponId]`
Kuponu siler (soft delete - isActive: false).

---

### 3. ✅ **Destek Talepleri API**

#### `GET /api/seller/support-tickets`
Satıcıya ait destek taleplerini listeler.

**Query Parameters:**
- `status` - Ticket durumu (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- `priority` - Öncelik (LOW, MEDIUM, HIGH, URGENT)
- `category` - Kategori (order, product, payment, technical, other)
- `page` - Sayfa numarası
- `limit` - Sayfa başına kayıt

**Response:**
```json
{
  "success": true,
  "tickets": [...],
  "pagination": {...},
  "stats": {
    "open": 5,
    "inProgress": 2,
    "resolved": 10,
    "total": 17
  }
}
```

---

### 4. ✅ **Sub-Orders (SellerOrder) API**

#### `GET /api/seller/orders`
Satıcıya ait sub-orders listesini getirir.

**Query Parameters:**
- `status` - Sipariş durumu (pending, confirmed, processing, shipped, delivered, cancelled)
- `startDate` - Başlangıç tarihi
- `endDate` - Bitiş tarihi
- `page` - Sayfa numarası
- `limit` - Sayfa başına kayıt

**Response:**
```json
{
  "success": true,
  "orders": [...],
  "pagination": {...},
  "stats": {
    "byStatus": {...},
    "total": {
      "orders": 50,
      "totalRevenue": 50000,
      "totalPayout": 46000,
      "totalCommission": 4000
    }
  }
}
```

#### `GET /api/seller/orders/[sellerOrderId]`
Belirli bir sub-order'ın detaylarını getirir.

#### `PATCH /api/seller/orders/[sellerOrderId]`
Sub-order durumunu günceller.

**Body:**
```json
{
  "status": "shipped",
  "trackingNumber": "TR123456789",
  "notes": "Kargo bilgileri..."
}
```

---

## 🔐 GÜVENLİK

Tüm endpoint'ler:
- ✅ Session kontrolü yapıyor
- ✅ SELLER veya ADMIN rolü kontrolü yapıyor
- ✅ Satıcı profili kontrolü yapıyor
- ✅ Sadece satıcıya ait kayıtları döndürüyor

---

## 📊 ÖZELLİKLER

### İade Talepleri
- ✅ Satıcıya ait iade taleplerini listeleme
- ✅ İade talebi detaylarını görüntüleme
- ✅ İade talebini onaylama/reddetme
- ✅ İstatistikler (durum bazlı sayılar)

### Kupon Yönetimi
- ✅ Satıcıya ait kuponları listeleme
- ✅ Yeni kupon oluşturma
- ✅ Kupon güncelleme
- ✅ Kupon silme (soft delete)
- ✅ Kupon kullanım istatistikleri

### Destek Talepleri
- ✅ Satıcıya ait destek taleplerini listeleme
- ✅ Durum, öncelik, kategori filtreleme
- ✅ İstatistikler

### Sub-Orders
- ✅ Satıcıya ait sub-orders listesi
- ✅ Sub-order detayları
- ✅ Durum güncelleme (shipped, delivered, vb.)
- ✅ Kargo takip numarası ekleme
- ✅ İstatistikler (gelir, komisyon, payout)

---

## 🚀 SONRAKI ADIMLAR

1. ✅ API Endpoint'leri - **TAMAMLANDI**
2. ⏳ Satıcı Dashboard Sayfaları
   - İade talepleri sayfası
   - Kupon yönetimi sayfası
   - Destek talepleri sayfası
   - Sub-orders listesi ve yönetimi
3. ⏳ Admin Panel İyileştirmeleri

---

**Son Güncelleme:** 2025-01-XX


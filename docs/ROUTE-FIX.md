# 🔧 Route Çakışması Düzeltildi

**Tarih:** 2025-01-XX  
**Sorun:** Next.js route çakışması - `[orderId]` ve `[sellerOrderId]` aynı seviyede

---

## ❌ SORUN

Next.js build hatası:
```
Error: You cannot use different slug names for the same dynamic path ('orderId' !== 'sellerOrderId').
```

**Neden:**
- `app/api/seller/orders/[orderId]/status/route.ts` - OrderItem durum güncelleme
- `app/api/seller/orders/[sellerOrderId]/route.ts` - SellerOrder yönetimi

Aynı path seviyesinde farklı slug isimleri kullanılamaz.

---

## ✅ ÇÖZÜM

`[orderId]/status` route'u yeni bir path'e taşındı:

**Eski:** `/api/seller/orders/[orderId]/status`  
**Yeni:** `/api/seller/order-items/[orderId]/status`

---

## 📋 DEĞİŞİKLİKLER

### Dosya Taşıma
- ✅ `app/api/seller/orders/[orderId]/status/route.ts` → `app/api/seller/order-items/[orderId]/status/route.ts`
- ✅ Eski dosya silindi

### Yeni Route Yapısı
```
app/api/seller/
  ├── orders/
  │   ├── [sellerOrderId]/route.ts  ← SellerOrder yönetimi
  │   └── route.ts                  ← SellerOrder listesi
  └── order-items/
      └── [orderId]/
          └── status/route.ts       ← OrderItem durum güncelleme
```

---

## 🔄 API DEĞİŞİKLİKLERİ

### Eski Endpoint (Kaldırıldı)
```
PATCH /api/seller/orders/[orderId]/status
```

### Yeni Endpoint
```
PATCH /api/seller/order-items/[orderId]/status
```

**Not:** Bu endpoint OrderItem'ların durumunu günceller (eski sistem).  
SellerOrder yönetimi için `/api/seller/orders/[sellerOrderId]` kullanılır (yeni sistem).

---

## ⚠️ BREAKING CHANGE

Eğer frontend'de bu endpoint kullanılıyorsa güncellenmelidir:

```typescript
// Eski
fetch(`/api/seller/orders/${orderId}/status`, { ... })

// Yeni
fetch(`/api/seller/order-items/${orderId}/status`, { ... })
```

---

## ✅ SONUÇ

Route çakışması çözüldü. Next.js build artık başarılı olacak.

---

**Son Güncelleme:** 2025-01-XX


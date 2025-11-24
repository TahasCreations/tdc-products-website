# Geliştirme Günlüğü

## 2025-11-11 – Satıcı Paneli Temelleri
- Satıcı başvuru modeline yeni çok adımlı form alanlarını ve süreç günlüklerini ekledik (`prisma.schema` güncellemesi).
- `partner/seller/dashboard` artık `getSellerDashboardData` aracılığıyla gerçek satış, sipariş ve ödeme metriklerini çekiyor.
- Satıcı paneli için yeni API uçları: `GET /api/seller/dashboard`, `GET /api/seller/products`, `GET /api/seller/orders`, `GET /api/seller/payouts`.
- `SellerDashboardContent` bileşeni gerçek zamanlı KPI kartları, son siparişler, düşük stok uyarıları ve ödeme geçmişini dinamik olarak gösteriyor.

## 2025-11-11 – Satıcı Ürün/Sipariş/Finans Modülleri
- `OrderItem` modeline durum, kargo ve takip alanları eklendi; `Order.updatedAt` otomatik güncelleniyor.
- Satıcı ürün yönetimi API'leri genişletildi: `POST /api/seller/products`, `PATCH/DELETE /api/seller/products/[id]` ile slug üretimi ve JSON alanları normalize edildi.
- Yeni istemci bileşenleri (`SellerProductsContent`, `SellerOrdersContent`) ile ürün ekleme, stok yönetimi, sipariş durumu güncelleme ve gerçek zamanlı tablo kontrolleri sağlandı.
- Sipariş durum güncellemesi için `PATCH /api/seller/orders/[orderId]/status` eklendi; tüm panel UI'ları bu uçlara bağlandı.
- Payout raporu gerçek API verileriyle besleniyor (`GET /api/seller/payouts`), finansal özetler `getSellerFinancialSnapshot` üzerinden paylaşılıyor, `POST /api/seller/payouts/request` ile bakiye çekim isteği açılabiliyor.

## 2025-11-11 – Transactional Email Bildirimleri (Task-9) ✅
- Email template sistemi genişletildi: Satıcı/Influencer başvuru onay/red, ödeme başarısı, kargo gönderimi ve teslimat bildirimleri için HTML template'ler eklendi.
- `src/lib/email.ts` içine 7 yeni transactional email fonksiyonu eklendi: `sendSellerApplicationApproved`, `sendSellerApplicationRejected`, `sendInfluencerApplicationApproved`, `sendInfluencerApplicationRejected`, `sendPaymentSuccess`, `sendOrderShipped`, `sendOrderDelivered`.
- Satıcı başvuru onay/red akışlarına email bildirimleri entegre edildi (`lib/seller-application-admin.ts`).
- Influencer başvuru onay/red akışlarına email bildirimleri entegre edildi (`lib/influencer-application-admin.ts`).
- PayTR ve Iyzico ödeme callback'lerine ödeme başarı email bildirimi eklendi.
- Satıcı sipariş durumu güncelleme endpoint'ine (`/api/seller/orders/[orderId]/status`) kargo gönderimi ve teslimat email bildirimleri eklendi.
- Sipariş oluşturma endpoint'ine (`/api/orders`) sipariş onay email bildirimi eklendi.
- `env.example` dosyasına SMTP ve SendGrid konfigürasyon bilgileri eklendi (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SENDGRID_API_KEY, SENDGRID_FROM_EMAIL).
- Tüm email gönderimleri hata durumunda transaction'ı etkilemeyecek şekilde try-catch ile korundu.

## 2025-01-XX – Faz 3: Ödeme Yöntemleri (Havale/EFT, Kapıda Ödeme) ✅
- **Havale/EFT Ödeme Sistemi**:
  - `lib/payments/bank-transfer.ts` - Havale/EFT ödeme işlemcisi oluşturuldu
  - `app/api/payment/bank-transfer/create/route.ts` - Havale/EFT ödeme oluşturma API'si
  - `app/api/payment/bank-transfer/verify/route.ts` - Ödeme onaylama/red API'si (admin)
  - `app/api/payment/bank-transfer/remind/route.ts` - Ödeme hatırlatma email API'si
  - Otomatik ödeme talimatları email'i (`sendBankTransferInstructions`)
  - Ödeme hatırlatma email'i (`sendPaymentReminder`)
  - Ödeme son tarihi yönetimi (varsayılan 3 gün)
  - Süresi dolan ödemeleri otomatik iptal etme
- **Banka Hesap Yönetimi**:
  - `app/api/admin/bank-accounts/route.ts` - Banka hesap CRUD API'si
  - `app/api/admin/bank-accounts/[id]/route.ts` - Banka hesap güncelleme/silme API'si
  - Prisma schema'ya `BankAccount` modeli eklendi
  - Çoklu banka hesabı desteği
  - Default banka hesabı belirleme
- **Kapıda Ödeme (COD) Sistemi**:
  - `app/api/seller/orders/[orderId]/status/route.ts` - Kapıda ödeme entegrasyonu
  - Kargo teslim edildiğinde otomatik ödeme onayı
  - Post-payment processing entegrasyonu
- **Prisma Schema Güncellemeleri**:
  - `BankAccount` modeli eklendi (banka hesap bilgileri)
  - `PaymentTransaction` modeli eklendi (havale/EFT ödeme işlemleri)
  - `Order` modeline `paymentTransaction` ilişkisi eklendi
  - `User` modeline `paymentTransactions` ilişkisi eklendi
- **Order API Güncellemeleri**:
  - `app/api/orders/route.ts` - Havale/EFT ödeme yöntemi için otomatik payment transaction oluşturma
- **Özellikler**:
  - Havale/EFT ödeme talimatları email'i
  - Ödeme hatırlatma email sistemi
  - Admin ödeme onaylama/red sistemi
  - Banka hesap yönetimi (CRUD)
  - Kapıda ödeme otomatik işleme
  - Süresi dolan ödemeleri otomatik iptal

## 2025-01-XX – Faz 2: Kargo Entegrasyonları ✅
- **Kargo Adapter Sistemi**:
  - `lib/shipping/base-adapter.ts` - Base shipping adapter interface oluşturuldu
  - `lib/shipping/yurtici-adapter.ts` - Yurtiçi Kargo adapter
  - `lib/shipping/aras-adapter.ts` - Aras Kargo adapter
  - `lib/shipping/mng-adapter.ts` - MNG Kargo adapter
  - `lib/shipping/shipping-manager.ts` - Tüm adapter'ları yöneten merkezi manager
- **Kargo API Endpoint'leri**:
  - `app/api/shipping/create/route.ts` - Kargo gönderi oluşturma API'si
  - `app/api/shipping/track/route.ts` - Kargo takip API'si
  - `app/api/shipping/label/[trackingNumber]/route.ts` - Kargo etiket indirme API'si
  - `app/api/shipping/webhook/route.ts` - Kargo webhook handler (durum güncellemeleri)
  - `app/api/shipping/calculate/route.ts` - Gerçek kargo API'leri ile entegre edildi
- **Seller Order Status Entegrasyonu**:
  - `app/api/seller/orders/[orderId]/status/route.ts` - Otomatik kargo oluşturma eklendi
  - Sipariş "shipped" durumuna geçtiğinde otomatik kargo oluşturma
- **Environment Variables**:
  - Yurtiçi, Aras, MNG Kargo API bilgileri için env variables eklendi
- **Özellikler**:
  - Çoklu kargo firması desteği
  - Gerçek zamanlı fiyat teklifi alma
  - Otomatik kargo gönderi oluşturma
  - Kargo takip entegrasyonu
  - Kargo etiket indirme
  - Webhook ile otomatik durum güncellemeleri
  - Mock response desteği (API bilgileri yoksa)

## 2025-01-XX – Faz 1: Yasal Zorunluluklar (KVKK, Mesafeli Satış, İade, E-Fatura) ✅
- **KVKK Uyumluluk Sistemi**: 
  - `lib/kvkk/compliance.ts` - KVKK uyumluluk servisi oluşturuldu
  - `app/(marketing)/kvkk/page.tsx` - KVKK aydınlatma metni sayfası eklendi
  - `app/api/kvkk/consent/route.ts` - Onay kayıt API'si
  - `app/api/kvkk/export/route.ts` - Veri export API'si (veri taşınabilirliği hakkı)
  - `app/api/kvkk/delete/route.ts` - Veri silme API'si (unutulma hakkı)
  - `components/kvkk/CookieConsentBanner.tsx` - Cookie consent banner eklendi
  - Cookie consent banner layout'a entegre edildi
- **Mesafeli Satış Sözleşmesi**:
  - `app/(marketing)/mesafeli-satis-sozlesmesi/page.tsx` - Sözleşme sayfası oluşturuldu
  - `app/api/orders/route.ts` - Sipariş oluşturma sırasında mesafeli satış sözleşmesi onayı kaydediliyor
  - Sipariş API'sine `distanceSalesAgreementAccepted` zorunlu alanı eklendi
- **İade/Değişim Sistemi**:
  - Prisma schema'ya `ReturnRequest` modeli eklendi
  - `app/api/returns/route.ts` - İade talebi oluşturma ve listeleme API'si
  - `app/api/returns/[returnId]/route.ts` - İade talebi detay ve güncelleme API'si
  - `app/(dynamic)/iade/page.tsx` - İade başvuru formu sayfası
  - 14 günlük cayma hakkı kontrolü implement edildi
  - İade sebep kategorileri eklendi (ürün hatası, yanlış ürün, vb.)
  - Fotoğraf yükleme desteği eklendi
- **İade Ödeme Sistemi**:
  - `lib/returns/refund-processor.ts` - İade ödeme işlemcisi oluşturuldu
  - Orijinal ödeme yöntemine iade (Iyzico entegrasyonu)
  - Mağaza kredisi olarak iade (Loyalty points sistemi)
  - Banka havalesi ile iade (manuel işlem için payout kaydı)
  - İade onaylandığında otomatik ödeme işlemi
  - İade tamamlandığında stok güncellemesi
  - İade bildirim email'i (`sendRefundNotification`)
- **E-Fatura Entegrasyonu**:
  - `lib/invoice/efatura-adapter.ts` - E-Fatura adapter oluşturuldu
  - `app/api/invoices/create/route.ts` - Fatura oluşturma API'si
  - `app/api/invoices/[invoiceNumber]/pdf/route.ts` - Fatura PDF endpoint'i
  - E-Fatura ve E-Arşiv fatura desteği
  - Post-payment processor'a otomatik fatura oluşturma eklendi (company seller için)
  - GIB API entegrasyonu için temel yapı hazır (gerçek API bilgileri gerekli)
- **Schema Güncellemeleri**:
  - `ConsentLog` modeli eklendi (KVKK onay kayıtları)
  - `DistanceSalesAgreement` modeli eklendi (mesafeli satış sözleşmesi onayları)
  - `ReturnRequest` modeli eklendi (iade talepleri)
  - User, Order, OrderItem modellerine ilişkiler eklendi

## 2025-01-XX – Ödeme Sonrası İşlem Sistemi (Post-Payment Processor) ✅
- **Yeni Dosya**: `lib/post-payment-processor.ts` - Ödeme başarılı olduktan sonra tüm işlemleri yöneten merkezi sistem oluşturuldu.
- **Stok Güncelleme Sistemi**: Ödeme başarılı olduğunda siparişteki tüm ürünlerin stoğu otomatik olarak düşürülüyor. Yetersiz stok durumunda hata loglanıyor, düşük stok (10 adet altı) durumunda uyarı veriliyor.
- **Komisyon Hesaplama Sistemi**: Satıcı tipine göre (individual: %10, company: %7) komisyon hesaplanıyor, KDV (%18) ekleniyor ve toplam komisyon hesaplanıyor. Her satıcı için ayrı ayrı hesaplama yapılıyor.
- **Payout Kaydı Oluşturma**: Her satıcı için otomatik olarak payout kaydı oluşturuluyor. Payout kaydında sipariş detayları, komisyon hesaplamaları ve tüm finansal bilgiler meta alanında saklanıyor.
- **Email Bildirimleri**: 
  - Müşterilere sipariş onay email'i gönderiliyor (`sendOrderConfirmation`)
  - Satıcılara yeni sipariş bildirimi gönderiliyor (`sendSellerNewOrder`)
- **PayTR Callback Entegrasyonu**: `app/api/payment/paytr/callback/route.ts` dosyasına post-payment processor entegre edildi. Ödeme başarılı olduğunda tüm işlemler otomatik olarak tetikleniyor.
- **Iyzico Entegrasyonu**: `app/api/payment/iyzico/route.ts` dosyasına post-payment processor entegre edildi. Ödeme başarılı olduğunda tüm işlemler otomatik olarak tetikleniyor.
- **Email Template Güncellemeleri**: 
  - `OrderConfirmationData` interface'i genişletildi (paymentMethod, orderUrl, title/qty desteği)
  - `sendSellerNewOrder` fonksiyonu eklendi ve HTML template'i oluşturuldu
  - Email template'lerinde eski ve yeni format desteği sağlandı
- **Schema Güncellemesi**: `SellerProfile` modeline `sellerType` field'ı eklendi (default: "individual", company/individual desteği).
- **Hata Yönetimi**: Tüm işlemler try-catch ile korunuyor, hatalar loglanıyor ancak ödeme işlemi başarılı olduğu için callback başarısız olmuyor. Hatalar daha sonra retry edilebilir şekilde tasarlandı.
- **Build Kontrolü**: Tüm değişiklikler build edildi ve başarılı oldu.



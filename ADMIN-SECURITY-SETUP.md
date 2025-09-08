# Admin Güvenlik Sistemi Kurulumu

Bu dokümantasyon, TDC Products web sitesi için yeni admin güvenlik sisteminin nasıl kurulacağını ve kullanılacağını açıklar.

## 🔒 Güvenlik Açığı Çözümü

**Önceki Durum**: Normal kullanıcılar Supabase auth ile giriş yaparak admin paneline erişebiliyordu.

**Yeni Durum**: Sadece özel admin kullanıcıları admin paneline erişebilir.

## 🏗️ Sistem Mimarisi

### 1. Ana Admin (Main Admin)
- **E-posta**: `bentahasarii@gmail.com`
- **Şifre**: `35sandalye`
- **Yetkiler**: Tüm admin işlemleri + diğer admin kullanıcıları yönetme

### 2. Alt Adminler (Sub Admins)
- Ana admin tarafından oluşturulan kullanıcılar
- Sadece belirli admin işlemlerini yapabilir
- Ana admin yetkilerine sahip değil

## 📋 Kurulum Adımları

### 1. Veritabanı Güncellemesi

`admin-users-setup.sql` dosyasını Supabase SQL Editor'de çalıştırın:

```sql
-- Admin kullanıcıları tablosu güncellenir
-- Ana admin kullanıcısı eklenir
-- RLS politikaları ayarlanır
```

### 2. Yeni Dosyalar

Aşağıdaki dosyalar oluşturuldu:

- `src/app/api/admin-auth/route.ts` - Admin giriş API'si
- `src/app/api/admin-users/route.ts` - Admin kullanıcı yönetimi API'si
- `src/app/admin/login/page.tsx` - Admin giriş sayfası
- `src/components/AdminProtection.tsx` - Admin sayfa koruması
- `src/app/admin/dashboard/page.tsx` - Admin kullanıcı yönetimi sayfası

### 3. Güncellenen Dosyalar

- `src/contexts/AuthContext.tsx` - Admin durumu kontrolü eklendi
- `src/app/admin/page.tsx` - Yeni admin dashboard
- `src/app/admin/blogs/page.tsx` - Admin koruması eklendi
- `src/app/admin/comments/page.tsx` - Admin koruması eklendi

## 🚀 Kullanım

### Admin Girişi

1. `/admin/login` sayfasına gidin
2. Ana admin bilgileri ile giriş yapın:
   - E-posta: `bentahasarii@gmail.com`
   - Şifre: `35sandalye`

### Admin Kullanıcı Yönetimi

1. Admin paneline giriş yaptıktan sonra
2. "Admin Kullanıcıları" menüsüne tıklayın
3. Yeni admin kullanıcıları ekleyin, düzenleyin veya silin

### Admin Sayfaları

Tüm admin sayfaları artık koruma altındadır:
- `/admin` - Ana dashboard
- `/admin/dashboard` - Admin kullanıcı yönetimi
- `/admin/blogs` - Blog yönetimi
- `/admin/comments` - Yorum yönetimi

## 🔐 Güvenlik Özellikleri

### 1. Çift Katmanlı Kimlik Doğrulama
- Supabase Auth (normal kullanıcılar için)
- Admin Auth (admin kullanıcıları için)

### 2. Şifre Güvenliği
- Bcrypt ile hash'lenmiş şifreler
- Güçlü şifre politikaları

### 3. Yetki Kontrolü
- Ana admin vs alt admin ayrımı
- Sayfa bazında yetki kontrolü

### 4. Session Yönetimi
- LocalStorage ile admin session
- Otomatik çıkış ve yeniden yönlendirme

## 🛠️ API Endpoints

### Admin Auth
- `POST /api/admin-auth` - Admin girişi

### Admin Users
- `GET /api/admin-users` - Admin kullanıcıları listele
- `POST /api/admin-users` - Yeni admin kullanıcı ekle
- `PUT /api/admin-users` - Admin kullanıcı güncelle
- `DELETE /api/admin-users` - Admin kullanıcı sil

## 📝 Önemli Notlar

1. **Veritabanı Güncellemesi**: `admin-users-setup.sql` dosyasını mutlaka çalıştırın
2. **Environment Variables**: Supabase environment variables'ların doğru ayarlandığından emin olun
3. **Ana Admin**: İlk kurulumda sadece ana admin giriş yapabilir
4. **Güvenlik**: Admin şifrelerini güvenli tutun ve düzenli olarak değiştirin

## 🔧 Sorun Giderme

### Admin Giriş Yapamıyorum
1. Veritabanında admin kullanıcısının var olduğunu kontrol edin
2. Şifrenin doğru olduğundan emin olun
3. Console'da hata mesajlarını kontrol edin

### Admin Sayfalarına Erişemiyorum
1. Admin girişi yaptığınızdan emin olun
2. LocalStorage'da admin bilgilerinin olduğunu kontrol edin
3. Browser'ı yenileyin

### Yeni Admin Ekleyemiyorum
1. Ana admin olarak giriş yaptığınızdan emin olun
2. API endpoint'lerinin çalıştığını kontrol edin
3. Veritabanı bağlantısını kontrol edin

## 📞 Destek

Herhangi bir sorun yaşarsanız, sistem loglarını kontrol edin ve gerekirse geliştirici ekibiyle iletişime geçin.

# Global Görsel Yönetim Modülü

TDC Market projesi için kapsamlı görsel yönetim sistemi. Tüm görselleri tek yerden yönetin, optimize edin ve izleyin.

## 📋 İçindekiler

- [Özellikler](#özellikler)
- [Kurulum](#kurulum)
- [Konfigürasyon](#konfigürasyon)
- [Kullanım](#kullanım)
- [API Referansı](#api-referansı)
- [Sınırlamalar](#sınırlamalar)
- [Sorun Giderme](#sorun-giderme)

## ✨ Özellikler

### Otomatik İndeksleme
- `public/`, `app/`, `components/` dizinlerindeki tüm görselleri tarar
- `<Image>`, `<img>`, CSS `url()` kullanımlarını tespit eder
- Görsel metadata'sını otomatik olarak çıkarır (boyut, format, dominant renk)
- Kullanım haritası oluşturur (hangi dosya, satır, component)

### Admin UI
- `/admin/media` route'unda kullanıcı dostu arayüz
- Gelişmiş filtreleme ve arama
- Gerçek zamanlı önizleme
- Toplu işlemler
- Kullanım haritası görüntüleme

### Görsel İşlemleri
- Alt metin düzenleme (tekil ve toplu)
- Tag yönetimi
- Durum güncelleme (ACTIVE, DEPRECATED, MISSING)
- Görsel değiştirme (replace) ve rollback
- WebP/AVIF optimizasyonu

### Güvenlik
- Admin-only erişim
- Rate limiting
- CSRF koruması
- İşlem loglama ve audit trail

## 🚀 Kurulum

### 1. Veritabanı Migrasyonu

```bash
npx prisma generate
npx prisma db push
```

### 2. Bağımlılıklar

Tüm gerekli paketler zaten `package.json`'da mevcut:
- `@prisma/client` - Database ORM
- `sharp` - Image processing
- `@babel/parser` - Code parsing
- `glob` - File scanning
- `zod` - Validation

### 3. İlk İndeksleme

```bash
# Dry run (test)
pnpm media:index:dry

# Gerçek indeksleme
pnpm media:index
```

## ⚙️ Konfigürasyon

`.env` veya `.env.local` dosyanıza ekleyin:

```bash
# === MEDIA MANAGEMENT CONFIGURATION ===

# Media storage type: local (public/) or gcs (Google Cloud Storage)
MEDIA_STORAGE=local

# Google Cloud Storage (optional, only if MEDIA_STORAGE=gcs)
GCS_BUCKET=your-bucket-name
GCS_PROJECT_ID=your-project-id
GCS_KEY_FILE=/path/to/keyfile.json

# Enable image optimization (WebP/AVIF conversion)
ENABLE_IMAGE_OPTIMIZATION=false

# Check external image URLs (HEAD request to validate)
EXTERNAL_CHECK=false

# Rate limit for media write operations (per minute)
MEDIA_RATE_LIMIT_WRITE_PER_MIN=30

# Maximum upload size in MB
MEDIA_MAX_UPLOAD_MB=20

# Allow replacing remote (external) URLs
MEDIA_ALLOW_REMOTE_REPLACE=false
```

### Varsayılan Değerler

- `MEDIA_STORAGE`: `local` (GCS olmadan da çalışır)
- `ENABLE_IMAGE_OPTIMIZATION`: `false` (performans için)
- `EXTERNAL_CHECK`: `false` (dış URL'lere HEAD isteği yapmaz)
- `MEDIA_RATE_LIMIT_WRITE_PER_MIN`: `30`
- `MEDIA_MAX_UPLOAD_MB`: `20`

## 📖 Kullanım

### CLI Komutları

```bash
# İndeksleme
pnpm media:index              # Tüm görselleri indeksle
pnpm media:index:dry          # Dry run (rapor üret, DB yazma)

# Optimizasyon
pnpm media:optimize           # Seçili görselleri optimize et
```

### Admin UI Kullanımı

1. **Erişim**: `http://localhost:3000/admin/media`
2. **Yetki**: Admin kullanıcı olarak giriş yapmalısınız

#### Filtreleme
- **Ara**: Dosya adı, URL, alt metin bazlı arama
- **Format**: jpg, png, svg, webp, etc.
- **Durum**: ACTIVE, DEPRECATED, MISSING
- **Depolama**: LOCAL, GCS, REMOTE
- **Alt Metin**: Var/Yok
- **Boyut**: Min/Max KB

#### Tekil İşlemler
1. Görsele tıklayın
2. Detay panelinde:
   - Alt metin düzenle
   - Durum değiştir
   - Kullanım haritasını görüntüle

#### Toplu İşlemler
1. Görselleri seçin (checkbox)
2. Toplu işlem butonlarından birini seçin:
   - **Alt Metin**: Tüm seçililer için aynı alt metin
   - **Etiketler**: Ekle/Çıkar
   - **Durum**: ACTIVE/DEPRECATED/MISSING
   - **Optimize Et**: WebP/AVIF'e dönüştür (ENABLE_IMAGE_OPTIMIZATION=true gerekli)

### API Kullanımı

Tüm API endpoint'leri admin yetkilendirmesi gerektirir (`admin-token` cookie).

#### Görselleri Listele
```bash
GET /api/media/assets?page=1&limit=20&format=jpg&status=ACTIVE
```

#### Görsel Detayı
```bash
GET /api/media/assets/:id
```

#### Alt Metin Güncelle
```bash
POST /api/media/assets/:id/alt
Content-Type: application/json

{
  "alt": "Yeni alt metin",
  "title": "Başlık (opsiyonel)"
}
```

#### Tag Ekle/Çıkar
```bash
POST /api/media/assets/:id/tags
Content-Type: application/json

{
  "action": "add",
  "tags": ["ürün", "banner"]
}
```

#### Durum Güncelle
```bash
POST /api/media/assets/:id/status
Content-Type: application/json

{
  "status": "DEPRECATED"
}
```

#### Görsel Değiştir (Replace)
```bash
POST /api/media/replace
Content-Type: multipart/form-data

assetId: xxx-xxx-xxx
file: [binary]
keepOriginal: true
```

#### Optimizasyon
```bash
POST /api/media/optimize
Content-Type: application/json

{
  "assetIds": ["id1", "id2"],
  "format": "webp",
  "quality": 80
}
```

#### Toplu İşlem
```bash
POST /api/media/bulk
Content-Type: application/json

{
  "assetIds": ["id1", "id2"],
  "action": "updateAlt",
  "data": {
    "alt": "Yeni alt metin"
  }
}
```

#### Manuel Reindex
```bash
POST /api/media/reindex
```

## 📊 Veri Modeli

### MediaAsset

| Alan | Tip | Açıklama |
|------|-----|----------|
| `id` | String | Unique ID |
| `url` | String | Görsel URL (unique) |
| `storage` | Enum | LOCAL, GCS, REMOTE |
| `path` | String | Dosya path'i |
| `filename` | String | Dosya adı |
| `width` | Int? | Genişlik (px) |
| `height` | Int? | Yükseklik (px) |
| `format` | String? | jpg, png, svg, etc. |
| `sizeBytes` | Int? | Dosya boyutu |
| `dominantColor` | String? | Hex color |
| `alt` | String? | Alt metin |
| `title` | String? | Başlık |
| `tags` | JSON | Tag array |
| `status` | Enum | ACTIVE, DEPRECATED, MISSING |
| `usedIn` | JSON | Kullanım yerleri array |
| `metadata` | JSON? | Ek metadata |
| `lastIndexedAt` | DateTime | Son indeksleme |

### MediaHistory

Her değişiklik için log:
- `action`: replace, update, optimize, deprecate
- `performedBy`: Admin email
- `oldValue`: Önceki değer
- `newValue`: Yeni değer

## ⚠️ Sınırlamalar

### Bilinen Kısıtlamalar

1. **Dinamik Import'lar**: Runtime'da oluşturulan image path'leri tespit edilemez
   ```js
   // ❌ Tespit edilemez
   const imgPath = `/products/${productId}.jpg`;
   <img src={imgPath} />
   ```

2. **Base64 Inline Images**: Data URL'ler indekslenemez

3. **Remote Replace**: Harici URL'lerdeki görseller varsayılan olarak değiştirilemez
   - `MEDIA_ALLOW_REMOTE_REPLACE=true` ile açılabilir (riskli)

4. **GCS Dependencies**: GCS kullanımı için ayrı credentials gerekli

5. **Büyük Repolar**: 10k+ görsel için initial indexing uzun sürebilir
   - Dry run ile test edin
   - Background job olarak çalıştırın

6. **SVG Optimization**: SVG dosyaları Sharp ile işlenemez

### Performans Notları

- İndeksleme: ~100-200 dosya/sn
- Optimize: Format ve görsel boyutuna bağlı (1-3sn/görsel)
- Rate Limiting: Write işlemleri dakikada 30 (config'den değiştirilebilir)

## 🔧 Sorun Giderme

### "Image not found" hatası

```bash
# Public dizinini kontrol edin
ls -la public/

# Reindex yapın
pnpm media:index
```

### Optimizasyon çalışmıyor

```bash
# .env kontrol edin
ENABLE_IMAGE_OPTIMIZATION=true

# Sharp kurulu mu?
npm list sharp
```

### Rate limit aşıldı

```env
# .env'de artırın
MEDIA_RATE_LIMIT_WRITE_PER_MIN=60
```

### Prisma client güncel değil

```bash
npx prisma generate
```

## 🛡️ Güvenlik

### Best Practices

1. **Admin-Only Access**: Tüm endpoint'ler admin yetkisi kontrol eder
2. **Rate Limiting**: DoS koruması
3. **File Upload Validation**: Boyut ve tip kontrolü
4. **Audit Trail**: Her değişiklik loglanır
5. **Backup**: Replace işlemleri orijinali `.backup/` altına kopyalar

### Production Checklist

- [ ] `JWT_SECRET` güçlü ve unique
- [ ] `MEDIA_MAX_UPLOAD_MB` uygun değer
- [ ] Rate limit ayarları kontrol edildi
- [ ] GCS credentials güvenli saklanıyor (secret manager)
- [ ] Admin kullanıcıları sınırlı

## 📝 Changelog

### v1.0.0 (2025-01-23)
- ✨ İlk release
- 🚀 Auto-indexing
- 🎨 Admin UI
- 🔧 API endpoints
- 📊 Usage tracking
- 🖼️ Image optimization
- 🔒 Security & rate limiting

## 🤝 Katkıda Bulunma

Sorun veya öneriniz varsa issue açın. Pull request'ler memnuniyetle karşılanır.

## 📄 Lisans

Bu modül TDC Market projesinin bir parçasıdır.


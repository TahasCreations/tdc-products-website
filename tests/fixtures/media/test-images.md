# Test Media Fixtures

Bu dizin test görselleri için kullanılır.

## Test Görselleri

Media management modülünü test etmek için aşağıdaki görselleri kullanabilirsiniz:

### 1. sample-product.jpg
- 800x600 px
- JPEG format
- Örnek ürün görseli

### 2. banner-hero.png
- 1920x1080 px
- PNG format
- Şeffaf arka plan

### 3. logo.svg
- Vector format
- SVG

### 4. thumbnail.webp
- 300x300 px
- WebP format
- Optimize edilmiş küçük görsel

## Test Senaryoları

### İndeksleme Testi
```bash
# Test görsellerini public/ altına kopyala
cp tests/fixtures/media/*.{jpg,png,svg,webp} public/test-images/

# İndeksle
pnpm media:index:dry

# Temizle
rm -rf public/test-images/
```

### Optimizasyon Testi
```bash
# Test görseli ekle
cp tests/fixtures/media/sample-product.jpg public/

# İndeksle
pnpm media:index

# Admin UI'dan optimize et veya:
# pnpm media:optimize
```

### Alt Metin Testi
```bash
# Admin UI'dan:
# 1. Görsele tıkla
# 2. Alt metin ekle
# 3. Kaydet
# 4. API'dan kontrol et:
curl http://localhost:3000/api/media/assets?search=sample-product
```

## Gerçek Görseller

Test için gerçek görseller eklemek isterseniz:

```bash
# Public dizinine örnek görseller ekleyin
mkdir -p public/test-images
# Görselleri ekleyin...

# İndeksleyin
pnpm media:index
```

## Temizlik

Test sonrası:

```bash
# Test görsellerini sil
rm -rf public/test-images/

# Veritabanından sil (opsiyonel)
npx prisma studio
# MediaAsset tablosundan test verilerini silin
```


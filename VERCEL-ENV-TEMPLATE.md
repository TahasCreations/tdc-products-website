# 🔧 Vercel Environment Variables

## Vercel Dashboard'da Ayarlanacak Environment Variables:

### 1. Temel Konfigürasyon
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://tdcmarket.com
```

### 2. Analytics & Tracking
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_HOTJAR_ID=XXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token
```

### 3. Revalidation
```env
REVALIDATE_SECRET=your-secret-key-here-32-chars-min
```

### 4. Database (Opsiyonel)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/tdcmarket
```

### 5. External APIs (Opsiyonel)
```env
UNSPLASH_ACCESS_KEY=your-unsplash-key
MEILISEARCH_HOST=https://your-meilisearch.com
MEILISEARCH_API_KEY=your-meilisearch-key
```

### 6. Payment Providers (Opsiyonel)
```env
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
IYZICO_API_KEY=your-iyzico-key
IYZICO_SECRET_KEY=your-iyzico-secret
```

### 7. Email Service (Opsiyonel)
```env
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@tdcmarket.com
```

### 8. Storage (Opsiyonel)
```env
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=tdcmarket-media
```

### 9. Redis (Opsiyonel)
```env
REDIS_URL=redis://localhost:6379
```

### 10. JWT (Opsiyonel)
```env
JWT_SECRET=your-jwt-secret-key-32-chars-min
```

### 11. Vercel Otomatik (Değiştirme)
```env
VERCEL_URL=your-vercel-url
VERCEL_ENV=production
```

## 🎯 Minimum Gerekli Variables:

Sadece bu 3 tanesi zorunlu:
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://tdcmarket.com
REVALIDATE_SECRET=your-secret-key-here
```

## 📝 Vercel Dashboard'da Ayarlama:

1. **Vercel Dashboard** → **Project Settings** → **Environment Variables**
2. **Name** ve **Value** alanlarını doldur
3. **Environment**: Production seç
4. **Save** butonuna tıkla
5. **Redeploy** yap

## 🔒 Güvenlik Notları:

- **REVALIDATE_SECRET**: En az 32 karakter, güçlü bir şifre
- **JWT_SECRET**: En az 32 karakter, güçlü bir şifre
- **API Keys**: Gerçek değerlerle değiştir
- **Database URL**: Production veritabanı URL'i kullan

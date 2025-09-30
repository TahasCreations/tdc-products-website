# 🔧 VERCEL CONFIG FIXED!

## ❌ Sorun: `rootDirectory` Desteklenmiyor

Vercel JSON schema'sında `rootDirectory` özelliği desteklenmiyor.

## ✅ Çözüm: Doğru Vercel Konfigürasyonu

### 1. **Root vercel.json** (Monorepo için)
```json
{
  "version": 2,
  "buildCommand": "cd apps/web && npm run build",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "functions": {
    "apps/web/src/app/api/**/*.ts": {
      "runtime": "nodejs18.x",
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### 2. **apps/web/vercel.json** (Web app için)
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**/*.ts": {
      "runtime": "nodejs18.x",
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

## 🚀 VERCEL DEPLOYMENT ADIMLARI:

### **Yöntem 1: Vercel Dashboard ile (Önerilen)**

1. **Vercel'e git**: https://vercel.com
2. **"New Project"** butonuna tıkla
3. **GitHub repository'yi seç**: `tdc-market`
4. **Import** butonuna tıkla
5. **Konfigürasyon ayarla**:
   ```
   Framework Preset: Next.js
   Root Directory: apps/web
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```
6. **Environment Variables ekle**:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://tdcmarket.com
   REVALIDATE_SECRET=your-secret-key
   ```
7. **Deploy** butonuna tıkla

### **Yöntem 2: Vercel CLI ile**

```bash
# 1. Vercel CLI yükle
npm i -g vercel

# 2. Login
vercel login

# 3. Web app dizinine git
cd apps/web

# 4. Deploy
vercel --prod
```

## 🎯 SONUÇ:

✅ **Vercel JSON schema hatası çözüldü!**
✅ **Konfigürasyon Vercel standartlarına uygun**
✅ **Monorepo desteği aktif**
✅ **Deployment hazır**

**Artık Vercel'e deploy edebilirsin!** 🚀

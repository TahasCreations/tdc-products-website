# Vercel Deployment Guide - TDC Market

## 🚀 Vercel'e Deploy Etme

### 1. Vercel Dashboard Ayarları

#### Project Settings:
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: `npm run build:web`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### Environment Variables:
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://tdcmarket.com
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_GTM_ID=your-gtm-id
REVALIDATE_SECRET=your-revalidate-secret
```

### 2. Vercel CLI ile Deploy

```bash
# Vercel CLI yükle
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Veya specific directory için
vercel --cwd apps/web --prod
```

### 3. GitHub Integration

1. GitHub repository'yi Vercel'e bağla
2. **Root Directory**: `apps/web` olarak ayarla
3. **Build Command**: `npm run build:web`
4. **Output Directory**: `.next`

### 4. Monorepo Konfigürasyonu

#### vercel.json (Root):
```json
{
  "version": 2,
  "buildCommand": "npm run build:web",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "rootDirectory": "apps/web",
  "functions": {
    "apps/web/src/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### apps/web/vercel.json:
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 5. Build Optimizasyonları

#### next.config.js:
```javascript
const nextConfig = {
  // Vercel optimizations
  output: 'standalone',
  trailingSlash: false,
  generateEtags: false,
  
  // Performance
  swcMinify: true,
  compress: true,
  
  // ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      }
    ],
    formats: ['image/webp', 'image/avif'],
  }
};
```

### 6. Domain Ayarları

1. **Custom Domain**: `tdcmarket.com`
2. **SSL Certificate**: Otomatik
3. **DNS Records**: Vercel tarafından yönetilir

### 7. Performance Monitoring

#### Vercel Analytics:
- Real User Monitoring (RUM)
- Core Web Vitals
- Performance Insights

#### Environment Variables:
```env
VERCEL_ANALYTICS_ID=your-analytics-id
```

### 8. Troubleshooting

#### Common Issues:

1. **Build Failures**:
   - Check Node.js version (18.x)
   - Verify build command
   - Check environment variables

2. **API Routes Not Working**:
   - Verify function runtime (nodejs18.x)
   - Check file paths in vercel.json

3. **Static Files Not Loading**:
   - Check output directory
   - Verify Next.js configuration

4. **Environment Variables**:
   - Ensure all required vars are set
   - Check variable names (case-sensitive)

### 9. Deployment Checklist

- [ ] Build command works locally
- [ ] All environment variables set
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] Performance monitoring enabled
- [ ] Error tracking setup

### 10. Post-Deployment

#### Test URLs:
- Homepage: `https://tdcmarket.com`
- Sitemap: `https://tdcmarket.com/sitemap.xml`
- Robots: `https://tdcmarket.com/robots.txt`
- API: `https://tdcmarket.com/api/revalidate`

#### Performance Check:
- Lighthouse score > 90
- Core Web Vitals green
- Mobile responsive
- SEO optimized

### 11. Monitoring & Maintenance

#### Vercel Dashboard:
- Deployments history
- Function logs
- Performance metrics
- Error tracking

#### Updates:
```bash
# Deploy updates
vercel --prod

# Or via GitHub (automatic)
git push origin main
```

## 🎯 Success Metrics

- **Build Time**: < 3 minutes
- **Deploy Time**: < 2 minutes
- **Lighthouse Score**: > 90
- **Uptime**: > 99.9%
- **Response Time**: < 200ms
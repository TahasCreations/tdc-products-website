# 🚀 Vercel Deployment Guide - TDC Products

## 📋 Ön Gereksinimler

### 1. Vercel Hesabı
- [Vercel](https://vercel.com) hesabı oluşturun
- GitHub repository'nizi bağlayın

### 2. Environment Variables
Vercel dashboard'da aşağıdaki environment variables'ları ekleyin:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Site URLs
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app

# E-posta Ayarları
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Vercel Environment Variables
VERCEL_URL=your_vercel_url
VERCEL_ENV=production

# Admin Configuration
ADMIN_CLEANUP_TOKEN=your_strong_token
DEV_ADMIN_BYPASS=false
DEV_ADMIN_EMAIL=your_admin_email
DEV_ADMIN_PASSWORD=your_strong_password

# Performance & Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_GTM_ID=your_gtm_id

# Security
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-domain.vercel.app

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_AI=true
```

## 🏗️ Build Configuration

### 1. Vercel Build Settings
```json
{
  "buildCommand": "npm run build:vercel",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "framework": "nextjs"
}
```

### 2. Build Optimization
- ✅ SWC Minification enabled
- ✅ Image optimization enabled
- ✅ Bundle analysis enabled
- ✅ Type checking enabled
- ✅ ESLint checking enabled

## 📊 Performance Optimizations

### 1. Bundle Size Optimization
- **Current Bundle Size**: ~87.7 kB shared JS
- **Largest Pages**: 
  - `/admin/ai`: 161 kB
  - `/checkout`: 153 kB
  - `/products`: 154 kB

### 2. Lazy Loading
- ✅ AI components lazy loaded
- ✅ Payment system lazy loaded
- ✅ Heavy admin components lazy loaded

### 3. Caching Strategy
- ✅ Static assets: 1 year cache
- ✅ API routes: 24 hours cache
- ✅ Images: 1 year cache with WebP/AVIF

## 🔧 Deployment Steps

### 1. Automatic Deployment
```bash
# Push to main branch triggers automatic deployment
git push origin main
```

### 2. Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Environment Setup
```bash
# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... add all required variables
```

## 📈 Monitoring & Analytics

### 1. Vercel Analytics
- Real-time performance monitoring
- Core Web Vitals tracking
- Error tracking

### 2. Custom Monitoring
- Bundle size analysis
- Build time tracking
- Error boundary reporting

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs
vercel logs

# Local build test
npm run build:vercel
```

#### 2. Environment Variables
```bash
# List current env vars
vercel env ls

# Update env var
vercel env add VARIABLE_NAME
```

#### 3. Performance Issues
```bash
# Analyze bundle
npm run analyze

# Check build report
cat .next/build-report.json
```

## 🎯 Performance Targets

### Core Web Vitals
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Bundle Size
- **Shared JS**: < 100 kB
- **Page JS**: < 200 kB per page
- **Images**: WebP/AVIF format

## 🔒 Security

### Headers
- ✅ X-Frame-Options: DENY
- ✅ X-Content-Type-Options: nosniff
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Strict-Transport-Security enabled

### Environment
- ✅ Production secrets secured
- ✅ Admin bypass disabled in production
- ✅ Service role key protected

## 📱 PWA Features

### Manifest
- ✅ Offline support
- ✅ Installable
- ✅ Background sync

### Service Worker
- ✅ Cache-first strategy
- ✅ Network fallback
- ✅ Update notifications

## 🎉 Success Metrics

### Build Success
- ✅ Type checking passes
- ✅ ESLint passes
- ✅ Bundle size optimized
- ✅ All pages build successfully

### Performance
- ✅ First Load JS < 200 kB
- ✅ Build time < 5 minutes
- ✅ No critical errors

---

## 🚀 Ready for Production!

Your TDC Products website is now optimized for Vercel deployment with:
- ⚡ Lightning-fast performance
- 🔒 Enterprise-grade security
- 📊 Comprehensive monitoring
- 🎯 Optimized bundle sizes
- 🚀 One-click deployment

**Deploy now**: `vercel --prod` 🎉


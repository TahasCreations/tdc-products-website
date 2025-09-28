# Vercel Deployment Setup

## Environment Variables

Vercel dashboard'da aşağıdaki environment variables'ları ekleyin:

### Required Variables:
```
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
VERCEL_ENV=production
```

### Supabase (Optional):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Feature Flags:
```
DEMO_MODE=false
ALLOW_DESTRUCTIVE=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_AI=true
```

## Build Settings

Vercel otomatik olarak Next.js projelerini algılar. Eğer sorun yaşarsanız:

1. **Framework Preset**: Next.js
2. **Build Command**: `npm run build`
3. **Output Directory**: `.next`
4. **Install Command**: `npm install`

## Troubleshooting

1. **Build Fails**: Check Vercel build logs
2. **Environment Variables**: Ensure all required vars are set
3. **Dependencies**: Make sure all packages are in package.json
4. **Node.js Version**: Vercel uses Node.js 18.x by default

## Local Testing

```bash
npm run build
npm start
```

Bu komutlar production build'i test etmek için kullanılabilir.

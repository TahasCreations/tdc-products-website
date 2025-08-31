#!/bin/bash

# TDC Products - Production Deployment Script
echo "🚀 TDC Products - Production Deployment Başlatılıyor..."

# 1. TypeScript kontrolü
echo "📝 TypeScript kontrolü yapılıyor..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ TypeScript hataları bulundu! Düzeltin ve tekrar deneyin."
    exit 1
fi
echo "✅ TypeScript kontrolü başarılı!"

# 2. Lint kontrolü
echo "🔍 ESLint kontrolü yapılıyor..."
npm run lint
if [ $? -ne 0 ]; then
    echo "⚠️  ESLint uyarıları var ama devam ediliyor..."
fi

# 3. Build
echo "🏗️  Production build oluşturuluyor..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build başarısız! Hataları düzeltin ve tekrar deneyin."
    exit 1
fi
echo "✅ Build başarılı!"

# 4. Environment variables kontrolü
echo "🔧 Environment variables kontrol ediliyor..."
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo "⚠️  NEXT_PUBLIC_SUPABASE_URL tanımlanmamış!"
fi
if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlanmamış!"
fi

# 5. Production server başlatma (opsiyonel)
echo "🎯 Production server başlatılıyor..."
echo "📱 Uygulama http://localhost:3000 adresinde çalışıyor"
echo "🛑 Durdurmak için Ctrl+C tuşlayın"

npm start

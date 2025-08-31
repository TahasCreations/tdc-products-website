@echo off
chcp 65001 >nul
echo 🚀 TDC Products - Production Deployment Başlatılıyor...

REM 1. TypeScript kontrolü
echo 📝 TypeScript kontrolü yapılıyor...
npx tsc --noEmit
if %errorlevel% neq 0 (
    echo ❌ TypeScript hataları bulundu! Düzeltin ve tekrar deneyin.
    pause
    exit /b 1
)
echo ✅ TypeScript kontrolü başarılı!

REM 2. Lint kontrolü
echo 🔍 ESLint kontrolü yapılıyor...
npm run lint
if %errorlevel% neq 0 (
    echo ⚠️  ESLint uyarıları var ama devam ediliyor...
)

REM 3. Build
echo 🏗️  Production build oluşturuluyor...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build başarısız! Hataları düzeltin ve tekrar deneyin.
    pause
    exit /b 1
)
echo ✅ Build başarılı!

REM 4. Environment variables kontrolü
echo 🔧 Environment variables kontrol ediliyor...
if "%NEXT_PUBLIC_SUPABASE_URL%"=="" (
    echo ⚠️  NEXT_PUBLIC_SUPABASE_URL tanımlanmamış!
)
if "%NEXT_PUBLIC_SUPABASE_ANON_KEY%"=="" (
    echo ⚠️  NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlanmamış!
)

REM 5. Production server başlatma
echo 🎯 Production server başlatılıyor...
echo 📱 Uygulama http://localhost:3000 adresinde çalışıyor
echo 🛑 Durdurmak için Ctrl+C tuşlayın

npm start
pause

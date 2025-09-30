# 🚀 Git & Vercel Setup - TDC Market

## Sorun: Git Repository Yok!

**Problem**: Proje Git repository'si olmadığı için Vercel'e push edilmiyor.

## ✅ Çözüm Adımları:

### 1. Git Repository Başlatma

```bash
# Terminal'de proje dizininde çalıştır:
cd C:\Users\taha\tdc-products-website

# Git repository başlat
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit: TDC Market e-commerce platform"
```

### 2. GitHub Repository Oluşturma

1. **GitHub'a git**: https://github.com
2. **"New repository"** butonuna tıkla
3. **Repository name**: `tdc-market` (veya istediğin isim)
4. **Description**: "TDC Market - Türkiye'nin Tasarım & Figür Pazarı"
5. **Public** veya **Private** seç
6. **"Create repository"** butonuna tıkla

### 3. GitHub'a Bağlama

```bash
# GitHub repository URL'ini ekle (kendi URL'ini kullan)
git remote add origin https://github.com/KULLANICI_ADI/tdc-market.git

# Main branch'e geç
git branch -M main

# GitHub'a push et
git push -u origin main
```

### 4. Vercel'e Bağlama

#### A. Vercel Dashboard ile:
1. **Vercel'e git**: https://vercel.com
2. **"New Project"** butonuna tıkla
3. **GitHub repository'yi seç**: `tdc-market`
4. **Import** butonuna tıkla

#### B. Vercel Konfigürasyonu:
```
Framework Preset: Next.js
Root Directory: apps/web
Build Command: npm run build:web
Output Directory: .next
Install Command: npm install
```

#### C. Environment Variables:
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://tdcmarket.com
NEXT_PUBLIC_GA_ID=your-ga-id
NEXT_PUBLIC_GTM_ID=your-gtm-id
REVALIDATE_SECRET=your-secret-key
```

### 5. Otomatik Deployment

Artık her `git push` yaptığında Vercel otomatik olarak deploy edecek!

```bash
# Değişiklik yap
git add .
git commit -m "Update: Add new feature"
git push origin main

# Vercel otomatik olarak deploy edecek! 🚀
```

## 🔧 Troubleshooting

### Git Push Hatası:
```bash
# Eğer git push hatası alırsan:
git pull origin main --allow-unrelated-histories
git push origin main
```

### Vercel Build Hatası:
1. **Root Directory**: `apps/web` olduğundan emin ol
2. **Build Command**: `npm run build:web` olduğundan emin ol
3. **Environment Variables**: Tüm gerekli değişkenleri ekle

### GitHub Bağlantı Hatası:
```bash
# Remote'u kontrol et
git remote -v

# Eğer yanlışsa düzelt
git remote set-url origin https://github.com/KULLANICI_ADI/tdc-market.git
```

## 📁 Proje Yapısı

```
tdc-products-website/
├── apps/
│   └── web/                 # Next.js app (Vercel root)
│       ├── src/
│       ├── public/
│       ├── next.config.js
│       └── vercel.json
├── packages/                # Shared packages
├── vercel.json             # Root Vercel config
├── package.json            # Root package.json
└── .gitignore
```

## 🎯 Sonuç

Bu adımları takip ettikten sonra:
- ✅ Git repository hazır
- ✅ GitHub'a bağlı
- ✅ Vercel'e bağlı
- ✅ Otomatik deployment çalışıyor

**Artık her `git push` yaptığında Vercel otomatik olarak deploy edecek!** 🚀

## 🚨 Önemli Notlar

1. **Root Directory**: Vercel'de `apps/web` olarak ayarla
2. **Build Command**: `npm run build:web` kullan
3. **Environment Variables**: Mutlaka ayarla
4. **Git Branch**: `main` branch'i kullan

## 📞 Yardım

Eğer sorun yaşarsan:
1. Git status kontrol et: `git status`
2. Vercel logs kontrol et: Vercel dashboard'da
3. Build log'ları incele
4. Environment variables'ları kontrol et

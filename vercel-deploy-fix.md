# 🚀 Vercel Deploy Sorunu Çözüm Rehberi

## ❌ Sorun: Vercel'de Deploy Başlamıyor

Vercel'de deploy'un başlamaması genellikle şu nedenlerden kaynaklanır:

## 🔍 Olası Nedenler ve Çözümler

### 1. Git Repository Bağlantısı Sorunu

**Kontrol:**
```bash
git remote -v
```

**Çözüm:**
Eğer remote yoksa:
```bash
# GitHub repository URL'inizi ekleyin
git remote add origin https://github.com/KULLANICI_ADI/REPO_ADI.git
git push -u origin main
```

### 2. Vercel Proje Ayarları

Vercel Dashboard'da kontrol edin:

1. **Settings → Git**
   - GitHub repository bağlı mı?
   - Branch: `main` veya `master` seçili mi?
   - Production Branch: `main` olmalı

2. **Settings → General**
   - Framework: `Next.js` seçili mi?
   - Root Directory: Boş bırakın (root'tan deploy ediyorsanız)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 3. Webhook Sorunu

Vercel webhook'ları çalışmıyor olabilir.

**Çözüm:**
1. Vercel Dashboard → Settings → Git
2. "Disconnect" butonuna tıklayın
3. Tekrar "Connect Git Repository" ile bağlayın
4. Repository'yi seçin ve izinleri verin

### 4. Manuel Deploy

Eğer otomatik deploy çalışmıyorsa, manuel deploy yapın:

```bash
# Vercel CLI yükle (eğer yoksa)
npm i -g vercel

# Login
vercel login

# Proje dizininde
vercel --prod
```

### 5. Branch Ayarları

Vercel sadece belirli branch'leri dinler.

**Kontrol:**
- Vercel Dashboard → Settings → Git
- "Production Branch" ayarını kontrol edin
- Genellikle `main` veya `master` olmalı

**Çözüm:**
```bash
# Hangi branch'te olduğunuzu kontrol edin
git branch

# Eğer farklı bir branch'teyseniz
git checkout main
# veya
git checkout -b main
```

### 6. Son Commit'i Push Edin

Bazen son commit push edilmemiş olabilir:

```bash
# Son commit'leri kontrol edin
git log --oneline -5

# Push edin
git push origin main
```

### 7. Vercel Projesini Yeniden Bağlayın

Bazen Vercel projesi düzgün bağlanmamış olabilir:

1. Vercel Dashboard → Settings → Git
2. "Disconnect" butonuna tıklayın
3. Projeyi silin (opsiyonel)
4. "New Project" ile yeni proje oluşturun
5. Aynı repository'yi bağlayın

## ✅ Hızlı Çözüm Adımları

### Adım 1: Git Durumunu Kontrol Et
```bash
git status
git log --oneline -1
git remote -v
```

### Adım 2: Son Değişiklikleri Push Et
```bash
git add .
git commit -m "fix: Package reserved word issue resolved"
git push origin main
```

### Adım 3: Vercel Dashboard'da Kontrol Et
1. Vercel Dashboard'a gidin
2. Projenizi seçin
3. "Deployments" sekmesine gidin
4. Son deployment'ı kontrol edin
5. Eğer yoksa, "Redeploy" butonuna tıklayın

### Adım 4: Manuel Deploy (Gerekirse)
```bash
npx vercel --prod
```

## 🎯 Vercel CLI ile Hızlı Deploy

Eğer GitHub bağlantısı çalışmıyorsa, Vercel CLI ile direkt deploy edebilirsiniz:

```bash
# 1. Vercel CLI yükle (eğer yoksa)
npm i -g vercel

# 2. Login
vercel login

# 3. Proje dizininde deploy et
vercel --prod

# 4. İlk deploy'da sorular soracak:
# - Set up and deploy? Y
# - Which scope? (Hesabınızı seçin)
# - Link to existing project? N (yeni proje için)
# - Project name? (Proje adını girin)
# - Directory? . (root için)
# - Override settings? N
```

## 📋 Kontrol Listesi

- [ ] Git repository bağlı mı? (`git remote -v`)
- [ ] Son commit push edildi mi? (`git log --oneline -1`)
- [ ] Vercel Dashboard'da repository bağlı mı?
- [ ] Production branch doğru mu? (`main` veya `master`)
- [ ] Build settings doğru mu?
- [ ] Environment variables eklendi mi?
- [ ] Webhook'lar çalışıyor mu?

## 🔧 Vercel Dashboard Ayarları

### Build & Development Settings:
```
Framework Preset: Next.js
Root Directory: (boş bırakın veya root için `.`)
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

### Git Settings:
```
Production Branch: main
Preview Branches: (tüm branch'ler)
```

## 💡 İpucu

Eğer hala deploy başlamıyorsa:
1. Vercel Dashboard'da "Deployments" sekmesine gidin
2. "Redeploy" butonuna tıklayın
3. Son başarılı deployment'ı seçin
4. "Redeploy" butonuna tıklayın

Bu, manuel olarak yeni bir deployment başlatır.

---

**Sorun devam ederse, Vercel CLI ile manuel deploy yapın veya Vercel support'a başvurun.**

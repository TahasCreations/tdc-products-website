# TDC Market Git Setup Script
Write-Host "🚀 Setting up Git repository for TDC Market..." -ForegroundColor Green

# Initialize Git repository
Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
git init

# Add all files
Write-Host "📝 Adding files to Git..." -ForegroundColor Yellow
git add .

# Initial commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: TDC Market e-commerce platform

- Complete Next.js 14 application with App Router
- Tailwind CSS with TDC design system  
- Homepage with Hero, CategoryGrid, CollectionStrip components
- SEO optimized with sitemap.xml and robots.txt
- Vercel deployment ready
- TypeScript configuration
- Performance optimized build"

Write-Host "✅ Git repository initialized successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Create GitHub repository at https://github.com" -ForegroundColor White
Write-Host "2. Add remote origin: git remote add origin <your-repo-url>" -ForegroundColor White
Write-Host "3. Push to GitHub: git push -u origin main" -ForegroundColor White
Write-Host "4. Connect to Vercel for automatic deployment" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Vercel Setup Guide: GIT-VERCEL-SETUP.md" -ForegroundColor Magenta

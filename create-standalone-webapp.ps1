# Create Standalone Web App for Vercel - PowerShell
Write-Host "🚀 Creating Standalone Web App for Vercel..." -ForegroundColor Green
Write-Host ""

# Create standalone web app directory
Write-Host "📁 Creating standalone directory..." -ForegroundColor Yellow
if (Test-Path "tdc-market-standalone") {
    Remove-Item -Recurse -Force "tdc-market-standalone"
}
New-Item -ItemType Directory -Path "tdc-market-standalone" | Out-Null
Set-Location "tdc-market-standalone"

# Copy web app files
Write-Host "📁 Copying web app files..." -ForegroundColor Yellow
Copy-Item -Recurse -Force "../apps/web/*" .

# Copy root files that might be needed
Write-Host "📁 Copying root files..." -ForegroundColor Yellow
Copy-Item "../.gitignore" .
Copy-Item "../README.md" .

# Update package.json to standalone version
Write-Host "📝 Updating package.json..." -ForegroundColor Yellow
Copy-Item "package-standalone.json" "package.json"

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "   ✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to install dependencies: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test build
Write-Host "🔨 Testing build..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "   ✅ Build successful!" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Build failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Standalone web app created successfully!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. cd tdc-market-standalone" -ForegroundColor White
Write-Host "2. git init" -ForegroundColor White
Write-Host "3. git add ." -ForegroundColor White
Write-Host "4. git commit -m 'Initial commit: TDC Market Standalone'" -ForegroundColor White
Write-Host "5. Create GitHub repository" -ForegroundColor White
Write-Host "6. git remote add origin <your-repo-url>" -ForegroundColor White
Write-Host "7. git push -u origin main" -ForegroundColor White
Write-Host "8. Deploy to Vercel! 🚀" -ForegroundColor White

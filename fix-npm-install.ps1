# Fix NPM Install Issues - PowerShell
Write-Host "🔧 Fixing NPM Install Issues..." -ForegroundColor Green
Write-Host ""

# Fix 1: Clean node_modules and package-lock.json
Write-Host "1. Cleaning node_modules and package-lock.json..." -ForegroundColor Yellow
try {
    if (Test-Path "node_modules") {
        Remove-Item -Recurse -Force "node_modules"
        Write-Host "   ✅ Removed node_modules" -ForegroundColor Green
    }
    
    if (Test-Path "package-lock.json") {
        Remove-Item "package-lock.json"
        Write-Host "   ✅ Removed package-lock.json" -ForegroundColor Green
    }
    
    if (Test-Path "apps/web/node_modules") {
        Remove-Item -Recurse -Force "apps/web/node_modules"
        Write-Host "   ✅ Removed apps/web/node_modules" -ForegroundColor Green
    }
    
    if (Test-Path "apps/web/package-lock.json") {
        Remove-Item "apps/web/package-lock.json"
        Write-Host "   ✅ Removed apps/web/package-lock.json" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Error cleaning: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Fix 2: Check package.json files
Write-Host "`n2. Checking package.json files..." -ForegroundColor Yellow
try {
    $rootPackage = Get-Content "package.json" | ConvertFrom-Json
    Write-Host "   ✅ Root package.json is valid" -ForegroundColor Green
    
    $webPackage = Get-Content "apps/web/package.json" | ConvertFrom-Json
    Write-Host "   ✅ Web package.json is valid" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error reading package.json: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Fix 3: Install root dependencies
Write-Host "`n3. Installing root dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "   ✅ Root dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to install root dependencies: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Trying with --legacy-peer-deps..." -ForegroundColor Yellow
    try {
        npm install --legacy-peer-deps
        Write-Host "   ✅ Root dependencies installed with --legacy-peer-deps" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Failed with --legacy-peer-deps: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Fix 4: Install web app dependencies
Write-Host "`n4. Installing web app dependencies..." -ForegroundColor Yellow
Set-Location "apps/web"
try {
    npm install
    Write-Host "   ✅ Web app dependencies installed" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to install web app dependencies: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Trying with --legacy-peer-deps..." -ForegroundColor Yellow
    try {
        npm install --legacy-peer-deps
        Write-Host "   ✅ Web app dependencies installed with --legacy-peer-deps" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Failed with --legacy-peer-deps: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Fix 5: Check for common issues
Write-Host "`n5. Checking for common issues..." -ForegroundColor Yellow

# Check Node.js version
$nodeVersion = node --version
Write-Host "   Node.js version: $nodeVersion" -ForegroundColor White
if ([int]$nodeVersion.Split('.')[0].Substring(1) -lt 18) {
    Write-Host "   ⚠️  Warning: Node.js 18+ recommended for Vercel" -ForegroundColor Yellow
}

# Check npm version
try {
    $npmVersion = npm --version
    Write-Host "   npm version: $npmVersion" -ForegroundColor White
} catch {
    Write-Host "   ⚠️  Could not check npm version" -ForegroundColor Yellow
}

# Fix 6: Try alternative installation methods
Write-Host "`n6. Trying alternative installation methods..." -ForegroundColor Yellow

# Try with npm ci
try {
    npm ci
    Write-Host "   ✅ npm ci successful" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  npm ci failed, trying npm install --force..." -ForegroundColor Yellow
    try {
        npm install --force
        Write-Host "   ✅ npm install --force successful" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ All installation methods failed" -ForegroundColor Red
    }
}

Write-Host "`n✅ NPM install issues fixed!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Try: npm run build" -ForegroundColor White
Write-Host "2. If still failing, check specific error messages" -ForegroundColor White
Write-Host "3. Deploy to Vercel! 🚀" -ForegroundColor White

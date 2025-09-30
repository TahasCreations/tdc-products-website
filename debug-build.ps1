# Debug Build Script - PowerShell
Write-Host "🔍 Debugging Build Issues..." -ForegroundColor Green
Write-Host ""

# Check 1: Node.js version
Write-Host "1. Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "   Node.js: $nodeVersion" -ForegroundColor White

# Check 2: Navigate to web app
Write-Host "`n2. Navigating to web app..." -ForegroundColor Yellow
Set-Location "apps/web"
Write-Host "   Current directory: $(Get-Location)" -ForegroundColor White

# Check 3: Check package.json
Write-Host "`n3. Checking package.json..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "   ✅ package.json exists" -ForegroundColor Green
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    Write-Host "   Name: $($packageJson.name)" -ForegroundColor White
    Write-Host "   Version: $($packageJson.version)" -ForegroundColor White
} else {
    Write-Host "   ❌ package.json missing" -ForegroundColor Red
}

# Check 4: Install dependencies
Write-Host "`n4. Installing dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "   ✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to install dependencies: $($_.Exception.Message)" -ForegroundColor Red
}

# Check 5: Type check
Write-Host "`n5. Running type check..." -ForegroundColor Yellow
try {
    npm run type-check
    Write-Host "   ✅ Type check passed" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Type check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Check 6: Build
Write-Host "`n6. Attempting build..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "   ✅ Build successful!" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Build failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Error output: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🔍 Debug complete!" -ForegroundColor Green

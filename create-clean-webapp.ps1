# Create Clean Web App for Vercel - PowerShell
Write-Host "🚀 Creating Clean Web App for Vercel..." -ForegroundColor Green
Write-Host ""

# Create clean web app directory
Write-Host "📁 Creating clean directory..." -ForegroundColor Yellow
if (Test-Path "tdc-market-clean") {
    Remove-Item -Recurse -Force "tdc-market-clean"
}
New-Item -ItemType Directory -Path "tdc-market-clean" | Out-Null
Set-Location "tdc-market-clean"

# Copy web app files
Write-Host "📁 Copying web app files..." -ForegroundColor Yellow
Copy-Item -Recurse -Force "../apps/web/*" .

# Clean package.json - Remove workspace dependencies
Write-Host "🔧 Cleaning package.json..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" | ConvertFrom-Json

# Remove workspace dependencies
$packageJson.dependencies = @{}
$packageJson.devDependencies = @{}

# Add only necessary dependencies
$packageJson.dependencies = @{
    "@auth/prisma-adapter" = "^1.6.0"
    "@heroicons/react" = "^2.2.0"
    "@prisma/client" = "^5.16.2"
    "bcryptjs" = "^2.4.3"
    "next" = "^14.2.33"
    "next-auth" = "^5.0.0-beta.19"
    "prisma" = "^5.16.2"
    "pusher" = "^5.2.0"
    "pusher-js" = "^8.4.0-rc2"
    "react" = "^18.3.1"
    "react-dom" = "^18.3.1"
    "remixicon" = "^4.6.0"
    "zod" = "^3.23.8"
    "clsx" = "^2.1.0"
    "class-variance-authority" = "^0.7.0"
}

$packageJson.devDependencies = @{
    "@types/bcryptjs" = "^2.4.6"
    "@types/node" = "^20.14.12"
    "@types/react" = "^18.3.3"
    "@types/react-dom" = "^18.3.0"
    "autoprefixer" = "^10.4.19"
    "eslint" = "^9.36.0"
    "postcss" = "^8.4.39"
    "tailwindcss" = "^3.4.7"
    "typescript" = "^5.5.3"
}

# Add engines
$packageJson.engines = @{
    "node" = ">=18.0.0"
    "npm" = ">=8.0.0"
}

# Save cleaned package.json
$packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"

# Create .gitignore
Write-Host "📝 Creating .gitignore..." -ForegroundColor Yellow
$gitignore = @"
# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
.next/
out/
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out
storybook-static

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS generated files
Thumbs.db
ehthumbs.db

# Turbo
.turbo

# Vercel
.vercel

# Docker
.dockerignore

# Database
*.db
*.sqlite
*.sqlite3

# Prisma
prisma/migrations/

# Test files
test-*.js
*.test.js
*.spec.js

# Backup files
*backup*
"@

$gitignore | Out-File -FilePath ".gitignore" -Encoding UTF8

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

Write-Host "`n✅ Clean web app created successfully!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. cd tdc-market-clean" -ForegroundColor White
Write-Host "2. git init" -ForegroundColor White
Write-Host "3. git add ." -ForegroundColor White
Write-Host "4. git commit -m 'Initial commit: TDC Market Clean'" -ForegroundColor White
Write-Host "5. Create GitHub repository: tdc-market-clean" -ForegroundColor White
Write-Host "6. git remote add origin <your-repo-url>" -ForegroundColor White
Write-Host "7. git push -u origin main" -ForegroundColor White
Write-Host "8. Deploy to Vercel! 🚀" -ForegroundColor White

# Fix Build Issues Script - PowerShell
Write-Host "🔧 Fixing Build Issues..." -ForegroundColor Green
Write-Host ""

# Navigate to web app
Set-Location "apps/web"

# Fix 1: Create missing directories
Write-Host "1. Creating missing directories..." -ForegroundColor Yellow
$dirs = @(
    ".next",
    "public/images",
    "public/images/categories",
    "public/images/products",
    "public/images/collections",
    "public/images/stores",
    "public/images/blog"
)

foreach ($dir in $dirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "   ✅ Created $dir" -ForegroundColor Green
    } else {
        Write-Host "   ✅ $dir already exists" -ForegroundColor White
    }
}

# Fix 2: Create placeholder images
Write-Host "`n2. Creating placeholder images..." -ForegroundColor Yellow
$images = @(
    "public/images/categories/3d-figures.jpg",
    "public/images/categories/desktop-accessories.jpg",
    "public/images/categories/gift-items.jpg",
    "public/images/categories/collectibles.jpg",
    "public/images/categories/educational-toys.jpg",
    "public/images/categories/decorative-objects.jpg",
    "public/images/products/anime-figure.jpg",
    "public/images/products/desk-lamp.jpg",
    "public/images/products/cat-figure.jpg",
    "public/images/products/plant-pot.jpg",
    "public/images/collections/trending.jpg",
    "public/images/collections/local-designers.jpg",
    "public/images/collections/limited-figures.jpg",
    "public/images/collections/gift-guide.jpg",
    "public/images/stores/artisan-craft.jpg",
    "public/images/stores/tech-gadgets.jpg",
    "public/images/stores/nature-craft.jpg",
    "public/images/blog/3d-printing.jpg",
    "public/images/blog/home-decoration.jpg",
    "public/images/blog/gift-selection.jpg"
)

foreach ($image in $images) {
    if (!(Test-Path $image)) {
        New-Item -ItemType File -Path $image -Force | Out-Null
        Write-Host "   ✅ Created placeholder $image" -ForegroundColor Green
    } else {
        Write-Host "   ✅ $image already exists" -ForegroundColor White
    }
}

# Fix 3: Create manifest.json
Write-Host "`n3. Creating manifest.json..." -ForegroundColor Yellow
$manifest = @{
    name = "TDC Market"
    short_name = "TDC Market"
    description = "Türkiye'nin Tasarım & Figür Pazarı"
    start_url = "/"
    display = "standalone"
    background_color = "#ffffff"
    theme_color = "#5A63F2"
    icons = @(
        @{
            src = "/icon-192x192.png"
            sizes = "192x192"
            type = "image/png"
        },
        @{
            src = "/icon-512x512.png"
            sizes = "512x512"
            type = "image/png"
        }
    )
} | ConvertTo-Json -Depth 3

if (!(Test-Path "public/manifest.json")) {
    $manifest | Out-File -FilePath "public/manifest.json" -Encoding UTF8
    Write-Host "   ✅ Created manifest.json" -ForegroundColor Green
} else {
    Write-Host "   ✅ manifest.json already exists" -ForegroundColor White
}

# Fix 4: Create icon files
Write-Host "`n4. Creating icon files..." -ForegroundColor Yellow
$icons = @(
    "public/icon-192x192.png",
    "public/icon-512x512.png",
    "public/favicon.ico"
)

foreach ($icon in $icons) {
    if (!(Test-Path $icon)) {
        New-Item -ItemType File -Path $icon -Force | Out-Null
        Write-Host "   ✅ Created placeholder $icon" -ForegroundColor Green
    } else {
        Write-Host "   ✅ $icon already exists" -ForegroundColor White
    }
}

# Fix 5: Create robots.txt
Write-Host "`n5. Creating robots.txt..." -ForegroundColor Yellow
$robotsTxt = @"
User-agent: *
Allow: /

Sitemap: https://tdcmarket.com/sitemap.xml
"@

if (!(Test-Path "public/robots.txt")) {
    $robotsTxt | Out-File -FilePath "public/robots.txt" -Encoding UTF8
    Write-Host "   ✅ Created robots.txt" -ForegroundColor Green
} else {
    Write-Host "   ✅ robots.txt already exists" -ForegroundColor White
}

# Fix 6: Create sitemap.xml
Write-Host "`n6. Creating sitemap.xml..." -ForegroundColor Yellow
$sitemapXml = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tdcmarket.com/</loc>
    <lastmod>$(Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ")</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tdcmarket.com/about</loc>
    <lastmod>$(Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ")</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tdcmarket.com/become-seller</loc>
    <lastmod>$(Get-Date -Format "yyyy-MM-ddTHH:mm:ss.fffZ")</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
"@

if (!(Test-Path "public/sitemap.xml")) {
    $sitemapXml | Out-File -FilePath "public/sitemap.xml" -Encoding UTF8
    Write-Host "   ✅ Created sitemap.xml" -ForegroundColor Green
} else {
    Write-Host "   ✅ sitemap.xml already exists" -ForegroundColor White
}

# Fix 7: Create OG image
Write-Host "`n7. Creating OG image..." -ForegroundColor Yellow
if (!(Test-Path "public/og-image.jpg")) {
    New-Item -ItemType File -Path "public/og-image.jpg" -Force | Out-Null
    Write-Host "   ✅ Created placeholder og-image.jpg" -ForegroundColor Green
} else {
    Write-Host "   ✅ og-image.jpg already exists" -ForegroundColor White
}

Write-Host "`n✅ All build issues fixed!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: npm install" -ForegroundColor White
Write-Host "2. Run: npm run build" -ForegroundColor White
Write-Host "3. Deploy to Vercel! 🚀" -ForegroundColor White

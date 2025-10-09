# TDC Market - Performance Test Script
# Bu script cache ve rate limiting'i test eder

Write-Host "🚀 TDC Market Performance Test" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

# Test 1: Cache Performance
Write-Host "📊 Test 1: Cache Performance" -ForegroundColor Yellow
Write-Host "Testing /api/products endpoint..." -ForegroundColor Gray

Write-Host "  → First request (DB fetch)..." -ForegroundColor Gray
$start1 = Get-Date
$response1 = Invoke-WebRequest -Uri "$baseUrl/api/products?page=1&limit=10" -UseBasicParsing -ErrorAction SilentlyContinue
$duration1 = ((Get-Date) - $start1).TotalMilliseconds

if ($response1.StatusCode -eq 200) {
    Write-Host "  ✅ First request: $([math]::Round($duration1, 2))ms" -ForegroundColor Green
} else {
    Write-Host "  ❌ First request failed" -ForegroundColor Red
}

Start-Sleep -Seconds 1

Write-Host "  → Second request (Cache hit)..." -ForegroundColor Gray
$start2 = Get-Date
$response2 = Invoke-WebRequest -Uri "$baseUrl/api/products?page=1&limit=10" -UseBasicParsing -ErrorAction SilentlyContinue
$duration2 = ((Get-Date) - $start2).TotalMilliseconds

if ($response2.StatusCode -eq 200) {
    Write-Host "  ✅ Second request: $([math]::Round($duration2, 2))ms" -ForegroundColor Green
    $improvement = [math]::Round((($duration1 - $duration2) / $duration1) * 100, 1)
    Write-Host "  🚀 Speed improvement: $improvement%" -ForegroundColor Cyan
} else {
    Write-Host "  ❌ Second request failed" -ForegroundColor Red
}

Write-Host ""

# Test 2: Rate Limiting
Write-Host "🛡️  Test 2: Rate Limiting" -ForegroundColor Yellow
Write-Host "Testing /api/search endpoint (30 req/min limit)..." -ForegroundColor Gray

$successCount = 0
$rateLimitedCount = 0

Write-Host "  → Sending 35 requests..." -ForegroundColor Gray

for ($i = 1; $i -le 35; $i++) {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/search?q=test" -UseBasicParsing -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 200) {
        $successCount++
        if ($i % 10 -eq 0) {
            Write-Host "    Request $i : ✅ Success" -ForegroundColor Green
        }
    } elseif ($response.StatusCode -eq 429) {
        $rateLimitedCount++
        if ($rateLimitedCount -eq 1) {
            Write-Host "    Request $i : 🛡️  Rate Limited (429)" -ForegroundColor Yellow
        }
    }
    
    Start-Sleep -Milliseconds 100
}

Write-Host ""
Write-Host "  📊 Results:" -ForegroundColor Cyan
Write-Host "    ✅ Successful: $successCount" -ForegroundColor Green
Write-Host "    🛡️  Rate Limited: $rateLimitedCount" -ForegroundColor Yellow

if ($rateLimitedCount -gt 0) {
    Write-Host "  ✅ Rate limiting is working!" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Rate limiting might not be active" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Redis Connection
Write-Host "🔌 Test 3: Redis Connection" -ForegroundColor Yellow
Write-Host "Checking Redis health..." -ForegroundColor Gray

# Check if UPSTASH variables are set
$envFile = Get-Content .env.local -ErrorAction SilentlyContinue
$hasUpstash = $envFile | Select-String -Pattern "UPSTASH_REDIS_REST_URL" -Quiet

if ($hasUpstash) {
    $upstashUrl = ($envFile | Select-String -Pattern "UPSTASH_REDIS_REST_URL=").Line -replace 'UPSTASH_REDIS_REST_URL=', '' -replace '"', ''
    
    if ($upstashUrl -like "*upstash.io*") {
        Write-Host "  ✅ Upstash credentials configured" -ForegroundColor Green
        Write-Host "  📍 URL: $($upstashUrl.Substring(0, [Math]::Min(50, $upstashUrl.Length)))..." -ForegroundColor Gray
    } else {
        Write-Host "  ⚠️  Upstash URL not properly configured" -ForegroundColor Yellow
        Write-Host "  💡 Please update UPSTASH_REDIS_REST_URL in .env.local" -ForegroundColor Cyan
    }
} else {
    Write-Host "  ❌ Upstash credentials not found in .env.local" -ForegroundColor Red
    Write-Host "  💡 Please add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Performance test complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Check console logs for [redis], [cache], [metric] messages" -ForegroundColor Gray
Write-Host "  2. Monitor cache hit rates" -ForegroundColor Gray
Write-Host "  3. Adjust TTL values if needed" -ForegroundColor Gray
Write-Host "  4. Review docs/PERFORMANCE_SETUP.md for more details" -ForegroundColor Gray
Write-Host ""


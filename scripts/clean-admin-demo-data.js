#!/usr/bin/env node
/**
 * Admin Panel Demo Data Cleanup Script
 * Bu script tüm admin paneli dosyalarındaki demo/mock verileri temizler
 */

const fs = require('fs');
const path = require('path');

const filesToClean = [
  // Admin sayfaları
  'src/app/(admin)/admin/commerce/products/page.tsx',
  'src/app/(admin)/admin/blog-moderasyon/page.tsx',
  'apps/web/src/app/admin/page.tsx',
  'app/admin/dashboard/page.tsx',
  'app/admin/ai/trend-analysis/page.tsx',
  'app/admin/ai/price-suggestion/page.tsx',
  'app/admin/accounting/fixed-assets/page.tsx',
  'src/app/(admin)/admin/ai/seo-assistant/page.tsx',
  'src/app/(admin)/admin/campaigns/promotions/page.tsx',
  'src/app/(admin)/admin/commerce/inventory/page.tsx',
  'src/app/(admin)/admin/products/page.tsx',
  'components/admin/KPIDashboard.tsx',
  'components/admin/AdminSidebar.tsx',
  'src/components/admin/AdminLayout.tsx',
];

console.log('🧹 Admin Panel Demo Veri Temizliği Başlatılıyor...\n');

let totalCleaned = 0;
let totalErrors = 0;

filesToClean.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Atlandı (dosya bulunamadı): ${file}`);
    return;
  }
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalLength = content.length;
    
    // Badge'leri temizle (örnek sayılar)
    content = content.replace(/badge:\s*['"`]\d+[KMB]?['"`]/g, 'badge: null');
    content = content.replace(/badge:\s*['"`][\d.]+K?['"`]/g, 'badge: null');
    
    // Mock array verilerini boşalt
    content = content.replace(/const\s+mockStats\s*:\s*DashboardStats\s*=\s*\{[\s\S]*?\};/g, 
      `const mockStats: DashboardStats = {
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
      monthlyGrowth: 0,
      conversionRate: 0,
      averageOrderValue: 0,
      activeUsers: 0
    };`);
    
    // Mock activities temizle
    content = content.replace(/const\s+mockActivities\s*:\s*RecentActivity\[\]\s*=\s*\[[\s\S]*?\];/g,
      `const mockActivities: RecentActivity[] = [];`);
    
    // setProducts mock data temizle
    content = content.replace(/setProducts\(\[[\s\S]*?\{[\s\S]*?id:\s*['"`]P\d+['"`][\s\S]*?\}\s*\]\);/g,
      'setProducts([]);');
    
    // setPosts mock data temizle
    content = content.replace(/setPosts\(\[[\s\S]*?\{[\s\S]*?id:\s*\d+[\s\S]*?\}\s*\]\);/g,
      'setPosts([]);');
    
    // Inline mock arrays temizle
    content = content.replace(/const\s+trendData\s*=\s*\[[\s\S]*?\{[\s\S]*?keyword:[\s\S]*?\}\s*\];/g,
      'const trendData = [];');
    
    // Mock verilerin yorumlarını güncelle
    content = content.replace(/\/\/\s*Mock\s+data\s*-\s*Gerçek\s+API'den\s+gelecek/g,
      '// Demo veriler temizlendi - Veritabanından gerçek veri gelecek');
    
    content = content.replace(/\/\/\s*Mock\s+data/g,
      '// Demo veriler temizlendi');
      
    // Fallback mock data yorumlarını güncelle
    content = content.replace(/\/\/\s*Fallback\s*:\s*Mock\s+data/g,
      '// Veritabanından veri gelecek');
    
    if (content.length !== originalLength) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Temizlendi: ${file}`);
      totalCleaned++;
    } else {
      console.log(`⏭️  Değişiklik yok: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Hata (${file}):`, error.message);
    totalErrors++;
  }
});

console.log('\n' + '='.repeat(60));
console.log('📊 Özet:');
console.log(`✅ Temizlenen dosya: ${totalCleaned}`);
console.log(`⏭️  Atlanan dosya: ${filesToClean.length - totalCleaned - totalErrors}`);
console.log(`❌ Hatalı dosya: ${totalErrors}`);
console.log('='.repeat(60));

if (totalCleaned > 0) {
  console.log('\n🎉 Demo veri temizliği tamamlandı!');
  console.log('💡 Değişiklikleri kontrol edin ve build test edin.');
} else {
  console.log('\n⚠️  Temizlenecek demo veri bulunamadı.');
}


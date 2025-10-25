/**
 * TDC Products Website - Database Cleanup Script
 * 
 * Bu script admin panelindeki tüm modüllerin demo verilerini temizler
 * 
 * Kullanım:
 * 1. .env dosyasında veritabanı bağlantısını ayarlayın
 * 2. node cleanup-database.js
 * 
 * ⚠️ DİKKAT: Bu işlem geri alınamaz! Mutlaka yedek alın!
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Renkli console çıktıları için
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
  console.log('\n' + '='.repeat(60));
  log(message, 'bright');
  console.log('='.repeat(60) + '\n');
}

async function checkDatabaseConnection(client) {
  try {
    await client.query('SELECT NOW()');
    log('✓ Veritabanı bağlantısı başarılı', 'green');
    return true;
  } catch (error) {
    log('✗ Veritabanı bağlantı hatası:', 'red');
    log(error.message, 'red');
    return false;
  }
}

async function getTableCounts(client) {
  const tables = [
    'products', 'categories', 'sellers', 'product_reviews',
    'orders', 'order_items', 'customers', 'invoices',
    'blog_comments', 'blogs', 'media_files',
    'campaigns', 'email_campaigns', 'coupons',
    'journal_entries', 'accounts', 'companies',
    'employees', 'departments', 'wishlists',
    'settlements', 'influencers'
  ];

  const counts = {};
  
  for (const table of tables) {
    try {
      const result = await client.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_name = $1
      `, [table]);

      if (result.rows[0].count > 0) {
        const countResult = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
        counts[table] = parseInt(countResult.rows[0].count);
      } else {
        counts[table] = 0;
      }
    } catch (error) {
      counts[table] = 0;
    }
  }

  return counts;
}

async function displayCurrentData(client) {
  header('MEVCUT VERİ DURUMU');
  
  const counts = await getTableCounts(client);
  
  let totalRecords = 0;
  
  Object.entries(counts).forEach(([table, count]) => {
    if (count > 0) {
      const icon = count > 100 ? '🔴' : count > 10 ? '🟡' : '🟢';
      log(`${icon} ${table.padEnd(30)} : ${count} kayıt`, count > 0 ? 'cyan' : 'reset');
      totalRecords += count;
    }
  });
  
  log(`\n📊 TOPLAM KAYIT SAYISI: ${totalRecords}`, 'bright');
}

async function confirmCleanup() {
  header('⚠️ UYARI ⚠️');
  
  log('Bu işlem TÜM demo verilerini SİLECEKTİR!', 'red');
  log('Bu işlem GERİ ALINAMAZ!', 'red');
  log('\nEmin misiniz? (evet/hayır): ', 'yellow');

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    readline.question('', (answer) => {
      readline.close();
      resolve(answer.toLowerCase() === 'evet');
    });
  });
}

async function backupDatabase(client) {
  header('VERİTABANI YEDEĞİ');
  
  log('Otomatik yedek alma özelliği henüz aktif değil.', 'yellow');
  log('Manuel yedek almanız şiddetle tavsiye edilir!', 'yellow');
  log('\nDevam etmek istiyor musunuz? (evet/hayır): ', 'yellow');

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    readline.question('', (answer) => {
      readline.close();
      resolve(answer.toLowerCase() === 'evet');
    });
  });
}

async function runCleanupScript(client) {
  header('VERİ TEMİZLEME İŞLEMİ BAŞLIYOR');
  
  const sqlFile = path.join(__dirname, 'COMPREHENSIVE-DATA-CLEANUP.sql');
  
  if (!fs.existsSync(sqlFile)) {
    log('✗ SQL dosyası bulunamadı: ' + sqlFile, 'red');
    return false;
  }

  const sql = fs.readFileSync(sqlFile, 'utf8');
  
  try {
    log('📝 SQL scripti okundu, çalıştırılıyor...', 'cyan');
    
    await client.query('BEGIN');
    
    // SQL scriptini satır satır çalıştır
    const statements = sql.split(';').filter(s => s.trim());
    let completed = 0;
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
          completed++;
          
          if (completed % 10 === 0) {
            process.stdout.write(`\r✓ ${completed}/${statements.length} işlem tamamlandı`);
          }
        } catch (err) {
          // Bazı hatalar göz ardı edilebilir (tablo yoksa vs.)
          if (!err.message.includes('does not exist')) {
            log(`\n⚠ Uyarı: ${err.message}`, 'yellow');
          }
        }
      }
    }
    
    await client.query('COMMIT');
    
    console.log('\n');
    log('✓ Veri temizleme işlemi tamamlandı!', 'green');
    return true;
    
  } catch (error) {
    await client.query('ROLLBACK');
    log('\n✗ Temizleme sırasında hata oluştu:', 'red');
    log(error.message, 'red');
    return false;
  }
}

async function optimizeDatabase(client) {
  header('VERİTABANI OPTİMİZASYONU');
  
  try {
    log('🔧 VACUUM ANALYZE çalıştırılıyor...', 'cyan');
    await client.query('VACUUM ANALYZE');
    log('✓ Veritabanı optimize edildi', 'green');
    return true;
  } catch (error) {
    log('⚠ Optimizasyon başarısız: ' + error.message, 'yellow');
    return false;
  }
}

async function displayFinalReport(client) {
  header('TEMİZLİK SONUÇ RAPORU');
  
  const counts = await getTableCounts(client);
  
  let totalRecords = 0;
  
  log('KALAN KAYIT SAYILARI:', 'bright');
  log('─'.repeat(60), 'cyan');
  
  Object.entries(counts).forEach(([table, count]) => {
    const icon = count === 0 ? '✓' : '⚠';
    const color = count === 0 ? 'green' : 'yellow';
    log(`${icon} ${table.padEnd(30)} : ${count} kayıt`, color);
    totalRecords += count;
  });
  
  log('─'.repeat(60), 'cyan');
  log(`\n📊 TOPLAM KALAN KAYIT: ${totalRecords}`, 'bright');
  
  if (totalRecords === 0) {
    log('\n🎉 TÜM DEMO VERİLERİ BAŞARIYLA TEMİZLENDİ!', 'green');
  } else {
    log('\n⚠ Bazı veriler hala mevcut. Manuel kontrol gerekebilir.', 'yellow');
  }
}

async function main() {
  header('TDC PRODUCTS - VERİTABANI TEMİZLEME ARACI');
  
  // Veritabanı bağlantı bilgileri
  const connectionString = process.env.DATABASE_URL || 
                           process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!connectionString) {
    log('✗ Veritabanı bağlantı bilgisi bulunamadı!', 'red');
    log('Lütfen .env.local dosyasında DATABASE_URL değişkenini ayarlayın.', 'yellow');
    process.exit(1);
  }

  // PostgreSQL client oluştur
  const client = new Client({
    connectionString: connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    // Veritabanına bağlan
    log('🔌 Veritabanına bağlanılıyor...', 'cyan');
    await client.connect();
    
    // Bağlantıyı kontrol et
    const connected = await checkDatabaseConnection(client);
    if (!connected) {
      process.exit(1);
    }

    // Mevcut verileri göster
    await displayCurrentData(client);

    // Kullanıcıdan onay al
    const confirmed = await confirmCleanup();
    if (!confirmed) {
      log('\n❌ İşlem iptal edildi.', 'red');
      process.exit(0);
    }

    // Yedek uyarısı
    const backupConfirmed = await backupDatabase(client);
    if (!backupConfirmed) {
      log('\n❌ İşlem iptal edildi. Lütfen önce yedek alın!', 'red');
      process.exit(0);
    }

    // Temizleme işlemini başlat
    const success = await runCleanupScript(client);
    
    if (success) {
      // Veritabanını optimize et
      await optimizeDatabase(client);
      
      // Sonuç raporunu göster
      await displayFinalReport(client);
    } else {
      log('\n❌ Temizleme işlemi başarısız oldu.', 'red');
    }

  } catch (error) {
    log('\n✗ Beklenmeyen hata:', 'red');
    log(error.message, 'red');
    log(error.stack, 'red');
  } finally {
    // Bağlantıyı kapat
    await client.end();
    log('\n🔌 Veritabanı bağlantısı kapatıldı.', 'cyan');
  }
}

// Scripti çalıştır
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { main };


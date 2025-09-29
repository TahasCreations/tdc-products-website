#!/usr/bin/env tsx

/**
 * Server Status Check Script
 * Local server'ın durumunu kontrol eder
 */

import { Pool } from 'pg';
import fs from 'fs';

const config = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'tdc_database',
  user: process.env.POSTGRES_USER || 'tdc_user',
  password: process.env.POSTGRES_PASSWORD || 'tdc_password',
};

async function checkServerStatus() {
  console.log('🔍 TDC Local Server Durumu Kontrol Ediliyor...\n');
  
  // Database durumu
  console.log('🗄️ Database Durumu:');
  try {
    const pool = new Pool(config);
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    
    console.log(`  ✅ PostgreSQL: Bağlı`);
    console.log(`  🕐 Sunucu Zamanı: ${result.rows[0].current_time}`);
    console.log(`  📊 Versiyon: ${result.rows[0].version.split(' ')[0]}`);
    
    // Tablo sayılarını kontrol et
    const tablesResult = await client.query(`
      SELECT 
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes
      FROM pg_stat_user_tables
      ORDER BY tablename
    `);
    
    console.log('  📋 Tablolar:');
    tablesResult.rows.forEach(row => {
      console.log(`    - ${row.tablename}: ${row.inserts} kayıt`);
    });
    
    client.release();
    await pool.end();
  } catch (error) {
    console.log(`  ❌ PostgreSQL: Bağlantı hatası - ${error.message}`);
  }
  
  // File storage durumu
  console.log('\n📁 File Storage Durumu:');
  try {
    const dataDir = './data';
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir);
      console.log(`  ✅ Data klasörü: Mevcut`);
      console.log(`  📄 Dosyalar: ${files.join(', ')}`);
      
      // Dosya boyutlarını göster
      files.forEach(file => {
        const filePath = `${dataDir}/${file}`;
        const stats = fs.statSync(filePath);
        const size = (stats.size / 1024).toFixed(2);
        console.log(`    - ${file}: ${size} KB`);
      });
    } else {
      console.log('  ❌ Data klasörü: Bulunamadı');
    }
  } catch (error) {
    console.log(`  ❌ File Storage: Hata - ${error.message}`);
  }
  
  // Backup durumu
  console.log('\n💾 Backup Durumu:');
  try {
    const backupDir = './backups';
    if (fs.existsSync(backupDir)) {
      const backups = fs.readdirSync(backupDir).filter(f => f.endsWith('.tar.gz'));
      console.log(`  ✅ Backup klasörü: Mevcut`);
      console.log(`  📦 Backup sayısı: ${backups.length}`);
      
      if (backups.length > 0) {
        const latestBackup = backups.sort().pop();
        const stats = fs.statSync(`${backupDir}/${latestBackup}`);
        const size = (stats.size / 1024 / 1024).toFixed(2);
        const date = stats.mtime.toLocaleString('tr-TR');
        console.log(`  🕐 Son backup: ${latestBackup} (${size} MB, ${date})`);
      }
    } else {
      console.log('  ❌ Backup klasörü: Bulunamadı');
    }
  } catch (error) {
    console.log(`  ❌ Backup: Hata - ${error.message}`);
  }
  
  // Environment durumu
  console.log('\n⚙️ Environment Durumu:');
  const envVars = [
    'NODE_ENV',
    'POSTGRES_HOST',
    'POSTGRES_DB',
    'POSTGRES_USER',
    'NEXT_PUBLIC_APP_URL'
  ];
  
  envVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`  ✅ ${varName}: ${value}`);
    } else {
      console.log(`  ❌ ${varName}: Tanımlı değil`);
    }
  });
  
  console.log('\n🎯 Öneriler:');
  console.log('  - Server başlatmak için: npm run server:start');
  console.log('  - Backup oluşturmak için: npm run backup');
  console.log('  - Logları görmek için: npm run server:logs');
  console.log('  - Docker servisleri için: npm run docker:up');
}

// Script doğrudan çalıştırıldığında status check'i başlat
if (require.main === module) {
  checkServerStatus();
}

export default checkServerStatus;

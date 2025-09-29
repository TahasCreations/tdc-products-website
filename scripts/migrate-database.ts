#!/usr/bin/env tsx

/**
 * Database Migration Script
 * PostgreSQL veritabanını kurar ve gerekli tabloları oluşturur
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const config = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'tdc_database',
  user: process.env.POSTGRES_USER || 'tdc_user',
  password: process.env.POSTGRES_PASSWORD || 'tdc_password',
};

async function runMigrations() {
  const pool = new Pool(config);
  
  try {
    console.log('🗄️ Database migration başlıyor...');
    
    // Database bağlantısını test et
    const client = await pool.connect();
    console.log('✅ Database bağlantısı başarılı');
    
    // Schema dosyasını oku
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema dosyası bulunamadı: ${schemaPath}`);
    }
    
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('📄 Schema dosyası okundu');
    
    // Migration'ı çalıştır
    await client.query(schema);
    console.log('✅ Database schema başarıyla uygulandı');
    
    // Tabloları kontrol et
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📋 Oluşturulan tablolar:');
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    client.release();
    console.log('🎉 Database migration tamamlandı!');
    
  } catch (error) {
    console.error('❌ Migration hatası:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Script doğrudan çalıştırıldığında migration'ı başlat
if (require.main === module) {
  runMigrations();
}

export default runMigrations;

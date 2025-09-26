#!/usr/bin/env tsx

/**
 * Demo Data Cleanup Script
 * 
 * Bu script tüm modüllerdeki demo verileri güvenli bir şekilde temizler.
 * 
 * Kullanım:
 *   pnpm clean:demo
 *   npm run clean:demo
 *   yarn clean:demo
 * 
 * Güvenlik:
 * - Production ortamında çalışmaz
 * - ALLOW_DESTRUCTIVE=true gerekli
 * - Backup önerilir
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Environment variables yükle
config({ path: '.env.local' });

// Supabase client oluştur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase environment variables bulunamadı!');
  console.error('NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Güvenlik kontrolleri
function checkSafety() {
  const nodeEnv = process.env.NODE_ENV;
  const allowDestructive = process.env.ALLOW_DESTRUCTIVE;
  
  if (nodeEnv === 'production') {
    console.error('❌ Production ortamında demo veri temizleme yasak!');
    console.error('NODE_ENV=production olduğu için işlem iptal edildi.');
    process.exit(1);
  }
  
  if (allowDestructive !== 'true') {
    console.error('❌ Destructive işlemler için izin gerekli!');
    console.error('ALLOW_DESTRUCTIVE=true olarak ayarlayın.');
    process.exit(1);
  }
  
  console.log('✅ Güvenlik kontrolleri başarılı');
}

// Demo veri tespit pattern'leri
const DEMO_PATTERNS = {
  // Email patterns
  email: ['@example.com', '@demo.com', '@test.com', '@sample.com'],
  
  // Name patterns
  name: ['demo', 'test', 'sample', 'mock', 'fake'],
  
  // SKU/Code patterns
  code: ['DEMO-', 'TEST-', 'SAMPLE-', 'MOCK-', 'FAKE-'],
  
  // Title/Description patterns
  content: ['demo', 'test', 'sample', 'mock', 'fake', 'example'],
  
  // ID patterns
  id: ['demo-', 'test-', 'sample-', 'mock-', 'fake-']
};

// Tablo yapılandırması
const TABLES = [
  { name: 'categories', fields: ['name', 'slug'] },
  { name: 'products', fields: ['name', 'sku', 'description'] },
  { name: 'orders', fields: ['order_number', 'customer_name', 'customer_email'] },
  { name: 'customers', fields: ['first_name', 'last_name', 'email', 'company_name'] },
  { name: 'coupons', fields: ['code', 'description'] },
  { name: 'invoices', fields: ['invoice_number', 'customer_name', 'customer_email'] },
  { name: 'campaigns', fields: ['name', 'description'] },
  { name: 'employees', fields: ['first_name', 'last_name', 'email'] },
  { name: 'admin_users', fields: ['name', 'email'] },
  { name: 'site_users', fields: ['first_name', 'last_name', 'email'] },
  { name: 'blog_posts', fields: ['title', 'slug', 'content'] },
  { name: 'comments', fields: ['content', 'author_name', 'author_email'] },
  { name: 'wishlist', fields: ['user_id'] },
  { name: 'subscriptions', fields: ['user_id', 'plan_name'] },
  { name: 'gift_cards', fields: ['code', 'recipient_email'] },
  { name: 'loyalty_points', fields: ['user_id'] },
  { name: 'price_optimization', fields: ['product_id'] },
  { name: 'automations', fields: ['name', 'description'] },
  { name: 'ai_recommendations', fields: ['user_id', 'product_id'] },
  { name: 'security_threats', fields: ['title', 'description'] },
  { name: 'security_vulnerabilities', fields: ['title', 'description'] },
  { name: 'performance_metrics', fields: ['page_name', 'page_url'] },
  { name: 'page_performance', fields: ['page_name', 'page_url'] },
  { name: 'bundle_analysis', fields: ['name'] },
  { name: 'performance_recommendations', fields: ['title', 'description'] },
  { name: 'ai_insights', fields: ['title', 'description'] },
  { name: 'ai_chatbot_interactions', fields: ['user_id'] },
  { name: 'analytics_sessions', fields: ['user_id'] },
  { name: 'page_views', fields: ['user_id', 'path'] },
  { name: 'sessions', fields: ['user_id'] },
  { name: 'users', fields: ['first_name', 'last_name', 'email'] },
  { name: 'error_logs', fields: ['message', 'user_id'] },
  { name: 'security_logs', fields: ['event_type', 'user_id'] }
];

// Demo veri tespit fonksiyonu
function isDemoData(record: any, tableConfig: { name: string; fields: string[] }): boolean {
  const { fields } = tableConfig;
  
  // is_demo flag kontrolü
  if (record.is_demo === true) {
    return true;
  }
  
  // Pattern kontrolü
  for (const field of fields) {
    const value = record[field];
    if (!value) continue;
    
    const stringValue = String(value).toLowerCase();
    
    // Email pattern kontrolü
    if (field.includes('email')) {
      for (const pattern of DEMO_PATTERNS.email) {
        if (stringValue.includes(pattern)) {
          return true;
        }
      }
    }
    
    // Name pattern kontrolü
    if (field.includes('name') || field.includes('title')) {
      for (const pattern of DEMO_PATTERNS.name) {
        if (stringValue.includes(pattern)) {
          return true;
        }
      }
    }
    
    // Code/SKU pattern kontrolü
    if (field.includes('code') || field.includes('sku') || field.includes('number')) {
      for (const pattern of DEMO_PATTERNS.code) {
        if (stringValue.includes(pattern.toLowerCase())) {
          return true;
        }
      }
    }
    
    // Content pattern kontrolü
    if (field.includes('content') || field.includes('description')) {
      for (const pattern of DEMO_PATTERNS.content) {
        if (stringValue.includes(pattern)) {
          return true;
        }
      }
    }
    
    // ID pattern kontrolü
    if (field.includes('id') || field.includes('user_id')) {
      for (const pattern of DEMO_PATTERNS.id) {
        if (stringValue.includes(pattern)) {
          return true;
        }
      }
    }
  }
  
  return false;
}

// Tablo demo veri sayısını al
async function getDemoCount(tableName: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
      .eq('is_demo', true);
    
    if (error) {
      console.warn(`⚠️  ${tableName} tablosunda demo veri sayısı alınamadı:`, error.message);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.warn(`⚠️  ${tableName} tablosunda hata:`, error);
    return 0;
  }
}

// Tablo demo verilerini temizle
async function cleanTable(tableName: string): Promise<{ deleted: number; errors: string[] }> {
  const errors: string[] = [];
  let deleted = 0;
  
  try {
    // Önce demo veri sayısını al
    const demoCount = await getDemoCount(tableName);
    
    if (demoCount === 0) {
      console.log(`✅ ${tableName}: Demo veri bulunamadı`);
      return { deleted: 0, errors: [] };
    }
    
    console.log(`🧹 ${tableName}: ${demoCount} demo veri temizleniyor...`);
    
    // Demo verileri sil
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('is_demo', true);
    
    if (error) {
      errors.push(`${tableName}: ${error.message}`);
      console.error(`❌ ${tableName}: Silme hatası -`, error.message);
    } else {
      deleted = demoCount;
      console.log(`✅ ${tableName}: ${deleted} demo veri silindi`);
    }
    
  } catch (error) {
    const errorMsg = `${tableName}: ${error}`;
    errors.push(errorMsg);
    console.error(`❌ ${tableName}: Beklenmeyen hata -`, error);
  }
  
  return { deleted, errors };
}

// Ana temizleme fonksiyonu
async function cleanDemoData() {
  console.log('🚀 Demo veri temizleme başlatılıyor...\n');
  
  // Güvenlik kontrolleri
  checkSafety();
  
  // Kullanıcı onayı
  console.log('⚠️  Bu işlem demo verileri kalıcı olarak silecektir!');
  console.log('⚠️  Geri alınamaz! Backup alındığından emin olun.\n');
  
  // Tablo bazında temizleme
  const results: { table: string; deleted: number; errors: string[] }[] = [];
  let totalDeleted = 0;
  let totalErrors = 0;
  
  for (const tableConfig of TABLES) {
    const result = await cleanTable(tableConfig.name);
    results.push({
      table: tableConfig.name,
      deleted: result.deleted,
      errors: result.errors
    });
    
    totalDeleted += result.deleted;
    totalErrors += result.errors.length;
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Sonuçları raporla
  console.log('\n📊 Temizleme Raporu:');
  console.log('='.repeat(50));
  
  results.forEach(result => {
    if (result.deleted > 0) {
      console.log(`✅ ${result.table}: ${result.deleted} veri silindi`);
    } else if (result.errors.length > 0) {
      console.log(`❌ ${result.table}: ${result.errors.length} hata`);
    } else {
      console.log(`ℹ️  ${result.table}: Demo veri bulunamadı`);
    }
  });
  
  console.log('='.repeat(50));
  console.log(`📈 Toplam: ${totalDeleted} demo veri silindi`);
  console.log(`❌ Toplam: ${totalErrors} hata`);
  
  if (totalErrors > 0) {
    console.log('\n🔍 Hata Detayları:');
    results.forEach(result => {
      if (result.errors.length > 0) {
        console.log(`\n${result.table}:`);
        result.errors.forEach(error => console.log(`  - ${error}`));
      }
    });
  }
  
  console.log('\n✅ Demo veri temizleme tamamlandı!');
}

// Script çalıştır
if (require.main === module) {
  cleanDemoData().catch(error => {
    console.error('❌ Script hatası:', error);
    process.exit(1);
  });
}

export { cleanDemoData, isDemoData, DEMO_PATTERNS, TABLES };

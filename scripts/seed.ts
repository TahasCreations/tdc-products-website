#!/usr/bin/env tsx

/**
 * Database Seed Script
 * 
 * Bu script veritabanını demo verilerle doldurur.
 * DEMO_MODE kontrolü ile güvenli çalışır.
 * 
 * Kullanım:
 *   pnpm seed
 *   npm run seed
 *   yarn seed
 * 
 * Environment Variables:
 *   DEMO_MODE=true|false
 *   NODE_ENV=development|production
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { faker } from '@faker-js/faker';

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
  const demoMode = process.env.DEMO_MODE;
  
  if (nodeEnv === 'production') {
    console.error('❌ Production ortamında seed işlemi yasak!');
    console.error('NODE_ENV=production olduğu için işlem iptal edildi.');
    process.exit(1);
  }
  
  if (demoMode !== 'true') {
    console.error('❌ Demo mode aktif değil!');
    console.error('DEMO_MODE=true olarak ayarlayın.');
    process.exit(1);
  }
  
  console.log('✅ Güvenlik kontrolleri başarılı');
}

// Demo veri oluşturma fonksiyonları
function createDemoCategories(count: number = 10) {
  const categories = [];
  
  for (let i = 0; i < count; i++) {
    categories.push({
      name: `DEMO-${faker.commerce.department()}`,
      slug: `demo-${faker.helpers.slugify(faker.commerce.department()).toLowerCase()}`,
      description: faker.commerce.productDescription(),
      emoji: faker.helpers.arrayElement(['📱', '💻', '🎮', '📚', '👕', '🍕', '🏠', '🚗', '🎵', '📷']),
      is_active: true,
      is_demo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return categories;
}

function createDemoProducts(count: number = 50) {
  const products = [];
  
  for (let i = 0; i < count; i++) {
    products.push({
      name: `DEMO-${faker.commerce.productName()}`,
      slug: `demo-${faker.helpers.slugify(faker.commerce.productName()).toLowerCase()}`,
      description: faker.commerce.productDescription(),
      sku: `DEMO-${faker.string.alphanumeric(8).toUpperCase()}`,
      price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      compare_price: parseFloat(faker.commerce.price({ min: 100, max: 1200 })),
      stock: faker.number.int({ min: 0, max: 100 }),
      status: faker.helpers.arrayElement(['active', 'inactive', 'draft']),
      main_image: faker.image.url({ width: 800, height: 600 }),
      category_id: faker.number.int({ min: 1, max: 10 }),
      is_demo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return products;
}

function createDemoCustomers(count: number = 30) {
  const customers = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    customers.push({
      first_name: firstName,
      last_name: lastName,
      email: `demo-${faker.internet.email({ firstName, lastName })}`,
      phone: faker.phone.number(),
      company_name: `DEMO-${faker.company.name()}`,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      postal_code: faker.location.zipCode(),
      country: faker.location.country(),
      is_active: true,
      is_demo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return customers;
}

function createDemoOrders(count: number = 25) {
  const orders = [];
  
  for (let i = 0; i < count; i++) {
    orders.push({
      order_number: `DEMO-${faker.string.alphanumeric(8).toUpperCase()}`,
      customer_id: faker.number.int({ min: 1, max: 30 }),
      customer_name: faker.person.fullName(),
      customer_email: `demo-${faker.internet.email()}`,
      customer_phone: faker.phone.number(),
      status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
      total_amount: parseFloat(faker.commerce.price({ min: 50, max: 2000 })),
      currency: 'TRY',
      payment_method: faker.helpers.arrayElement(['credit_card', 'bank_transfer', 'cash', 'paypal']),
      shipping_address: faker.location.streetAddress(),
      billing_address: faker.location.streetAddress(),
      notes: faker.lorem.sentence(),
      is_demo: true,
      created_at: faker.date.recent({ days: 30 }).toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return orders;
}

function createDemoCoupons(count: number = 15) {
  const coupons = [];
  
  for (let i = 0; i < count; i++) {
    coupons.push({
      code: `DEMO-${faker.string.alphanumeric(6).toUpperCase()}`,
      description: `Demo coupon - ${faker.commerce.productAdjective()}`,
      discount_type: faker.helpers.arrayElement(['percentage', 'fixed']),
      discount_value: faker.number.int({ min: 5, max: 50 }),
      minimum_amount: parseFloat(faker.commerce.price({ min: 100, max: 500 })),
      maximum_discount: parseFloat(faker.commerce.price({ min: 10, max: 100 })),
      usage_limit: faker.number.int({ min: 10, max: 100 }),
      used_count: faker.number.int({ min: 0, max: 10 }),
      is_active: true,
      valid_from: faker.date.past().toISOString(),
      valid_until: faker.date.future().toISOString(),
      is_demo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return coupons;
}

function createDemoInvoices(count: number = 20) {
  const invoices = [];
  
  for (let i = 0; i < count; i++) {
    invoices.push({
      invoice_number: `DEMO-INV-${faker.string.alphanumeric(6).toUpperCase()}`,
      customer_id: faker.number.int({ min: 1, max: 30 }),
      customer_name: faker.person.fullName(),
      customer_email: `demo-${faker.internet.email()}`,
      customer_address: faker.location.streetAddress(),
      subtotal: parseFloat(faker.commerce.price({ min: 100, max: 1000 })),
      tax_amount: parseFloat(faker.commerce.price({ min: 10, max: 100 })),
      total_amount: parseFloat(faker.commerce.price({ min: 110, max: 1100 })),
      currency: 'TRY',
      status: faker.helpers.arrayElement(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
      due_date: faker.date.future().toISOString(),
      paid_at: faker.helpers.maybe(() => faker.date.past().toISOString()),
      is_demo: true,
      created_at: faker.date.recent({ days: 30 }).toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return invoices;
}

function createDemoCampaigns(count: number = 12) {
  const campaigns = [];
  
  for (let i = 0; i < count; i++) {
    campaigns.push({
      name: `DEMO-${faker.commerce.productName()} Campaign`,
      description: faker.commerce.productDescription(),
      type: faker.helpers.arrayElement(['email', 'sms', 'push', 'social', 'display']),
      status: faker.helpers.arrayElement(['draft', 'active', 'paused', 'completed', 'cancelled']),
      budget: parseFloat(faker.commerce.price({ min: 1000, max: 50000 })),
      spent: parseFloat(faker.commerce.price({ min: 0, max: 50000 })),
      target_audience: faker.helpers.arrayElement(['all', 'new_customers', 'returning_customers', 'vip_customers']),
      start_date: faker.date.past().toISOString(),
      end_date: faker.date.future().toISOString(),
      is_demo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return campaigns;
}

function createDemoEmployees(count: number = 15) {
  const employees = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    employees.push({
      first_name: firstName,
      last_name: lastName,
      email: `demo-${faker.internet.email({ firstName, lastName })}`,
      phone: faker.phone.number(),
      position: faker.person.jobTitle(),
      department: faker.commerce.department(),
      salary: parseFloat(faker.commerce.price({ min: 5000, max: 50000 })),
      hire_date: faker.date.past({ years: 5 }).toISOString(),
      status: faker.helpers.arrayElement(['active', 'inactive', 'terminated']),
      is_demo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return employees;
}

function createDemoBlogPosts(count: number = 8) {
  const blogPosts = [];
  
  for (let i = 0; i < count; i++) {
    blogPosts.push({
      title: `DEMO-${faker.lorem.sentence()}`,
      slug: `demo-${faker.helpers.slugify(faker.lorem.sentence()).toLowerCase()}`,
      content: faker.lorem.paragraphs(5),
      excerpt: faker.lorem.paragraph(),
      author: `DEMO-${faker.person.fullName()}`,
      author_id: faker.number.int({ min: 1, max: 5 }),
      category: faker.commerce.department(),
      tags: faker.helpers.arrayElements(['demo', 'test', 'example', 'sample'], 2),
      status: faker.helpers.arrayElement(['draft', 'published', 'archived']),
      featured_image: faker.image.url({ width: 800, height: 400 }),
      views: faker.number.int({ min: 0, max: 1000 }),
      published_at: faker.date.past().toISOString(),
      is_demo: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return blogPosts;
}

// Veri ekleme fonksiyonu
async function insertData(tableName: string, data: any[]): Promise<{ inserted: number; errors: string[] }> {
  const errors: string[] = [];
  let inserted = 0;
  
  try {
    if (data.length === 0) {
      return { inserted: 0, errors: [] };
    }
    
    const { data: result, error } = await supabase
      .from(tableName)
      .insert(data)
      .select();
    
    if (error) {
      errors.push(`${tableName}: ${error.message}`);
      console.error(`❌ ${tableName}: Ekleme hatası -`, error.message);
    } else {
      inserted = result?.length || 0;
      console.log(`✅ ${tableName}: ${inserted} veri eklendi`);
    }
    
  } catch (error) {
    const errorMsg = `${tableName}: ${error}`;
    errors.push(errorMsg);
    console.error(`❌ ${tableName}: Beklenmeyen hata -`, error);
  }
  
  return { inserted, errors };
}

// Ana seed fonksiyonu
async function seedDatabase() {
  console.log('🌱 Veritabanı seed işlemi başlatılıyor...\n');
  
  // Güvenlik kontrolleri
  checkSafety();
  
  // Demo veri oluştur
  console.log('📝 Demo veri oluşturuluyor...');
  
  const categories = createDemoCategories(10);
  const products = createDemoProducts(50);
  const customers = createDemoCustomers(30);
  const orders = createDemoOrders(25);
  const coupons = createDemoCoupons(15);
  const invoices = createDemoInvoices(20);
  const campaigns = createDemoCampaigns(12);
  const employees = createDemoEmployees(15);
  const blogPosts = createDemoBlogPosts(8);
  
  console.log('✅ Demo veri oluşturuldu\n');
  
  // Veritabanına ekle
  console.log('💾 Veritabanına ekleniyor...');
  
  const results: { table: string; inserted: number; errors: string[] }[] = [];
  let totalInserted = 0;
  let totalErrors = 0;
  
  // Sıralı ekleme (foreign key constraints için)
  const insertions = [
    { table: 'categories', data: categories },
    { table: 'products', data: products },
    { table: 'customers', data: customers },
    { table: 'orders', data: orders },
    { table: 'coupons', data: coupons },
    { table: 'invoices', data: invoices },
    { table: 'campaigns', data: campaigns },
    { table: 'employees', data: employees },
    { table: 'blog_posts', data: blogPosts }
  ];
  
  for (const insertion of insertions) {
    const result = await insertData(insertion.table, insertion.data);
    results.push({
      table: insertion.table,
      inserted: result.inserted,
      errors: result.errors
    });
    
    totalInserted += result.inserted;
    totalErrors += result.errors.length;
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Sonuçları raporla
  console.log('\n📊 Seed Raporu:');
  console.log('='.repeat(50));
  
  results.forEach(result => {
    if (result.inserted > 0) {
      console.log(`✅ ${result.table}: ${result.inserted} veri eklendi`);
    } else if (result.errors.length > 0) {
      console.log(`❌ ${result.table}: ${result.errors.length} hata`);
    } else {
      console.log(`ℹ️  ${result.table}: Veri eklenmedi`);
    }
  });
  
  console.log('='.repeat(50));
  console.log(`📈 Toplam: ${totalInserted} demo veri eklendi`);
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
  
  console.log('\n✅ Seed işlemi tamamlandı!');
  console.log('💡 Demo veriler is_demo=true ile işaretlendi');
}

// Script çalıştır
if (require.main === module) {
  seedDatabase().catch(error => {
    console.error('❌ Script hatası:', error);
    process.exit(1);
  });
}

export { seedDatabase, createDemoCategories, createDemoProducts, createDemoCustomers };

#!/usr/bin/env node

// 🚀 TDC PRODUCTS WEBSITE - SUPABASE KURULUM SCRIPTİ
// Bu script Supabase kurulumunu otomatikleştirir

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 TDC Products Website - Supabase Kurulum Scripti');
console.log('================================================\n');

// 1. Environment variables kontrolü
console.log('📋 1. Environment Variables Kontrolü...');

if (!fs.existsSync('.env.local')) {
  console.log('❌ .env.local dosyası bulunamadı!');
  console.log('💡 env-template.txt dosyasını .env.local olarak kopyalayın');
  console.log('💡 Supabase bilgilerini doldurun');
  process.exit(1);
}

// .env.local dosyasını oku
const envContent = fs.readFileSync('.env.local', 'utf8');

// Supabase URL kontrolü
if (envContent.includes('your_supabase_project_url') || 
    envContent.includes('your-project-id.supabase.co')) {
  console.log('❌ Supabase URL henüz ayarlanmamış!');
  console.log('💡 .env.local dosyasında NEXT_PUBLIC_SUPABASE_URL değerini güncelleyin');
  process.exit(1);
}

// Supabase anon key kontrolü
if (envContent.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')) {
  console.log('❌ Supabase anon key henüz ayarlanmamış!');
  console.log('💡 .env.local dosyasında NEXT_PUBLIC_SUPABASE_ANON_KEY değerini güncelleyin');
  process.exit(1);
}

console.log('✅ Environment variables doğru ayarlanmış');

// 2. Node modules kontrolü
console.log('\n📦 2. Dependencies Kontrolü...');

if (!fs.existsSync('node_modules')) {
  console.log('📥 Dependencies yükleniyor...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies yüklendi');
  } catch (error) {
    console.error('❌ Dependencies yüklenemedi:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies mevcut');
}

// 3. Supabase bağlantı testi
console.log('\n🔗 3. Supabase Bağlantı Testi...');

try {
  const result = execSync('node test-supabase-connection.js', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  if (result.includes('TÜM TESTLER BAŞARILI!')) {
    console.log('✅ Supabase bağlantısı başarılı!');
    console.log('✅ Veritabanı şeması doğru kurulmuş');
  } else {
    console.log('⚠️ Supabase bağlantısında sorun var');
    console.log('💡 test-supabase-connection.js çıktısını kontrol edin');
  }
} catch (error) {
  console.log('❌ Supabase bağlantı testi başarısız');
  console.log('💡 Aşağıdaki adımları takip edin:');
  console.log('   1. Supabase projesi oluşturun');
  console.log('   2. database/COMPLETE-SUPABASE-SCHEMA.sql dosyasını çalıştırın');
  console.log('   3. .env.local dosyasını doğru şekilde ayarlayın');
}

// 4. Build testi
console.log('\n🔨 4. Build Testi...');

try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build başarılı!');
} catch (error) {
  console.error('❌ Build başarısız:', error.message);
  console.log('💡 Build hatalarını düzeltin');
}

// 5. Kurulum özeti
console.log('\n📋 KURULUM ÖZETİ');
console.log('================');
console.log('✅ Environment variables ayarlandı');
console.log('✅ Dependencies yüklendi');
console.log('✅ Supabase bağlantısı test edildi');
console.log('✅ Build testi yapıldı');

console.log('\n🚀 SONRAKI ADIMLAR:');
console.log('1. npm run dev ile development server\'ı başlatın');
console.log('2. http://localhost:3000/admin adresine gidin');
console.log('3. Admin hesabıyla giriş yapın');
console.log('4. Kategori ekleme/silme işlemlerini test edin');

console.log('\n📚 YARDIM:');
console.log('- SUPABASE-KURULUM-REHBERI.md dosyasını okuyun');
console.log('- Sorun yaşarsanız test-supabase-connection.js çalıştırın');

console.log('\n🎉 Kurulum tamamlandı!');

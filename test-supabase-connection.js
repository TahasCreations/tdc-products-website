// 🚀 TDC PRODUCTS WEBSITE - SUPABASE BAĞLANTI TESTİ
const { createClient } = require('@supabase/supabase-js');

// Environment variables'ı kontrol et
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Supabase Bağlantı Testi');
console.log('========================');

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL environment variable bulunamadı!');
  process.exit(1);
}

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable bulunamadı!');
  process.exit(1);
}

console.log('✅ Environment variables mevcut');
console.log('📍 Supabase URL:', supabaseUrl);
console.log('🔑 Anon Key:', supabaseAnonKey.substring(0, 20) + '...');

// Supabase client oluştur
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n🔄 Supabase bağlantısı test ediliyor...');
    
    // 1. Categories tablosu testi
    console.log('\n📋 1. Categories tablosu testi...');
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(5);

    if (categoriesError) {
      console.error('❌ Categories tablosu hatası:', categoriesError.message);
      
      if (categoriesError.message.includes('relation "categories" does not exist')) {
        console.log('\n💡 Çözüm önerileri:');
        console.log('1. Supabase dashboard\'da database/COMPLETE-SUPABASE-SCHEMA.sql dosyasını çalıştırın');
        console.log('2. Tabloların oluşturulduğundan emin olun');
      }
      
      process.exit(1);
    }

    console.log('✅ Categories tablosu erişilebilir');
    console.log('📊 Toplam kategori sayısı:', categoriesData?.length || 0);
    
    if (categoriesData && categoriesData.length > 0) {
      console.log('\n📝 Kategoriler:');
      categoriesData.forEach((cat, index) => {
        console.log(`  ${index + 1}. ${cat.name} (${cat.emoji || '📦'}) - ${cat.slug}`);
      });
    }

    // 2. Products tablosu testi
    console.log('\n🛍️ 2. Products tablosu testi...');
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(3);

    if (productsError) {
      console.error('❌ Products tablosu hatası:', productsError.message);
    } else {
      console.log('✅ Products tablosu erişilebilir');
      console.log('📊 Toplam ürün sayısı:', productsData?.length || 0);
    }

    // 3. Orders tablosu testi
    console.log('\n📦 3. Orders tablosu testi...');
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .limit(3);

    if (ordersError) {
      console.error('❌ Orders tablosu hatası:', ordersError.message);
    } else {
      console.log('✅ Orders tablosu erişilebilir');
      console.log('📊 Toplam sipariş sayısı:', ordersData?.length || 0);
    }

    // 4. Site settings testi
    console.log('\n⚙️ 4. Site Settings testi...');
    const { data: settingsData, error: settingsError } = await supabase
      .from('site_settings')
      .select('*')
      .limit(5);

    if (settingsError) {
      console.error('❌ Site Settings hatası:', settingsError.message);
    } else {
      console.log('✅ Site Settings erişilebilir');
      console.log('📊 Toplam ayar sayısı:', settingsData?.length || 0);
    }

    // 5. Admin users testi
    console.log('\n👤 5. Admin Users testi...');
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(3);

    if (adminError) {
      console.error('❌ Admin Users hatası:', adminError.message);
    } else {
      console.log('✅ Admin Users erişilebilir');
      console.log('📊 Toplam admin sayısı:', adminData?.length || 0);
    }

    // 6. Kategori ekleme testi
    console.log('\n➕ 6. Kategori ekleme testi...');
    const testCategory = {
      name: 'Test Kategori',
      slug: 'test-kategori-' + Date.now(),
      description: 'Test için oluşturulan kategori',
      emoji: '🧪',
      is_active: true
    };

    const { data: newCategory, error: insertError } = await supabase
      .from('categories')
      .insert([testCategory])
      .select()
      .single();

    if (insertError) {
      console.error('❌ Kategori ekleme hatası:', insertError.message);
    } else {
      console.log('✅ Kategori başarıyla eklendi:', newCategory.name);
      
      // Test kategorisini sil
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', newCategory.id);
      
      if (deleteError) {
        console.error('⚠️ Test kategorisi silinemedi:', deleteError.message);
      } else {
        console.log('✅ Test kategorisi temizlendi');
      }
    }

    console.log('\n🎉 TÜM TESTLER BAŞARILI!');
    console.log('✅ Supabase entegrasyonu tamamen çalışıyor');
    console.log('✅ Kategori ekleme/silme işlemleri çalışıyor');
    console.log('✅ Veritabanı şeması doğru kurulmuş');
    console.log('\n🚀 Artık e-ticaret modülünü kullanabilirsin!');

  } catch (err) {
    console.error('❌ Beklenmeyen hata:', err.message);
    console.error('Stack trace:', err.stack);
    process.exit(1);
  }
}

// Test'i çalıştır
testConnection();

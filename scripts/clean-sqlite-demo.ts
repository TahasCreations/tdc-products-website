#!/usr/bin/env tsx
/**
 * SQLite Demo Data Cleanup Script
 * 
 * Bu script SQLite veritabanındaki tüm demo verileri temizler
 * Prisma Client kullanarak güvenli silme işlemi yapar
 * 
 * Kullanım: npx tsx scripts/clean-sqlite-demo.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 SQLite Demo Veri Temizliği Başlatılıyor...\n');
  console.log('⚠️  Bu işlem geri alınamaz!');
  console.log('💡 Devam etmeden önce veritabanı yedeği aldığınızdan emin olun.\n');

  let totalDeleted = 0;

  try {
    // 1. KULLANICI VERİLERİ
    console.log('👥 Kullanıcı verileri temizleniyor...');
    
    // Demo kullanıcıları sil (test emailler)
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        OR: [
          { email: { contains: '@example.com' } },
          { email: { contains: '@demo.com' } },
          { email: { contains: '@test.com' } },
          { email: 'admin@tdc.local' },
          { email: 'seller@tdc.local' },
          { email: 'seller2@tdc.local' },
          { email: 'buyer@tdc.local' },
          { email: 'admin@tdcmarket.com' },
          { email: 'seller@tdcmarket.com' },
        ],
        NOT: {
          email: 'bentahasarii@gmail.com' // Ana admin korunur
        }
      }
    });
    console.log(`  ✓ ${deletedUsers.count} demo kullanıcı silindi`);
    totalDeleted += deletedUsers.count;

    // 2. ÜRÜN VERİLERİ
    console.log('\n📦 Ürün verileri temizleniyor...');
    
    // Product reviews
    const deletedReviews = await prisma.review.deleteMany({});
    console.log(`  ✓ ${deletedReviews.count} yorum silindi`);
    totalDeleted += deletedReviews.count;

    // Products (tüm satıcılar silindiğinde otomatik silinecek)
    const deletedProducts = await prisma.product.deleteMany({});
    console.log(`  ✓ ${deletedProducts.count} ürün silindi`);
    totalDeleted += deletedProducts.count;

    // 3. SİPARİŞLER
    console.log('\n🛒 Sipariş verileri temizleniyor...');
    
    // Order items önce silinmeli (foreign key)
    const deletedOrderItems = await prisma.orderItem.deleteMany({});
    console.log(`  ✓ ${deletedOrderItems.count} sipariş kalemi silindi`);
    totalDeleted += deletedOrderItems.count;

    // Orders
    const deletedOrders = await prisma.order.deleteMany({});
    console.log(`  ✓ ${deletedOrders.count} sipariş silindi`);
    totalDeleted += deletedOrders.count;

    // 4. SATICI PROFİLLERİ
    console.log('\n🏪 Satıcı profilleri temizleniyor...');
    
    // Seller applications
    const deletedSellerApps = await prisma.sellerApplication.deleteMany({});
    console.log(`  ✓ ${deletedSellerApps.count} satıcı başvurusu silindi`);
    totalDeleted += deletedSellerApps.count;

    // Seller profiles (cascade delete products)
    const deletedSellers = await prisma.sellerProfile.deleteMany({});
    console.log(`  ✓ ${deletedSellers.count} satıcı profili silindi`);
    totalDeleted += deletedSellers.count;

    // 5. INFLUENCER PROFİLLERİ
    console.log('\n💫 Influencer profilleri temizleniyor...');
    
    // Influencer applications
    const deletedInfluencerApps = await prisma.influencerApplication.deleteMany({});
    console.log(`  ✓ ${deletedInfluencerApps.count} influencer başvurusu silindi`);
    totalDeleted += deletedInfluencerApps.count;

    // Influencer profiles
    const deletedInfluencers = await prisma.influencerProfile.deleteMany({});
    console.log(`  ✓ ${deletedInfluencers.count} influencer profili silindi`);
    totalDeleted += deletedInfluencers.count;

    // 6. DİĞER VERİLER
    console.log('\n🗑️ Diğer veriler temizleniyor...');
    
    // Wishlist items
    const deletedWishlist = await prisma.wishlistItem.deleteMany({});
    console.log(`  ✓ ${deletedWishlist.count} wishlist öğesi silindi`);
    totalDeleted += deletedWishlist.count;

    // Addresses
    const deletedAddresses = await prisma.address.deleteMany({});
    console.log(`  ✓ ${deletedAddresses.count} adres silindi`);
    totalDeleted += deletedAddresses.count;

    // Collaborations
    if (prisma.collaboration) {
      const deletedCollabs = await prisma.collaboration.deleteMany({});
      console.log(`  ✓ ${deletedCollabs.count} işbirliği silindi`);
      totalDeleted += deletedCollabs.count;
    }

    // Ad campaigns
    if (prisma.adCampaign) {
      const deletedCampaigns = await prisma.adCampaign.deleteMany({});
      console.log(`  ✓ ${deletedCampaigns.count} reklam kampanyası silindi`);
      totalDeleted += deletedCampaigns.count;
    }

    // Push tokens
    const deletedPushTokens = await prisma.pushToken.deleteMany({});
    console.log(`  ✓ ${deletedPushTokens.count} push token silindi`);
    totalDeleted += deletedPushTokens.count;

    // SONUÇ RAPORU
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEMİZLİK SONUÇ RAPORU');
    console.log('='.repeat(60));

    // Kalan kayıt sayıları
    const remainingUsers = await prisma.user.count();
    const remainingProducts = await prisma.product.count();
    const remainingOrders = await prisma.order.count();
    const remainingSellers = await prisma.sellerProfile.count();

    console.log(`\n✓ Kullanıcılar kalan: ${remainingUsers}`);
    console.log(`✓ Ürünler kalan: ${remainingProducts}`);
    console.log(`✓ Siparişler kalan: ${remainingOrders}`);
    console.log(`✓ Satıcılar kalan: ${remainingSellers}`);

    // Ana admin kontrolü
    const adminUser = await prisma.user.findUnique({
      where: { email: 'bentahasarii@gmail.com' }
    });

    if (adminUser) {
      console.log(`\n✅ Ana admin korundu: ${adminUser.email}`);
    } else {
      console.log('\n⚠️  UYARI: Ana admin bulunamadı!');
    }

    console.log(`\n📊 Toplam silinen kayıt: ${totalDeleted}`);
    console.log('='.repeat(60));
    console.log('\n🎉 Demo veri temizliği başarıyla tamamlandı!');
    console.log('💡 Şimdi admin panele giriş yapıp kontrol edebilirsiniz.');
    
  } catch (error) {
    console.error('\n❌ Hata oluştu:', error);
    console.log('\n💡 Veritabanını yedekten geri yükleyin.');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });


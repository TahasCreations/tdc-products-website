#!/usr/bin/env tsx
/**
 * SQLite Demo Data Check Script
 * 
 * Bu script SQLite veritabanındaki demo verileri kontrol eder
 * Temizlik öncesi ve sonrası karşılaştırma için kullanın
 * 
 * Kullanım: npx tsx scripts/check-sqlite-demo.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 SQLite Demo Veri Kontrolü\n');
  console.log('='.repeat(60));

  try {
    // KULLANICILAR
    console.log('\n👥 KULLANICI VERİLERİ');
    console.log('─'.repeat(60));
    
    const totalUsers = await prisma.user.count();
    const demoUsers = await prisma.user.count({
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
          email: 'bentahasarii@gmail.com'
        }
      }
    });
    const realUsers = totalUsers - demoUsers;

    console.log(`├─ Toplam Kullanıcı: ${totalUsers}`);
    console.log(`├─ Demo Kullanıcı: ${demoUsers}`);
    console.log(`└─ Gerçek Kullanıcı: ${realUsers}`);

    // Ana admin kontrolü
    const adminUser = await prisma.user.findUnique({
      where: { email: 'bentahasarii@gmail.com' }
    });

    if (adminUser) {
      console.log(`\n✅ Ana admin mevcut: ${adminUser.email} (Korunacak)`);
    } else {
      console.log('\n⚠️  Ana admin bulunamadı!');
    }

    // ÜRÜNLER
    console.log('\n📦 ÜRÜN VERİLERİ');
    console.log('─'.repeat(60));
    
    const totalProducts = await prisma.product.count();
    const totalReviews = await prisma.review.count();
    
    console.log(`├─ Ürünler: ${totalProducts}`);
    console.log(`└─ Yorumlar: ${totalReviews}`);

    // SATICILAR
    console.log('\n🏪 SATICI VERİLERİ');
    console.log('─'.repeat(60));
    
    const totalSellers = await prisma.sellerProfile.count();
    const totalSellerApps = await prisma.sellerApplication.count();
    
    console.log(`├─ Satıcı Profilleri: ${totalSellers}`);
    console.log(`└─ Satıcı Başvuruları: ${totalSellerApps}`);

    // SİPARİŞLER
    console.log('\n🛒 SİPARİŞ VERİLERİ');
    console.log('─'.repeat(60));
    
    const totalOrders = await prisma.order.count();
    const totalOrderItems = await prisma.orderItem.count();
    
    console.log(`├─ Siparişler: ${totalOrders}`);
    console.log(`└─ Sipariş Kalemleri: ${totalOrderItems}`);

    // INFLUENCER
    console.log('\n💫 INFLUENCER VERİLERİ');
    console.log('─'.repeat(60));
    
    const totalInfluencers = await prisma.influencerProfile.count();
    const totalInfluencerApps = await prisma.influencerApplication.count();
    
    console.log(`├─ Influencer Profilleri: ${totalInfluencers}`);
    console.log(`└─ Influencer Başvuruları: ${totalInfluencerApps}`);

    // DİĞERLERİ
    console.log('\n🗂️ DİĞER VERİLER');
    console.log('─'.repeat(60));
    
    const totalWishlist = await prisma.wishlistItem.count();
    const totalAddresses = await prisma.address.count();
    
    console.log(`├─ Wishlist: ${totalWishlist}`);
    console.log(`└─ Adresler: ${totalAddresses}`);

    // ÖZET
    console.log('\n' + '='.repeat(60));
    console.log('📊 ÖZET');
    console.log('='.repeat(60));
    
    const totalRecords = totalUsers + totalProducts + totalReviews + 
                        totalSellers + totalOrders + totalOrderItems +
                        totalInfluencers + totalWishlist + totalAddresses;
    
    console.log(`\n📈 Toplam Kayıt: ${totalRecords}`);
    console.log(`🗑️ Demo Kullanıcı: ${demoUsers}`);
    console.log(`✅ Korunacak: Ana admin (bentahasarii@gmail.com)`);

    if (totalRecords === 0 || (totalRecords === 1 && adminUser)) {
      console.log('\n✨ Veritabanı temiz! Sadece ana admin var.');
    } else if (demoUsers > 0 || totalProducts > 0 || totalSellers > 0) {
      console.log('\n⚠️  Demo veriler mevcut. Temizlemek için:');
      console.log('   npx tsx scripts/clean-sqlite-demo.ts');
    } else {
      console.log('\n✅ Veritabanı temiz görünüyor!');
    }

    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();


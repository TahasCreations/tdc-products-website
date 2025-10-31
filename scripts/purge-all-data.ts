#!/usr/bin/env tsx

/**
 * Complete Data Purge Script for TDC Market
 * 
 * Bu script TÜM veri tabanlı verileri temizler.
 * SADECE admin kullanıcıları korur.
 * 
 * ⚠️  DİKKAT: Bu işlem geri alınamaz!
 * 
 * Kullanım:
 *   tsx scripts/purge-all-data.ts --dry-run    # Önce dry run yap
 *   tsx scripts/purge-all-data.ts --confirm    # Gerçek temizlik
 */

import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const isDryRun = !args.includes('--confirm');

interface PurgeStats {
  users: number;
  sellers: number;
  influencers: number;
  products: number;
  orders: number;
  reviews: number;
  wishlistItems: number;
  addresses: number;
  collaborations: number;
  applications: number;
  subscriptions: number;
  payouts: number;
  domains: number;
  themes: number;
  adCampaigns: number;
  coupons: number;
  sessions: number;
  accounts: number;
  total: number;
}

async function confirmAction(prompt: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'yes');
    });
  });
}

async function getDataCounts(): Promise<PurgeStats> {
  console.log('📊 Veritabanı verilerini analiz ediliyor...\n');

  try {
    const [
      users,
      sellers,
      influencers,
      products,
      orders,
      reviews,
      wishlistItems,
      addresses,
      collaborations,
      sellerApps,
      influencerApps,
      subscriptions,
      payouts,
      domains,
      themes,
      adCampaigns,
      sessions,
      accounts,
    ] = await Promise.all([
      prisma.user.count({ where: { role: { not: 'ADMIN' } } }).catch(() => 0),
      prisma.sellerProfile.count().catch(() => 0),
      prisma.influencerProfile.count().catch(() => 0),
      prisma.product.count().catch(() => 0),
      prisma.order.count().catch(() => 0),
      prisma.review.count().catch(() => 0),
      prisma.wishlistItem.count().catch(() => 0),
      prisma.address.count().catch(() => 0),
      prisma.collaboration.count().catch(() => 0),
      prisma.sellerApplication.count().catch(() => 0),
      prisma.influencerApplication.count().catch(() => 0),
      prisma.subscription.count().catch(() => 0),
      prisma.payout.count().catch(() => 0),
      prisma.storeDomain.count().catch(() => 0),
      prisma.storeTheme.count().catch(() => 0),
      prisma.adCampaign.count().catch(() => 0),
      prisma.session.count().catch(() => 0),
      prisma.account.count().catch(() => 0),
    ]);
    
    const coupons = 0; // Coupon modeli mevcut değil

    const applications = sellerApps + influencerApps;

    return {
      users,
      sellers,
      influencers,
      products,
      orders,
      reviews,
      wishlistItems,
      addresses,
      collaborations,
      applications,
      subscriptions,
      payouts,
      domains,
      themes,
      adCampaigns,
      coupons,
      sessions,
      accounts,
      total: users + products + orders + reviews + sellers + influencers,
    };
  } catch (error) {
    console.error('❌ Veri sayma hatası:', error);
    throw error;
  }
}

async function purgeAllData(): Promise<PurgeStats> {
  console.log('🗑️  Veri temizliği başlatılıyor...\n');

  const stats: PurgeStats = {
    users: 0,
    sellers: 0,
    influencers: 0,
    products: 0,
    orders: 0,
    reviews: 0,
    wishlistItems: 0,
    addresses: 0,
    collaborations: 0,
    applications: 0,
    subscriptions: 0,
    payouts: 0,
    domains: 0,
    themes: 0,
    adCampaigns: 0,
    coupons: 0,
    sessions: 0,
    accounts: 0,
    total: 0,
  };

  try {
    // 1. Kuponlar (Model mevcut değil - atlanıyor)
    stats.coupons = 0;

    // 2. Ad Campaigns
    console.log('📢 Reklam kampanyaları temizleniyor...');
    const deletedAds = await prisma.adCampaign.deleteMany({});
    stats.adCampaigns = deletedAds.count;
    console.log(`   ✅ ${stats.adCampaigns} reklam kampanyası silindi\n`);

    // 3. Store Themes
    console.log('🎨 Mağaza temaları temizleniyor...');
    const deletedThemes = await prisma.storeTheme.deleteMany({});
    stats.themes = deletedThemes.count;
    console.log(`   ✅ ${stats.themes} tema silindi\n`);

    // 4. Store Domains
    console.log('🌐 Domain kayıtları temizleniyor...');
    await prisma.domainAllowance.deleteMany({});
    const deletedDomains = await prisma.storeDomain.deleteMany({});
    stats.domains = deletedDomains.count;
    console.log(`   ✅ ${stats.domains} domain silindi\n`);

    // 5. Collaborations & Messages
    console.log('🤝 İşbirlikleri temizleniyor...');
    await prisma.message.deleteMany({});
    await prisma.conversation.deleteMany({});
    const deletedCollabs = await prisma.collaboration.deleteMany({});
    stats.collaborations = deletedCollabs.count;
    console.log(`   ✅ ${stats.collaborations} işbirliği silindi\n`);

    // 6. Applications
    console.log('📝 Başvurular temizleniyor...');
    const [deletedSellerApps, deletedInfluencerApps] = await Promise.all([
      prisma.sellerApplication.deleteMany({}),
      prisma.influencerApplication.deleteMany({}),
    ]);
    stats.applications = deletedSellerApps.count + deletedInfluencerApps.count;
    console.log(`   ✅ ${stats.applications} başvuru silindi\n`);

    // 7. Payouts & Subscriptions
    console.log('💰 Ödemeler ve abonelikler temizleniyor...');
    const [deletedPayouts, deletedSubs] = await Promise.all([
      prisma.payout.deleteMany({}),
      prisma.subscription.deleteMany({}),
    ]);
    stats.payouts = deletedPayouts.count;
    stats.subscriptions = deletedSubs.count;
    console.log(`   ✅ ${stats.payouts} ödeme, ${stats.subscriptions} abonelik silindi\n`);

    // 8. Reviews & Review Likes
    console.log('⭐ Yorumlar temizleniyor...');
    await prisma.reviewLike.deleteMany({});
    const deletedReviews = await prisma.review.deleteMany({});
    stats.reviews = deletedReviews.count;
    console.log(`   ✅ ${stats.reviews} yorum silindi\n`);

    // 9. Wishlist Items
    console.log('❤️  İstek listeleri temizleniyor...');
    const deletedWishlist = await prisma.wishlistItem.deleteMany({});
    stats.wishlistItems = deletedWishlist.count;
    console.log(`   ✅ ${stats.wishlistItems} istek listesi ögesi silindi\n`);

    // 10. Orders & Order Items
    console.log('📦 Siparişler temizleniyor...');
    await prisma.orderItem.deleteMany({});
    const deletedOrders = await prisma.order.deleteMany({});
    stats.orders = deletedOrders.count;
    console.log(`   ✅ ${stats.orders} sipariş silindi\n`);

    // 11. Products (bu seller profile'a bağlı)
    console.log('🛍️  Ürünler temizleniyor...');
    const deletedProducts = await prisma.product.deleteMany({});
    stats.products = deletedProducts.count;
    console.log(`   ✅ ${stats.products} ürün silindi\n`);

    // 12. Seller Profiles
    console.log('🏪 Satıcı profilleri temizleniyor...');
    const deletedSellers = await prisma.sellerProfile.deleteMany({});
    stats.sellers = deletedSellers.count;
    console.log(`   ✅ ${stats.sellers} satıcı profili silindi\n`);

    // 13. Influencer Profiles
    console.log('📱 Influencer profilleri temizleniyor...');
    const deletedInfluencers = await prisma.influencerProfile.deleteMany({});
    stats.influencers = deletedInfluencers.count;
    console.log(`   ✅ ${stats.influencers} influencer profili silindi\n`);

    // 14. Addresses & Push Tokens
    console.log('📍 Adresler ve bildirim token\'ları temizleniyor...');
    await prisma.pushToken.deleteMany({});
    const deletedAddresses = await prisma.address.deleteMany({});
    stats.addresses = deletedAddresses.count;
    console.log(`   ✅ ${stats.addresses} adres silindi\n`);

    // 15. User Sessions & Accounts (Admin olmayan kullanıcılar için)
    console.log('🔑 Oturumlar ve hesaplar temizleniyor...');
    const nonAdminUsers = await prisma.user.findMany({
      where: { role: { not: 'ADMIN' } },
      select: { id: true },
    });
    const nonAdminUserIds = nonAdminUsers.map((u) => u.id);

    if (nonAdminUserIds.length > 0) {
      await prisma.session.deleteMany({
        where: { userId: { in: nonAdminUserIds } },
      });
      await prisma.account.deleteMany({
        where: { userId: { in: nonAdminUserIds } },
      });
      await prisma.verificationToken.deleteMany({});
    }

    // Admin kullanıcıları olmayan tüm session'ları da temizle
    const deletedSessions = await prisma.session.deleteMany({});
    const deletedAccounts = await prisma.account.deleteMany({});
    stats.sessions = deletedSessions.count;
    stats.accounts = deletedAccounts.count;
    console.log(`   ✅ ${stats.sessions} oturum, ${stats.accounts} hesap silindi\n`);

    // 16. Users (Admin hariç)
    console.log('👥 Kullanıcılar temizleniyor (Admin kullanıcılar korunuyor)...');
    const deletedUsers = await prisma.user.deleteMany({
      where: { role: { not: 'ADMIN' } },
    });
    stats.users = deletedUsers.count;
    console.log(`   ✅ ${stats.users} kullanıcı silindi\n`);

    stats.total =
      stats.users +
      stats.products +
      stats.orders +
      stats.reviews +
      stats.sellers +
      stats.influencers +
      stats.collaborations +
      stats.applications;

    return stats;
  } catch (error) {
    console.error('\n❌ Temizleme sırasında hata oluştu:', error);
    throw error;
  }
}

async function main() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         TDC MARKET - TAM VERİ TEMİZLEME SCRIPT\'İ          ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('\n');

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - Hiçbir veri silinmeyecek\n');
    console.log('💡 Gerçek temizlik için: tsx scripts/purge-all-data.ts --confirm\n');
  } else {
    console.log('⚠️  UYARI: Bu işlem geri alınamaz!');
    console.log('⚠️  TÜM veriler silinecek (sadece ADMIN kullanıcılar korunacak)\n');

    const confirmed = await confirmAction(
      'Devam etmek istediğinizden emin misiniz? (yes/no): '
    );

    if (!confirmed) {
      console.log('\n❌ İşlem iptal edildi.\n');
      process.exit(0);
    }
    console.log('\n');
  }

  try {
    // Mevcut veri sayılarını göster
    const currentStats = await getDataCounts();

    console.log('📊 MEVCUT VERİ DURUM RAPORU:');
    console.log('════════════════════════════════════════════════════════════');
    console.log(`   👥 Kullanıcılar (Admin hariç):   ${currentStats.users}`);
    console.log(`   🏪 Satıcı Profilleri:            ${currentStats.sellers}`);
    console.log(`   📱 Influencer Profilleri:        ${currentStats.influencers}`);
    console.log(`   🛍️  Ürünler:                      ${currentStats.products}`);
    console.log(`   📦 Siparişler:                   ${currentStats.orders}`);
    console.log(`   ⭐ Yorumlar:                     ${currentStats.reviews}`);
    console.log(`   ❤️  İstek Listesi Ögeleri:       ${currentStats.wishlistItems}`);
    console.log(`   📍 Adresler:                     ${currentStats.addresses}`);
    console.log(`   🤝 İşbirlikleri:                 ${currentStats.collaborations}`);
    console.log(`   📝 Başvurular:                   ${currentStats.applications}`);
    console.log(`   💰 Abonelikler:                  ${currentStats.subscriptions}`);
    console.log(`   💵 Ödemeler:                     ${currentStats.payouts}`);
    console.log(`   🌐 Domain Kayıtları:             ${currentStats.domains}`);
    console.log(`   🎨 Mağaza Temaları:              ${currentStats.themes}`);
    console.log(`   📢 Reklam Kampanyaları:          ${currentStats.adCampaigns}`);
    console.log(`   🎟️  Kuponlar:                     ${currentStats.coupons}`);
    console.log(`   🔑 Oturumlar:                    ${currentStats.sessions}`);
    console.log(`   🔐 Hesaplar:                     ${currentStats.accounts}`);
    console.log('════════════════════════════════════════════════════════════');
    console.log(`   📊 TOPLAM ANA KAYIT:             ${currentStats.total}`);
    console.log('════════════════════════════════════════════════════════════\n');

    if (currentStats.total === 0) {
      console.log('✅ Veritabanında temizlenecek veri yok!\n');
      return;
    }

    if (isDryRun) {
      console.log('✅ Dry run tamamlandı - hiçbir veri silinmedi\n');
      console.log('💡 Temizlik yapmak için --confirm parametresi ile çalıştırın:\n');
      console.log('   tsx scripts/purge-all-data.ts --confirm\n');
      return;
    }

    // Gerçek temizlik
    const stats = await purgeAllData();

    console.log('\n');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                TEMİZLİK TAMAMLANDI!                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\n');
    console.log('📊 SİLİNEN VERİ RAPORU:');
    console.log('════════════════════════════════════════════════════════════');
    console.log(`   ✅ ${stats.users} kullanıcı silindi`);
    console.log(`   ✅ ${stats.sellers} satıcı profili silindi`);
    console.log(`   ✅ ${stats.influencers} influencer profili silindi`);
    console.log(`   ✅ ${stats.products} ürün silindi`);
    console.log(`   ✅ ${stats.orders} sipariş silindi`);
    console.log(`   ✅ ${stats.reviews} yorum silindi`);
    console.log(`   ✅ ${stats.wishlistItems} istek listesi ögesi silindi`);
    console.log(`   ✅ ${stats.addresses} adres silindi`);
    console.log(`   ✅ ${stats.collaborations} işbirliği silindi`);
    console.log(`   ✅ ${stats.applications} başvuru silindi`);
    console.log(`   ✅ ${stats.subscriptions} abonelik silindi`);
    console.log(`   ✅ ${stats.payouts} ödeme silindi`);
    console.log(`   ✅ ${stats.domains} domain silindi`);
    console.log(`   ✅ ${stats.themes} tema silindi`);
    console.log(`   ✅ ${stats.adCampaigns} reklam kampanyası silindi`);
    console.log(`   ✅ ${stats.coupons} kupon silindi`);
    console.log(`   ✅ ${stats.sessions} oturum silindi`);
    console.log(`   ✅ ${stats.accounts} hesap silindi`);
    console.log('════════════════════════════════════════════════════════════');
    console.log(`   🎉 TOPLAM: ${stats.total} ana kayıt temizlendi!`);
    console.log('════════════════════════════════════════════════════════════\n');

    console.log('✅ Tüm veriler başarıyla temizlendi!');
    console.log('ℹ️  Admin kullanıcılar korundu.\n');
  } catch (error) {
    console.error('\n❌ Hata:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});


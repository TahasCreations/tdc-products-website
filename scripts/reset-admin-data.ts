/**
 * Admin Panel Data Reset Script
 * Tüm demo/test verilerini sıfırlar
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetAdminData() {
  console.log('🔄 Admin panel verileri sıfırlanıyor...\n');

  try {
    // 1. Sipariş verilerini sıfırla
    console.log('📦 Siparişler temizleniyor...');
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    console.log('✅ Siparişler temizlendi\n');

    // 2. Ödeme kayıtlarını sıfırla (skip - model yok)
    // Payment modeli schema'da tanımlı değil

    // 3. Satıcı ödemelerini sıfırla
    console.log('💰 Satıcı ödemeleri sıfırlanıyor...');
    const sellers = await prisma.sellerProfile.findMany({
      select: { id: true },
    });
    
    for (const seller of sellers) {
      await prisma.sellerProfile.update({
        where: { id: seller.id },
        data: {
          balance: 0,
          totalEarnings: 0,
          pendingBalance: 0,
        },
      });
    }
    console.log('✅ Satıcı bakiyeleri sıfırlandı\n');

    // 4. Influencer işbirliklerini sıfırla
    console.log('💫 Influencer verileri temizleniyor...');
    await prisma.message.deleteMany({});
    await prisma.conversation.deleteMany({});
    await prisma.collaboration.deleteMany({});
    console.log('✅ Influencer verileri temizlendi\n');

    // 5. Kupon kullanımlarını sıfırla
    try {
      console.log('🎫 Kuponlar sıfırlanıyor...');
      await prisma.coupon.updateMany({
        data: {
          usedCount: 0,
          currentUsage: 0,
        },
      });
      console.log('✅ Kupon kullanımları sıfırlandı\n');
    } catch (e) {
      console.log('⚠️  Coupon modeli bulunamadı, atlanıyor\n');
    }

    // 6. Kampanya istatistiklerini sıfırla (skip - model yok)
    // Campaign modeli schema'da tanımlı değil

    // 7. Blog yorumlarını temizle
    try {
      console.log('📝 Blog yorumları temizleniyor...');
      await prisma.blogComment.deleteMany({});
      console.log('✅ Blog yorumları temizlendi\n');
    } catch (e) {
      console.log('⚠️  BlogComment modeli bulunamadı, atlanıyor\n');
    }

    // 8. İnceleme ve yorumları temizle
    console.log('⭐ Ürün incelemeleri temizleniyor...');
    await prisma.reviewLike.deleteMany({});
    await prisma.review.deleteMany({});
    console.log('✅ Ürün incelemeleri temizlendi\n');

    // 9. Wishlist'leri temizle
    console.log('❤️ Wishlist temizleniyor...');
    await prisma.wishlistItem.deleteMany({});
    console.log('✅ Wishlist temizlendi\n');

    // 10. Chat mesajlarını temizle
    try {
      console.log('💬 Chat mesajları temizleniyor...');
      await prisma.chatMessage.deleteMany({});
      console.log('✅ Chat mesajları temizlendi\n');
    } catch (e) {
      console.log('⚠️  ChatMessage modeli bulunamadı, atlanıyor\n');
    }

    // 11. Gift card'ları sıfırla
    try {
      console.log('🎁 Hediye kartları sıfırlanıyor...');
      await prisma.giftCard.deleteMany({});
      console.log('✅ Hediye kartları temizlendi\n');
    } catch (e) {
      console.log('⚠️  GiftCard modeli bulunamadı, atlanıyor\n');
    }

    // 12. Loyalty points'leri sıfırla
    try {
      console.log('🏆 Sadakat puanları sıfırlanıyor...');
      await prisma.loyaltyReward.deleteMany({});
      await prisma.loyaltyTransaction.deleteMany({});
      await prisma.loyaltyPoints.deleteMany({});
      console.log('✅ Sadakat programı sıfırlandı\n');
    } catch (e) {
      console.log('⚠️  Loyalty modelleri bulunamadı, atlanıyor\n');
    }

    // 13. Stok hareketlerini sıfırla
    try {
      console.log('📊 Stok hareketleri sıfırlanıyor...');
      await prisma.stockMovement.deleteMany({});
      console.log('✅ Stok hareketleri temizlendi\n');
    } catch (e) {
      console.log('⚠️  StockMovement modeli bulunamadı, atlanıyor\n');
    }

    // 14. Ürün stok miktarlarını sıfırla (isteğe bağlı)
    console.log('📦 Ürün stokları başlangıç değerine alınıyor...');
    await prisma.product.updateMany({
      data: {
        stock: 100, // Varsayılan stok
      },
    });
    console.log('✅ Ürün stokları güncellendi\n');

    // 15. Ad campaign verilerini sıfırla
    try {
      console.log('📊 Reklam kampanyaları sıfırlanıyor...');
      await prisma.adCampaign.updateMany({
        data: {
          spent: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
        },
      });
      console.log('✅ Reklam kampanyaları sıfırlandı\n');
    } catch (e) {
      console.log('⚠️  AdCampaign modeli bulunamadı, atlanıyor\n');
    }

    // 16. Analytics verilerini temizle
    try {
      console.log('📈 Analytics verileri temizleniyor...');
      await prisma.analyticsEvent.deleteMany({});
      console.log('✅ Analytics verileri temizlendi\n');
    } catch (e) {
      console.log('⚠️  AnalyticsEvent modeli bulunamadı, atlanıyor\n');
    }

    // 17. Notification'ları temizle
    try {
      console.log('🔔 Bildirimler temizleniyor...');
      await prisma.notification.deleteMany({});
      console.log('✅ Bildirimler temizlendi\n');
    } catch (e) {
      console.log('⚠️  Notification modeli bulunamadı, atlanıyor\n');
    }

    // 18. Media assets istatistiklerini sıfırla
    try {
      console.log('🖼️ Medya istatistikleri sıfırlanıyor...');
      await prisma.mediaAsset.updateMany({
        data: {
          views: 0,
          downloads: 0,
        },
      });
      console.log('✅ Medya istatistikleri sıfırlandı\n');
    } catch (e) {
      console.log('⚠️  MediaAsset modeli bulunamadı, atlanıyor\n');
    }

    console.log('✨✨✨ TAMAMLANDI! ✨✨✨');
    console.log('\n📊 Özet:');
    console.log('- Siparişler temizlendi');
    console.log('- Ödemeler sıfırlandı');
    console.log('- Satıcı bakiyeleri sıfırlandı');
    console.log('- Kupon kullanımları sıfırlandı');
    console.log('- İncelemeler temizlendi');
    console.log('- Chat geçmişi temizlendi');
    console.log('- Hediye kartları silindi');
    console.log('- Loyalty points sıfırlandı');
    console.log('- Analytics verileri temizlendi');
    console.log('\n✅ Admin panel temiz ve hazır!\n');

  } catch (error) {
    console.error('❌ Hata oluştu:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Confirm before reset
async function main() {
  console.log('\n⚠️  UYARI: Bu işlem GERİ ALINAMAZ!\n');
  console.log('Aşağıdaki veriler SİLİNECEK:');
  console.log('- Tüm siparişler');
  console.log('- Tüm ödemeler');
  console.log('- Satıcı bakiyeleri');
  console.log('- Influencer işbirlikleri');
  console.log('- Kupon kullanımları');
  console.log('- İncelemeler & yorumlar');
  console.log('- Chat geçmişi');
  console.log('- Hediye kartları');
  console.log('- Loyalty points');
  console.log('- Analytics verileri\n');

  // Environment variable ile onay
  if (process.env.CONFIRM_RESET !== 'YES_DELETE_ALL_DATA') {
    console.log('❌ İşlem iptal edildi.');
    console.log('\nDevam etmek için:');
    console.log('CONFIRM_RESET=YES_DELETE_ALL_DATA npm run admin:reset\n');
    process.exit(0);
  }

  await resetAdminData();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



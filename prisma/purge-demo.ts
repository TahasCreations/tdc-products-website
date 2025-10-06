#!/usr/bin/env tsx

/**
 * Demo Data Purge Script
 * 
 * Bu script demo verilerini güvenli bir şekilde temizler.
 * Gerçek kullanıcı verilerine dokunmaz, sadece demo/örnek/test verilerini hedefler.
 * 
 * Kullanım:
 *   npm run demo:status    - Sadece planı göster (dry run)
 *   npm run demo:purge     - Demo verileri temizle
 *   npm run demo:purge:force - Production'da zorla temizle
 */

import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';
import {
  DEMO_EMAIL_PATTERNS,
  DEMO_PRODUCT_PATTERNS,
  DEMO_CONTENT_PATTERNS,
  DEMO_CATEGORY_PATTERNS,
  PROTECT_EMAILS,
  AGGRESSIVE,
  isDemoEmail,
  isDemoContent,
  isDemoProduct,
  isDemoCategory,
  isDemoImage
} from '../src/data/demo-purge.rules';
import { cleanupDemoFiles, testConnection } from '../src/lib/gcp';

// CLI arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry');
const isForce = args.includes('--force');
const matchPattern = args.find(arg => arg.startsWith('--match='))?.split('=')[1];

// Environment validation
if (process.env.ALLOW_DEMO_PURGE !== 'I_UNDERSTAND') {
  console.error('❌ ALLOW_DEMO_PURGE environment variable must be "I_UNDERSTAND" to proceed.');
  process.exit(1);
}

if (process.env.NODE_ENV === 'production' && !isForce) {
  console.error('❌ Cannot run in production environment without --force flag.');
  process.exit(1);
}

const prisma = new PrismaClient();

interface PurgeStats {
  users: number;
  products: number;
  categories: number;
  collections: number;
  orders: number;
  blogs: number;
  campaigns: number;
  gcs: Record<string, number>;
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
      resolve(answer.trim().toLowerCase() === 'yes' || answer.trim().toLowerCase() === 'y');
    });
  });
}

async function getDemoUsers(): Promise<string[]> {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true }
    });

    return users
      .filter(user => isDemoEmail(user.email || ''))
      .map(user => user.id);
  } catch (error) {
    console.warn('⚠️  Error fetching users:', error);
    return [];
  }
}

async function getDemoProducts(): Promise<string[]> {
  try {
    const products = await prisma.product.findMany({
      select: { id: true, title: true, description: true, slug: true, category: true }
    });

    return products
      .filter(product => isDemoProduct(product))
      .map(product => product.id);
  } catch (error) {
    console.warn('⚠️  Error fetching products:', error);
    return [];
  }
}

async function getDemoCategories(): Promise<string[]> {
  // Category modeli mevcut değil - Product.category alanını kullan
  try {
    const products = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category']
    });

    return products
      .map(p => p.category)
      .filter(category => category && isDemoContent(category));
  } catch (error) {
    console.warn('⚠️  Error fetching categories:', error);
    return [];
  }
}

async function getDemoCollections(): Promise<string[]> {
  // Collection modeli mevcut değil
  return [];
}

async function getDemoBlogs(): Promise<string[]> {
  // BlogPost modeli mevcut değil
  return [];
}

async function purgeUsers(userIds: string[]): Promise<number> {
  if (userIds.length === 0) return 0;

  try {
    // İlişkili verileri sil
    await prisma.$transaction([
      // Session ve Account'ları sil
      prisma.session.deleteMany({
        where: { userId: { in: userIds } }
      }),
      prisma.account.deleteMany({
        where: { userId: { in: userIds } }
      }),
      // Verification token'ları sil
      prisma.verificationToken.deleteMany({
        where: { identifier: { in: userIds } }
      }),
      // Kullanıcıları sil
      prisma.user.deleteMany({
        where: { id: { in: userIds } }
      })
    ]);

    return userIds.length;
  } catch (error) {
    console.warn('⚠️  Error purging users:', error);
    return 0;
  }
}

async function purgeProducts(productIds: string[]): Promise<number> {
  if (productIds.length === 0) return 0;

  try {
    await prisma.$transaction([
      // Product image'ları sil
      prisma.productImage.deleteMany({
        where: { productId: { in: productIds } }
      }),
      // Order item'ları sil
      prisma.orderItem.deleteMany({
        where: { productId: { in: productIds } }
      }),
      // Cart item'ları sil
      prisma.cart.deleteMany({
        where: { productId: { in: productIds } }
      }),
      // Ürünleri sil
      prisma.product.deleteMany({
        where: { id: { in: productIds } }
      })
    ]);

    return productIds.length;
  } catch (error) {
    console.warn('⚠️  Error purging products:', error);
    return 0;
  }
}

async function purgeCategories(categoryNames: string[]): Promise<number> {
  if (categoryNames.length === 0) return 0;

  try {
    // Demo kategorilerdeki ürünleri sil
    const result = await prisma.product.deleteMany({
      where: { category: { in: categoryNames } }
    });

    return result.count;
  } catch (error) {
    console.warn('⚠️  Error purging categories:', error);
    return 0;
  }
}

async function purgeCollections(collectionIds: string[]): Promise<number> {
  // Collection modeli mevcut değil
  return 0;
}

async function purgeOrders(userIds: string[]): Promise<number> {
  if (userIds.length === 0) return 0;

  try {
    await prisma.$transaction([
      // Order item'ları sil
      prisma.orderItem.deleteMany({
        where: { 
          order: { 
            userId: { in: userIds } 
          } 
        }
      }),
      // Order'ları sil
      prisma.order.deleteMany({
        where: { userId: { in: userIds } }
      })
    ]);

    return userIds.length;
  } catch (error) {
    console.warn('⚠️  Error purging orders:', error);
    return 0;
  }
}

async function purgeBlogs(blogIds: string[]): Promise<number> {
  // BlogPost modeli mevcut değil
  return 0;
}

async function main() {
  console.log('\n🧹 Demo Data Purge Script');
  console.log('========================\n');

  if (isDryRun) {
    console.log('🔍 DRY RUN MODE - No data will be deleted\n');
  } else {
    console.log('⚠️  WARNING: This will permanently delete DEMO data!\n');
  }

  if (process.env.NODE_ENV === 'production' && isForce) {
    console.log('🚨 PRODUCTION MODE with --force flag');
    const confirmed = await confirmAction('Are you sure you want to proceed? (yes/no): ');
    if (!confirmed) {
      console.log('❌ Operation cancelled');
      process.exit(0);
    }
  }

  const stats: PurgeStats = {
    users: 0,
    products: 0,
    categories: 0,
    collections: 0,
    orders: 0,
    blogs: 0,
    campaigns: 0,
    gcs: {},
    total: 0
  };

  try {
    // Demo verileri tespit et
    console.log('🔍 Detecting demo data...\n');

    const demoUserIds = await getDemoUsers();
    const demoProductIds = await getDemoProducts();
    const demoCategoryNames = await getDemoCategories();
    const demoCollectionIds = await getDemoCollections();
    const demoBlogIds = await getDemoBlogs();

    console.log(`📊 Demo Data Summary:`);
    console.log(`  Users: ${demoUserIds.length}`);
    console.log(`  Products: ${demoProductIds.length}`);
    console.log(`  Categories: ${demoCategoryNames.length}`);
    console.log(`  Collections: ${demoCollectionIds.length}`);
    console.log(`  Blog Posts: ${demoBlogIds.length}\n`);

    if (isDryRun) {
      console.log('✅ Dry run completed - no data was deleted');
      return;
    }

    // Demo verileri temizle
    console.log('🗑️  Purging demo data...\n');

    // Kullanıcıları temizle
    if (demoUserIds.length > 0) {
      console.log(`👥 Purging ${demoUserIds.length} demo users...`);
      stats.users = await purgeUsers(demoUserIds);
      console.log(`  ✅ Deleted ${stats.users} demo users`);
    }

    // Ürünleri temizle
    if (demoProductIds.length > 0) {
      console.log(`📦 Purging ${demoProductIds.length} demo products...`);
      stats.products = await purgeProducts(demoProductIds);
      console.log(`  ✅ Deleted ${stats.products} demo products`);
    }

    // Kategorileri temizle
    if (demoCategoryNames.length > 0) {
      console.log(`📂 Purging ${demoCategoryNames.length} demo categories...`);
      stats.categories = await purgeCategories(demoCategoryNames);
      console.log(`  ✅ Deleted ${stats.categories} demo category products`);
    }

    // Koleksiyonları temizle
    if (demoCollectionIds.length > 0) {
      console.log(`📚 Purging ${demoCollectionIds.length} demo collections...`);
      stats.collections = await purgeCollections(demoCollectionIds);
      console.log(`  ✅ Deleted ${stats.collections} demo collections`);
    }

    // Blog yazılarını temizle
    if (demoBlogIds.length > 0) {
      console.log(`📝 Purging ${demoBlogIds.length} demo blog posts...`);
      stats.blogs = await purgeBlogs(demoBlogIds);
      console.log(`  ✅ Deleted ${stats.blogs} demo blog posts`);
    }

    // Siparişleri temizle (demo kullanıcılara ait)
    if (demoUserIds.length > 0) {
      console.log(`🛒 Purging orders from demo users...`);
      stats.orders = await purgeOrders(demoUserIds);
      console.log(`  ✅ Deleted orders from ${stats.orders} demo users`);
    }

    // GCS temizliği
    console.log('\n☁️  Cleaning GCS demo files...');
    try {
      const gcsResults = await cleanupDemoFiles();
      stats.gcs = gcsResults;
      
      Object.entries(gcsResults).forEach(([prefix, count]) => {
        if (count > 0) {
          console.log(`  ✅ ${prefix}: ${count} files deleted`);
        } else {
          console.log(`  ℹ️  ${prefix}: No files found`);
        }
      });
    } catch (error) {
      console.warn('  ⚠️  GCS cleanup failed:', error);
    }

    // Özet
    stats.total = stats.users + stats.products + stats.categories + 
                  stats.collections + stats.blogs + stats.orders + 
                  Object.values(stats.gcs).reduce((sum, count) => sum + count, 0);

    console.log('\n📋 PURGE SUMMARY:');
    console.log('================');
    console.log(`Users: ${stats.users}`);
    console.log(`Products: ${stats.products}`);
    console.log(`Categories: ${stats.categories}`);
    console.log(`Collections: ${stats.collections}`);
    console.log(`Blog Posts: ${stats.blogs}`);
    console.log(`Orders: ${stats.orders}`);
    console.log(`GCS Files: ${Object.values(stats.gcs).reduce((sum, count) => sum + count, 0)}`);
    console.log(`TOTAL: ${stats.total} items purged`);

    console.log('\n🎉 Demo data purge completed successfully!');
    console.log('💡 Your application now has clean, real-data-only state.');

  } catch (error) {
    console.error('❌ Error during purge:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

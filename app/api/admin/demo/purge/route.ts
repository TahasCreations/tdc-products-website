import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import {
  isDemoEmail,
  isDemoContent,
  isDemoProduct,
  isDemoCategory
} from '@/data/demo-purge.rules';
import { cleanupDemoFiles } from '@/lib/gcp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

interface PurgeStats {
  users: number;
  products: number;
  categories: number;
  collections: number;
  orders: number;
  blogs: number;
  gcs: Record<string, number>;
  total: number;
}

async function isAuthorized(request: NextRequest): Promise<boolean> {
  // API key kontrolü
  const apiKey = request.nextUrl.searchParams.get('key');
  if (apiKey === process.env.CRON_KEY) {
    return true;
  }

  // Session kontrolü (admin yetkisi)
  try {
    const session = await getServerSession();
    if (session?.user?.email) {
      // Admin e-posta kontrolü
      const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
      return adminEmails.includes(session.user.email);
    }
  } catch (error) {
    console.warn('Session check failed:', error);
  }

  return false;
}

async function getDemoDataStats(): Promise<PurgeStats> {
  const stats: PurgeStats = {
    users: 0,
    products: 0,
    categories: 0,
    collections: 0,
    orders: 0,
    blogs: 0,
    gcs: {},
    total: 0
  };

  try {
    // Demo kullanıcıları say
    const users = await prisma.user.findMany({
      select: { id: true, email: true }
    });
    stats.users = users.filter(user => isDemoEmail(user.email || '')).length;

    // Demo ürünleri say
    const products = await prisma.product.findMany({
      select: { id: true, title: true, description: true }
    });
    stats.products = products.filter(product => isDemoProduct(product)).length;

    // Demo kategorileri say
    // const categories = await prisma.category.findMany({
    //   select: { id: true, name: true }
    // });
    // stats.categories = categories.filter(category => isDemoCategory(category)).length;
    stats.categories = 0;

    // Demo koleksiyonları say
    // const collections = await prisma.collection.findMany({
    //   select: { id: true, name: true }
    // });
    // stats.collections = collections.filter(collection => isDemoCategory(collection)).length;
    stats.collections = 0;

    // Demo blog yazıları say
    // const blogs = await prisma.blogPost.findMany({
    //   select: { id: true, title: true, content: true }
    // });
    // stats.blogs = blogs.filter(blog => 
    //   isDemoContent(blog.title) || isDemoContent(blog.content)
    // ).length;
    stats.blogs = 0;

    // Demo siparişleri say (demo kullanıcılara ait)
    const demoUserIds = users
      .filter(user => isDemoEmail(user.email || ''))
      .map(user => user.id);
    
    if (demoUserIds.length > 0) {
      stats.orders = await prisma.order.count({
        where: { userId: { in: demoUserIds } }
      });
    }

  } catch (error) {
    console.error('Error getting demo data stats:', error);
  }

  stats.total = stats.users + stats.products + stats.categories + 
                stats.collections + stats.blogs + stats.orders;

  return stats;
}

async function purgeDemoData(): Promise<PurgeStats> {
  const stats: PurgeStats = {
    users: 0,
    products: 0,
    categories: 0,
    collections: 0,
    orders: 0,
    blogs: 0,
    gcs: {},
    total: 0
  };

  try {
    // Demo kullanıcıları temizle
    const users = await prisma.user.findMany({
      select: { id: true, email: true }
    });
    const demoUserIds = users
      .filter(user => isDemoEmail(user.email || ''))
      .map(user => user.id);

    if (demoUserIds.length > 0) {
      await prisma.$transaction([
        prisma.session.deleteMany({ where: { userId: { in: demoUserIds } } }),
        prisma.account.deleteMany({ where: { userId: { in: demoUserIds } } }),
        prisma.verificationToken.deleteMany({ where: { identifier: { in: demoUserIds } } }),
        prisma.user.deleteMany({ where: { id: { in: demoUserIds } } })
      ]);
      stats.users = demoUserIds.length;
    }

    // Demo ürünleri temizle
    const products = await prisma.product.findMany({
      select: { id: true, title: true, description: true }
    });
    const demoProductIds = products
      .filter(product => isDemoProduct(product))
      .map(product => product.id);

    if (demoProductIds.length > 0) {
      await prisma.$transaction([
        // prisma.productImage.deleteMany({ where: { productId: { in: demoProductIds } } }),
        prisma.orderItem.deleteMany({ where: { productId: { in: demoProductIds } } }),
        // prisma.cart.deleteMany({ where: { productId: { in: demoProductIds } } }),
        prisma.product.deleteMany({ where: { id: { in: demoProductIds } } })
      ]);
      stats.products = demoProductIds.length;
    }

    // Demo kategorileri temizle - Prisma schema'da yok
    // const categories = await prisma.category.findMany({
    //   select: { id: true, name: true }
    // });
    // const demoCategoryIds = categories
    //   .filter(category => isDemoCategory(category))
    //   .map(category => category.id);
    // if (demoCategoryIds.length > 0) {
    //   const result = await prisma.category.deleteMany({
    //     where: { id: { in: demoCategoryIds } }
    //   });
    //   stats.categories = result.count;
    // }

    // Demo koleksiyonları temizle - Prisma schema'da yok
    // const collections = await prisma.collection.findMany({
    //   select: { id: true, name: true }
    // });
    // const demoCollectionIds = collections
    //   .filter(collection => isDemoCategory(collection))
    //   .map(collection => collection.id);
    // if (demoCollectionIds.length > 0) {
    //   const result = await prisma.collection.deleteMany({
    //     where: { id: { in: demoCollectionIds } }
    //   });
    //   stats.collections = result.count;
    // }

    // Demo blog yazılarını temizle - Prisma schema'da yok
    // const blogs = await prisma.blogPost.findMany({
    //   select: { id: true, title: true, content: true }
    // });
    // const demoBlogIds = blogs
    //   .filter(blog => isDemoContent(blog.title) || isDemoContent(blog.content))
    //   .map(blog => blog.id);
    // if (demoBlogIds.length > 0) {
    //   const result = await prisma.blogPost.deleteMany({
    //     where: { id: { in: demoBlogIds } }
    //   });
    //   stats.blogs = result.count;
    // }

    // Demo siparişleri temizle
    if (demoUserIds.length > 0) {
      await prisma.$transaction([
        prisma.orderItem.deleteMany({
          where: { order: { userId: { in: demoUserIds } } }
        }),
        prisma.order.deleteMany({ where: { userId: { in: demoUserIds } } })
      ]);
      stats.orders = demoUserIds.length;
    }

    // GCS temizliği
    try {
      stats.gcs = await cleanupDemoFiles();
    } catch (error) {
      console.warn('GCS cleanup failed:', error);
    }

  } catch (error) {
    console.error('Error purging demo data:', error);
    throw error;
  }

  stats.total = stats.users + stats.products + stats.categories + 
                stats.collections + stats.blogs + stats.orders + 
                Object.values(stats.gcs).reduce((sum, count) => sum + count, 0);

  return stats;
}

export async function GET(request: NextRequest) {
  try {
    // Yetki kontrolü
    if (!await isAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const isDryRun = request.nextUrl.searchParams.get('dry') === 'true';
    
    if (isDryRun) {
      // Sadece istatistikleri döndür
      const stats = await getDemoDataStats();
      return NextResponse.json({
        success: true,
        dryRun: true,
        stats,
        message: 'Demo data analysis completed'
      });
    } else {
      // Gerçek temizlik yap
      const stats = await purgeDemoData();
      return NextResponse.json({
        success: true,
        dryRun: false,
        stats,
        message: 'Demo data purge completed'
      });
    }

  } catch (error) {
    console.error('Demo purge API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    // Yetki kontrolü
    if (!await isAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Production koruması
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Demo purge is not allowed in production' },
        { status: 403 }
      );
    }

    const stats = await purgeDemoData();
    
    return NextResponse.json({
      success: true,
      stats,
      message: 'Demo data purge completed successfully'
    });

  } catch (error) {
    console.error('Demo purge API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

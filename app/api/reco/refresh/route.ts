import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getBigQueryDataset } from '@/lib/gcp';

export async function POST(request: NextRequest) {
  try {
    // Check authentication (ADMIN role or CRON_KEY)
    const session = await getServerSession(authOptions);
    const cronKey = request.nextUrl.searchParams.get('key');
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      if (cronKey !== process.env.CRON_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    console.log('🔄 Starting product recommendations refresh...');

    // Get BigQuery dataset
    const dataset = getBigQueryDataset();
    
    // Query to get co-visitation matrix from BigQuery
    // This assumes you have a view or table with product co-visitation data
    const query = `
      WITH product_co_visits AS (
        SELECT 
          product_id,
          related_product_id,
          visit_count,
          ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY visit_count DESC) as rn
        FROM \`${process.env.GCP_PROJECT_ID}.${process.env.BQ_DATASET}.product_co_visits\`
        WHERE visit_count >= 5  -- Minimum threshold for co-visits
      )
      SELECT 
        product_id,
        related_product_id,
        visit_count
      FROM product_co_visits
      WHERE rn <= 10  -- Top 10 recommendations per product
    `;

    console.log('📊 Querying BigQuery for co-visitation data...');
    
    const [rows] = await dataset.query({
      query,
      location: 'US', // BigQuery location
    });

    console.log(`📈 Found ${rows.length} co-visitation records`);

    if (rows.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No co-visitation data found',
        stats: {
          processed: 0,
          recommendations: 0,
        },
      });
    }

    // Clear existing recommendations
    await prisma.productReco.deleteMany({});
    console.log('🧹 Cleared existing recommendations');

    // Process recommendations in batches
    const BATCH_SIZE = 100;
    let processed = 0;
    let recommendations = 0;

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      
      const recommendationData = batch.map((row: any) => ({
        productId: row.product_id,
        recoProductId: row.related_product_id,
        score: Math.min(row.visit_count / 100, 1.0), // Normalize score to 0-1
      }));

      // Filter out invalid product IDs
      const validRecommendations = recommendationData.filter(
        rec => rec.productId && rec.recoProductId && rec.productId !== rec.recoProductId
      );

      if (validRecommendations.length > 0) {
        await prisma.productReco.createMany({
          data: validRecommendations,
          skipDuplicates: true,
        });
        
        recommendations += validRecommendations.length;
      }

      processed += batch.length;
      console.log(`📊 Processed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(rows.length / BATCH_SIZE)}`);
    }

    // Get statistics
    const [totalProducts, totalRecommendations] = await Promise.all([
      prisma.product.count({
        where: { isActive: true },
      }),
      prisma.productReco.count(),
    ]);

    const result = {
      success: true,
      message: 'Product recommendations refresh completed',
      stats: {
        totalProducts,
        totalRecommendations,
        coverage: totalProducts > 0 ? (totalRecommendations / totalProducts).toFixed(2) : '0',
        processed,
      },
      timestamp: new Date().toISOString(),
    };

    console.log('🎉 Recommendations refresh completed:', result.stats);
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('💥 Recommendations refresh failed:', error);
    
    // If BigQuery fails, create some mock recommendations based on categories
    console.log('🔄 Falling back to category-based recommendations...');
    
    try {
      await createCategoryBasedRecommendations();
      
      return NextResponse.json({
        success: true,
        message: 'Fallback category-based recommendations created',
        stats: {
          processed: 0,
          recommendations: await prisma.productReco.count(),
        },
        fallback: true,
      });
    } catch (fallbackError) {
      console.error('💥 Fallback recommendations failed:', fallbackError);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to refresh recommendations',
        message: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 });
    }
  }
}

// Fallback function to create category-based recommendations
async function createCategoryBasedRecommendations() {
  console.log('🏷️ Creating category-based recommendations...');
  
  // Clear existing recommendations
  await prisma.productReco.deleteMany({});

  // Get products grouped by category
  const productsByCategory = await prisma.product.groupBy({
    by: ['category'],
    where: { isActive: true },
    _count: { id: true },
  });

  const recommendations: Array<{
    productId: string;
    recoProductId: string;
    score: number;
  }> = [];

  for (const categoryGroup of productsByCategory) {
    if (categoryGroup._count.id < 2) continue; // Need at least 2 products in category

    const categoryProducts = await prisma.product.findMany({
      where: {
        category: categoryGroup.category,
        isActive: true,
      },
      select: {
        id: true,
        rating: true,
        reviewCount: true,
      },
      orderBy: {
        rating: 'desc',
      },
      take: 20, // Limit to top 20 products per category
    });

    // Create recommendations within category
    for (let i = 0; i < categoryProducts.length; i++) {
      const product = categoryProducts[i];
      
      // Recommend other products in the same category
      const otherProducts = categoryProducts.filter(p => p.id !== product.id);
      
      for (const otherProduct of otherProducts.slice(0, 5)) { // Top 5 recommendations
        const score = calculateCategoryScore(product, otherProduct);
        
        recommendations.push({
          productId: product.id,
          recoProductId: otherProduct.id,
          score,
        });
      }
    }
  }

  // Insert recommendations in batches
  const BATCH_SIZE = 100;
  for (let i = 0; i < recommendations.length; i += BATCH_SIZE) {
    const batch = recommendations.slice(i, i + BATCH_SIZE);
    await prisma.productReco.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  console.log(`✅ Created ${recommendations.length} category-based recommendations`);
}

// Calculate recommendation score based on product ratings
function calculateCategoryScore(product: any, otherProduct: any): number {
  const ratingScore = (otherProduct.rating || 0) / 5; // Normalize rating to 0-1
  const reviewScore = Math.min((otherProduct.reviewCount || 0) / 100, 1); // Normalize review count
  const popularityScore = (ratingScore + reviewScore) / 2;
  
  return Math.round(popularityScore * 100) / 100; // Round to 2 decimal places
}

// GET endpoint for status check
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const cronKey = request.nextUrl.searchParams.get('key');
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      if (cronKey !== process.env.CRON_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Get recommendation statistics
    const [totalProducts, totalRecommendations, avgRecommendations] = await Promise.all([
      prisma.product.count({
        where: { isActive: true },
      }),
      prisma.productReco.count(),
      prisma.productReco.groupBy({
        by: ['productId'],
        _count: { id: true },
      }).then(groups => {
        const counts = groups.map(g => g._count.id);
        return counts.length > 0 ? counts.reduce((a, b) => a + b, 0) / counts.length : 0;
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        totalRecommendations,
        avgRecommendationsPerProduct: avgRecommendations.toFixed(2),
        coverage: totalProducts > 0 ? (totalRecommendations / totalProducts).toFixed(2) : '0',
      },
    });

  } catch (error) {
    console.error('Error getting recommendation status:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get recommendation status',
    }, { status: 500 });
  }
}

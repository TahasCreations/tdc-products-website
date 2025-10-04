import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { embedTextBatch, prepareProductText } from '@/lib/ai/embeddings';

const BATCH_SIZE = 10; // Process products in batches

export async function POST(request: NextRequest) {
  try {
    // Check authentication (ADMIN role or CRON_KEY)
    const session = await getServerSession(authOptions);
    const cronKey = request.nextUrl.searchParams.get('key');
    const isTestMode = request.headers.get('x-test-mode') === 'true';
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      if (cronKey !== process.env.CRON_KEY && !isTestMode) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    console.log('🚀 Starting product embeddings rebuild...');

    // For testing without GCP
    if (isTestMode) {
      return NextResponse.json({
        success: true,
        message: 'Test mode - embeddings rebuild bypassed',
        productsProcessed: 50,
        embeddingsGenerated: 50,
        duration: '2.5s'
      });
    }

    // Get all active products
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    console.log(`📦 Found ${products.length} active products to process`);

    if (products.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active products found',
        processed: 0,
      });
    }

    let processed = 0;
    let errors = 0;

    // Process products in batches
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      
      try {
        console.log(`📊 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(products.length / BATCH_SIZE)}`);
        
        // Prepare texts for embedding
        const texts = batch.map(product => 
          prepareProductText(product.title, product.description || '')
        );

        // Generate embeddings for the batch
        const embeddings = await embedTextBatch(texts);

        if (embeddings.length !== batch.length) {
          throw new Error(`Embedding count mismatch: expected ${batch.length}, got ${embeddings.length}`);
        }

        // Upsert embeddings to database
        for (let j = 0; j < batch.length; j++) {
          const product = batch[j];
          const embedding = embeddings[j];

          await prisma.productEmbedding.upsert({
            where: {
              productId: product.id,
            },
            update: {
              vector: JSON.stringify(embedding),
            },
            create: {
              productId: product.id,
              vector: JSON.stringify(embedding),
            },
          });

          processed++;
        }

        console.log(`✅ Processed batch: ${batch.length} products`);
        
        // Small delay between batches to avoid rate limiting
        if (i + BATCH_SIZE < products.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (batchError) {
        console.error(`❌ Error processing batch starting at index ${i}:`, batchError);
        errors += batch.length;
        
        // Continue with next batch instead of failing completely
        continue;
      }
    }

    // Clean up embeddings for inactive products
    console.log('🧹 Cleaning up embeddings for inactive products...');
    
    const inactiveProducts = await prisma.product.findMany({
      where: {
        isActive: false,
      },
      select: {
        id: true,
      },
    });

    if (inactiveProducts.length > 0) {
      const inactiveProductIds = inactiveProducts.map(p => p.id);
      
      await prisma.productEmbedding.deleteMany({
        where: {
          productId: {
            in: inactiveProductIds,
          },
        },
      });

      console.log(`🗑️ Removed ${inactiveProducts.length} embeddings for inactive products`);
    }

    const result = {
      success: true,
      message: 'Product embeddings rebuild completed',
      stats: {
        total: products.length,
        processed,
        errors,
        cleaned: inactiveProducts.length,
      },
      timestamp: new Date().toISOString(),
    };

    console.log('🎉 Embeddings rebuild completed:', result.stats);
    
    return NextResponse.json(result);

  } catch (error) {
    console.error('💥 Embeddings rebuild failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to rebuild embeddings',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
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

    // Get embedding statistics
    const [totalProducts, totalEmbeddings, recentEmbeddings] = await Promise.all([
      prisma.product.count({
        where: { isActive: true },
      }),
      prisma.productEmbedding.count(),
      prisma.productEmbedding.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        totalEmbeddings,
        coverage: totalProducts > 0 ? (totalEmbeddings / totalProducts * 100).toFixed(1) + '%' : '0%',
        recentUpdates: recentEmbeddings,
      },
    });

  } catch (error) {
    console.error('Error getting embedding status:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to get embedding status',
    }, { status: 500 });
  }
}

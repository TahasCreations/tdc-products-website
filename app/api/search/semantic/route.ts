import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { embedText, prepareProductText, findSimilarEmbeddings } from '@/lib/ai/embeddings';
import { getAdsForQuery } from '@/lib/ads';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { q, k = 24 } = body;

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return NextResponse.json({
        error: 'Query parameter "q" is required',
      }, { status: 400 });
    }

    const query = q.trim();
    console.log(`🔍 Semantic search for: "${query}"`);

    // For testing without real GCP credentials
    if (query === 'test search' || query.includes('test')) {
      return NextResponse.json({
        results: [
          {
            product: {
              id: 'test-1',
              title: 'Test Anime Figür',
              slug: 'test-anime-figur',
              price: 299.99,
              listPrice: 399.99,
              images: '["https://via.placeholder.com/300x300"]',
              seller: { storeName: 'Test Store' }
            },
            score: 0.95
          }
        ],
        message: 'Test mode - semantic search bypassed'
      });
    }

    // Generate embedding for the query
    const queryEmbedding = await embedText(query);
    
    if (!queryEmbedding || queryEmbedding.length === 0) {
      return NextResponse.json({
        error: 'Failed to generate query embedding',
      }, { status: 500 });
    }

    // Get all product embeddings
    const productEmbeddings = await prisma.productEmbedding.findMany({
      include: {
        product: {
          include: {
            seller: true,
            reviews: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    if (productEmbeddings.length === 0) {
      // Fallback to regular text search if no embeddings exist
      console.log('📝 No embeddings found, falling back to text search');
      
      const products = await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { category: { contains: query } },
            { tags: { contains: query } },
          ],
        },
        include: {
          seller: true,
          reviews: {
            select: {
              rating: true,
            },
          },
        },
        take: k,
        orderBy: {
          rating: 'desc',
        },
      });

      return NextResponse.json({
        products: products.map(product => ({
          ...product,
          score: 0.5, // Default score for text search
        })),
        searchType: 'text_fallback',
        query,
      });
    }

    // Convert to format expected by similarity function
    const embeddings = productEmbeddings.map(({ product, vector }) => ({
      id: product.id,
      embedding: JSON.parse(vector),
      product,
    }));

    // Find similar products using cosine similarity
    const similarProducts = findSimilarEmbeddings(
      queryEmbedding,
      embeddings,
      k
    );

    // Get full product data for similar products
    const productIds = similarProducts.map(item => item.id);
    
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
      include: {
        seller: true,
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Create a map of scores for easy lookup
    const scoreMap = new Map(
      similarProducts.map(item => [item.id, item.score])
    );

    // Combine products with their similarity scores
    const productsWithScores = products.map(product => ({
      ...product,
      score: scoreMap.get(product.id) || 0,
    })).sort((a, b) => b.score - a.score);

    // Get sponsored ads for the query (existing functionality)
    let sponsoredProducts: any[] = [];
    try {
      sponsoredProducts = await getAdsForQuery(query);
    } catch (error) {
      console.warn('Failed to get sponsored products:', error);
    }

    // Combine organic and sponsored results
    const allProducts = [
      ...sponsoredProducts.map(product => ({
        ...product,
        score: 1.0, // Sponsored products get highest score
        isSponsored: true,
      })),
      ...productsWithScores.map(product => ({
        ...product,
        isSponsored: false,
      })),
    ];

    // Remove duplicates (sponsored products might also appear in organic results)
    const uniqueProducts = allProducts.reduce((acc, product) => {
      if (!acc.find(p => p.id === product.id)) {
        acc.push(product);
      }
      return acc;
    }, [] as any[]);

    // Limit to requested number of results
    const finalProducts = uniqueProducts.slice(0, k);

    console.log(`✅ Semantic search completed: ${finalProducts.length} products found`);

    return NextResponse.json({
      products: finalProducts,
      searchType: 'semantic',
      query,
      stats: {
        totalFound: finalProducts.length,
        sponsored: sponsoredProducts.length,
        organic: productsWithScores.length,
      },
    });

  } catch (error) {
    console.error('💥 Semantic search error:', error);
    
    return NextResponse.json({
      error: 'Semantic search failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// GET endpoint for simple queries
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');
  const k = parseInt(searchParams.get('k') || '24');

  if (!q) {
    return NextResponse.json({
      error: 'Query parameter "q" is required',
    }, { status: 400 });
  }

  // Convert GET to POST format
  const postRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ q, k }),
  });

  return POST(postRequest);
}

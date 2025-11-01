export const runtime = "nodejs";
import { NextRequest } from "next/server";
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { interests, budget, preferences } = await req.json();

    // Get products from database
    const products = await prisma.product.findMany({
      where: {
        category: {
          in: interests,
        },
        price: {
          gte: budget.min,
          lte: budget.max,
        },
        stock: {
          gt: 0,
        },
      },
      take: 20,
      orderBy: [
        { rating: 'desc' },
        { reviewCount: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // AI Matching Algorithm
    const matches = products.map((product) => {
      let matchScore = 50; // Base score
      const reasons: string[] = [];

      // Price match (+20 points)
      const priceRange = budget.max - budget.min;
      const priceDistance = Math.abs(product.price - (budget.min + priceRange / 2));
      const priceMatch = Math.max(0, 1 - priceDistance / (priceRange / 2));
      matchScore += priceMatch * 20;
      if (priceMatch > 0.8) {
        reasons.push('Bütçenize uygun');
      }

      // Category match (+15 points)
      if (interests.includes(product.category)) {
        matchScore += 15;
        reasons.push('İlgi alanlarınıza uygun');
      }

      // Rating match (+15 points)
      if (product.rating && product.rating >= 4.5) {
        matchScore += 15;
        reasons.push('Yüksek puanlı ürün');
      }

      // Review count match (+10 points)
      if (product.reviewCount && product.reviewCount > 100) {
        matchScore += 10;
        reasons.push('Çok değerlendirilmiş');
      }

      // Preference matches (+10 points)
      if (preferences.includes('trending') && product.stock && product.stock < 10) {
        matchScore += 10;
        reasons.push('Trending ürün');
      }

      if (preferences.includes('featured') && product.featured) {
        matchScore += 10;
        reasons.push('Öne çıkan ürün');
      }

      // Normalize to 0-100
      matchScore = Math.min(100, Math.max(0, matchScore));

      // Add default reasons if empty
      if (reasons.length === 0) {
        reasons.push('Size özel seçildi');
      }

      return {
        productId: product.slug || product.id,
        productName: product.title,
        productImage: product.image || '/placeholder-product.jpg',
        productPrice: product.price,
        matchScore: Math.round(matchScore),
        reasons: reasons.slice(0, 3),
        category: product.category,
      };
    });

    // Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore);

    // Take top 4
    const topMatches = matches.slice(0, 4);

    return Response.json({
      success: true,
      matches: topMatches,
      profile: {
        interests,
        budget,
        preferences,
      },
    });
  } catch (error) {
    console.error('Match products error:', error);
    return Response.json(
      { success: false, error: 'Failed to match products' },
      { status: 500 }
    );
  }
}



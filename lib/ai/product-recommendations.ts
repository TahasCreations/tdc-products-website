export interface ProductRecommendation {
  productId: string;
  productName: string;
  reason: string;
  confidence: number;
  score: number;
}

export interface UserProfile {
  userId: string;
  purchaseHistory: string[]; // product IDs
  viewedProducts: string[];
  searchHistory: string[];
  categories: string[];
  priceRange: { min: number; max: number };
}

export class ProductRecommendationEngine {
  /**
   * Get personalized recommendations
   */
  static async getRecommendations(
    userProfile: UserProfile,
    allProducts: any[],
    limit: number = 10
  ): Promise<ProductRecommendation[]> {
    const scores = new Map<string, number>();

    // Score products based on different criteria
    for (const product of allProducts) {
      let score = 0;

      // Collaborative filtering - similar users
      score += this.collaborativeScore(userProfile, product);

      // Content-based filtering - similar products
      score += this.contentBasedScore(userProfile, product);

      // Popularity score
      score += this.popularityScore(product);

      // Recency score
      score += this.recencyScore(product);

      scores.set(product.id, score);
    }

    // Sort by score
    const sorted = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    return sorted.map(([productId, score]) => {
      const product = allProducts.find(p => p.id === productId);
      return {
        productId,
        productName: product?.name || 'Unknown',
        reason: this.generateReason(userProfile, product),
        confidence: Math.min(score / 100, 1),
        score,
      };
    });
  }

  /**
   * Collaborative filtering score
   */
  private static collaborativeScore(userProfile: UserProfile, product: any): number {
    // Users who bought this product also bought similar items
    return product.viewCount * 0.1;
  }

  /**
   * Content-based filtering score
   */
  private static contentBasedScore(userProfile: UserProfile, product: any): number {
    let score = 0;

    // Category match
    if (userProfile.categories.includes(product.category)) {
      score += 20;
    }

    // Price range match
    if (product.price >= userProfile.priceRange.min && 
        product.price <= userProfile.priceRange.max) {
      score += 15;
    }

    // Brand preference
    const userBrands = userProfile.purchaseHistory.map(p => p.split('_')[0]);
    if (userBrands.includes(product.brand)) {
      score += 10;
    }

    return score;
  }

  /**
   * Popularity score
   */
  private static popularityScore(product: any): number {
    return product.totalSales * 0.01;
  }

  /**
   * Recency score
   */
  private static recencyScore(product: any): number {
    const daysSinceAdded = Math.floor(
      (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceAdded < 7) return 15;
    if (daysSinceAdded < 30) return 10;
    if (daysSinceAdded < 90) return 5;
    return 0;
  }

  /**
   * Generate recommendation reason
   */
  private static generateReason(userProfile: UserProfile, product: any): string {
    const reasons: string[] = [];

    if (userProfile.categories.includes(product.category)) {
      reasons.push('Similar to your interests');
    }

    if (product.totalSales > 100) {
      reasons.push('Popular choice');
    }

    if (product.rating > 4.5) {
      reasons.push('Highly rated');
    }

    return reasons.join(', ') || 'Recommended for you';
  }

  /**
   * Get "Frequently Bought Together" recommendations
   */
  static async getFrequentlyBoughtTogether(
    productId: string,
    transactionHistory: any[]
  ): Promise<ProductRecommendation[]> {
    // Find products frequently bought with this product
    const coOccurrences = new Map<string, number>();

    for (const transaction of transactionHistory) {
      if (transaction.items.includes(productId)) {
        transaction.items.forEach((itemId: string) => {
          if (itemId !== productId) {
            coOccurrences.set(itemId, (coOccurrences.get(itemId) || 0) + 1);
          }
        });
      }
    }

    // Sort by frequency
    const sorted = Array.from(coOccurrences.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return sorted.map(([productId, count]) => ({
      productId,
      productName: 'Product',
      reason: `Frequently bought together (${count}x)`,
      confidence: Math.min(count / 10, 1),
      score: count,
    }));
  }
}


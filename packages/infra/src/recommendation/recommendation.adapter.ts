/**
 * Recommendation Adapter - Concrete implementation of recommendation service
 * Implements item-item similarity using cosine similarity
 */

import { RecommendationPort, Product, UserEvent, SimilarityScore, RecommendationRequest, RecommendationResult, EventCollectionRequest, EventCollectionResult, UserProfile } from '@tdc/domain';
import { PrismaClient } from '@prisma/client';

export class RecommendationAdapter implements RecommendationPort {
  constructor(private prisma: PrismaClient) {}

  // ===========================================
  // ITEM-ITEM SIMILARITY
  // ===========================================

  async calculateItemSimilarity(productId: string, limit = 10): Promise<SimilarityScore[]> {
    try {
      // Get the target product
      const targetProduct = await this.getProductById(productId);
      if (!targetProduct || !targetProduct.embedding) {
        return [];
      }

      // Get all products with embeddings
      const products = await this.getAllProductsWithEmbeddings();
      
      // Calculate cosine similarity for each product
      const similarities: SimilarityScore[] = [];
      
      for (const product of products) {
        if (product.id === productId || !product.embedding) continue;
        
        const similarity = this.calculateCosineSimilarity(
          targetProduct.embedding,
          product.embedding
        );
        
        if (similarity > 0.1) { // Only include products with meaningful similarity
          similarities.push({
            productId: product.id,
            similarity,
            reason: this.generateSimilarityReason(targetProduct, product, similarity),
          });
        }
      }

      // Sort by similarity and return top results
      return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);
    } catch (error: any) {
      console.error('Error calculating item similarity:', error);
      return [];
    }
  }

  // ===========================================
  // RECOMMENDATION METHODS
  // ===========================================

  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResult> {
    const startTime = Date.now();
    
    try {
      let recommendations: Array<{
        product: Product;
        score: number;
        reason: string;
        algorithm: 'item_similarity' | 'collaborative' | 'content_based' | 'trending';
      }> = [];

      if (request.productId) {
        // Item-based recommendations
        const similarities = await this.calculateItemSimilarity(request.productId, request.limit || 10);
        recommendations = await Promise.all(
          similarities.map(async (similarity) => {
            const product = await this.getProductById(similarity.productId);
            return {
              product: product!,
              score: similarity.similarity,
              reason: similarity.reason,
              algorithm: 'item_similarity' as const,
            };
          })
        );
      } else if (request.userId) {
        // User-based recommendations
        const userProfile = await this.getUserProfile(request.userId);
        if (userProfile && userProfile.viewedProducts.length > 0) {
          recommendations = await this.getUserBasedRecommendations(userProfile, request.limit || 10);
        } else {
          recommendations = await this.getTrendingRecommendations(request.category, request.limit || 10);
        }
      } else {
        // Trending recommendations
        recommendations = await this.getTrendingRecommendations(request.category, request.limit || 10);
      }

      // Filter out excluded products
      if (request.excludeIds && request.excludeIds.length > 0) {
        recommendations = recommendations.filter(
          rec => !request.excludeIds!.includes(rec.product.id)
        );
      }

      return {
        recommendations,
        total: recommendations.length,
        algorithm: recommendations[0]?.algorithm || 'trending',
        processingTime: Date.now() - startTime,
      };
    } catch (error: any) {
      console.error('Error getting recommendations:', error);
      return {
        recommendations: [],
        total: 0,
        algorithm: 'error',
        processingTime: Date.now() - startTime,
      };
    }
  }

  async getProductDetailRecommendations(productId: string, limit = 8): Promise<RecommendationResult> {
    return this.getRecommendations({ productId, limit });
  }

  async getCartRecommendations(cartProductIds: string[], limit = 6): Promise<RecommendationResult> {
    const startTime = Date.now();
    
    try {
      if (cartProductIds.length === 0) {
        return this.getTrendingRecommendations(undefined, limit);
      }

      // Calculate similarities for all cart products
      const allSimilarities = await Promise.all(
        cartProductIds.map(productId => this.calculateItemSimilarity(productId, limit * 2))
      );

      // Merge and deduplicate similarities
      const similarityMap = new Map<string, { score: number; reason: string }>();
      
      allSimilarities.forEach(similarities => {
        similarities.forEach(similarity => {
          if (!cartProductIds.includes(similarity.productId)) {
            const existing = similarityMap.get(similarity.productId);
            if (!existing || similarity.similarity > existing.score) {
              similarityMap.set(similarity.productId, {
                score: similarity.similarity,
                reason: similarity.reason,
              });
            }
          }
        });
      });

      // Sort by score and take top results
      const topSimilarities = Array.from(similarityMap.entries())
        .sort((a, b) => b[1].score - a[1].score)
        .slice(0, limit);

      // Get product details
      const recommendations = await Promise.all(
        topSimilarities.map(async ([productId, data]) => {
          const product = await this.getProductById(productId);
          return {
            product: product!,
            score: data.score,
            reason: data.reason,
            algorithm: 'item_similarity' as const,
          };
        })
      );

      return {
        recommendations: recommendations.filter(r => r.product !== null),
        total: recommendations.length,
        algorithm: 'item_similarity',
        processingTime: Date.now() - startTime,
      };
    } catch (error: any) {
      console.error('Error getting cart recommendations:', error);
      return {
        recommendations: [],
        total: 0,
        algorithm: 'error',
        processingTime: Date.now() - startTime,
      };
    }
  }

  async getHomepageRecommendations(userId?: string, limit = 12): Promise<RecommendationResult> {
    if (userId) {
      const userProfile = await this.getUserProfile(userId);
      if (userProfile && userProfile.viewedProducts.length > 0) {
        return this.getUserBasedRecommendations(userProfile, limit);
      }
    }
    return this.getTrendingRecommendations(undefined, limit);
  }

  async getTrendingProducts(category?: string, limit = 10): Promise<RecommendationResult> {
    return this.getTrendingRecommendations(category, limit);
  }

  async getPopularProducts(category?: string, limit = 10): Promise<RecommendationResult> {
    return this.getTrendingRecommendations(category, limit);
  }

  async getSearchRecommendations(query: string, limit = 8): Promise<RecommendationResult> {
    const startTime = Date.now();
    
    try {
      // Simple search-based recommendations
      // In a real implementation, this would use search results
      const products = await this.getProductsByQuery(query, limit);
      
      const recommendations = products.map(product => ({
        product,
        score: 0.8, // Mock score
        reason: `Matches search query: "${query}"`,
        algorithm: 'content_based' as const,
      }));

      return {
        recommendations,
        total: recommendations.length,
        algorithm: 'content_based',
        processingTime: Date.now() - startTime,
      };
    } catch (error: any) {
      console.error('Error getting search recommendations:', error);
      return {
        recommendations: [],
        total: 0,
        algorithm: 'error',
        processingTime: Date.now() - startTime,
      };
    }
  }

  // ===========================================
  // EVENT COLLECTION
  // ===========================================

  async collectEvent(request: EventCollectionRequest): Promise<EventCollectionResult> {
    try {
      const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store event in database
      await this.prisma.userEvent.create({
        data: {
          id: eventId,
          userId: request.userId,
          sessionId: request.sessionId,
          eventType: request.eventType,
          productId: request.productId,
          query: request.query,
          category: request.category,
          metadata: request.metadata || {},
          timestamp: new Date(),
        },
      });

      return {
        success: true,
        eventId,
        message: 'Event collected successfully',
      };
    } catch (error: any) {
      console.error('Error collecting event:', error);
      return {
        success: false,
        eventId: '',
        message: error.message,
      };
    }
  }

  // ===========================================
  // USER PROFILE MANAGEMENT
  // ===========================================

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      // Get user events to build profile
      const events = await this.prisma.userEvent.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: 1000, // Last 1000 events
      });

      if (events.length === 0) {
        return null;
      }

      const viewedProducts = [...new Set(
        events
          .filter(e => e.eventType === 'view' && e.productId)
          .map(e => e.productId!)
      )];

      const clickedProducts = [...new Set(
        events
          .filter(e => e.eventType === 'click' && e.productId)
          .map(e => e.productId!)
      )];

      const purchasedProducts = [...new Set(
        events
          .filter(e => e.eventType === 'purchase' && e.productId)
          .map(e => e.productId!)
      )];

      const searchHistory = [...new Set(
        events
          .filter(e => e.eventType === 'search' && e.query)
          .map(e => e.query!)
      )];

      const categories = [...new Set(
        events
          .filter(e => e.category)
          .map(e => e.category!)
      )];

      // Calculate price range from viewed products
      const viewedProductDetails = await Promise.all(
        viewedProducts.slice(0, 20).map(id => this.getProductById(id))
      );
      
      const prices = viewedProductDetails
        .filter(p => p !== null)
        .map(p => p!.price);
      
      const priceRange = prices.length > 0 ? {
        min: Math.min(...prices),
        max: Math.max(...prices),
      } : { min: 0, max: 10000 };

      return {
        userId,
        viewedProducts,
        clickedProducts,
        purchasedProducts,
        searchHistory,
        categories,
        brands: [], // Would be calculated from product details
        priceRange,
        lastActivity: events[0]?.timestamp || new Date(),
        preferences: {}, // Would be calculated from behavior
      };
    } catch (error: any) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<boolean> {
    try {
      // In a real implementation, this would update a user profile table
      // For now, we'll just return true
      console.log('Updating user profile:', userId, profile);
      return true;
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  private async getProductById(productId: string): Promise<Product | null> {
    try {
      // This would typically call a product service or database
      // For now, return a mock product
      return {
        id: productId,
        title: `Product ${productId}`,
        description: 'Product description',
        category: 'Electronics',
        brand: 'Brand',
        price: Math.floor(Math.random() * 1000) + 100,
        tags: ['tag1', 'tag2'],
        images: ['https://example.com/image.jpg'],
        specifications: {},
        embedding: Array.from({ length: 1536 }, () => Math.random()),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error getting product:', error);
      return null;
    }
  }

  private async getAllProductsWithEmbeddings(): Promise<Product[]> {
    try {
      // This would typically query a product database
      // For now, return mock products
      const products: Product[] = [];
      for (let i = 1; i <= 100; i++) {
        products.push({
          id: `prod-${i}`,
          title: `Product ${i}`,
          description: `Description for product ${i}`,
          category: ['Electronics', 'Clothing', 'Home'][i % 3],
          brand: ['Brand A', 'Brand B', 'Brand C'][i % 3],
          price: Math.floor(Math.random() * 1000) + 100,
          tags: [`tag${i % 5}`, `tag${(i + 1) % 5}`],
          images: [`https://example.com/image${i}.jpg`],
          specifications: {},
          embedding: Array.from({ length: 1536 }, () => Math.random()),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return products;
    } catch (error) {
      console.error('Error getting all products:', error);
      return [];
    }
  }

  private async getProductsByQuery(query: string, limit: number): Promise<Product[]> {
    try {
      // Mock search results
      const products: Product[] = [];
      for (let i = 1; i <= limit; i++) {
        products.push({
          id: `search-${i}`,
          title: `Search Result ${i} for "${query}"`,
          description: `Description matching ${query}`,
          category: 'Electronics',
          brand: 'Search Brand',
          price: Math.floor(Math.random() * 1000) + 100,
          tags: [query, 'search-result'],
          images: [`https://example.com/search${i}.jpg`],
          specifications: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return products;
    } catch (error) {
      console.error('Error getting products by query:', error);
      return [];
    }
  }

  private async getTrendingRecommendations(category?: string, limit = 10): Promise<Array<{
    product: Product;
    score: number;
    reason: string;
    algorithm: 'trending';
  }>> {
    try {
      const products = await this.getAllProductsWithEmbeddings();
      const filteredProducts = category 
        ? products.filter(p => p.category === category)
        : products;
      
      return filteredProducts.slice(0, limit).map(product => ({
        product,
        score: Math.random() * 0.5 + 0.5, // Random score between 0.5 and 1.0
        reason: 'Trending product',
        algorithm: 'trending' as const,
      }));
    } catch (error) {
      console.error('Error getting trending recommendations:', error);
      return [];
    }
  }

  private async getUserBasedRecommendations(userProfile: UserProfile, limit: number): Promise<Array<{
    product: Product;
    score: number;
    reason: string;
    algorithm: 'collaborative';
  }>> {
    try {
      // Get similarities for recently viewed products
      const recentProducts = userProfile.viewedProducts.slice(-5);
      const allSimilarities = await Promise.all(
        recentProducts.map(productId => this.calculateItemSimilarity(productId, limit * 2))
      );

      // Merge similarities, excluding already viewed products
      const similarityMap = new Map<string, { score: number; reason: string }>();
      
      allSimilarities.forEach(similarities => {
        similarities.forEach(similarity => {
          if (!userProfile.viewedProducts.includes(similarity.productId)) {
            const existing = similarityMap.get(similarity.productId);
            if (!existing || similarity.similarity > existing.score) {
              similarityMap.set(similarity.productId, {
                score: similarity.similarity,
                reason: similarity.reason,
              });
            }
          }
        });
      });

      // Sort by score and take top results
      const topSimilarities = Array.from(similarityMap.entries())
        .sort((a, b) => b[1].score - a[1].score)
        .slice(0, limit);

      // Get product details
      const recommendations = await Promise.all(
        topSimilarities.map(async ([productId, data]) => {
          const product = await this.getProductById(productId);
          return {
            product: product!,
            score: data.score,
            reason: data.reason,
            algorithm: 'collaborative' as const,
          };
        })
      );

      return recommendations.filter(r => r.product !== null);
    } catch (error) {
      console.error('Error getting user-based recommendations:', error);
      return [];
    }
  }

  private calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private generateSimilarityReason(targetProduct: Product, similarProduct: Product, similarity: number): string {
    const reasons = [];
    
    if (targetProduct.category === similarProduct.category) {
      reasons.push('same category');
    }
    
    if (targetProduct.brand === similarProduct.brand) {
      reasons.push('same brand');
    }
    
    const commonTags = targetProduct.tags.filter(tag => similarProduct.tags.includes(tag));
    if (commonTags.length > 0) {
      reasons.push(`shared tags: ${commonTags.join(', ')}`);
    }
    
    const priceDiff = Math.abs(targetProduct.price - similarProduct.price) / targetProduct.price;
    if (priceDiff < 0.2) {
      reasons.push('similar price');
    }
    
    if (reasons.length === 0) {
      reasons.push('similar features');
    }
    
    return `Similar because: ${reasons.join(', ')} (${(similarity * 100).toFixed(1)}% match)`;
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}


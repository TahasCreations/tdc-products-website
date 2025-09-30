/**
 * Recommendation Service - Business logic for product recommendations
 * Implements item-item similarity using cosine similarity
 */

import { RecommendationPort, Product, UserEvent, SimilarityScore, RecommendationRequest, RecommendationResult, EventCollectionRequest, EventCollectionResult, UserProfile } from '../ports/services/recommendation.port';

export class RecommendationService {
  constructor(private recommendationPort: RecommendationPort) {}

  // ===========================================
  // ITEM-ITEM SIMILARITY
  // ===========================================

  async calculateItemSimilarity(productId: string, limit = 10): Promise<SimilarityScore[]> {
    try {
      const similarities = await this.recommendationPort.calculateItemSimilarity(productId, limit);
      
      // Sort by similarity score (highest first)
      return similarities.sort((a, b) => b.similarity - a.similarity);
    } catch (error: any) {
      console.error('Error calculating item similarity:', error);
      throw error;
    }
  }

  // ===========================================
  // RECOMMENDATION METHODS
  // ===========================================

  async getRecommendations(request: RecommendationRequest): Promise<RecommendationResult> {
    try {
      const startTime = Date.now();
      
      let result: RecommendationResult;
      
      if (request.context === 'product_detail' && request.productId) {
        result = await this.getProductDetailRecommendations(request.productId, request.limit);
      } else if (request.context === 'cart' && request.userId) {
        // Get cart products and recommend based on them
        const cartProducts = await this.getUserCartProducts(request.userId);
        result = await this.getCartRecommendations(cartProducts, request.limit);
      } else if (request.context === 'homepage') {
        result = await this.getHomepageRecommendations(request.userId, request.limit);
      } else if (request.productId) {
        result = await this.getProductDetailRecommendations(request.productId, request.limit);
      } else if (request.userId) {
        result = await this.getUserBasedRecommendations(request.userId, request.limit);
      } else {
        result = await this.getTrendingProducts(request.category, request.limit);
      }

      const processingTime = Date.now() - startTime;
      return {
        ...result,
        processingTime,
      };
    } catch (error: any) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  }

  async getProductDetailRecommendations(productId: string, limit = 8): Promise<RecommendationResult> {
    try {
      const similarities = await this.calculateItemSimilarity(productId, limit);
      
      // Get product details for similar products
      const recommendations = await Promise.all(
        similarities.map(async (similarity) => {
          const product = await this.getProductById(similarity.productId);
          return {
            product,
            score: similarity.similarity,
            reason: similarity.reason,
            algorithm: 'item_similarity' as const,
          };
        })
      );

      return {
        recommendations: recommendations.filter(r => r.product !== null),
        total: recommendations.length,
        algorithm: 'item_similarity',
        processingTime: 0, // Will be set by caller
      };
    } catch (error: any) {
      console.error('Error getting product detail recommendations:', error);
      throw error;
    }
  }

  async getCartRecommendations(cartProductIds: string[], limit = 6): Promise<RecommendationResult> {
    try {
      if (cartProductIds.length === 0) {
        return this.getTrendingProducts(undefined, limit);
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
            product,
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
        processingTime: 0,
      };
    } catch (error: any) {
      console.error('Error getting cart recommendations:', error);
      throw error;
    }
  }

  async getHomepageRecommendations(userId?: string, limit = 12): Promise<RecommendationResult> {
    try {
      if (userId) {
        // Try user-based recommendations first
        const userProfile = await this.recommendationPort.getUserProfile(userId);
        if (userProfile && userProfile.viewedProducts.length > 0) {
          return this.getUserBasedRecommendations(userId, limit);
        }
      }

      // Fallback to trending products
      return this.getTrendingProducts(undefined, limit);
    } catch (error: any) {
      console.error('Error getting homepage recommendations:', error);
      // Fallback to trending
      return this.getTrendingProducts(undefined, limit);
    }
  }

  async getUserBasedRecommendations(userId: string, limit = 10): Promise<RecommendationResult> {
    try {
      const userProfile = await this.recommendationPort.getUserProfile(userId);
      if (!userProfile || userProfile.viewedProducts.length === 0) {
        return this.getTrendingProducts(undefined, limit);
      }

      // Get similarities for recently viewed products
      const recentProducts = userProfile.viewedProducts.slice(-5); // Last 5 viewed
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
            product,
            score: data.score,
            reason: data.reason,
            algorithm: 'collaborative' as const,
          };
        })
      );

      return {
        recommendations: recommendations.filter(r => r.product !== null),
        total: recommendations.length,
        algorithm: 'collaborative',
        processingTime: 0,
      };
    } catch (error: any) {
      console.error('Error getting user-based recommendations:', error);
      throw error;
    }
  }

  async getTrendingProducts(category?: string, limit = 10): Promise<RecommendationResult> {
    try {
      return await this.recommendationPort.getTrendingProducts(category, limit);
    } catch (error: any) {
      console.error('Error getting trending products:', error);
      throw error;
    }
  }

  async getPopularProducts(category?: string, limit = 10): Promise<RecommendationResult> {
    try {
      return await this.recommendationPort.getPopularProducts(category, limit);
    } catch (error: any) {
      console.error('Error getting popular products:', error);
      throw error;
    }
  }

  async getSearchRecommendations(query: string, limit = 8): Promise<RecommendationResult> {
    try {
      return await this.recommendationPort.getSearchRecommendations(query, limit);
    } catch (error: any) {
      console.error('Error getting search recommendations:', error);
      throw error;
    }
  }

  // ===========================================
  // EVENT COLLECTION
  // ===========================================

  async collectEvent(request: EventCollectionRequest): Promise<EventCollectionResult> {
    try {
      const result = await this.recommendationPort.collectEvent(request);
      
      // Update user profile based on event
      if (result.success) {
        await this.updateUserProfileFromEvent(request);
      }
      
      return result;
    } catch (error: any) {
      console.error('Error collecting event:', error);
      return {
        success: false,
        eventId: '',
        message: error.message,
      };
    }
  }

  async trackProductView(userId: string, sessionId: string, productId: string, metadata?: Record<string, any>): Promise<EventCollectionResult> {
    return this.collectEvent({
      userId,
      sessionId,
      eventType: 'view',
      productId,
      metadata,
    });
  }

  async trackProductClick(userId: string, sessionId: string, productId: string, metadata?: Record<string, any>): Promise<EventCollectionResult> {
    return this.collectEvent({
      userId,
      sessionId,
      eventType: 'click',
      productId,
      metadata,
    });
  }

  async trackAddToCart(userId: string, sessionId: string, productId: string, metadata?: Record<string, any>): Promise<EventCollectionResult> {
    return this.collectEvent({
      userId,
      sessionId,
      eventType: 'add_to_cart',
      productId,
      metadata,
    });
  }

  async trackPurchase(userId: string, sessionId: string, productId: string, metadata?: Record<string, any>): Promise<EventCollectionResult> {
    return this.collectEvent({
      userId,
      sessionId,
      eventType: 'purchase',
      productId,
      metadata,
    });
  }

  async trackSearch(userId: string, sessionId: string, query: string, category?: string, metadata?: Record<string, any>): Promise<EventCollectionResult> {
    return this.collectEvent({
      userId,
      sessionId,
      eventType: 'search',
      query,
      category,
      metadata,
    });
  }

  // ===========================================
  // USER PROFILE MANAGEMENT
  // ===========================================

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      return await this.recommendationPort.getUserProfile(userId);
    } catch (error: any) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<boolean> {
    try {
      return await this.recommendationPort.updateUserProfile(userId, profile);
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
      // This would typically call a product service
      // For now, return a mock product
      return {
        id: productId,
        title: `Product ${productId}`,
        description: 'Product description',
        category: 'Electronics',
        brand: 'Brand',
        price: 100,
        tags: ['tag1', 'tag2'],
        images: ['https://example.com/image.jpg'],
        specifications: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error getting product:', error);
      return null;
    }
  }

  private async getUserCartProducts(userId: string): Promise<string[]> {
    try {
      // This would typically call a cart service
      // For now, return mock cart products
      return ['prod-1', 'prod-2', 'prod-3'];
    } catch (error) {
      console.error('Error getting user cart products:', error);
      return [];
    }
  }

  private async updateUserProfileFromEvent(request: EventCollectionRequest): Promise<void> {
    try {
      const userProfile = await this.getUserProfile(request.userId);
      if (!userProfile) return;

      const updates: Partial<UserProfile> = {};

      switch (request.eventType) {
        case 'view':
          if (request.productId && !userProfile.viewedProducts.includes(request.productId)) {
            updates.viewedProducts = [...userProfile.viewedProducts, request.productId].slice(-50); // Keep last 50
          }
          break;
        case 'click':
          if (request.productId && !userProfile.clickedProducts.includes(request.productId)) {
            updates.clickedProducts = [...userProfile.clickedProducts, request.productId].slice(-30); // Keep last 30
          }
          break;
        case 'purchase':
          if (request.productId && !userProfile.purchasedProducts.includes(request.productId)) {
            updates.purchasedProducts = [...userProfile.purchasedProducts, request.productId].slice(-20); // Keep last 20
          }
          break;
        case 'search':
          if (request.query && !userProfile.searchHistory.includes(request.query)) {
            updates.searchHistory = [...userProfile.searchHistory, request.query].slice(-20); // Keep last 20
          }
          break;
      }

      updates.lastActivity = new Date();

      if (Object.keys(updates).length > 0) {
        await this.updateUserProfile(request.userId, updates);
      }
    } catch (error) {
      console.error('Error updating user profile from event:', error);
    }
  }

  // ===========================================
  // HEALTH CHECK
  // ===========================================

  async healthCheck(): Promise<boolean> {
    try {
      return await this.recommendationPort.healthCheck();
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}


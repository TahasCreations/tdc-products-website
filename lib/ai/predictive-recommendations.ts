/**
 * AI Predictive Recommendations Engine
 * Machine learning-based product recommendations
 */

export interface UserBehavior {
  userId: string;
  viewedProducts: string[];
  purchasedProducts: string[];
  searchQueries: string[];
  categories: string[];
  priceRange: { min: number; max: number };
  sessionDuration: number;
}

export interface ProductRecommendation {
  productId: string;
  score: number;
  reason: 'trending' | 'similar' | 'collaborative' | 'content_based' | 'ai_predicted';
  confidence: number;
}

class PredictiveRecommendationsEngine {
  /**
   * Get personalized recommendations using AI
   */
  async getPersonalizedRecommendations(
    userId: string,
    context?: 'homepage' | 'product_page' | 'cart' | 'checkout'
  ): Promise<ProductRecommendation[]> {
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, context })
      });

      if (response.ok) {
        const data = await response.json();
        return data.recommendations || [];
      }
      return [];
    } catch (error) {
      console.error('Predictive recommendations error:', error);
      return [];
    }
  }

  /**
   * Trending products (real-time)
   */
  async getTrendingProducts(limit: number = 10): Promise<ProductRecommendation[]> {
    try {
      const response = await fetch(`/api/ai/trending?limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        return data.products || [];
      }
      return [];
    } catch (error) {
      console.error('Trending products error:', error);
      return [];
    }
  }

  /**
   * Similar products (content-based filtering)
   */
  async getSimilarProducts(productId: string, limit: number = 6): Promise<ProductRecommendation[]> {
    try {
      const response = await fetch(`/api/ai/similar/${productId}?limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        return data.products || [];
      }
      return [];
    } catch (error) {
      console.error('Similar products error:', error);
      return [];
    }
  }

  /**
   * Collaborative filtering (users who bought X also bought Y)
   */
  async getCollaborativeRecommendations(
    userId: string,
    limit: number = 8
  ): Promise<ProductRecommendation[]> {
    try {
      const response = await fetch(`/api/ai/collaborative/${userId}?limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        return data.products || [];
      }
      return [];
    } catch (error) {
      console.error('Collaborative recommendations error:', error);
      return [];
    }
  }

  /**
   * Next purchase prediction
   */
  async predictNextPurchase(userId: string): Promise<{
    products: ProductRecommendation[];
    confidence: number;
    estimatedDate: string;
  }> {
    try {
      const response = await fetch(`/api/ai/predict-next-purchase/${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      return { products: [], confidence: 0, estimatedDate: '' };
    } catch (error) {
      console.error('Next purchase prediction error:', error);
      return { products: [], confidence: 0, estimatedDate: '' };
    }
  }

  /**
   * Track user behavior for ML training
   */
  async trackBehavior(event: {
    userId: string;
    eventType: 'view' | 'cart_add' | 'purchase' | 'search';
    productId?: string;
    query?: string;
    metadata?: any;
  }): Promise<void> {
    try {
      await fetch('/api/ai/track-behavior', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Track behavior error:', error);
    }
  }
}

// Singleton instance
export const aiRecommendations = new PredictiveRecommendationsEngine();

// React Hook
export function useAIRecommendations() {
  return {
    getPersonalizedRecommendations: aiRecommendations.getPersonalizedRecommendations.bind(aiRecommendations),
    getTrendingProducts: aiRecommendations.getTrendingProducts.bind(aiRecommendations),
    getSimilarProducts: aiRecommendations.getSimilarProducts.bind(aiRecommendations),
    getCollaborativeRecommendations: aiRecommendations.getCollaborativeRecommendations.bind(aiRecommendations),
    predictNextPurchase: aiRecommendations.predictNextPurchase.bind(aiRecommendations),
    trackBehavior: aiRecommendations.trackBehavior.bind(aiRecommendations)
  };
}


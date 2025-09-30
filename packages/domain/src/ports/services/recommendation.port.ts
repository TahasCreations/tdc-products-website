/**
 * Recommendation Domain Port
 * Interface for recommendation services including item-item similarity
 */

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  tags: string[];
  images: string[];
  specifications: Record<string, any>;
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserEvent {
  id: string;
  userId: string;
  sessionId: string;
  eventType: 'view' | 'click' | 'add_to_cart' | 'purchase' | 'search';
  productId?: string;
  query?: string;
  category?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface SimilarityScore {
  productId: string;
  similarity: number;
  reason: string; // Why this product is similar
}

export interface RecommendationRequest {
  productId?: string;
  userId?: string;
  sessionId?: string;
  category?: string;
  limit?: number;
  excludeIds?: string[];
  context?: 'product_detail' | 'cart' | 'homepage' | 'search';
}

export interface RecommendationResult {
  recommendations: Array<{
    product: Product;
    score: number;
    reason: string;
    algorithm: 'item_similarity' | 'collaborative' | 'content_based' | 'trending';
  }>;
  total: number;
  algorithm: string;
  processingTime: number;
}

export interface EventCollectionRequest {
  userId: string;
  sessionId: string;
  eventType: 'view' | 'click' | 'add_to_cart' | 'purchase' | 'search';
  productId?: string;
  query?: string;
  category?: string;
  metadata?: Record<string, any>;
}

export interface EventCollectionResult {
  success: boolean;
  eventId: string;
  message: string;
}

export interface UserProfile {
  userId: string;
  viewedProducts: string[];
  clickedProducts: string[];
  purchasedProducts: string[];
  searchHistory: string[];
  categories: string[];
  brands: string[];
  priceRange: { min: number; max: number };
  lastActivity: Date;
  preferences: Record<string, any>;
}

export interface RecommendationPort {
  // Item-item similarity
  calculateItemSimilarity(productId: string, limit?: number): Promise<SimilarityScore[]>;
  
  // Get recommendations
  getRecommendations(request: RecommendationRequest): Promise<RecommendationResult>;
  
  // Event collection
  collectEvent(request: EventCollectionRequest): Promise<EventCollectionResult>;
  
  // User profile management
  getUserProfile(userId: string): Promise<UserProfile | null>;
  updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<boolean>;
  
  // Product recommendations for specific contexts
  getProductDetailRecommendations(productId: string, limit?: number): Promise<RecommendationResult>;
  getCartRecommendations(cartProductIds: string[], limit?: number): Promise<RecommendationResult>;
  getHomepageRecommendations(userId?: string, limit?: number): Promise<RecommendationResult>;
  
  // Trending and popular products
  getTrendingProducts(category?: string, limit?: number): Promise<RecommendationResult>;
  getPopularProducts(category?: string, limit?: number): Promise<RecommendationResult>;
  
  // Search-based recommendations
  getSearchRecommendations(query: string, limit?: number): Promise<RecommendationResult>;
  
  // Health check
  healthCheck(): Promise<boolean>;
}


/**
 * AI-Powered Personalization Engine
 * User behavior tracking ve recommendation sistemi
 */

interface UserBehavior {
  userId: string;
  viewedProducts: string[];
  purchasedProducts: string[];
  searchQueries: string[];
  categories: string[];
  priceRange: [number, number];
  lastActivity: Date;
}

interface ProductRecommendation {
  productId: string;
  score: number;
  reason: string;
}

// Collaborative Filtering
export function getCollaborativeRecommendations(
  userId: string,
  userBehaviors: UserBehavior[]
): ProductRecommendation[] {
  // Benzer kullanıcıları bul
  const currentUser = userBehaviors.find(u => u.userId === userId);
  if (!currentUser) return [];

  const similarUsers = userBehaviors
    .filter(u => u.userId !== userId)
    .map(user => ({
      userId: user.userId,
      similarity: calculateSimilarity(currentUser, user),
      products: user.purchasedProducts,
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 10);

  // Benzer kullanıcıların ürünlerini öner
  const recommendations: Map<string, { count: number; score: number }> = new Map();
  
  similarUsers.forEach(user => {
    user.products.forEach(productId => {
      if (!currentUser.purchasedProducts.includes(productId)) {
        const existing = recommendations.get(productId) || { count: 0, score: 0 };
        recommendations.set(productId, {
          count: existing.count + 1,
          score: existing.score + user.similarity,
        });
      }
    });
  });

  return Array.from(recommendations.entries())
    .map(([productId, data]) => ({
      productId,
      score: data.score / data.count,
      reason: 'Benzer kullanıcılar satın aldı',
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

// Content-Based Filtering
export function getContentBasedRecommendations(
  userId: string,
  userBehavior: UserBehavior,
  allProducts: any[]
): ProductRecommendation[] {
  const userPreferences = {
    categories: getMostCommonCategories(userBehavior.categories),
    priceRange: userBehavior.priceRange,
  };

  return allProducts
    .filter(product => {
      // Daha önce satın alınmamış
      if (userBehavior.purchasedProducts.includes(product.id)) return false;
      
      // Kategori uyumu
      const categoryMatch = userPreferences.categories.includes(product.category);
      
      // Fiyat aralığı
      const priceMatch = product.price >= userPreferences.priceRange[0] &&
                        product.price <= userPreferences.priceRange[1];
      
      return categoryMatch && priceMatch;
    })
    .map(product => ({
      productId: product.id,
      score: calculateContentScore(product, userPreferences),
      reason: `${product.category} kategorisinden`,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

// Trending Products
export function getTrendingProducts(
  timeWindow: 'day' | 'week' | 'month' = 'week'
): ProductRecommendation[] {
  // Son X gün içindeki en popüler ürünler
  // Gerçek uygulamada database'den çekilir
  return [
    { productId: '1', score: 0.95, reason: 'Bu hafta trend' },
    { productId: '2', score: 0.88, reason: 'Çok satan' },
    { productId: '3', score: 0.82, reason: 'Yeni ve popüler' },
  ];
}

// Personalized Homepage
export function getPersonalizedHomepage(
  userId: string,
  userBehavior: UserBehavior
) {
  return {
    hero: {
      type: 'category',
      category: getMostViewedCategory(userBehavior),
      message: `${getMostViewedCategory(userBehavior)} koleksiyonunu keşfedin`,
    },
    sections: [
      {
        title: 'Size Özel Seçtiklerimiz',
        type: 'personalized',
        products: [], // AI recommendations
      },
      {
        title: 'Gezdiğiniz Ürünler',
        type: 'recently-viewed',
        products: userBehavior.viewedProducts.slice(-8),
      },
      {
        title: 'Benzer Ürünler',
        type: 'similar',
        products: [], // Based on viewed products
      },
      {
        title: 'Trend Ürünler',
        type: 'trending',
        products: [], // Trending in user's favorite category
      },
    ],
  };
}

// Price Drop Alerts
export function getPriceDropAlerts(
  userId: string,
  userBehavior: UserBehavior,
  products: any[]
): any[] {
  return userBehavior.viewedProducts
    .map(productId => {
      const product = products.find(p => p.id === productId);
      if (!product) return null;
      
      // Fiyat düşmüş mü kontrol et
      const hasDiscount = product.originalPrice && 
                         product.price < product.originalPrice;
      
      return hasDiscount ? {
        productId: product.id,
        name: product.name,
        oldPrice: product.originalPrice,
        newPrice: product.price,
        discount: Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100),
      } : null;
    })
    .filter(Boolean);
}

// Helper Functions
function calculateSimilarity(user1: UserBehavior, user2: UserBehavior): number {
  let score = 0;
  
  // Ortak kategoriler
  const commonCategories = user1.categories.filter(c => 
    user2.categories.includes(c)
  ).length;
  score += commonCategories * 0.3;
  
  // Ortak satın alınan ürünler
  const commonPurchases = user1.purchasedProducts.filter(p =>
    user2.purchasedProducts.includes(p)
  ).length;
  score += commonPurchases * 0.5;
  
  // Fiyat aralığı benzerliği
  const priceSimilarity = 1 - Math.abs(
    (user1.priceRange[0] - user2.priceRange[0]) / 1000
  );
  score += priceSimilarity * 0.2;
  
  return score;
}

function getMostCommonCategories(categories: string[]): string[] {
  const counts: Record<string, number> = {};
  categories.forEach(cat => {
    counts[cat] = (counts[cat] || 0) + 1;
  });
  
  return Object.entries(counts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([cat]) => cat);
}

function getMostViewedCategory(behavior: UserBehavior): string {
  return getMostCommonCategories(behavior.categories)[0] || 'Anime';
}

function calculateContentScore(product: any, preferences: any): number {
  let score = 0;
  
  // Kategori match
  if (preferences.categories.includes(product.category)) {
    score += 0.5;
  }
  
  // Rating
  score += (product.rating / 5) * 0.3;
  
  // Popularity
  score += Math.min(product.salesCount / 1000, 1) * 0.2;
  
  return score;
}

// Smart Search Suggestions
export function getSmartSearchSuggestions(
  query: string,
  userBehavior: UserBehavior
): string[] {
  const suggestions: string[] = [];
  
  // User's previous searches
  const relevantSearches = userBehavior.searchQueries
    .filter(q => q.toLowerCase().includes(query.toLowerCase()))
    .slice(-5);
  
  suggestions.push(...relevantSearches);
  
  // Category-based suggestions
  const favCategory = getMostViewedCategory(userBehavior);
  suggestions.push(`${query} ${favCategory}`);
  
  // Trending suggestions
  suggestions.push(`${query} yeni`, `${query} indirim`);
  
  return [...new Set(suggestions)].slice(0, 8);
}


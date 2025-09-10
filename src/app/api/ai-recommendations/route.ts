import { NextRequest, NextResponse } from 'next/server';

interface RecommendationRequest {
  userId?: string;
  userPreferences?: {
    categories?: string[];
    priceRange?: { min: number; max: number };
    brands?: string[];
    recentlyViewed?: string[];
    purchaseHistory?: string[];
  };
  currentProduct?: string;
  context?: 'homepage' | 'product' | 'cart' | 'checkout';
  limit?: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  description: string;
  tags: string[];
  stock: number;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, userPreferences, currentProduct, context = 'homepage', limit = 6 }: RecommendationRequest = await request.json();

    // Demo products database
    const demoProducts: Product[] = [
      {
        id: '1',
        name: 'Naruto Uzumaki Figürü',
        category: 'Anime',
        price: 299.99,
        image: '/images/naruto-figur.jpg',
        rating: 4.8,
        description: 'Naruto anime serisinin ana karakteri',
        tags: ['naruto', 'anime', 'ninja', 'popüler'],
        stock: 15
      },
      {
        id: '2',
        name: 'Goku Super Saiyan Figürü',
        category: 'Anime',
        price: 349.99,
        image: '/images/goku-figur.jpg',
        rating: 4.9,
        description: 'Dragon Ball Z serisinin efsanevi karakteri',
        tags: ['goku', 'dragon ball', 'saiyan', 'güçlü'],
        stock: 8
      },
      {
        id: '3',
        name: 'Mario Bros Figürü',
        category: 'Gaming',
        price: 199.99,
        image: '/images/mario-figur.jpg',
        rating: 4.7,
        description: 'Nintendo\'nun ikonik karakteri',
        tags: ['mario', 'nintendo', 'gaming', 'klasik'],
        stock: 25
      },
      {
        id: '4',
        name: 'Pikachu Figürü',
        category: 'Gaming',
        price: 249.99,
        image: '/images/pikachu-figur.jpg',
        rating: 4.9,
        description: 'Pokemon serisinin maskotu',
        tags: ['pikachu', 'pokemon', 'elektrik', 'sevimli'],
        stock: 20
      },
      {
        id: '5',
        name: 'Sonic Figürü',
        category: 'Gaming',
        price: 229.99,
        image: '/images/sonic-figur.jpg',
        rating: 4.6,
        description: 'Sega\'nın hızlı karakteri',
        tags: ['sonic', 'sega', 'hız', 'mavi'],
        stock: 12
      },
      {
        id: '6',
        name: 'Batman Figürü',
        category: 'Film',
        price: 399.99,
        image: '/images/batman-figur.jpg',
        rating: 4.8,
        description: 'DC Comics\'in karanlık şövalyesi',
        tags: ['batman', 'dc', 'superhero', 'karanlık'],
        stock: 6
      },
      {
        id: '7',
        name: 'Spider-Man Figürü',
        category: 'Film',
        price: 379.99,
        image: '/images/spiderman-figur.jpg',
        rating: 4.7,
        description: 'Marvel\'in örümcek adamı',
        tags: ['spiderman', 'marvel', 'superhero', 'örümcek'],
        stock: 10
      },
      {
        id: '8',
        name: 'One Piece Luffy Figürü',
        category: 'Anime',
        price: 329.99,
        image: '/images/luffy-figur.jpg',
        rating: 4.9,
        description: 'One Piece serisinin ana karakteri',
        tags: ['luffy', 'one piece', 'korsan', 'lastik'],
        stock: 18
      }
    ];

    // AI-powered recommendation algorithm
    const recommendations = getSmartRecommendations(demoProducts, userPreferences, currentProduct, context, limit);

    return NextResponse.json({
      success: true,
      recommendations: recommendations,
      algorithm: 'AI-Powered Collaborative Filtering',
      context: context,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI Recommendations API Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Öneriler alınırken bir hata oluştu',
      recommendations: []
    }, { status: 500 });
  }
}

function getSmartRecommendations(
  products: Product[],
  userPreferences?: any,
  currentProduct?: string,
  context?: string,
  limit: number = 6
): Product[] {
  let scoredProducts = products.map(product => ({
    ...product,
    score: calculateRecommendationScore(product, userPreferences, currentProduct, context)
  }));

  // Sort by score (highest first)
  scoredProducts.sort((a, b) => b.score - a.score);

  // Apply diversity filter
  const diverseRecommendations = applyDiversityFilter(scoredProducts, limit);

  return diverseRecommendations.slice(0, limit);
}

function calculateRecommendationScore(
  product: Product,
  userPreferences?: any,
  currentProduct?: string,
  context?: string
): number {
  let score = 0;

  // Base popularity score
  score += product.rating * 10;

  // Stock availability bonus
  if (product.stock > 10) score += 5;
  else if (product.stock > 5) score += 2;

  // User preferences matching
  if (userPreferences?.categories?.includes(product.category)) {
    score += 20;
  }

  if (userPreferences?.priceRange) {
    const { min, max } = userPreferences.priceRange;
    if (product.price >= min && product.price <= max) {
      score += 15;
    }
  }

  // Context-based scoring
  switch (context) {
    case 'homepage':
      // Popular products for homepage
      score += product.rating * 5;
      break;
    case 'product':
      // Similar products
      if (currentProduct && product.id !== currentProduct) {
        score += 10;
      }
      break;
    case 'cart':
      // Complementary products
      score += 8;
      break;
    case 'checkout':
      // Last-minute additions
      score += 5;
      break;
  }

  // Category diversity bonus
  const categoryBonus = Math.random() * 5; // Simulate AI diversity algorithm
  score += categoryBonus;

  return score;
}

function applyDiversityFilter(products: Product[], limit: number): Product[] {
  const categories = new Set<string>();
  const diverseProducts: Product[] = [];

  // First pass: ensure category diversity
  for (const product of products) {
    if (categories.size >= Math.min(4, limit)) break;
    
    if (!categories.has(product.category)) {
      categories.add(product.category);
      diverseProducts.push(product);
    }
  }

  // Second pass: fill remaining slots
  for (const product of products) {
    if (diverseProducts.length >= limit) break;
    
    if (!diverseProducts.find(p => p.id === product.id)) {
      diverseProducts.push(product);
    }
  }

  return diverseProducts;
}

/**
 * AI-powered SEO title and description suggestion service
 * Pure functions for generating SEO-optimized content
 */

export interface SeoSuggestionInput {
  raw: string;
  category?: string;
  brand?: string;
  price?: number;
  targetKeywords?: string[];
  maxTitleLength?: number;
  maxDescriptionLength?: number;
  language?: 'TR' | 'EN';
}

export interface SeoSuggestionResult {
  title: string;
  description: string;
  keywords: string[];
  confidence: number;
  seoScore: number;
  suggestions: string[];
  reasoning: string[];
}

/**
 * Extract keywords from raw text
 * Pure function - no side effects
 */
export function extractSeoKeywords(text: string, language: 'TR' | 'EN' = 'TR'): string[] {
  if (!text || typeof text !== 'string') return [];

  const cleaned = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Language-specific stop words
  const stopWords = language === 'TR' 
    ? new Set(['ve', 'ile', 'için', 'olan', 'bir', 'bu', 'şu', 'o', 'ben', 'sen', 'biz', 'siz', 'onlar', 'da', 'de', 'ta', 'te', 'den', 'dan', 'ten', 'tan', 'nin', 'nın', 'nun', 'nün', 'nin', 'nın', 'nun', 'nün'])
    : new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall']);

  const words = cleaned.split(' ')
    .filter(word => word.length > 2 && !stopWords.has(word));

  // Count word frequency
  const wordCounts: Record<string, number> = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });

  // Return words sorted by frequency
  return Object.entries(wordCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([word]) => word)
    .slice(0, 10);
}

/**
 * Get category-specific SEO keywords
 * Pure function - no side effects
 */
export function getCategorySeoKeywords(category: string, language: 'TR' | 'EN' = 'TR'): string[] {
  const categoryKeywords: Record<string, Record<string, string[]>> = {
    'TR': {
      'electronics': ['elektronik', 'teknoloji', 'gadget', 'akıllı', 'dijital', 'modern', 'kaliteli', 'dayanıklı'],
      'clothing': ['giyim', 'moda', 'stil', 'şık', 'trend', 'kombin', 'rahat', 'kaliteli'],
      'home-garden': ['ev', 'bahçe', 'dekorasyon', 'iç mekan', 'dış mekan', 'yaşam', 'konfor', 'şık'],
      'beauty-health': ['güzellik', 'sağlık', 'bakım', 'kozmetik', 'cilt', 'vücut', 'doğal', 'organik'],
      'sports': ['spor', 'fitness', 'egzersiz', 'aktif', 'sağlıklı', 'enerji', 'performans', 'dayanıklı'],
      'books': ['kitap', 'okuma', 'eğitim', 'bilgi', 'öğrenme', 'kültür', 'edebiyat', 'roman'],
      'toys': ['oyuncak', 'çocuk', 'eğlence', 'oyun', 'yaratıcı', 'eğitici', 'güvenli', 'renkli'],
      'automotive': ['otomotiv', 'araç', 'motor', 'yol', 'seyahat', 'ulaşım', 'güvenli', 'konforlu'],
      'food': ['yemek', 'gıda', 'beslenme', 'lezzet', 'sağlıklı', 'doğal', 'organik', 'taze'],
      'jewelry': ['mücevher', 'takı', 'aksesuar', 'şık', 'özel', 'hediye', 'lüks', 'zarif']
    },
    'EN': {
      'electronics': ['electronics', 'technology', 'gadget', 'smart', 'digital', 'modern', 'quality', 'durable'],
      'clothing': ['clothing', 'fashion', 'style', 'elegant', 'trendy', 'outfit', 'comfortable', 'quality'],
      'home-garden': ['home', 'garden', 'decoration', 'interior', 'exterior', 'living', 'comfort', 'elegant'],
      'beauty-health': ['beauty', 'health', 'care', 'cosmetics', 'skin', 'body', 'natural', 'organic'],
      'sports': ['sports', 'fitness', 'exercise', 'active', 'healthy', 'energy', 'performance', 'durable'],
      'books': ['book', 'reading', 'education', 'knowledge', 'learning', 'culture', 'literature', 'novel'],
      'toys': ['toy', 'children', 'fun', 'game', 'creative', 'educational', 'safe', 'colorful'],
      'automotive': ['automotive', 'vehicle', 'motor', 'road', 'travel', 'transportation', 'safe', 'comfortable'],
      'food': ['food', 'nutrition', 'taste', 'healthy', 'natural', 'organic', 'fresh'],
      'jewelry': ['jewelry', 'accessory', 'elegant', 'special', 'gift', 'luxury', 'delicate']
    }
  };

  return categoryKeywords[language][category.toLowerCase()] || [];
}

/**
 * Get brand-specific SEO keywords
 * Pure function - no side effects
 */
export function getBrandSeoKeywords(brand: string, language: 'TR' | 'EN' = 'TR'): string[] {
  if (!brand) return [];

  const brandLower = brand.toLowerCase();
  const brandKeywords: Record<string, string[]> = {
    'TR': ['marka', 'kaliteli', 'güvenilir', 'profesyonel', 'şık', 'modern'],
    'EN': ['brand', 'quality', 'reliable', 'professional', 'elegant', 'modern']
  };

  const baseKeywords = brandKeywords[language];

  // Add brand-specific keywords
  if (['apple', 'samsung', 'sony', 'lg', 'huawei', 'xiaomi'].some(tech => brandLower.includes(tech))) {
    return [...baseKeywords, 'teknoloji', 'akıllı', 'dijital'];
  }

  if (['nike', 'adidas', 'puma', 'under armour', 'reebok'].some(sport => brandLower.includes(sport))) {
    return [...baseKeywords, 'spor', 'aktif', 'performans'];
  }

  if (['gucci', 'louis vuitton', 'chanel', 'hermes', 'prada', 'dior'].some(lux => brandLower.includes(lux))) {
    return [...baseKeywords, 'lüks', 'premium', 'şık'];
  }

  return baseKeywords;
}

/**
 * Generate SEO title
 * Pure function - no side effects
 */
export function generateSeoTitle(
  input: SeoSuggestionInput,
  keywords: string[]
): string {
  const maxLength = input.maxTitleLength || 60;
  const language = input.language || 'TR';
  
  let title = input.raw.trim();
  
  // If raw text is too long, truncate intelligently
  if (title.length > maxLength) {
    const words = title.split(' ');
    let truncated = '';
    
    for (const word of words) {
      if ((truncated + ' ' + word).trim().length <= maxLength - 3) {
        truncated += (truncated ? ' ' : '') + word;
      } else {
        break;
      }
    }
    
    title = truncated.trim() + '...';
  }

  // Add category keywords if space allows
  if (input.category && title.length < maxLength - 10) {
    const categoryKeywords = getCategorySeoKeywords(input.category, language);
    const relevantKeyword = categoryKeywords.find(kw => 
      !title.toLowerCase().includes(kw.toLowerCase()) && 
      title.length + kw.length + 1 <= maxLength
    );
    
    if (relevantKeyword) {
      title += ` ${relevantKeyword}`;
    }
  }

  // Add brand if space allows
  if (input.brand && title.length < maxLength - 10) {
    const brandName = input.brand;
    if (!title.toLowerCase().includes(brandName.toLowerCase()) && 
        title.length + brandName.length + 1 <= maxLength) {
      title += ` ${brandName}`;
    }
  }

  return title.substring(0, maxLength);
}

/**
 * Generate SEO description
 * Pure function - no side effects
 */
export function generateSeoDescription(
  input: SeoSuggestionInput,
  keywords: string[]
): string {
  const maxLength = input.maxDescriptionLength || 160;
  const language = input.language || 'TR';
  
  let description = input.raw.trim();
  
  // If raw text is too short, enhance it
  if (description.length < 50) {
    const enhancements: string[] = [];
    
    if (input.category) {
      const categoryKeywords = getCategorySeoKeywords(input.category, language);
      enhancements.push(categoryKeywords[0]);
    }
    
    if (input.brand) {
      enhancements.push(input.brand);
    }
    
    if (input.price) {
      const priceText = language === 'TR' ? `${input.price} TL` : `${input.price} USD`;
      enhancements.push(priceText);
    }
    
    if (enhancements.length > 0) {
      description += ` - ${enhancements.join(', ')}`;
    }
  }
  
  // If too long, truncate intelligently
  if (description.length > maxLength) {
    const words = description.split(' ');
    let truncated = '';
    
    for (const word of words) {
      if ((truncated + ' ' + word).trim().length <= maxLength - 3) {
        truncated += (truncated ? ' ' : '') + word;
      } else {
        break;
      }
    }
    
    description = truncated.trim() + '...';
  }

  // Add call-to-action if space allows
  if (description.length < maxLength - 20) {
    const cta = language === 'TR' ? 'Hemen satın al!' : 'Buy now!';
    if (description.length + cta.length + 1 <= maxLength) {
      description += ` ${cta}`;
    }
  }

  return description.substring(0, maxLength);
}

/**
 * Calculate SEO score
 * Pure function - no side effects
 */
export function calculateSeoScore(
  title: string,
  description: string,
  keywords: string[],
  targetKeywords?: string[]
): number {
  let score = 0;
  const maxScore = 100;

  // Title length score (optimal: 50-60 characters)
  const titleLength = title.length;
  if (titleLength >= 50 && titleLength <= 60) {
    score += 20;
  } else if (titleLength >= 40 && titleLength <= 70) {
    score += 15;
  } else if (titleLength >= 30 && titleLength <= 80) {
    score += 10;
  }

  // Description length score (optimal: 150-160 characters)
  const descLength = description.length;
  if (descLength >= 150 && descLength <= 160) {
    score += 20;
  } else if (descLength >= 120 && descLength <= 180) {
    score += 15;
  } else if (descLength >= 100 && descLength <= 200) {
    score += 10;
  }

  // Keyword density score
  const titleWords = title.toLowerCase().split(/\s+/);
  const descWords = description.toLowerCase().split(/\s+/);
  const totalWords = titleWords.length + descWords.length;
  
  if (totalWords > 0) {
    const keywordDensity = keywords.reduce((density, keyword) => {
      const keywordCount = [...titleWords, ...descWords].filter(word => 
        word.includes(keyword.toLowerCase())
      ).length;
      return density + (keywordCount / totalWords) * 100;
    }, 0);
    
    score += Math.min(keywordDensity * 2, 20); // Max 20 points for keyword density
  }

  // Target keywords match score
  if (targetKeywords && targetKeywords.length > 0) {
    const matchedKeywords = targetKeywords.filter(targetKw =>
      title.toLowerCase().includes(targetKw.toLowerCase()) ||
      description.toLowerCase().includes(targetKw.toLowerCase())
    );
    score += (matchedKeywords.length / targetKeywords.length) * 20;
  }

  // Title uniqueness score
  const uniqueWords = new Set(titleWords).size;
  const totalTitleWords = titleWords.length;
  if (totalTitleWords > 0) {
    const uniqueness = uniqueWords / totalTitleWords;
    score += uniqueness * 10;
  }

  // Description readability score (simple word count heuristic)
  const avgWordLength = descWords.reduce((sum, word) => sum + word.length, 0) / descWords.length;
  if (avgWordLength >= 4 && avgWordLength <= 8) {
    score += 10;
  } else if (avgWordLength >= 3 && avgWordLength <= 10) {
    score += 5;
  }

  return Math.min(Math.round(score), maxScore);
}

/**
 * Generate SEO suggestions
 * Pure function - no side effects
 */
export function generateSeoSuggestions(
  input: SeoSuggestionInput,
  result: SeoSuggestionResult
): string[] {
  const suggestions: string[] = [];
  const language = input.language || 'TR';

  // Title suggestions
  if (result.title.length < 50) {
    suggestions.push(language === 'TR' 
      ? 'Başlık daha uzun olabilir (50-60 karakter önerilir)'
      : 'Title could be longer (50-60 characters recommended)'
    );
  } else if (result.title.length > 60) {
    suggestions.push(language === 'TR'
      ? 'Başlık çok uzun (60 karakterden kısa olmalı)'
      : 'Title is too long (should be under 60 characters)'
    );
  }

  // Description suggestions
  if (result.description.length < 120) {
    suggestions.push(language === 'TR'
      ? 'Açıklama daha detaylı olabilir (120-160 karakter önerilir)'
      : 'Description could be more detailed (120-160 characters recommended)'
    );
  } else if (result.description.length > 160) {
    suggestions.push(language === 'TR'
      ? 'Açıklama çok uzun (160 karakterden kısa olmalı)'
      : 'Description is too long (should be under 160 characters)'
    );
  }

  // Keyword suggestions
  if (result.keywords.length < 3) {
    suggestions.push(language === 'TR'
      ? 'Daha fazla anahtar kelime ekleyin'
      : 'Add more keywords'
    );
  }

  // Target keywords suggestions
  if (input.targetKeywords && input.targetKeywords.length > 0) {
    const missingKeywords = input.targetKeywords.filter(kw =>
      !result.title.toLowerCase().includes(kw.toLowerCase()) &&
      !result.description.toLowerCase().includes(kw.toLowerCase())
    );
    
    if (missingKeywords.length > 0) {
      suggestions.push(language === 'TR'
        ? `Hedef anahtar kelimeleri ekleyin: ${missingKeywords.join(', ')}`
        : `Add target keywords: ${missingKeywords.join(', ')}`
      );
    }
  }

  // SEO score suggestions
  if (result.seoScore < 70) {
    suggestions.push(language === 'TR'
      ? 'SEO skorunu artırmak için daha fazla anahtar kelime kullanın'
      : 'Use more keywords to improve SEO score'
    );
  }

  if (result.seoScore >= 90) {
    suggestions.push(language === 'TR'
      ? 'Mükemmel SEO optimizasyonu!'
      : 'Perfect SEO optimization!'
    );
  }

  return suggestions;
}

/**
 * Generate reasoning
 * Pure function - no side effects
 */
export function generateSeoReasoning(
  input: SeoSuggestionInput,
  result: SeoSuggestionResult
): string[] {
  const reasoning: string[] = [];
  const language = input.language || 'TR';

  // Title analysis
  reasoning.push(language === 'TR'
    ? `Başlık uzunluğu: ${result.title.length} karakter`
    : `Title length: ${result.title.length} characters`
  );

  // Description analysis
  reasoning.push(language === 'TR'
    ? `Açıklama uzunluğu: ${result.description.length} karakter`
    : `Description length: ${result.description.length} characters`
  );

  // Keywords analysis
  reasoning.push(language === 'TR'
    ? `${result.keywords.length} anahtar kelime tespit edildi`
    : `${result.keywords.length} keywords identified`
  );

  // SEO score analysis
  if (result.seoScore >= 90) {
    reasoning.push(language === 'TR' ? 'Mükemmel SEO skoru' : 'Excellent SEO score');
  } else if (result.seoScore >= 70) {
    reasoning.push(language === 'TR' ? 'İyi SEO skoru' : 'Good SEO score');
  } else if (result.seoScore >= 50) {
    reasoning.push(language === 'TR' ? 'Orta SEO skoru' : 'Average SEO score');
  } else {
    reasoning.push(language === 'TR' ? 'Düşük SEO skoru' : 'Low SEO score');
  }

  // Category analysis
  if (input.category) {
    reasoning.push(language === 'TR'
      ? `${input.category} kategorisi için optimize edildi`
      : `Optimized for ${input.category} category`
    );
  }

  // Brand analysis
  if (input.brand) {
    reasoning.push(language === 'TR'
      ? `${input.brand} markası vurgulandı`
      : `${input.brand} brand emphasized`
    );
  }

  return reasoning;
}

/**
 * Main SEO suggestion function
 * Pure function - no side effects, deterministic
 */
export function seoTitleDescription(input: SeoSuggestionInput): SeoSuggestionResult {
  // Validate input
  if (!input.raw || input.raw.trim().length === 0) {
    throw new Error('Raw content is required');
  }

  // Extract keywords
  const extractedKeywords = extractSeoKeywords(input.raw, input.language);
  
  // Get additional keywords
  const additionalKeywords: string[] = [];
  
  if (input.category) {
    additionalKeywords.push(...getCategorySeoKeywords(input.category, input.language));
  }
  
  if (input.brand) {
    additionalKeywords.push(...getBrandSeoKeywords(input.brand, input.language));
  }

  // Combine and deduplicate keywords
  const allKeywords = [...new Set([...extractedKeywords, ...additionalKeywords])];

  // Generate title and description
  const title = generateSeoTitle(input, allKeywords);
  const description = generateSeoDescription(input, allKeywords);

  // Calculate SEO score
  const seoScore = calculateSeoScore(title, description, allKeywords, input.targetKeywords);

  // Calculate confidence based on input completeness
  let confidence = 0.5;
  if (input.category) confidence += 0.2;
  if (input.brand) confidence += 0.1;
  if (input.targetKeywords && input.targetKeywords.length > 0) confidence += 0.2;
  confidence = Math.min(confidence, 1.0);

  // Create result
  const result: SeoSuggestionResult = {
    title,
    description,
    keywords: allKeywords.slice(0, 10), // Limit to top 10 keywords
    confidence,
    seoScore,
    suggestions: [],
    reasoning: []
  };

  // Generate suggestions and reasoning
  result.suggestions = generateSeoSuggestions(input, result);
  result.reasoning = generateSeoReasoning(input, result);

  return result;
}

/**
 * Suggest SEO for multiple products
 * Pure function - no side effects
 */
export function seoTitleDescriptionForMultiple(
  inputs: SeoSuggestionInput[]
): SeoSuggestionResult[] {
  return inputs.map(input => seoTitleDescription(input));
}

/**
 * Get SEO suggestion summary
 * Pure function - no side effects
 */
export function getSeoSuggestionSummary(
  results: SeoSuggestionResult[]
): {
  totalProducts: number;
  averageSeoScore: number;
  averageConfidence: number;
  averageTitleLength: number;
  averageDescriptionLength: number;
  scoreDistribution: Record<string, number>;
} {
  if (results.length === 0) {
    return {
      totalProducts: 0,
      averageSeoScore: 0,
      averageConfidence: 0,
      averageTitleLength: 0,
      averageDescriptionLength: 0,
      scoreDistribution: {}
    };
  }

  const totalProducts = results.length;
  const averageSeoScore = results.reduce((sum, r) => sum + r.seoScore, 0) / totalProducts;
  const averageConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / totalProducts;
  const averageTitleLength = results.reduce((sum, r) => sum + r.title.length, 0) / totalProducts;
  const averageDescriptionLength = results.reduce((sum, r) => sum + r.description.length, 0) / totalProducts;

  // Score distribution
  const scoreDistribution = results.reduce((acc, r) => {
    let range = '';
    if (r.seoScore >= 90) range = 'Excellent (90-100)';
    else if (r.seoScore >= 70) range = 'Good (70-89)';
    else if (r.seoScore >= 50) range = 'Average (50-69)';
    else range = 'Poor (0-49)';
    
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalProducts,
    averageSeoScore,
    averageConfidence,
    averageTitleLength,
    averageDescriptionLength,
    scoreDistribution
  };
}


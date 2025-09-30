/**
 * AI-powered tag suggestion service
 * Pure functions for suggesting relevant product tags
 */

export interface TagSuggestionInput {
  title: string;
  description: string;
  category?: string;
  brand?: string;
  price?: number;
  color?: string;
  size?: string;
  material?: string;
  targetAudience?: 'MEN' | 'WOMEN' | 'CHILDREN' | 'UNISEX' | 'ALL';
  occasion?: 'CASUAL' | 'FORMAL' | 'SPORTS' | 'PARTY' | 'WORK' | 'HOME';
  season?: 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER' | 'ALL_SEASON';
}

export interface TagSuggestionResult {
  tags: string[];
  confidence: number;
  categories: {
    descriptive: string[];
    functional: string[];
    emotional: string[];
    technical: string[];
    seasonal: string[];
    demographic: string[];
  };
  reasoning: string[];
}

/**
 * Extract keywords from text
 * Pure function - no side effects
 */
export function extractKeywords(text: string): string[] {
  if (!text || typeof text !== 'string') return [];

  // Convert to lowercase and remove special characters
  const cleaned = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into words and filter out common stop words
  const stopWords = new Set([
    've', 'ile', 'için', 'olan', 'bir', 'bu', 'şu', 'o', 'ben', 'sen', 'biz', 'siz', 'onlar',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall'
  ]);

  return cleaned.split(' ')
    .filter(word => word.length > 2 && !stopWords.has(word))
    .filter((word, index, array) => array.indexOf(word) === index); // Remove duplicates
}

/**
 * Get category-specific tags
 * Pure function - no side effects
 */
export function getCategoryTags(category: string): string[] {
  const categoryTagMap: Record<string, string[]> = {
    'electronics': ['elektronik', 'teknoloji', 'gadget', 'akıllı', 'dijital', 'modern'],
    'clothing': ['giyim', 'moda', 'stil', 'şık', 'trend', 'kombin'],
    'home-garden': ['ev', 'bahçe', 'dekorasyon', 'iç mekan', 'dış mekan', 'yaşam'],
    'beauty-health': ['güzellik', 'sağlık', 'bakım', 'kozmetik', 'cilt', 'vücut'],
    'sports': ['spor', 'fitness', 'egzersiz', 'aktif', 'sağlıklı', 'enerji'],
    'books': ['kitap', 'okuma', 'eğitim', 'bilgi', 'öğrenme', 'kültür'],
    'toys': ['oyuncak', 'çocuk', 'eğlence', 'oyun', 'yaratıcı', 'eğitici'],
    'automotive': ['otomotiv', 'araç', 'motor', 'yol', 'seyahat', 'ulaşım'],
    'food': ['yemek', 'gıda', 'beslenme', 'lezzet', 'sağlıklı', 'doğal'],
    'jewelry': ['mücevher', 'takı', 'aksesuar', 'şık', 'özel', 'hediye']
  };

  return categoryTagMap[category.toLowerCase()] || [];
}

/**
 * Get brand-specific tags
 * Pure function - no side effects
 */
export function getBrandTags(brand: string): string[] {
  if (!brand) return [];

  const brandLower = brand.toLowerCase();
  const brandTags: string[] = [];

  // Luxury brands
  if (['gucci', 'louis vuitton', 'chanel', 'hermes', 'prada', 'dior'].some(lux => brandLower.includes(lux))) {
    brandTags.push('lüks', 'premium', 'kaliteli', 'şık');
  }

  // Tech brands
  if (['apple', 'samsung', 'sony', 'lg', 'huawei', 'xiaomi'].some(tech => brandLower.includes(tech))) {
    brandTags.push('teknoloji', 'akıllı', 'modern', 'kaliteli');
  }

  // Sports brands
  if (['nike', 'adidas', 'puma', 'under armour', 'reebok'].some(sport => brandLower.includes(sport))) {
    brandTags.push('spor', 'aktif', 'rahat', 'performans');
  }

  // Fashion brands
  if (['zara', 'h&m', 'uniqlo', 'mango', 'bershka'].some(fashion => brandLower.includes(fashion))) {
    brandTags.push('moda', 'trend', 'şık', 'uygun fiyat');
  }

  return brandTags;
}

/**
 * Get color-specific tags
 * Pure function - no side effects
 */
export function getColorTags(color: string): string[] {
  if (!color) return [];

  const colorLower = color.toLowerCase();
  const colorTags: string[] = [];

  // Basic colors
  const colorMap: Record<string, string[]> = {
    'kırmızı': ['kırmızı', 'canlı', 'dikkat çekici', 'enerjik'],
    'mavi': ['mavi', 'sakin', 'güvenilir', 'profesyonel'],
    'yeşil': ['yeşil', 'doğal', 'sakin', 'sağlıklı'],
    'sarı': ['sarı', 'neşeli', 'parlak', 'dikkat çekici'],
    'mor': ['mor', 'şık', 'yaratıcı', 'özel'],
    'pembe': ['pembe', 'romantik', 'şık', 'kadınsı'],
    'siyah': ['siyah', 'şık', 'klasik', 'zarif'],
    'beyaz': ['beyaz', 'temiz', 'sade', 'şık'],
    'gri': ['gri', 'nötr', 'şık', 'modern'],
    'kahverengi': ['kahverengi', 'doğal', 'sıcak', 'toprak']
  };

  for (const [colorName, tags] of Object.entries(colorMap)) {
    if (colorLower.includes(colorName)) {
      colorTags.push(...tags);
    }
  }

  return colorTags;
}

/**
 * Get size-specific tags
 * Pure function - no side effects
 */
export function getSizeTags(size: string): string[] {
  if (!size) return [];

  const sizeLower = size.toLowerCase();
  const sizeTags: string[] = [];

  if (sizeLower.includes('büyük') || sizeLower.includes('large') || sizeLower.includes('xl')) {
    sizeTags.push('büyük beden', 'geniş', 'rahat');
  }
  if (sizeLower.includes('küçük') || sizeLower.includes('small') || sizeLower.includes('xs')) {
    sizeTags.push('küçük beden', 'kompakt', 'şık');
  }
  if (sizeLower.includes('orta') || sizeLower.includes('medium') || sizeLower.includes('m')) {
    sizeTags.push('orta beden', 'standart', 'uygun');
  }

  return sizeTags;
}

/**
 * Get material-specific tags
 * Pure function - no side effects
 */
export function getMaterialTags(material: string): string[] {
  if (!material) return [];

  const materialLower = material.toLowerCase();
  const materialTags: string[] = [];

  const materialMap: Record<string, string[]> = {
    'pamuk': ['pamuk', 'doğal', 'nefes alabilir', 'yumuşak'],
    'polyester': ['polyester', 'dayanıklı', 'kolay bakım', 'pratik'],
    'deri': ['deri', 'lüks', 'dayanıklı', 'şık'],
    'jean': ['jean', 'klasik', 'dayanıklı', 'rahat'],
    'yün': ['yün', 'sıcak', 'doğal', 'kaliteli'],
    'ipek': ['ipek', 'lüks', 'yumuşak', 'şık'],
    'keten': ['keten', 'doğal', 'nefes alabilir', 'yazlık'],
    'metal': ['metal', 'dayanıklı', 'modern', 'şık'],
    'ahşap': ['ahşap', 'doğal', 'sıcak', 'organik'],
    'plastik': ['plastik', 'hafif', 'pratik', 'dayanıklı']
  };

  for (const [materialName, tags] of Object.entries(materialMap)) {
    if (materialLower.includes(materialName)) {
      materialTags.push(...tags);
    }
  }

  return materialTags;
}

/**
 * Get target audience tags
 * Pure function - no side effects
 */
export function getTargetAudienceTags(audience: string): string[] {
  const audienceTagMap: Record<string, string[]> = {
    'MEN': ['erkek', 'maskülen', 'güçlü', 'profesyonel'],
    'WOMEN': ['kadın', 'feminen', 'şık', 'zarif'],
    'CHILDREN': ['çocuk', 'eğlenceli', 'renkli', 'güvenli'],
    'UNISEX': ['unisex', 'herkes', 'evrensel', 'nötr'],
    'ALL': ['herkes', 'evrensel', 'çok amaçlı']
  };

  return audienceTagMap[audience] || [];
}

/**
 * Get occasion tags
 * Pure function - no side effects
 */
export function getOccasionTags(occasion: string): string[] {
  const occasionTagMap: Record<string, string[]> = {
    'CASUAL': ['günlük', 'rahat', 'sade', 'pratik'],
    'FORMAL': ['resmi', 'şık', 'zarif', 'profesyonel'],
    'SPORTS': ['spor', 'aktif', 'rahat', 'fonksiyonel'],
    'PARTY': ['parti', 'eğlenceli', 'dikkat çekici', 'şık'],
    'WORK': ['iş', 'profesyonel', 'şık', 'rahat'],
    'HOME': ['ev', 'rahat', 'sade', 'pratik']
  };

  return occasionTagMap[occasion] || [];
}

/**
 * Get seasonal tags
 * Pure function - no side effects
 */
export function getSeasonalTags(season: string): string[] {
  const seasonTagMap: Record<string, string[]> = {
    'SPRING': ['bahar', 'yenilik', 'canlı', 'taze'],
    'SUMMER': ['yaz', 'sıcak', 'parlak', 'havadar'],
    'AUTUMN': ['sonbahar', 'sıcak', 'doğal', 'huzurlu'],
    'WINTER': ['kış', 'sıcak', 'koruyucu', 'rahat'],
    'ALL_SEASON': ['dört mevsim', 'çok amaçlı', 'pratik']
  };

  return seasonTagMap[season] || [];
}

/**
 * Calculate tag confidence based on input completeness
 * Pure function - no side effects
 */
export function calculateTagConfidence(input: TagSuggestionInput): number {
  let confidence = 0.3; // Base confidence

  if (input.title && input.title.length > 5) confidence += 0.2;
  if (input.description && input.description.length > 20) confidence += 0.2;
  if (input.category) confidence += 0.1;
  if (input.brand) confidence += 0.1;
  if (input.color) confidence += 0.05;
  if (input.size) confidence += 0.05;
  if (input.material) confidence += 0.05;
  if (input.targetAudience) confidence += 0.05;
  if (input.occasion) confidence += 0.05;
  if (input.season) confidence += 0.05;

  return Math.min(confidence, 1.0);
}

/**
 * Generate tag reasoning
 * Pure function - no side effects
 */
export function generateTagReasoning(
  input: TagSuggestionInput,
  result: TagSuggestionResult
): string[] {
  const reasoning: string[] = [];

  // Title and description analysis
  const titleKeywords = extractKeywords(input.title);
  const descKeywords = extractKeywords(input.description);
  const totalKeywords = [...new Set([...titleKeywords, ...descKeywords])];
  
  reasoning.push(`${totalKeywords.length} anahtar kelime tespit edildi`);

  // Category-based reasoning
  if (input.category) {
    reasoning.push(`${input.category} kategorisi için özel etiketler eklendi`);
  }

  // Brand-based reasoning
  if (input.brand) {
    reasoning.push(`${input.brand} markası için marka etiketleri eklendi`);
  }

  // Color-based reasoning
  if (input.color) {
    reasoning.push(`${input.color} rengi için renk etiketleri eklendi`);
  }

  // Material-based reasoning
  if (input.material) {
    reasoning.push(`${input.material} malzemesi için malzeme etiketleri eklendi`);
  }

  // Target audience reasoning
  if (input.targetAudience) {
    reasoning.push(`${input.targetAudience} hedef kitle için demografik etiketler eklendi`);
  }

  // Occasion reasoning
  if (input.occasion) {
    reasoning.push(`${input.occasion} durumu için kullanım etiketleri eklendi`);
  }

  // Season reasoning
  if (input.season) {
    reasoning.push(`${input.season} mevsimi için mevsimsel etiketler eklendi`);
  }

  // Confidence reasoning
  if (result.confidence > 0.8) {
    reasoning.push('Yüksek güvenilirlik - yeterli bilgi mevcut');
  } else if (result.confidence > 0.6) {
    reasoning.push('Orta güvenilirlik - bazı bilgiler eksik');
  } else {
    reasoning.push('Düşük güvenilirlik - daha fazla bilgi gerekli');
  }

  return reasoning;
}

/**
 * Main tag suggestion function
 * Pure function - no side effects, deterministic
 */
export function suggestTags(input: TagSuggestionInput): TagSuggestionResult {
  // Validate input
  if (!input.title && !input.description) {
    throw new Error('At least title or description must be provided');
  }

  const allTags: string[] = [];
  const categories = {
    descriptive: [] as string[],
    functional: [] as string[],
    emotional: [] as string[],
    technical: [] as string[],
    seasonal: [] as string[],
    demographic: [] as string[]
  };

  // Extract keywords from title and description
  const titleKeywords = extractKeywords(input.title || '');
  const descKeywords = extractKeywords(input.description || '');
  const allKeywords = [...new Set([...titleKeywords, ...descKeywords])];

  // Add descriptive tags from keywords
  categories.descriptive.push(...allKeywords.slice(0, 5)); // Top 5 keywords
  allTags.push(...categories.descriptive);

  // Add category-specific tags
  if (input.category) {
    const categoryTags = getCategoryTags(input.category);
    categories.functional.push(...categoryTags);
    allTags.push(...categoryTags);
  }

  // Add brand-specific tags
  if (input.brand) {
    const brandTags = getBrandTags(input.brand);
    categories.emotional.push(...brandTags);
    allTags.push(...brandTags);
  }

  // Add color-specific tags
  if (input.color) {
    const colorTags = getColorTags(input.color);
    categories.descriptive.push(...colorTags);
    allTags.push(...colorTags);
  }

  // Add size-specific tags
  if (input.size) {
    const sizeTags = getSizeTags(input.size);
    categories.functional.push(...sizeTags);
    allTags.push(...sizeTags);
  }

  // Add material-specific tags
  if (input.material) {
    const materialTags = getMaterialTags(input.material);
    categories.technical.push(...materialTags);
    allTags.push(...materialTags);
  }

  // Add target audience tags
  if (input.targetAudience) {
    const audienceTags = getTargetAudienceTags(input.targetAudience);
    categories.demographic.push(...audienceTags);
    allTags.push(...audienceTags);
  }

  // Add occasion tags
  if (input.occasion) {
    const occasionTags = getOccasionTags(input.occasion);
    categories.functional.push(...occasionTags);
    allTags.push(...occasionTags);
  }

  // Add seasonal tags
  if (input.season) {
    const seasonTags = getSeasonalTags(input.season);
    categories.seasonal.push(...seasonTags);
    allTags.push(...seasonTags);
  }

  // Remove duplicates and limit to reasonable number
  const uniqueTags = [...new Set(allTags)].slice(0, 15);

  // Calculate confidence
  const confidence = calculateTagConfidence(input);

  // Create result
  const result: TagSuggestionResult = {
    tags: uniqueTags,
    confidence,
    categories,
    reasoning: []
  };

  // Generate reasoning
  result.reasoning = generateTagReasoning(input, result);

  return result;
}

/**
 * Suggest tags for multiple products
 * Pure function - no side effects
 */
export function suggestTagsForMultiple(
  inputs: TagSuggestionInput[]
): TagSuggestionResult[] {
  return inputs.map(input => suggestTags(input));
}

/**
 * Get tag suggestion summary
 * Pure function - no side effects
 */
export function getTagSuggestionSummary(
  results: TagSuggestionResult[]
): {
  totalProducts: number;
  averageTagsPerProduct: number;
  averageConfidence: number;
  mostCommonTags: Array<{ tag: string; count: number }>;
  categoryDistribution: Record<string, number>;
} {
  if (results.length === 0) {
    return {
      totalProducts: 0,
      averageTagsPerProduct: 0,
      averageConfidence: 0,
      mostCommonTags: [],
      categoryDistribution: {}
    };
  }

  const totalProducts = results.length;
  const averageTagsPerProduct = results.reduce((sum, r) => sum + r.tags.length, 0) / totalProducts;
  const averageConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / totalProducts;

  // Count tag frequency
  const tagCounts: Record<string, number> = {};
  results.forEach(result => {
    result.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  // Get most common tags
  const mostCommonTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Count category distribution
  const categoryDistribution: Record<string, number> = {};
  results.forEach(result => {
    Object.entries(result.categories).forEach(([category, tags]) => {
      if (tags.length > 0) {
        categoryDistribution[category] = (categoryDistribution[category] || 0) + 1;
      }
    });
  });

  return {
    totalProducts,
    averageTagsPerProduct,
    averageConfidence,
    mostCommonTags,
    categoryDistribution
  };
}


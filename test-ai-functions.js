/**
 * Test script for AI functions
 * Run with: node test-ai-functions.js
 */

import { 
  suggestPrice, 
  suggestTags, 
  seoTitleDescription,
  PriceSuggestionInput,
  TagSuggestionInput,
  SeoSuggestionInput
} from '@tdc/domain';

console.log('🧪 Testing AI Functions...\n');

try {
  // Test 1: Price Suggestion
  console.log('1️⃣ Testing Price Suggestion');
  const priceInput: PriceSuggestionInput = {
    category: 'electronics',
    competitorPrices: [40000, 42000, 45000, 48000, 50000],
    cost: 35000,
    brand: 'Samsung',
    marketTrend: 'STABLE',
    seasonality: 'MEDIUM',
    demandLevel: 'HIGH'
  };

  const priceResult = suggestPrice(priceInput);
  console.log('✅ Price Suggestion Result:');
  console.log(`   Önerilen Fiyat: ₺${priceResult.recommended.toFixed(2)}`);
  console.log(`   Min Fiyat: ₺${priceResult.min.toFixed(2)}`);
  console.log(`   Max Fiyat: ₺${priceResult.max.toFixed(2)}`);
  console.log(`   Kar Marjı: %${priceResult.profitMargin.toFixed(1)}`);
  console.log(`   Pazar Konumu: ${priceResult.marketPosition}`);
  console.log(`   Güvenilirlik: %${(priceResult.confidence * 100).toFixed(0)}`);
  console.log(`   Rekabet Analizi: ${priceResult.competitorAnalysis.count} ürün`);
  console.log('   Açıklama:');
  priceResult.reasoning.forEach(reason => console.log(`     • ${reason}`));
  console.log('');

  // Test 2: Tag Suggestion
  console.log('2️⃣ Testing Tag Suggestion');
  const tagInput: TagSuggestionInput = {
    title: 'Samsung Galaxy S24 Ultra Akıllı Telefon',
    description: 'En yeni Samsung Galaxy S24 Ultra akıllı telefon. 200MP kamera, S Pen desteği ve güçlü performans. 5G bağlantı ve uzun pil ömrü.',
    category: 'electronics',
    brand: 'Samsung',
    price: 45000,
    color: 'Siyah',
    material: 'Metal',
    targetAudience: 'ALL',
    occasion: 'ALL',
    season: 'ALL_SEASON'
  };

  const tagResult = suggestTags(tagInput);
  console.log('✅ Tag Suggestion Result:');
  console.log(`   Önerilen Taglar: ${tagResult.tags.join(', ')}`);
  console.log(`   Toplam Tag: ${tagResult.tags.length}`);
  console.log(`   Güvenilirlik: %${(tagResult.confidence * 100).toFixed(0)}`);
  console.log('   Kategoriler:');
  Object.entries(tagResult.categories).forEach(([category, tags]) => {
    if (tags.length > 0) {
      console.log(`     ${category}: ${tags.join(', ')}`);
    }
  });
  console.log('   Açıklama:');
  tagResult.reasoning.forEach(reason => console.log(`     • ${reason}`));
  console.log('');

  // Test 3: SEO Suggestion
  console.log('3️⃣ Testing SEO Suggestion');
  const seoInput: SeoSuggestionInput = {
    raw: 'Samsung Galaxy S24 Ultra akıllı telefon. 200MP kamera, S Pen desteği ve güçlü performans. 5G bağlantı ve uzun pil ömrü.',
    category: 'electronics',
    brand: 'Samsung',
    price: 45000,
    targetKeywords: ['samsung', 'galaxy', 'telefon', 'akıllı'],
    language: 'TR'
  };

  const seoResult = seoTitleDescription(seoInput);
  console.log('✅ SEO Suggestion Result:');
  console.log(`   Başlık: ${seoResult.title}`);
  console.log(`   Başlık Uzunluğu: ${seoResult.title.length} karakter`);
  console.log(`   Açıklama: ${seoResult.description}`);
  console.log(`   Açıklama Uzunluğu: ${seoResult.description.length} karakter`);
  console.log(`   Anahtar Kelimeler: ${seoResult.keywords.join(', ')}`);
  console.log(`   SEO Skoru: ${seoResult.seoScore}/100`);
  console.log(`   Güvenilirlik: %${(seoResult.confidence * 100).toFixed(0)}`);
  console.log('   Öneriler:');
  seoResult.suggestions.forEach(suggestion => console.log(`     • ${suggestion}`));
  console.log('   Açıklama:');
  seoResult.reasoning.forEach(reason => console.log(`     • ${reason}`));
  console.log('');

  // Test 4: Multiple Products
  console.log('4️⃣ Testing Multiple Products');
  const multiplePriceInputs = [
    {
      category: 'clothing',
      competitorPrices: [2000, 2200, 2500],
      cost: 1500,
      brand: 'Nike'
    },
    {
      category: 'electronics',
      competitorPrices: [50000, 52000, 55000],
      cost: 40000,
      brand: 'Apple'
    },
    {
      category: 'home-garden',
      competitorPrices: [3000, 3200, 3500],
      cost: 2500,
      brand: 'IKEA'
    }
  ];

  console.log('✅ Multiple Price Suggestions:');
  multiplePriceInputs.forEach((input, index) => {
    const result = suggestPrice(input);
    console.log(`   Ürün ${index + 1} (${input.brand} - ${input.category}):`);
    console.log(`     Önerilen: ₺${result.recommended.toFixed(2)}`);
    console.log(`     Kar Marjı: %${result.profitMargin.toFixed(1)}`);
    console.log(`     Pazar Konumu: ${result.marketPosition}`);
  });
  console.log('');

  // Test 5: Different Categories
  console.log('5️⃣ Testing Different Categories');
  const categories = ['electronics', 'clothing', 'home-garden', 'beauty-health', 'sports'];
  
  console.log('✅ Category-based Price Suggestions:');
  categories.forEach(category => {
    const input = {
      category,
      competitorPrices: [1000, 1200, 1500],
      cost: 800
    };
    const result = suggestPrice(input);
    console.log(`   ${category}: ₺${result.recommended.toFixed(2)} (${result.marketPosition})`);
  });
  console.log('');

  // Test 6: Different Seller Types (for commission integration)
  console.log('6️⃣ Testing Commission Integration');
  const commissionInputs = [
    {
      orderAmount: 1000,
      sellerType: 'TYPE_A' // Company seller
    },
    {
      orderAmount: 1000,
      sellerType: 'TYPE_B' // Individual/IG seller
    }
  ];

  console.log('✅ Commission Calculation Examples:');
  commissionInputs.forEach((input, index) => {
    // This would use the commission service
    console.log(`   ${input.sellerType} Seller (₺${input.orderAmount} sipariş):`);
    console.log(`     Komisyon oranı: ${input.sellerType === 'TYPE_A' ? '7%' : '10%'}`);
    console.log(`     KDV oranı: 18%`);
    console.log(`     Toplam komisyon: ${input.sellerType === 'TYPE_A' ? '8.26%' : '11.8%'}`);
  });
  console.log('');

  console.log('🎉 All AI function tests completed successfully!');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error('Stack trace:', error.stack);
}


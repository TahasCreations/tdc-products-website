'use client';

import React, { useState } from 'react';
import { 
  suggestPrice, 
  suggestTags, 
  seoTitleDescription,
  PriceSuggestionInput,
  TagSuggestionInput,
  SeoSuggestionInput,
  PriceSuggestionResult,
  TagSuggestionResult,
  SeoSuggestionResult
} from '@tdc/domain';

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  brand?: string;
  price?: number;
  cost?: number;
  color?: string;
  size?: string;
  material?: string;
  targetAudience?: 'MEN' | 'WOMEN' | 'CHILDREN' | 'UNISEX' | 'ALL';
  occasion?: 'CASUAL' | 'FORMAL' | 'SPORTS' | 'PARTY' | 'WORK' | 'HOME';
  season?: 'SPRING' | 'SUMMER' | 'AUTUMN' | 'WINTER' | 'ALL_SEASON';
}

interface AiSuggestionButtonsProps {
  product: Product;
  onPriceUpdate?: (price: number) => void;
  onTagsUpdate?: (tags: string[]) => void;
  onSeoUpdate?: (title: string, description: string) => void;
  competitorPrices?: number[];
}

export default function AiSuggestionButtons({
  product,
  onPriceUpdate,
  onTagsUpdate,
  onSeoUpdate,
  competitorPrices = []
}: AiSuggestionButtonsProps) {
  const [loading, setLoading] = useState<{
    price: boolean;
    tags: boolean;
    seo: boolean;
  }>({
    price: false,
    tags: false,
    seo: false
  });

  const [results, setResults] = useState<{
    price?: PriceSuggestionResult;
    tags?: TagSuggestionResult;
    seo?: SeoSuggestionResult;
  }>({});

  const [showResults, setShowResults] = useState<{
    price: boolean;
    tags: boolean;
    seo: boolean;
  }>({
    price: false,
    tags: false,
    seo: false
  });

  const handlePriceSuggestion = async () => {
    if (!product.cost) {
      alert('Ürün maliyeti gerekli');
      return;
    }

    setLoading(prev => ({ ...prev, price: true }));

    try {
      const input: PriceSuggestionInput = {
        category: product.category,
        competitorPrices: competitorPrices.length > 0 ? competitorPrices : [product.price || product.cost * 1.5],
        cost: product.cost,
        brand: product.brand,
        marketTrend: 'STABLE',
        seasonality: 'MEDIUM',
        demandLevel: 'MEDIUM'
      };

      const result = suggestPrice(input);
      setResults(prev => ({ ...prev, price: result }));
      setShowResults(prev => ({ ...prev, price: true }));
    } catch (error) {
      console.error('Price suggestion error:', error);
      alert('Fiyat önerisi alınırken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, price: false }));
    }
  };

  const handleTagSuggestion = async () => {
    setLoading(prev => ({ ...prev, tags: true }));

    try {
      const input: TagSuggestionInput = {
        title: product.title,
        description: product.description,
        category: product.category,
        brand: product.brand,
        price: product.price,
        color: product.color,
        size: product.size,
        material: product.material,
        targetAudience: product.targetAudience,
        occasion: product.occasion,
        season: product.season
      };

      const result = suggestTags(input);
      setResults(prev => ({ ...prev, tags: result }));
      setShowResults(prev => ({ ...prev, tags: true }));
    } catch (error) {
      console.error('Tag suggestion error:', error);
      alert('Tag önerisi alınırken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, tags: false }));
    }
  };

  const handleSeoSuggestion = async () => {
    setLoading(prev => ({ ...prev, seo: true }));

    try {
      const input: SeoSuggestionInput = {
        raw: product.description || product.title,
        category: product.category,
        brand: product.brand,
        price: product.price,
        language: 'TR'
      };

      const result = seoTitleDescription(input);
      setResults(prev => ({ ...prev, seo: result }));
      setShowResults(prev => ({ ...prev, seo: true }));
    } catch (error) {
      console.error('SEO suggestion error:', error);
      alert('SEO önerisi alınırken hata oluştu');
    } finally {
      setLoading(prev => ({ ...prev, seo: false }));
    }
  };

  const applyPriceSuggestion = () => {
    if (results.price && onPriceUpdate) {
      onPriceUpdate(results.price.recommended);
      setShowResults(prev => ({ ...prev, price: false }));
    }
  };

  const applyTagSuggestion = () => {
    if (results.tags && onTagsUpdate) {
      onTagsUpdate(results.tags.tags);
      setShowResults(prev => ({ ...prev, tags: false }));
    }
  };

  const applySeoSuggestion = () => {
    if (results.seo && onSeoUpdate) {
      onSeoUpdate(results.seo.title, results.seo.description);
      setShowResults(prev => ({ ...prev, seo: false }));
    }
  };

  return (
    <div className="space-y-4">
      {/* AI Suggestion Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handlePriceSuggestion}
          disabled={loading.price || !product.cost}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading.price ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          )}
          Fiyat Öner
        </button>

        <button
          onClick={handleTagSuggestion}
          disabled={loading.tags}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading.tags ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          )}
          Tag Öner
        </button>

        <button
          onClick={handleSeoSuggestion}
          disabled={loading.seo}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading.seo ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
          SEO Öner
        </button>
      </div>

      {/* Price Suggestion Results */}
      {showResults.price && results.price && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-blue-900">Fiyat Önerisi</h3>
            <button
              onClick={() => setShowResults(prev => ({ ...prev, price: false }))}
              className="text-blue-600 hover:text-blue-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">₺{results.price.min.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Minimum</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">₺{results.price.recommended.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Önerilen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">₺{results.price.max.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Maksimum</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="font-medium">Kar Marjı:</span> %{results.price.profitMargin.toFixed(1)}
            </div>
            <div>
              <span className="font-medium">Pazar Konumu:</span> {results.price.marketPosition}
            </div>
            <div>
              <span className="font-medium">Güvenilirlik:</span> %{(results.price.confidence * 100).toFixed(0)}
            </div>
            <div>
              <span className="font-medium">Rekabet Analizi:</span> {results.price.competitorAnalysis.count} ürün
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-blue-900 mb-2">Açıklama:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {results.price.reasoning.map((reason, index) => (
                <li key={index}>• {reason}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={applyPriceSuggestion}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Önerilen Fiyatı Uygula
          </button>
        </div>
      )}

      {/* Tag Suggestion Results */}
      {showResults.tags && results.tags && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-green-900">Tag Önerisi</h3>
            <button
              onClick={() => setShowResults(prev => ({ ...prev, tags: false }))}
              className="text-green-600 hover:text-green-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-green-900 mb-2">Önerilen Taglar:</h4>
            <div className="flex flex-wrap gap-2">
              {results.tags.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="font-medium">Toplam Tag:</span> {results.tags.tags.length}
            </div>
            <div>
              <span className="font-medium">Güvenilirlik:</span> %{(results.tags.confidence * 100).toFixed(0)}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-green-900 mb-2">Açıklama:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {results.tags.reasoning.map((reason, index) => (
                <li key={index}>• {reason}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={applyTagSuggestion}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            Önerilen Tagları Uygula
          </button>
        </div>
      )}

      {/* SEO Suggestion Results */}
      {showResults.seo && results.seo && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-purple-900">SEO Önerisi</h3>
            <button
              onClick={() => setShowResults(prev => ({ ...prev, seo: false }))}
              className="text-purple-600 hover:text-purple-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-purple-900 mb-2">Önerilen Başlık:</h4>
            <div className="bg-white border border-purple-200 rounded p-3 text-sm">
              {results.seo.title}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {results.seo.title.length} karakter
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-purple-900 mb-2">Önerilen Açıklama:</h4>
            <div className="bg-white border border-purple-200 rounded p-3 text-sm">
              {results.seo.description}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {results.seo.description.length} karakter
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="font-medium">SEO Skoru:</span> {results.seo.seoScore}/100
            </div>
            <div>
              <span className="font-medium">Güvenilirlik:</span> %{(results.seo.confidence * 100).toFixed(0)}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-purple-900 mb-2">Anahtar Kelimeler:</h4>
            <div className="flex flex-wrap gap-2">
              {results.seo.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-purple-900 mb-2">Öneriler:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              {results.seo.suggestions.map((suggestion, index) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={applySeoSuggestion}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
          >
            Önerilen SEO'yu Uygula
          </button>
        </div>
      )}
    </div>
  );
}


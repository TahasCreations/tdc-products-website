"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  ExternalLink,
  Copy,
  Save
} from 'lucide-react';

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

interface SEOOptimizerProps {
  data?: SEOData;
  onChange?: (data: SEOData) => void;
}

export const SEOOptimizer: React.FC<SEOOptimizerProps> = ({
  data = {
    title: '',
    description: '',
    keywords: [],
    ogImage: '',
    canonicalUrl: ''
  },
  onChange
}) => {
  const [seoData, setSeoData] = useState<SEOData>(data);
  const [currentKeyword, setCurrentKeyword] = useState('');

  const addKeyword = () => {
    if (currentKeyword.trim()) {
      const updated = {
        ...seoData,
        keywords: [...seoData.keywords, currentKeyword.trim()]
      };
      setSeoData(updated);
      onChange?.(updated);
      setCurrentKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    const updated = {
      ...seoData,
      keywords: seoData.keywords.filter((_, i) => i !== index)
    };
    setSeoData(updated);
    onChange?.(updated);
  };

  const updateField = (field: keyof SEOData, value: any) => {
    const updated = { ...seoData, [field]: value };
    setSeoData(updated);
    onChange?.(updated);
  };

  // SEO Score Calculation
  const calculateScore = () => {
    let score = 0;
    if (seoData.title && seoData.title.length > 0) score += 20;
    if (seoData.title && seoData.title.length <= 60) score += 10;
    if (seoData.description && seoData.description.length > 0) score += 20;
    if (seoData.description && seoData.description.length >= 120 && seoData.description.length <= 160) score += 10;
    if (seoData.keywords.length > 0) score += 20;
    if (seoData.ogImage) score += 10;
    if (seoData.canonicalUrl) score += 10;
    return score;
  };

  const score = calculateScore();

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <Search className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">SEO Optimizer</h3>
          <p className="text-xs text-gray-600">Arama motoru optimizasyonu</p>
        </div>
      </div>

      {/* SEO Score */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-gray-700">SEO Skoru</div>
          <div className={`text-2xl font-bold ${getScoreColor()}`}>{score}</div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              score >= 80 ? 'bg-green-600' : score >= 60 ? 'bg-yellow-600' : 'bg-red-600'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Meta Title {seoData.title && (
            <span className={`ml-2 ${seoData.title.length <= 60 ? 'text-green-600' : 'text-red-600'}`}>
              ({seoData.title.length}/60)
            </span>
          )}
        </label>
        <input
          type="text"
          value={seoData.title}
          onChange={(e) => updateField('title', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Sayfa başlığı..."
        />
        {seoData.title.length > 60 && (
          <div className="mt-1 text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Başlık çok uzun! 60 karakterden kısa olmalı.
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Meta Description {seoData.description && (
            <span className={`ml-2 ${
              seoData.description.length >= 120 && seoData.description.length <= 160
                ? 'text-green-600'
                : 'text-yellow-600'
            }`}>
              ({seoData.description.length}/160)
            </span>
          )}
        </label>
        <textarea
          value={seoData.description}
          onChange={(e) => updateField('description', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Sayfa açıklaması..."
        />
        {seoData.description.length < 120 && seoData.description.length > 0 && (
          <div className="mt-1 text-xs text-yellow-600 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" />
            Açıklama 120-160 karakter arasında olmalı.
          </div>
        )}
      </div>

      {/* Keywords */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Keywords
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={currentKeyword}
            onChange={(e) => setCurrentKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Anahtar kelime ekle..."
          />
          <button
            onClick={addKeyword}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Ekle
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {seoData.keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1"
            >
              {keyword}
              <button
                onClick={() => removeKeyword(index)}
                className="hover:text-blue-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* OG Image */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Open Graph Image
        </label>
        <input
          type="text"
          value={seoData.ogImage}
          onChange={(e) => updateField('ogImage', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://..."
        />
      </div>

      {/* Canonical URL */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Canonical URL
        </label>
        <input
          type="text"
          value={seoData.canonicalUrl}
          onChange={(e) => updateField('canonicalUrl', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://..."
        />
      </div>

      {/* SEO Tips */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-yellow-600" />
          <span className="text-xs font-semibold text-gray-700">SEO İpuçları</span>
        </div>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Başlık 60 karakterden kısa olmalı</li>
          <li>• Açıklama 120-160 karakter arasında olmalı</li>
          <li>• En az 3-5 anahtar kelime ekleyin</li>
          <li>• OG görsel ekleyin (1200x630px)</li>
        </ul>
      </div>
    </div>
  );
};


"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Type,
  X,
  Check,
  Search,
  TrendingUp,
  Star,
  Download
} from 'lucide-react';

interface Font {
  family: string;
  category: string;
  variants: string[];
  popularity: number;
}

interface TypographyManagerProps {
  value?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string;
  };
  onChange?: (typography: any) => void;
}

const POPULAR_FONTS = [
  { family: 'Inter', category: 'sans-serif', popular: true },
  { family: 'Roboto', category: 'sans-serif', popular: true },
  { family: 'Open Sans', category: 'sans-serif', popular: true },
  { family: 'Lato', category: 'sans-serif', popular: true },
  { family: 'Montserrat', category: 'sans-serif', popular: true },
  { family: 'Poppins', category: 'sans-serif', popular: true },
  { family: 'Playfair Display', category: 'serif', popular: true },
  { family: 'Merriweather', category: 'serif', popular: true },
  { family: 'Source Code Pro', category: 'monospace', popular: true },
  { family: 'Fira Code', category: 'monospace', popular: true },
];

const FONT_WEIGHTS = [
  { value: '100', label: 'Thin' },
  { value: '200', label: 'Extra Light' },
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
  { value: '900', label: 'Black' },
];

const PRESET_SIZES = [
  { label: 'XS', value: '0.75rem' },
  { label: 'SM', value: '0.875rem' },
  { label: 'Base', value: '1rem' },
  { label: 'LG', value: '1.125rem' },
  { label: 'XL', value: '1.25rem' },
  { label: '2XL', value: '1.5rem' },
  { label: '3XL', value: '1.875rem' },
  { label: '4XL', value: '2.25rem' },
  { label: '5XL', value: '3rem' },
];

export const TypographyManager: React.FC<TypographyManagerProps> = ({
  value = {},
  onChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPicker, setShowPicker] = useState(false);

  const currentFont = value.fontFamily || 'Inter';
  const categories = ['all', 'sans-serif', 'serif', 'monospace', 'display'];

  const filteredFonts = POPULAR_FONTS.filter(font => {
    const matchesSearch = font.family.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || font.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFontSelect = (fontFamily: string) => {
    onChange?.({ ...value, fontFamily });
  };

  const handlePresetSelect = (preset: { label: string; value: string }) => {
    onChange?.({ ...value, fontSize: preset.value });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Type className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Typography</h3>
          <p className="text-xs text-gray-600">Font ve stil ayarları</p>
        </div>
      </div>

      {/* Current Selection */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-sm font-semibold text-gray-700 mb-1">Seçili Font</div>
        <div className="text-2xl font-bold" style={{ fontFamily: currentFont }}>
          {currentFont}
        </div>
        <div className="text-xs text-gray-500 mt-1">{value.fontSize || '1rem'} • {value.fontWeight || '400'}</div>
      </div>

      {/* Font Family Picker */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Font Family
        </label>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors text-left flex items-center justify-between"
        >
          <span className="font-medium" style={{ fontFamily: currentFont }}>
            {currentFont}
          </span>
          <Type className="w-4 h-4 text-gray-500" />
        </button>

        {/* Font Picker Modal */}
        <AnimatePresence>
          {showPicker && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowPicker(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-4 max-h-96"
              >
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Font ara..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Categories */}
                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat === 'all' ? 'Tümü' : cat}
                    </button>
                  ))}
                </div>

                {/* Fonts List */}
                <div className="overflow-y-auto max-h-64">
                  {filteredFonts.map((font) => (
                    <button
                      key={font.family}
                      onClick={() => {
                        handleFontSelect(font.family);
                        setShowPicker(false);
                      }}
                      className="w-full p-3 hover:bg-gray-50 rounded-lg transition-colors text-left flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-semibold text-gray-900" style={{ fontFamily: font.family }}>
                          {font.family}
                        </div>
                        <div className="text-xs text-gray-500">{font.category}</div>
                      </div>
                      {font.popular && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Font Size Presets */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Font Size Presets
        </label>
        <div className="grid grid-cols-3 gap-2">
          {PRESET_SIZES.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetSelect(preset)}
              className={`p-2 border rounded-lg text-xs font-medium transition-colors ${
                value.fontSize === preset.value
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Settings */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Font Weight
          </label>
          <select
            value={value.fontWeight || '400'}
            onChange={(e) => onChange?.({ ...value, fontWeight: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {FONT_WEIGHTS.map((weight) => (
              <option key={weight.value} value={weight.value}>
                {weight.label} ({weight.value})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Custom Size
          </label>
          <input
            type="text"
            value={value.fontSize || ''}
            onChange={(e) => onChange?.({ ...value, fontSize: e.target.value })}
            placeholder="1rem"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Line Height
          </label>
          <input
            type="text"
            value={value.lineHeight || ''}
            onChange={(e) => onChange?.({ ...value, lineHeight: e.target.value })}
            placeholder="1.5"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Letter Spacing
          </label>
          <input
            type="text"
            value={value.letterSpacing || ''}
            onChange={(e) => onChange?.({ ...value, letterSpacing: e.target.value })}
            placeholder="0px"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};


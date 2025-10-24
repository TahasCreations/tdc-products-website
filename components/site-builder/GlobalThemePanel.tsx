"use client";

import React from 'react';
import { Palette, Type, Box } from 'lucide-react';
import { useEditorStore } from '@/lib/site-builder/store';

const COLOR_PALETTES = {
  modern: {
    name: 'Modern',
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    background: '#ffffff',
    text: '#1f2937',
  },
  warm: {
    name: 'Warm',
    primary: '#f97316',
    secondary: '#ef4444',
    accent: '#fbbf24',
    background: '#fef3c7',
    text: '#78350f',
  },
  cool: {
    name: 'Cool',
    primary: '#0ea5e9',
    secondary: '#06b6d4',
    accent: '#10b981',
    background: '#f0fdfa',
    text: '#134e4a',
  },
  dark: {
    name: 'Dark',
    primary: '#a78bfa',
    secondary: '#c084fc',
    accent: '#fbbf24',
    background: '#111827',
    text: '#f9fafb',
  },
  elegant: {
    name: 'Elegant',
    primary: '#1f2937',
    secondary: '#4b5563',
    accent: '#d97706',
    background: '#f9fafb',
    text: '#111827',
  },
};

const FONT_PAIRS = [
  { name: 'Modern Sans', heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
  { name: 'Classic Serif', heading: "'Playfair Display', serif", body: "'Georgia', serif" },
  { name: 'Tech', heading: "'Roboto', sans-serif", body: "'Roboto', sans-serif" },
  { name: 'Elegant', heading: "'Montserrat', sans-serif", body: "'Open Sans', sans-serif" },
  { name: 'Creative', heading: "'Poppins', sans-serif", body: "'Nunito', sans-serif" },
];

export const GlobalThemePanel: React.FC = () => {
  const { currentPage, updatePage } = useEditorStore();

  if (!currentPage) return null;

  const settings = currentPage.settings || {};

  const applyColorPalette = (palette: typeof COLOR_PALETTES.modern) => {
    updatePage({
      settings: {
        ...settings,
        primaryColor: palette.primary,
        secondaryColor: palette.secondary,
        accentColor: palette.accent,
        backgroundColor: palette.background,
        textColor: palette.text,
      },
    });
  };

  const applyFontPair = (fonts: typeof FONT_PAIRS[0]) => {
    updatePage({
      settings: {
        ...settings,
        headingFont: fonts.heading,
        bodyFont: fonts.body,
      },
    });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Global Theme
        </h3>
        <p className="text-xs text-gray-600 mt-1">Site geneli stil ayarları</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Color Palettes */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Renk Paletleri
          </h4>
          <div className="space-y-2">
            {Object.entries(COLOR_PALETTES).map(([key, palette]) => (
              <button
                key={key}
                onClick={() => applyColorPalette(palette)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition-all text-left group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{palette.name}</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: palette.primary }}></div>
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: palette.secondary }}></div>
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: palette.accent }}></div>
                  <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: palette.background }}></div>
                  <div className="w-8 h-8 rounded" style={{ backgroundColor: palette.text }}></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Font Pairs */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Type className="w-4 h-4" />
            Font Çiftleri
          </h4>
          <div className="space-y-2">
            {FONT_PAIRS.map((fonts) => (
              <button
                key={fonts.name}
                onClick={() => applyFontPair(fonts)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition-all text-left"
              >
                <div className="font-semibold text-gray-900 mb-1" style={{ fontFamily: fonts.heading }}>
                  {fonts.name}
                </div>
                <div className="text-sm text-gray-600" style={{ fontFamily: fonts.body }}>
                  Heading: {fonts.heading.split(',')[0].replace(/'/g, '')}
                </div>
                <div className="text-sm text-gray-600" style={{ fontFamily: fonts.body }}>
                  Body: {fonts.body.split(',')[0].replace(/'/g, '')}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Layout Settings */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Box className="w-4 h-4" />
            Layout
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Width</label>
              <select
                value={settings.maxWidth || '1200px'}
                onChange={(e) => updatePage({ settings: { ...settings, maxWidth: e.target.value } })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="100%">Full Width</option>
                <option value="1400px">1400px (XL)</option>
                <option value="1200px">1200px (Large)</option>
                <option value="1024px">1024px (Medium)</option>
                <option value="768px">768px (Small)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Layout Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updatePage({ settings: { ...settings, layout: 'full-width' } })}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    settings.layout === 'full-width'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                  }`}
                >
                  Full Width
                </button>
                <button
                  onClick={() => updatePage({ settings: { ...settings, layout: 'boxed' } })}
                  className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                    settings.layout === 'boxed'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                  }`}
                >
                  Boxed
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


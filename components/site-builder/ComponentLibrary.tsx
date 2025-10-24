"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Layout,
  Box,
  Grid,
  Type,
  Image,
  Video,
  MousePointerClick,
  Link as LinkIcon,
  LayoutGrid,
  Sparkles,
  AlignVerticalSpaceAround,
  Layers,
  Square
} from 'lucide-react';
import { ComponentType } from '@/lib/site-builder/types';
import { useEditorStore } from '@/lib/site-builder/store';
import { createDefaultComponent } from '@/lib/site-builder/utils';

interface ComponentDef {
  type: ComponentType;
  name: string;
  icon: React.ReactNode;
  category: 'layout' | 'content' | 'media' | 'interactive' | 'advanced';
  description: string;
}

const components: ComponentDef[] = [
  // Layout
  { type: 'section', name: 'Section', icon: <Layout />, category: 'layout', description: 'Tam genişlik bölüm' },
  { type: 'container', name: 'Container', icon: <Box />, category: 'layout', description: 'Merkezi konteyner' },
  { type: 'grid', name: 'Grid', icon: <Grid />, category: 'layout', description: 'Grid layout' },
  { type: 'flex', name: 'Flex', icon: <Layers />, category: 'layout', description: 'Flex layout' },
  { type: 'spacer', name: 'Spacer', icon: <AlignVerticalSpaceAround />, category: 'layout', description: 'Boşluk' },
  
  // Content
  { type: 'heading', name: 'Başlık', icon: <Type />, category: 'content', description: 'Heading (H1-H6)' },
  { type: 'text', name: 'Metin', icon: <Type />, category: 'content', description: 'Paragraf metni' },
  
  // Media
  { type: 'image', name: 'Görsel', icon: <Image />, category: 'media', description: 'Tek görsel' },
  { type: 'video', name: 'Video', icon: <Video />, category: 'media', description: 'Video player' },
  { type: 'gallery', name: 'Galeri', icon: <LayoutGrid />, category: 'media', description: 'Görsel galerisi' },
  
  // Interactive
  { type: 'button', name: 'Buton', icon: <MousePointerClick />, category: 'interactive', description: 'CTA butonu' },
  { type: 'link', name: 'Link', icon: <LinkIcon />, category: 'interactive', description: 'Bağlantı' },
  
  // Advanced
  { type: 'hero', name: 'Hero', icon: <Sparkles />, category: 'advanced', description: 'Hero section' },
  { type: 'carousel', name: 'Carousel', icon: <Square />, category: 'advanced', description: 'Slider' },
];

const categories = [
  { key: 'layout', name: 'Layout', icon: <Layout className="w-4 h-4" /> },
  { key: 'content', name: 'İçerik', icon: <Type className="w-4 h-4" /> },
  { key: 'media', name: 'Medya', icon: <Image className="w-4 h-4" /> },
  { key: 'interactive', name: 'Etkileşimli', icon: <MousePointerClick className="w-4 h-4" /> },
  { key: 'advanced', name: 'Gelişmiş', icon: <Sparkles className="w-4 h-4" /> },
];

export const ComponentLibrary: React.FC = () => {
  const [activeCategory, setActiveCategory] = React.useState<string>('layout');
  const addComponent = useEditorStore(state => state.addComponent);

  const handleAddComponent = (type: ComponentType) => {
    const defaultProps = createDefaultComponent(type);
    addComponent(defaultProps as any);
  };

  const filteredComponents = components.filter(c => c.category === activeCategory);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Component Library
        </h3>
        <p className="text-xs text-gray-600 mt-1">Sürükle & bırak ile ekle</p>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.key
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Components Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredComponents.map((comp) => (
            <motion.button
              key={comp.type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAddComponent(comp.type)}
              className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center text-gray-600 group-hover:text-blue-600 transition-colors">
                  {comp.icon}
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold text-gray-900">{comp.name}</div>
                  <div className="text-xs text-gray-500">{comp.description}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm">
          📦 Şablonlardan Seç
        </button>
      </div>
    </div>
  );
};


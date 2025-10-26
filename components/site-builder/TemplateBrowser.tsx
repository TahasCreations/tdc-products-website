"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout,
  Sparkles,
  ShoppingCart,
  FileText,
  Mail,
  Info,
  HelpCircle,
  Globe,
  Grid,
  X,
  Search,
  Star,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Template } from '@/lib/site-builder/types';
import { ADVANCED_TEMPLATES } from '@/lib/site-builder/advanced-templates';
import { useEditorStore } from '@/lib/site-builder/store';

interface TemplateBrowserProps {
  onClose?: () => void;
  onSelect?: (template: Template) => void;
}

export const TemplateBrowser: React.FC<TemplateBrowserProps> = ({ onClose, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { loadPage } = useEditorStore();

  const categories = [
    { key: 'all', name: 'Tümü', icon: <Grid className="w-4 h-4" /> },
    { key: 'landing', name: 'Landing', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'ecommerce', name: 'E-Ticaret', icon: <ShoppingCart className="w-4 h-4" /> },
    { key: 'content', name: 'İçerik', icon: <FileText className="w-4 h-4" /> },
    { key: 'contact', name: 'İletişim', icon: <Mail className="w-4 h-4" /> },
    { key: 'about', name: 'Hakkımızda', icon: <Info className="w-4 h-4" /> },
    { key: 'help', name: 'Yardım', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const filteredTemplates = ADVANCED_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (template: Template) => {
    // Template'i sayfa formatına dönüştür
    const page = {
      id: `page_${Date.now()}`,
      name: template.name,
      slug: template.name.toLowerCase().replace(/\s+/g, '-'),
      components: template.components,
      rootComponentIds: template.rootComponentIds,
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    loadPage(page);
    
    if (onSelect) {
      onSelect(template);
    }
    
    if (onClose) {
      onClose();
    }
  };

  const getTemplateIcon = (category?: string) => {
    switch (category) {
      case 'ecommerce': return <ShoppingCart className="w-5 h-5" />;
      case 'content': return <FileText className="w-5 h-5" />;
      case 'landing': return <Sparkles className="w-5 h-5" />;
      case 'contact': return <Mail className="w-5 h-5" />;
      case 'about': return <Info className="w-5 h-5" />;
      case 'help': return <HelpCircle className="w-5 h-5" />;
      default: return <Layout className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Sayfa Şablonları</h2>
                <p className="text-sm text-gray-600">Profesyonel sayfalar için hazır şablonlar</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Şablon ara..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 bg-gray-50 px-6">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                selectedCategory === cat.key
                  ? 'text-blue-600 border-blue-600 bg-white'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Şablon Bulunamadı</h3>
              <p className="text-gray-600">Farklı bir arama deneyin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelectTemplate(template)}
                  className="group cursor-pointer bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all"
                >
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {getTemplateIcon(template.category)}
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-2xl font-bold mb-2">Kullan</div>
                        <div className="text-sm opacity-90">Tıklayarak seç</div>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-gray-900 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        Popüler
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{template.name}</h3>
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {Object.keys(template.components).length} component
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description || 'Profesyonel sayfa şablonu'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Kurulum: 30 saniye</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{filteredTemplates.length}</span> şablon bulundu
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>Daha fazla şablon yakında gelecek</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


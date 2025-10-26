"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layout,
  Plus,
  FileText,
  Folder,
  Settings,
  X,
  Search,
  Globe,
  Eye,
  ChevronRight,
  ChevronDown,
  Zap,
  Palette,
  Image as ImageIcon,
  Type,
  Container,
  Code,
  Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TemplateBrowser } from './TemplateBrowser';

interface Page {
  id: string;
  name: string;
  slug: string;
  status: 'draft' | 'published';
  type: 'builder' | 'existing';
  category?: string;
}

interface SiteEditorSidebarProps {
  onClose?: () => void;
  onPageSelect?: (pageId: string) => void;
  currentPageId?: string;
}

export const SiteEditorSidebar: React.FC<SiteEditorSidebarProps> = ({
  onClose,
  onPageSelect,
  currentPageId
}) => {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplateBrowser, setShowTemplateBrowser] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    builder: true,
    existing: true,
    components: false
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      
      // Builder sayfaları
      const builderResponse = await fetch('/api/site-builder/pages');
      const builderData = await builderResponse.json();
      const builderPages = (builderData.pages || []).map((p: any) => ({
        ...p,
        type: 'builder' as const
      }));

      // Mevcut sayfalar
      const existingResponse = await fetch('/api/site-builder/pages/scan');
      const existingData = await existingResponse.json();
      const existingPages = (existingData.pages || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        status: 'published' as const,
        type: 'existing' as const,
        category: p.category
      }));

      setPages([...builderPages, ...existingPages]);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPages = pages.filter(page =>
    page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const builderPages = filteredPages.filter(p => p.type === 'builder');
  const existingPages = filteredPages.filter(p => p.type === 'existing');

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePageClick = (page: Page) => {
    if (onPageSelect) {
      onPageSelect(page.id);
    } else {
      // Yeni sekmede editörü aç
      window.open(`/admin/site-builder/editor/${page.id}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCreatePage = () => {
    window.open('/admin/site-builder/editor/new', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Template Browser Modal */}
      <AnimatePresence>
        {showTemplateBrowser && (
          <TemplateBrowser
            onClose={() => setShowTemplateBrowser(false)}
            onSelect={() => setShowTemplateBrowser(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ x: -400 }}
        animate={{ x: 0 }}
        exit={{ x: -400 }}
        transition={{ type: 'spring', damping: 25 }}
        className="w-80 h-full bg-white border-r border-gray-200 flex flex-col shadow-xl"
      >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-bold text-gray-900">Site Editor</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white rounded-lg p-2 border border-gray-200">
            <div className="text-gray-500">Toplam</div>
            <div className="font-bold text-gray-900">{pages.length}</div>
          </div>
          <div className="bg-white rounded-lg p-2 border border-gray-200">
            <div className="text-gray-500">Yayında</div>
            <div className="font-bold text-green-600">
              {pages.filter(p => p.status === 'published').length}
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sayfa ara..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {/* Create Page Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreatePage}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all mb-2"
            >
              <Plus className="w-5 h-5" />
              Yeni Sayfa Oluştur
            </motion.button>

            {/* Template Browser Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowTemplateBrowser(true)}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Şablonlardan Seç
            </motion.button>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs font-medium flex flex-col items-center gap-1">
                <ImageIcon className="w-5 h-5 text-gray-600" />
                Medya
              </button>
              <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-xs font-medium flex flex-col items-center gap-1">
                <Settings className="w-5 h-5 text-gray-600" />
                Ayarlar
              </button>
            </div>

            {/* Builder Pages */}
            <div>
              <button
                onClick={() => toggleSection('builder')}
                className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-sm text-gray-900">
                    Builder Sayfaları
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {builderPages.length}
                  </span>
                </div>
                {expandedSections.builder ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {expandedSections.builder && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 space-y-1"
                  >
                    {builderPages.map((page) => (
                      <motion.button
                        key={page.id}
                        whileHover={{ x: 4 }}
                        onClick={() => handlePageClick(page)}
                        className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-left ${
                          currentPageId === page.id
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <FileText className={`w-4 h-4 ${
                          currentPageId === page.id ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium truncate ${
                            currentPageId === page.id ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {page.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            /{page.slug}
                          </div>
                        </div>
                        {page.status === 'published' && (
                          <Globe className="w-3 h-3 text-green-600" />
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Existing Pages */}
            <div>
              <button
                onClick={() => toggleSection('existing')}
                className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-sm text-gray-900">
                    Mevcut Sayfalar
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {existingPages.length}
                  </span>
                </div>
                {expandedSections.existing ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              <AnimatePresence>
                {expandedSections.existing && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-2 space-y-1"
                  >
                    {existingPages.map((page) => (
                      <motion.button
                        key={page.id}
                        whileHover={{ x: 4 }}
                        onClick={() => handlePageClick(page)}
                        className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <Eye className="w-4 h-4 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {page.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            /{page.slug}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="w-3 h-3" />
            <span>Hızlı Editör</span>
          </div>
          <div>Ctrl+S: Kaydet • Ctrl+Z: Geri Al</div>
        </div>
      </div>
    </motion.div>
    </>
  );
};


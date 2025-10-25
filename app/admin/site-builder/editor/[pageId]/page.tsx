"use client";

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { EditorToolbar } from '@/components/site-builder/EditorToolbar';
import { ComponentLibrary } from '@/components/site-builder/ComponentLibrary';
import { EditorCanvas } from '@/components/site-builder/EditorCanvas';
import { PropertiesPanel } from '@/components/site-builder/PropertiesPanel';
import { LayersPanel } from '@/components/site-builder/LayersPanel';
import { KeyboardShortcuts } from '@/components/site-builder/KeyboardShortcuts';
import { useEditorStore } from '@/lib/site-builder/store';

export default function SiteBuilderEditorPage() {
  const params = useParams();
  const pageId = params.pageId as string;
  const { loadPage, showLayers, showComponentLibrary, showProperties } = useEditorStore();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      
      if (pageId === 'new') {
        // Create new page
        const newPage = {
          id: `page_${Date.now()}`,
          name: 'Yeni Sayfa',
          slug: 'yeni-sayfa',
          components: {},
          rootComponentIds: [],
          status: 'draft' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        loadPage(newPage);
      } else {
        // Load existing page
        const response = await fetch(`/api/site-builder/pages/${pageId}`);
        if (response.ok) {
          const data = await response.json();
          loadPage(data.page);
        } else {
          alert('Sayfa yüklenemedi');
        }
      }
    } catch (error) {
      console.error('Error loading page:', error);
      alert('Sayfa yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Sayfa yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Keyboard Shortcuts Handler */}
      <KeyboardShortcuts />

      {/* Toolbar - Daha şık */}
      <EditorToolbar />

      {/* Main Editor Area - Tam genişlik */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Layers Panel */}
        <AnimatePresence>
          {showLayers && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-80 flex-shrink-0 border-r border-gray-700"
            >
              <LayersPanel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Component Library */}
        <AnimatePresence>
          {showComponentLibrary && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-80 flex-shrink-0 border-r border-gray-700"
            >
              <ComponentLibrary />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center: Canvas - Daha geniş */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
          <EditorCanvas />
        </div>

        {/* Right: Properties Panel - Daha geniş */}
        <AnimatePresence>
          {showProperties && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-96 flex-shrink-0 border-l border-gray-700"
            >
              <PropertiesPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Keyboard Shortcuts Help - Modernize */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-6 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl p-5 text-xs text-gray-300 max-w-xs border border-gray-700"
      >
        <p className="font-bold mb-4 text-sm flex items-center gap-2 text-white">
          <span className="text-lg">⌨️</span>
          Klavye Kısayolları
        </p>
        <div className="space-y-2.5">
          {[
            { label: 'Geri Al', keys: 'Ctrl+Z' },
            { label: 'Yinele', keys: 'Ctrl+Y' },
            { label: 'Kaydet', keys: 'Ctrl+S' },
            { label: 'Kopyala', keys: 'Ctrl+C' },
            { label: 'Yapıştır', keys: 'Ctrl+V' },
            { label: 'Sil', keys: 'Delete' },
            { label: 'Çoğalt', keys: 'Ctrl+D' },
          ].map((shortcut) => (
            <div key={shortcut.keys} className="flex items-center justify-between group">
              <span className="text-gray-400 group-hover:text-gray-200 transition-colors">{shortcut.label}</span>
              <kbd className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg font-mono text-xs text-gray-300 group-hover:bg-gray-700 group-hover:border-gray-600 transition-all">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}


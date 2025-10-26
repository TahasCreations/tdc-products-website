"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { SiteEditorSidebar } from '@/components/site-builder/SiteEditorSidebar';
import { EditorToolbar } from '@/components/site-builder/EditorToolbar';
import { EditorCanvas } from '@/components/site-builder/EditorCanvas';
import { PropertiesPanel } from '@/components/site-builder/PropertiesPanel';
import { KeyboardShortcuts } from '@/components/site-builder/KeyboardShortcuts';
import { FloatingThemeButton } from '@/components/site-builder/FloatingThemeButton';
import { useEditorStore } from '@/lib/site-builder/store';
import { PanelLeftOpen, PanelRightOpen, X } from 'lucide-react';

export default function FullSiteEditorPage() {
  const searchParams = useSearchParams();
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  
  const { 
    currentPage, 
    showLayers, 
    showComponentLibrary, 
    showProperties,
    loadPage,
    selectComponent 
  } = useEditorStore();

  // URL'den page parametresini al ve yükle
  useEffect(() => {
    const pageId = searchParams.get('page');
    if (pageId) {
      handlePageSelect(pageId);
    }
  }, [searchParams]);

  const handlePageSelect = async (pageId: string) => {
    try {
      setIsPageLoading(true);
      
      if (pageId === 'new') {
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
        const response = await fetch(`/api/site-builder/pages/${pageId}`);
        if (response.ok) {
          const data = await response.json();
          loadPage(data.page);
        }
      }
    } catch (error) {
      console.error('Error loading page:', error);
    } finally {
      setIsPageLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50 overflow-hidden">
      {/* Keyboard Shortcuts Handler */}
      <KeyboardShortcuts />

      {/* Toolbar */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm z-50">
        <div className="flex items-center gap-3">
          {/* Toggle Left Panel */}
          <button
            onClick={() => setShowLeftPanel(!showLeftPanel)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={showLeftPanel ? "Sol paneli gizle" : "Sol paneli göster"}
          >
            <PanelLeftOpen className={`w-5 h-5 text-gray-600 transition-transform ${showLeftPanel ? '' : 'rotate-180'}`} />
          </button>

          {/* Page Title */}
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-900">
              {currentPage?.name || 'Site Editor'}
            </h1>
            {currentPage?.status === 'published' && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                Yayında
              </span>
            )}
          </div>
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-2">
          <EditorToolbar />
        </div>

        {/* Toggle Right Panel */}
        <button
          onClick={() => setShowRightPanel(!showRightPanel)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title={showRightPanel ? "Sağ paneli gizle" : "Sağ paneli göster"}
        >
          <PanelRightOpen className={`w-5 h-5 text-gray-600 transition-transform ${showRightPanel ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Sayfa Yönetimi */}
        <AnimatePresence>
          {showLeftPanel && (
            <motion.div
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="flex-shrink-0"
            >
              <SiteEditorSidebar
                onPageSelect={handlePageSelect}
                currentPageId={currentPage?.id}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center: Canvas Area - Tam Sayfa Önizleme */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
          {isPageLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Sayfa yükleniyor...</p>
              </div>
            </div>
          ) : (
            <EditorCanvas />
          )}
        </div>

        {/* Right Sidebar - Özellikler */}
        <AnimatePresence>
          {showRightPanel && showProperties && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-96 flex-shrink-0 border-l border-gray-200 bg-white"
            >
              <PropertiesPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Component Library Overlay */}
      <AnimatePresence>
        {showComponentLibrary && (
          <motion.div
            initial={{ y: 400, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Component Library</h3>
              <button
                onClick={() => {/* toggle component library */}}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            {/* Component Library content will be here */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Help */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 text-xs text-gray-700 max-w-xs border border-gray-200"
      >
        <p className="font-bold mb-4 text-sm flex items-center gap-2 text-gray-900">
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
              <span className="text-gray-600 group-hover:text-gray-900 transition-colors">{shortcut.label}</span>
              <kbd className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg font-mono text-xs text-gray-700 group-hover:bg-gray-200 transition-all">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating Theme Button - Sağ Alt Köşe */}
      <FloatingThemeButton />
    </div>
  );
}


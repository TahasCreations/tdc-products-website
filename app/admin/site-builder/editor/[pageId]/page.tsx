"use client";

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
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
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Keyboard Shortcuts Handler */}
      <KeyboardShortcuts />

      {/* Toolbar */}
      <EditorToolbar />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Layers Panel */}
        {showLayers && <LayersPanel />}

        {/* Component Library */}
        {showComponentLibrary && <ComponentLibrary />}

        {/* Center: Canvas */}
        <EditorCanvas />

        {/* Right: Properties Panel */}
        {showProperties && <PropertiesPanel />}
      </div>

      {/* Keyboard Shortcuts Help */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-xl shadow-xl p-4 text-xs text-gray-700 max-w-xs border border-gray-200"
      >
        <p className="font-bold mb-3 text-sm flex items-center gap-2">
          <span>⌨️</span>
          Klavye Kısayolları
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Geri Al</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded font-mono text-xs">Ctrl+Z</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>Yinele</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded font-mono text-xs">Ctrl+Y</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>Kaydet</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded font-mono text-xs">Ctrl+S</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>Kopyala</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded font-mono text-xs">Ctrl+C</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>Yapıştır</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded font-mono text-xs">Ctrl+V</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>Sil</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded font-mono text-xs">Delete</kbd>
          </div>
          <div className="flex items-center justify-between">
            <span>Çoğalt</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded font-mono text-xs">Ctrl+D</kbd>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


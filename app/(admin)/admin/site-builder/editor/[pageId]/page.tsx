'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, Save, Eye, Monitor, Tablet, Smartphone, Undo, Redo, 
  Layers, Type, Image as ImageIcon, Layout, Grid, Box, MousePointer,
  Settings, Code, Sparkles, Zap, Upload, Download, Copy, Trash2
} from 'lucide-react';
import PageEditorCanvas from '@/components/admin/page-editor/PageEditorCanvas';
import MediaUploader from '@/components/admin/page-editor/MediaUploader';
import ElementEditor from '@/components/admin/page-editor/ElementEditor';

interface Props {
  params: Promise<{ pageId: string }>;
}

export default function AdvancedPageEditor({ params }: Props) {
  const resolvedParams = use(params);
  const [pageData, setPageData] = useState<any>(null);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [editMode, setEditMode] = useState<'visual' | 'code'>('visual');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    loadPageData();
  }, [resolvedParams.pageId]);

  const loadPageData = async () => {
    // Mock data - gerçekte API'den gelecek
    const pageInfo = getPageInfo(resolvedParams.pageId);
    
    const mockData = {
      id: resolvedParams.pageId,
      title: pageInfo.title,
      slug: pageInfo.slug,
      sections: [
        {
          id: 'hero-1',
          type: 'hero',
          content: {
            title: pageInfo.title,
            subtitle: pageInfo.description,
            cta: 'Alışverişe Başla',
            ctaLink: '/products',
            backgroundImage: ''
          }
        }
      ],
      metadata: {
        seoTitle: pageInfo.title,
        seoDescription: pageInfo.description,
        ogImage: ''
      }
    };
    
    setPageData(mockData);
    setHistory([mockData]);
    setHistoryIndex(0);
  };

  const getPageInfo = (id: string) => {
    const pages: Record<string, any> = {
      'home': { title: 'Anasayfa', slug: '/', description: 'TDC Market ana sayfası' },
      'cat-figur': { title: 'Figür & Koleksiyon', slug: '/categories/figur-koleksiyon', description: 'Anime, manga ve koleksiyon figürleri' },
      'cat-moda': { title: 'Moda & Aksesuar', slug: '/categories/moda-aksesuar', description: 'Takı, saat ve moda aksesuarları' },
      'about': { title: 'Hakkımızda', slug: '/about', description: 'TDC Market hakkında' },
      'contact': { title: 'İletişim', slug: '/contact', description: 'Bizimle iletişime geçin' },
    };
    return pages[id] || { title: 'Sayfa', slug: '/', description: '' };
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('✅ Sayfa başarıyla kaydedildi!');
    } catch (error) {
      alert('❌ Kaydetme hatası!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPageData(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPageData(history[newIndex]);
    }
  };

  const handleElementClick = (element: any) => {
    if (!isPreviewMode) {
      setSelectedElement(element);
    }
  };

  const handleMediaSelect = (mediaUrl: string) => {
    if (selectedElement) {
      const updated = {
        ...selectedElement,
        content: {
          ...selectedElement.content,
          backgroundImage: mediaUrl
        }
      };
      setSelectedElement(updated);
      setShowMediaUploader(false);
    }
  };

  const getDeviceWidth = () => {
    switch(deviceMode) {
      case 'desktop': return '100%';
      case 'tablet': return '768px';
      case 'mobile': return '375px';
    }
  };

  const devices = [
    { mode: 'desktop', icon: Monitor, label: 'Desktop', width: '1920px' },
    { mode: 'tablet', icon: Tablet, label: 'Tablet', width: '768px' },
    { mode: 'mobile', icon: Smartphone, label: 'Mobile', width: '375px' }
  ];

  if (!pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 font-semibold text-lg">Sayfa yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
      {/* Top Toolbar - Ultra Modern */}
      <div className="bg-white/95 backdrop-blur-xl border-b-2 border-indigo-100 shadow-2xl">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <Link
              href="/admin/site-builder/pages"
              className="p-2.5 hover:bg-indigo-50 rounded-xl transition-all group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-indigo-600 transition-colors" />
            </Link>
            
            <div className="h-10 w-px bg-gray-200"></div>
            
            <div>
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                {pageData.title}
              </h2>
              <p className="text-xs text-gray-500 font-mono font-semibold">{pageData.slug}</p>
            </div>
          </div>

          {/* Center - Device Preview */}
          <div className="flex items-center gap-3">
            {devices.map(({ mode, icon: Icon, label, width }) => (
              <motion.button
                key={mode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDeviceMode(mode as any)}
                className={`px-4 py-2.5 rounded-xl transition-all font-semibold text-sm flex items-center gap-2 ${
                  deviceMode === mode 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={`${label} (${width})`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{label}</span>
              </motion.button>
            ))}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-3">
            {/* Undo/Redo */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Geri Al (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 hover:bg-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="İleri Al (Ctrl+Y)"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            {/* Preview Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-5 py-2.5 rounded-xl transition-all font-semibold flex items-center gap-2 ${
                isPreviewMode 
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/50' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              {isPreviewMode ? 'Edit Mode' : 'Preview'}
            </motion.button>

            {/* Save Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/50 font-bold flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Kaydediliyor...' : 'Kaydet & Yayınla'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Components */}
        {!isPreviewMode && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="w-80 bg-white border-r-2 border-indigo-100 overflow-y-auto shadow-2xl"
          >
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  Componentler
                </h3>
              </div>

              {/* Layout Components */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Layout</h4>
                <div className="space-y-2">
                  {[
                    { icon: <Layout />, label: 'Section', desc: 'Container bölümü' },
                    { icon: <Grid />, label: 'Grid', desc: '2-6 kolonlu grid' },
                    { icon: <Box />, label: 'Flex', desc: 'Esnek düzen' },
                  ].map((comp, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-xl transition-all border-2 border-transparent hover:border-indigo-300 group"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-md">
                        {comp.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-bold text-gray-900">{comp.label}</div>
                        <div className="text-xs text-gray-500">{comp.desc}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Content Components */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">İçerik</h4>
                <div className="space-y-2">
                  {[
                    { icon: <Type />, label: 'Text', desc: 'Başlık ve paragraf', color: 'from-blue-50 to-cyan-50' },
                    { icon: <ImageIcon />, label: 'Görsel', desc: 'Fotoğraf ekle', color: 'from-green-50 to-emerald-50' },
                    { icon: <MousePointer />, label: 'Button', desc: 'CTA butonu', color: 'from-orange-50 to-red-50' },
                  ].map((comp, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02, x: 4 }}
                      onClick={() => comp.label === 'Görsel' && setShowMediaUploader(true)}
                      className={`w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${comp.color} hover:shadow-lg rounded-xl transition-all border-2 border-transparent hover:border-indigo-300 group`}
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-700 group-hover:bg-gradient-to-br group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all shadow-md">
                        {comp.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-bold text-gray-900">{comp.label}</div>
                        <div className="text-xs text-gray-500">{comp.desc}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Advanced */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  Gelişmiş
                </h4>
                <div className="space-y-2">
                  {[
                    { icon: <Sparkles />, label: 'Hero Banner', desc: 'Ana görsel alan' },
                    { icon: <Grid />, label: 'Ürün Grid', desc: 'Ürün showcase' },
                    { icon: <Layout />, label: 'Testimonial', desc: 'Müşteri yorumları' },
                  ].map((comp, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-50 to-yellow-50 hover:shadow-lg rounded-xl transition-all border-2 border-transparent hover:border-amber-300 group"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-amber-600 group-hover:bg-gradient-to-br group-hover:from-amber-500 group-hover:to-yellow-500 group-hover:text-white transition-all shadow-md">
                        {comp.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-bold text-gray-900">{comp.label}</div>
                        <div className="text-xs text-gray-500">{comp.desc}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Center - Canvas */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-100 to-indigo-50">
          <div className="min-h-full flex items-start justify-center p-8">
            <motion.div 
              layout
              className="bg-white shadow-2xl transition-all"
              style={{ 
                width: getDeviceWidth(),
                minHeight: '100vh'
              }}
            >
              <PageEditorCanvas
                pageData={pageData}
                isPreviewMode={isPreviewMode}
                onElementClick={handleElementClick}
                selectedElement={selectedElement}
              />
            </motion.div>
          </div>
        </div>

        {/* Right Panel - Settings */}
        <AnimatePresence>
          {!isPreviewMode && selectedElement && (
            <motion.div
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="w-96 bg-white border-l-2 border-indigo-100 overflow-y-auto shadow-2xl"
            >
              <ElementEditor
                element={selectedElement}
                onUpdate={(updated) => setSelectedElement(updated)}
                onMediaUpload={() => setShowMediaUploader(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Panel - No Selection */}
        {!isPreviewMode && !selectedElement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-96 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-8"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <MousePointer className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Element Seçin</h3>
              <p className="text-sm text-gray-600">
                Düzenlemek için sayfada bir elemente tıklayın
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Media Uploader Modal */}
      <AnimatePresence>
        {showMediaUploader && (
          <MediaUploader
            onClose={() => setShowMediaUploader(false)}
            onSelect={handleMediaSelect}
          />
        )}
      </AnimatePresence>

      {/* Floating Action Bar */}
      {!isPreviewMode && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl shadow-indigo-500/50 p-2 flex items-center gap-2">
            <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all font-semibold text-sm">
              <Download className="w-4 h-4 inline mr-2" />
              Export
            </button>
            <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all font-semibold text-sm">
              <Copy className="w-4 h-4 inline mr-2" />
              Duplicate
            </button>
            <div className="w-px h-8 bg-white/20"></div>
            <button className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-red-500 transition-all font-semibold text-sm">
              <Trash2 className="w-4 h-4 inline mr-2" />
              Delete
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}


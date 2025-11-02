'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Eye, Monitor, Tablet, Smartphone, Upload, Image as ImageIcon, Type, Layout, Grid, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PageEditorCanvas from '@/components/admin/page-editor/PageEditorCanvas';
import MediaUploader from '@/components/admin/page-editor/MediaUploader';
import ElementEditor from '@/components/admin/page-editor/ElementEditor';

interface Props {
  params: Promise<{ id: string }>;
}

export default function PageEditPage({ params }: Props) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [pageData, setPageData] = useState<any>(null);
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showMediaUploader, setShowMediaUploader] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPageData();
  }, [resolvedParams.id]);

  const loadPageData = async () => {
    // Gerçek veri API'den gelecek, şimdilik mock
    const mockData = {
      id: resolvedParams.id,
      title: getPageTitle(resolvedParams.id),
      slug: getPageSlug(resolvedParams.id),
      sections: [
        {
          id: 'hero',
          type: 'hero',
          content: {
            title: 'Hoş Geldiniz',
            subtitle: 'TDC Market\'e',
            cta: 'Alışverişe Başla',
            backgroundImage: '/images/hero-bg.jpg'
          }
        }
      ]
    };
    setPageData(mockData);
  };

  const getPageTitle = (id: string) => {
    const titles: Record<string, string> = {
      'home': 'Anasayfa',
      'cat-figur': 'Figür & Koleksiyon',
      'cat-moda': 'Moda & Aksesuar',
      'about': 'Hakkımızda',
      'contact': 'İletişim',
      'blog': 'Blog'
    };
    return titles[id] || 'Sayfa';
  };

  const getPageSlug = (id: string) => {
    const slugs: Record<string, string> = {
      'home': '/',
      'cat-figur': '/categories/figur-koleksiyon',
      'cat-moda': '/categories/moda-aksesuar',
      'about': '/about',
      'contact': '/contact',
      'blog': '/blog'
    };
    return slugs[id] || '/';
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // API'ye kaydet
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock
      alert('Sayfa kaydedildi!');
    } catch (error) {
      alert('Kaydetme hatası!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleElementClick = (element: any) => {
    if (!isPreviewMode) {
      setSelectedElement(element);
    }
  };

  const handleMediaSelect = (mediaUrl: string) => {
    if (selectedElement) {
      // Seçili elemente görseli ekle
      setSelectedElement({
        ...selectedElement,
        content: {
          ...selectedElement.content,
          image: mediaUrl
        }
      });
      setShowMediaUploader(false);
    }
  };

  const getDeviceWidth = () => {
    switch(deviceMode) {
      case 'desktop': return '100%';
      case 'tablet': return '768px';
      case 'mobile': return '375px';
      default: return '100%';
    }
  };

  if (!pageData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Sayfa yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/pages"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{pageData.title}</h2>
            <p className="text-xs text-gray-500">{pageData.slug}</p>
          </div>
        </div>

        {/* Center - Device Preview */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`p-2 rounded-lg transition-colors ${
              deviceMode === 'desktop' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Desktop"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={`p-2 rounded-lg transition-colors ${
              deviceMode === 'tablet' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Tablet"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`p-2 rounded-lg transition-colors ${
              deviceMode === 'mobile' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Mobile"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isPreviewMode 
                ? 'bg-gray-200 text-gray-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            {isPreviewMode ? 'Edit Mode' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 inline mr-2" />
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar - Components */}
        {!isPreviewMode && (
          <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Componentler</h3>
              
              {/* Layout */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-gray-500 mb-2">Layout</h4>
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700">
                    <Layout className="w-4 h-4" />
                    Section
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700">
                    <Grid className="w-4 h-4" />
                    Grid
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h4 className="text-xs font-medium text-gray-500 mb-2">İçerik</h4>
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700">
                    <Type className="w-4 h-4" />
                    Text
                  </button>
                  <button 
                    onClick={() => setShowMediaUploader(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Görsel
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700">
                    <Upload className="w-4 h-4" />
                    Button
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Center - Canvas (Preview) */}
        <div className="flex-1 bg-gray-100 overflow-auto">
          <div className="min-h-full flex items-start justify-center p-8">
            <div 
              className="bg-white shadow-2xl transition-all duration-300"
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
            </div>
          </div>
        </div>

        {/* Right Panel - Settings */}
        {!isPreviewMode && selectedElement && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <ElementEditor
              element={selectedElement}
              onUpdate={(updated) => setSelectedElement(updated)}
              onMediaUpload={() => setShowMediaUploader(true)}
            />
          </div>
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
    </div>
  );
}


"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Undo,
  Redo,
  Save,
  Eye,
  EyeOff,
  Monitor,
  Tablet,
  Smartphone,
  Upload,
  Settings,
  ChevronLeft
} from 'lucide-react';
import { useEditorStore } from '@/lib/site-builder/store';
import { useRouter } from 'next/navigation';

export const EditorToolbar: React.FC = () => {
  const router = useRouter();
  const {
    currentPage,
    mode,
    breakpoint,
    canUndo,
    canRedo,
    undo,
    redo,
    setMode,
    setBreakpoint,
    save,
    publish,
  } = useEditorStore();

  const [isSaving, setIsSaving] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await save();
      // Show success toast
    } catch (error) {
      alert('Kaydetme başarısız!');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm('Sayfayı yayınlamak istediğinizden emin misiniz?')) return;
    
    try {
      setIsPublishing(true);
      await save(); // Save first
      await publish();
      alert('Sayfa başarıyla yayınlandı! 🎉');
    } catch (error) {
      alert('Yayınlama başarısız!');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/site-builder/pages')}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Geri</span>
        </button>
        
        <div className="h-8 w-px bg-gray-300"></div>
        
        <div>
          <h2 className="font-bold text-gray-900">{currentPage?.name || 'Untitled'}</h2>
          <p className="text-xs text-gray-500">
            {currentPage?.status === 'published' ? '🟢 Yayında' : '⚪ Taslak'}
          </p>
        </div>
      </div>

      {/* Center: Tools */}
      <div className="flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-2 rounded ${
              canUndo ? 'hover:bg-white text-gray-700' : 'text-gray-400 cursor-not-allowed'
            }`}
            title="Geri Al (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-2 rounded ${
              canRedo ? 'hover:bg-white text-gray-700' : 'text-gray-400 cursor-not-allowed'
            }`}
            title="Yinele (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        <div className="h-8 w-px bg-gray-300"></div>

        {/* Preview Mode */}
        <button
          onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            mode === 'preview'
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {mode === 'preview' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {mode === 'preview' ? 'Preview' : 'Edit'}
        </button>

        <div className="h-8 w-px bg-gray-300"></div>

        {/* Responsive Breakpoints */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setBreakpoint('desktop')}
            className={`p-2 rounded transition-colors ${
              breakpoint === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-white'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setBreakpoint('tablet')}
            className={`p-2 rounded transition-colors ${
              breakpoint === 'tablet' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-white'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setBreakpoint('mobile')}
            className={`p-2 rounded transition-colors ${
              breakpoint === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-white'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
        
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold text-sm disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {isPublishing ? 'Yayınlanıyor...' : 'Yayınla'}
        </button>
      </div>
    </div>
  );
};


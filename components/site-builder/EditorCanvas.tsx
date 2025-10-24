"use client";

import React from 'react';
import { ComponentRenderer } from './ComponentRenderer';
import { useEditorStore } from '@/lib/site-builder/store';

export const EditorCanvas: React.FC = () => {
  const { currentPage, mode, breakpoint, selectComponent } = useEditorStore();

  if (!currentPage) {
    return (
      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">📄</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sayfa Yüklenmedi</h3>
          <p className="text-gray-600">Düzenlemek için bir sayfa seçin veya yeni sayfa oluşturun</p>
        </div>
      </div>
    );
  }

  const getCanvasWidth = () => {
    switch (breakpoint) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
      default: return '100%';
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectComponent(null);
    }
  };

  return (
    <div className="flex-1 bg-gray-100 overflow-auto p-8" onClick={handleCanvasClick}>
      <div
        className="mx-auto bg-white shadow-2xl transition-all duration-300"
        style={{
          width: getCanvasWidth(),
          minHeight: '100vh',
        }}
      >
        {currentPage.rootComponentIds.map(componentId => {
          const component = currentPage.components[componentId];
          if (!component) return null;
          return (
            <ComponentRenderer
              key={componentId}
              component={component}
              isEditorMode={mode === 'edit'}
            />
          );
        })}

        {/* Empty State */}
        {currentPage.rootComponentIds.length === 0 && (
          <div className="min-h-screen flex items-center justify-center p-12 text-center">
            <div>
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Boş Sayfa</h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Soldaki Component Library'den sürükleyerek sayfanızı oluşturmaya başlayın
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>💡</span>
                <span>İpucu: Section ile başlayın</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


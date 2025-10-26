"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  Smartphone,
  Tablet,
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react';
import { useEditorStore } from '@/lib/site-builder/store';
import { ComponentRenderer } from './ComponentRenderer';

interface PreviewModeProps {
  onClose?: () => void;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const DEVICE_SIZES = {
  desktop: { width: '100%', minWidth: '1200px' },
  tablet: { width: '768px', minWidth: '768px' },
  mobile: { width: '375px', minWidth: '375px' }
};

export const PreviewMode: React.FC<PreviewModeProps> = ({ onClose }) => {
  const { currentPage, mode, setMode } = useEditorStore();
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  if (!currentPage) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Sayfa Yüklenmedi</h2>
          <p className="text-gray-400 mb-6">Önizleme için bir sayfa seçin</p>
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kapat
            </button>
          )}
        </div>
      </div>
    );
  }

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900 z-50 flex flex-col"
      >
        {/* Header Bar */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Device Selector */}
            <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
              {[
                { type: 'desktop' as DeviceType, icon: Monitor, label: 'Desktop' },
                { type: 'tablet' as DeviceType, icon: Tablet, label: 'Tablet' },
                { type: 'mobile' as DeviceType, icon: Smartphone, label: 'Mobile' },
              ].map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => setDevice(type)}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                    device === type
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>

            {/* URL Display */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUrl(!showUrl)}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
              >
                {showUrl ? 'URL Gizle' : 'URL Göster'}
              </button>
              {showUrl && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="px-3 py-2 bg-gray-700 rounded-lg text-sm text-gray-300 font-mono"
                >
                  /{currentPage.slug}
                </motion.div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
              title="Tam Ekran"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Preview Frame */}
        <div className="flex-1 overflow-auto bg-gray-700 p-8 flex items-center justify-center">
          <motion.div
            key={device}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-2xl"
            style={{
              width: DEVICE_SIZES[device].width,
              minWidth: DEVICE_SIZES[device].minWidth,
              height: '100%',
              maxHeight: 'calc(100vh - 100px)',
              overflow: 'auto'
            }}
          >
            {/* Device Frame */}
            <div className="border-8 border-gray-900 rounded-lg overflow-hidden" style={{ height: '100%' }}>
              {/* Status Bar (Mobile only) */}
              {device === 'mobile' && (
                <div className="bg-gray-900 h-6 flex items-center justify-between px-4">
                  <div className="text-white text-xs font-medium">9:41</div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-2 border border-white"></div>
                    <div className="w-6 h-3 border border-white rounded-sm"></div>
                  </div>
                </div>
              )}

              {/* Page Content */}
              <div className="relative" style={{ height: device === 'mobile' ? 'calc(100% - 24px)' : '100%' }}>
                {currentPage.rootComponentIds.map((componentId) => {
                  const component = currentPage.components[componentId];
                  if (!component) return null;
                  return (
                    <ComponentRenderer
                      key={componentId}
                      component={component}
                      isEditorMode={false}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Bar */}
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <span className="font-medium">{currentPage.name}</span>
            <span className="text-gray-600">•</span>
            <span>{device.toUpperCase()}</span>
            <span className="text-gray-600">•</span>
            <span>{currentPage.rootComponentIds.length} component</span>
          </div>
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            <span>Canlı Önizleme</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};


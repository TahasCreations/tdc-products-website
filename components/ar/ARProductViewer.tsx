'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, RotateCw, ZoomIn, ZoomOut, Camera } from 'lucide-react';

interface ARProductViewerProps {
  product: {
    id: string;
    title: string;
    modelUrl?: string; // 3D model URL (GLB/GLTF)
    images: string[];
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function ARProductViewer({ product, isOpen, onClose }: ARProductViewerProps) {
  const [mode, setMode] = useState<'3d' | 'ar'>('3d');
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isARSupported, setIsARSupported] = useState(false);
  const modelViewerRef = useRef<any>(null);

  useEffect(() => {
    // Check AR support
    if (typeof window !== 'undefined') {
      setIsARSupported('xr' in navigator || 'ARKit' in (window as any));
    }
  }, []);

  const handleRotate = () => {
    setRotation(prev => ({ ...prev, y: prev.y + 45 }));
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleARView = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.activateAR();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
          />

          {/* Viewer */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <div>
                  <h3 className="text-xl font-bold text-white">{product.title}</h3>
                  <p className="text-sm text-gray-400">3D / AR Görünüm</p>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Mode Toggle */}
              <div className="flex justify-center p-4 space-x-2 bg-gray-800/50">
                <button
                  onClick={() => setMode('3d')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    mode === '3d'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  🎨 3D Görünüm
                </button>
                {isARSupported && (
                  <button
                    onClick={() => setMode('ar')}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      mode === 'ar'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    📱 AR Görünüm
                  </button>
                )}
              </div>

              {/* 3D/AR Viewer */}
              <div className="relative bg-gradient-to-b from-gray-900 to-black" style={{ height: '500px' }}>
                {product.modelUrl ? (
                  // 3D Model Viewer (using model-viewer library)
                  <model-viewer
                    ref={modelViewerRef}
                    src={product.modelUrl}
                    alt={product.title}
                    ar={isARSupported}
                    ar-modes="webxr scene-viewer quick-look"
                    camera-controls
                    auto-rotate
                    style={{
                      width: '100%',
                      height: '100%',
                      transform: `scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                      transition: 'transform 0.3s ease'
                    }}
                  />
                ) : (
                  // Fallback: 360° Image Viewer
                  <div className="flex items-center justify-center h-full">
                    <div
                      className="relative w-full h-full bg-center bg-contain bg-no-repeat"
                      style={{
                        backgroundImage: `url(${product.images[0]})`,
                        transform: `scale(${zoom}) rotateY(${rotation.y}deg)`,
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  </div>
                )}

                {/* Overlay Info */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <p className="text-white text-sm">
                    🔄 Döndür • 🔍 Yakınlaştır • 📏 Ölçeklendir
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4 p-4 bg-gray-800/50">
                <button
                  onClick={handleRotate}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors group"
                  title="Döndür"
                >
                  <RotateCw className="w-5 h-5 text-white group-hover:rotate-90 transition-transform" />
                </button>

                <button
                  onClick={handleZoomOut}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Uzaklaştır"
                >
                  <ZoomOut className="w-5 h-5 text-white" />
                </button>

                <div className="px-4 py-2 bg-gray-700 rounded-lg">
                  <span className="text-white font-medium">{Math.round(zoom * 100)}%</span>
                </div>

                <button
                  onClick={handleZoomIn}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Yakınlaştır"
                >
                  <ZoomIn className="w-5 h-5 text-white" />
                </button>

                <button
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  title="Tam Ekran"
                >
                  <Maximize2 className="w-5 h-5 text-white" />
                </button>

                {isARSupported && (
                  <button
                    onClick={handleARView}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg rounded-lg transition-all flex items-center space-x-2"
                  >
                    <Camera className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold">AR'de Gör</span>
                  </button>
                )}
              </div>

              {/* Instructions */}
              <div className="p-4 bg-gray-800 text-center">
                <p className="text-sm text-gray-400">
                  💡 <strong>İpucu:</strong> Fareyle sürükleyerek döndürün, scroll ile yakınlaştırın
                  {isARSupported && ', AR butonuna basarak gerçek dünyada görün'}
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// model-viewer type declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}


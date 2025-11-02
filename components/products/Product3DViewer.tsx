"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, RotateCcw, Smartphone, X } from 'lucide-react';

interface Product3DViewerProps {
  productId: string;
  productName: string;
}

export default function Product3DViewer({ productId, productName }: Product3DViewerProps) {
  const [isARMode, setIsARMode] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleARView = () => {
    // AR.js veya model-viewer ile AR görüntüleme
    setIsARMode(true);
  };

  return (
    <div className="relative">
      {/* 3D Viewer Container */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
        {/* Three.js veya model-viewer burada render edilir */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotateY: rotation }}
            className="w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg shadow-2xl"
          >
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              3D Model
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          <button
            onClick={() => setRotation(r => r + 90)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Döndür"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={handleARView}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:shadow-xl transition-all flex items-center space-x-2"
            title="AR Görünüm"
          >
            <Smartphone className="w-5 h-5" />
            <span>AR'da Gör</span>
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Tam Ekran"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* AR Modal */}
      <AnimatePresence>
        {isARMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4">
              <h3 className="text-white font-bold">{productName} - AR Görünüm</h3>
              <button
                onClick={() => setIsARMode(false)}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* AR View */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-white">
                <Smartphone className="w-24 h-24 mx-auto mb-4" />
                <p className="text-lg mb-2">Kameranızı kullanarak</p>
                <p className="text-lg font-bold">Ürünü Mekanınızda Görün!</p>
                <p className="text-sm text-white/70 mt-4">
                  AR.js / WebXR entegrasyonu burada aktif olacak
                </p>
              </div>
            </div>

            {/* AR Instructions */}
            <div className="p-6 bg-white/10 backdrop-blur-sm">
              <div className="grid grid-cols-3 gap-4 text-center text-white text-sm">
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    1
                  </div>
                  <p>Düz bir yüzey bulun</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    2
                  </div>
                  <p>Kamerayı yüzeye tutun</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    3
                  </div>
                  <p>Ürünü yerleştirin</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 360° Image Viewer (3D model alternatifi)
export function Product360Viewer({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDrag = (e: React.MouseEvent) => {
    // Mouse drag ile rotasyon
    const newIndex = Math.floor((e.clientX / window.innerWidth) * images.length);
    setCurrentIndex(Math.max(0, Math.min(newIndex, images.length - 1)));
  };

  return (
    <div
      className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseMove={handleDrag}
    >
      {/* Current image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
      </div>
      
      {/* Progress indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 rounded-full px-4 py-2 text-sm font-semibold">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}


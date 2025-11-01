"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Search, Sparkles, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VisionSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // Webcam capture logic would go here
    alert('Kamera özelliği yakında eklenecek!');
  };

  const handleSearch = async () => {
    if (!image) return;

    setIsSearching(true);
    try {
      // Convert base64 to blob
      const response = await fetch(image);
      const blob = await response.blob();

      // Send to AI vision search
      const formData = new FormData();
      formData.append('image', blob);

      const result = await fetch('/api/ai/vision-search', {
        method: 'POST',
        body: formData,
      });

      if (result.ok) {
        const data = await result.json();
        setResults(data.products || []);
      }
    } catch (error) {
      console.error('Vision search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    setImage(null);
    setResults([]);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center hover:shadow-purple-500/50 transition-all"
      >
        <Camera className="w-6 h-6 text-white" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 relative">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">AI İle Ürün Ara</h2>
                      <p className="text-white/90 text-sm">Fotoğraf çek veya yükle</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {!image ? (
                    /* Upload Interface */
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-purple-300 rounded-xl p-12 text-center hover:border-purple-500 transition-all cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                        <p className="text-gray-700 font-semibold mb-2">
                          Fotoğrafı buraya sürükle
                        </p>
                        <p className="text-gray-500 text-sm mb-4">
                          veya tıklayarak seç
                        </p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-semibold"
                        >
                          Dosya Seç
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-gray-500 text-sm">veya</span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      <button
                        onClick={handleCameraCapture}
                        className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-bold flex items-center justify-center space-x-2"
                      >
                        <Camera className="w-5 h-5" />
                        <span>Kameradan Çek</span>
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    /* Preview & Results */
                    <div className="space-y-4">
                      {/* Image Preview */}
                      <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                        <img
                          src={image}
                          alt="Uploaded"
                          className="w-full h-64 object-cover"
                        />
                        <button
                          onClick={resetSearch}
                          className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
                        >
                          <X className="w-4 h-4 text-gray-700" />
                        </button>
                      </div>

                      {/* Search Button */}
                      <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
                      >
                        {isSearching ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Analiz Ediliyor...</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-5 h-5" />
                            <span>Ürünleri Bul</span>
                          </>
                        )}
                      </button>

                      {/* Results */}
                      {results.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-gray-700">
                            Benzer Ürünler Bulundu ({results.length})
                          </p>
                          <div className="space-y-2">
                            {results.slice(0, 5).map((product) => (
                              <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => {
                                  router.push(`/products/${product.slug}`);
                                  setIsOpen(false);
                                }}
                                className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:shadow-md transition-all cursor-pointer"
                              >
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                  <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{product.name}</p>
                                    <p className="text-lg font-black text-purple-600">
                                      ₺{product.price.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}



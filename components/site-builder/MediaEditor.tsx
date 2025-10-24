"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Crop,
  Maximize2,
  RotateCw,
  Sliders,
  Download,
  X,
  Check
} from 'lucide-react';

interface MediaEditorProps {
  imageUrl: string;
  onSave: (editedUrl: string) => void;
  onCancel: () => void;
}

export const MediaEditor: React.FC<MediaEditorProps> = ({ imageUrl, onSave, onCancel }) => {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getFilterStyle = () => {
    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`,
      transform: `rotate(${rotation}deg) scale(${scale})`,
    };
  };

  const handleSave = async () => {
    // Bu gerçek bir implementasyonda canvas'ı kullanarak yeni görsel oluşturulur
    // ve sunucuya yüklenir. Şimdilik basit versiyonu:
    onSave(imageUrl);
  };

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setRotation(0);
    setScale(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/90 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          <Sliders className="w-5 h-5" />
          Görsel Düzenle
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            Sıfırla
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Kaydet
          </button>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Preview Area */}
        <div className="flex-1 bg-gray-800 flex items-center justify-center p-8 overflow-auto">
          <div className="relative">
            <img
              src={imageUrl}
              alt="Preview"
              style={getFilterStyle()}
              className="max-w-full max-h-full rounded-lg shadow-2xl"
            />
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="w-80 bg-gray-900 border-l border-gray-700 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Brightness */}
            <div>
              <label className="block text-white font-semibold mb-3 flex items-center justify-between">
                <span>Parlaklık</span>
                <span className="text-sm text-gray-400">{brightness}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Contrast */}
            <div>
              <label className="block text-white font-semibold mb-3 flex items-center justify-between">
                <span>Kontrast</span>
                <span className="text-sm text-gray-400">{contrast}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Saturation */}
            <div>
              <label className="block text-white font-semibold mb-3 flex items-center justify-between">
                <span>Doygunluk</span>
                <span className="text-sm text-gray-400">{saturation}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Blur */}
            <div>
              <label className="block text-white font-semibold mb-3 flex items-center justify-between">
                <span>Bulanıklık</span>
                <span className="text-sm text-gray-400">{blur}px</span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Rotation */}
            <div>
              <label className="block text-white font-semibold mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4" />
                  Döndür
                </span>
                <span className="text-sm text-gray-400">{rotation}°</span>
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Scale */}
            <div>
              <label className="block text-white font-semibold mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4" />
                  Ölçek
                </span>
                <span className="text-sm text-gray-400">{scale.toFixed(2)}x</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Quick Presets */}
            <div className="pt-4 border-t border-gray-700">
              <label className="block text-white font-semibold mb-3">Hızlı Efektler</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setBrightness(120);
                    setContrast(110);
                  }}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  Parlak
                </button>
                <button
                  onClick={() => {
                    setBrightness(80);
                    setContrast(120);
                  }}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  Koyu
                </button>
                <button
                  onClick={() => {
                    setSaturation(150);
                    setContrast(110);
                  }}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  Canlı
                </button>
                <button
                  onClick={() => {
                    setSaturation(0);
                  }}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                >
                  Siyah-Beyaz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </motion.div>
  );
};


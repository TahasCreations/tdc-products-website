"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignVerticalStart,
  AlignVerticalCenter,
  AlignVerticalEnd,
  Maximize2,
  Minimize2,
  Grid3x3,
  Ruler,
  Layers,
  RotateCcw
} from 'lucide-react';

interface AlignmentToolsProps {
  onAlign?: (type: 'left' | 'center' | 'right' | 'justify') => void;
  onVerticalAlign?: (type: 'start' | 'center' | 'end') => void;
  onDistribute?: (type: 'horizontal' | 'vertical') => void;
}

export const AlignmentTools: React.FC<AlignmentToolsProps> = ({
  onAlign,
  onVerticalAlign,
  onDistribute
}) => {
  const [showGrid, setShowGrid] = useState(false);
  const [showRuler, setShowRuler] = useState(false);
  const [gridSize, setGridSize] = useState(8);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Ruler className="w-5 h-5 text-gray-600" />
        <h3 className="font-bold text-gray-900">Hizalama Araçları</h3>
      </div>

      {/* Text Alignment */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Metin Hizalama
        </label>
        <div className="flex gap-2">
          {[
            { icon: AlignLeft, label: 'Sol', value: 'left' },
            { icon: AlignCenter, label: 'Orta', value: 'center' },
            { icon: AlignRight, label: 'Sağ', value: 'right' },
            { icon: AlignJustify, label: 'İki Yana', value: 'justify' },
          ].map(({ icon: Icon, label, value }) => (
            <button
              key={value}
              onClick={() => onAlign?.(value as any)}
              className="flex-1 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center gap-1"
              title={label}
            >
              <Icon className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-600">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Alignment */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Dikey Hizalama
        </label>
        <div className="flex gap-2">
          {[
            { icon: AlignVerticalStart, label: 'Üst', value: 'start' },
            { icon: AlignVerticalCenter, label: 'Orta', value: 'center' },
            { icon: AlignVerticalEnd, label: 'Alt', value: 'end' },
          ].map(({ icon: Icon, label, value }) => (
            <button
              key={value}
              onClick={() => onVerticalAlign?.(value as any)}
              className="flex-1 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center gap-1"
              title={label}
            >
              <Icon className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-600">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Distribution */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Dağıtma
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => onDistribute?.('horizontal')}
            className="flex-1 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Maximize2 className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">Yatay</span>
          </button>
          <button
            onClick={() => onDistribute?.('vertical')}
            className="flex-1 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Minimize2 className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">Dikey</span>
          </button>
        </div>
      </div>

      {/* Grid Settings */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-700">
            Grid Göster
          </label>
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`w-10 h-6 rounded-full transition-colors ${
              showGrid ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform ${
                showGrid ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {showGrid && (
          <div className="mt-2">
            <label className="block text-xs text-gray-600 mb-1">
              Grid Boyutu: {gridSize}px
            </label>
            <input
              type="range"
              min="4"
              max="32"
              step="4"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Ruler */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-700">
            Cetvel Göster
          </label>
          <button
            onClick={() => setShowRuler(!showRuler)}
            className={`w-10 h-6 rounded-full transition-colors ${
              showRuler ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform ${
                showRuler ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Quick Spacing */}
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Hızlı Boşluklar
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[8, 16, 24, 32].map((size) => (
            <button
              key={size}
              className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium transition-colors"
            >
              {size}px
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


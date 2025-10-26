"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  X,
  Plus,
  Trash2,
  Check,
  Copy,
  Droplet
} from 'lucide-react';

interface ColorPalettePickerProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
}

const DEFAULT_COLORS = [
  '#000000', '#FFFFFF', '#EF4444', '#F59E0B', '#10B981',
  '#3B82F6', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6',
  '#F97316', '#84CC16', '#6366F1', '#A855F7', '#F43F5E'
];

export const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({
  value = '#000000',
  onChange,
  label = 'Renk'
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState(value);

  const allColors = [...DEFAULT_COLORS, ...customColors];

  const handleColorSelect = (color: string) => {
    onChange?.(color);
    setColorInput(color);
    setShowPicker(false);
  };

  const handleAddCustomColor = () => {
    if (colorInput && !customColors.includes(colorInput)) {
      setCustomColors([...customColors, colorInput]);
    }
  };

  const handleRemoveCustomColor = (color: string) => {
    setCustomColors(customColors.filter(c => c !== color));
  };

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
  };

  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Color Preview Button */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="w-full flex items-center gap-2 p-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
      >
        <div
          className="w-8 h-8 rounded border border-gray-300"
          style={{ backgroundColor: value }}
        />
        <span className="flex-1 text-left text-sm text-gray-700 font-mono">
          {value}
        </span>
        <Palette className="w-4 h-4 text-gray-500" />
      </button>

      {/* Color Picker Modal */}
      <AnimatePresence>
        {showPicker && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowPicker(false)}
            />
            
            {/* Picker Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900">Renk Seç</h3>
                </div>
                <button
                  onClick={() => setShowPicker(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Color Grid */}
              <div className="mb-4">
                <div className="grid grid-cols-6 gap-2">
                  {allColors.map((color, index) => (
                    <motion.button
                      key={`${color}-${index}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleColorSelect(color)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        value === color
                          ? 'border-blue-600 ring-2 ring-blue-200'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Color Input */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Özel Renk Ekle
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    placeholder="#000000"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddCustomColor}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Ekle"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Custom Colors List */}
              {customColors.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">
                    Özel Renklerim
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {customColors.map((color) => (
                      <div
                        key={color}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg"
                      >
                        <div
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs font-mono text-gray-700">{color}</span>
                        <button
                          onClick={() => handleRemoveCustomColor(color)}
                          className="p-0.5 hover:bg-gray-200 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyColor(value)}
                  className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Kopyala
                </button>
                <button
                  onClick={() => setShowPicker(false)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Tamam
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};


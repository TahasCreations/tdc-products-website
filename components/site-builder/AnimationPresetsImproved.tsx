"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Eye,
  Move,
  RotateCw,
  ZoomIn,
  FadeIn,
  Bounce,
  Zap
} from 'lucide-react';

interface AnimationPreset {
  id: string;
  name: string;
  description: string;
  type: 'entrance' | 'hover' | 'click' | 'scroll';
  animation: any;
  icon: React.ReactNode;
}

interface AnimationPresetsImprovedProps {
  onSelect?: (animation: any) => void;
}

const PRESETS: AnimationPreset[] = [
  {
    id: 'fade-in',
    name: 'Fade In',
    description: 'Yavaşça belir',
    type: 'entrance',
    animation: { opacity: [0, 1], duration: 0.5 },
    icon: <FadeIn className="w-5 h-5" />
  },
  {
    id: 'slide-up',
    name: 'Slide Up',
    description: 'Aşağıdan yukarı',
    type: 'entrance',
    animation: { y: [50, 0], opacity: [0, 1], duration: 0.5 },
    icon: <Move className="w-5 h-5" />
  },
  {
    id: 'zoom-in',
    name: 'Zoom In',
    description: 'Yakınlaştır',
    type: 'entrance',
    animation: { scale: [0.8, 1], opacity: [0, 1], duration: 0.5 },
    icon: <ZoomIn className="w-5 h-5" />
  },
  {
    id: 'bounce',
    name: 'Bounce',
    description: 'Zıplat',
    type: 'entrance',
    animation: { y: [0, -20, 0], duration: 0.6 },
    icon: <Bounce className="w-5 h-5" />
  },
  {
    id: 'rotate',
    name: 'Rotate',
    description: 'Döndür',
    type: 'entrance',
    animation: { rotate: [0, 360], duration: 0.8 },
    icon: <RotateCw className="w-5 h-5" />
  },
  {
    id: 'hover-lift',
    name: 'Hover Lift',
    description: 'Yukarı kaldır',
    type: 'hover',
    animation: { y: -5, transition: { duration: 0.2 } },
    icon: <Move className="w-5 h-5" />
  },
  {
    id: 'hover-scale',
    name: 'Hover Scale',
    description: 'Büyüt',
    type: 'hover',
    animation: { scale: 1.05, transition: { duration: 0.2 } },
    icon: <ZoomIn className="w-5 h-5" />
  },
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Nabız atışı',
    type: 'hover',
    animation: { scale: [1, 1.1, 1], duration: 1, repeat: Infinity },
    icon: <Zap className="w-5 h-5" />
  },
];

export const AnimationPresetsImproved: React.FC<AnimationPresetsImprovedProps> = ({
  onSelect
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [previewId, setPreviewId] = useState<string | null>(null);

  const filteredPresets = selectedType === 'all'
    ? PRESETS
    : PRESETS.filter(p => p.type === selectedType);

  const handleSelect = (preset: AnimationPreset) => {
    onSelect?.(preset.animation);
    setPreviewId(preset.id);
    setTimeout(() => setPreviewId(null), 1000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Animation Presets</h3>
          <p className="text-xs text-gray-600">Hazır animasyonlar</p>
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-4">
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'entrance', 'hover', 'click', 'scroll'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                selectedType === type
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'Tümü' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Presets Grid */}
      <div className="grid grid-cols-2 gap-2">
        {filteredPresets.map((preset) => (
          <motion.button
            key={preset.id}
            onClick={() => handleSelect(preset)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-3 border-2 rounded-lg transition-all text-left ${
              previewId === preset.id
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-gray-200 hover:border-yellow-400'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="text-yellow-600">{preset.icon}</div>
              <div className="text-sm font-semibold text-gray-900">{preset.name}</div>
            </div>
            <div className="text-xs text-gray-600">{preset.description}</div>
          </motion.button>
        ))}
      </div>

      {/* Custom Animation */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <label className="block text-xs font-semibold text-gray-700 mb-2">
          Custom Animation
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <input
            type="text"
            placeholder="Duration (s)"
            className="border border-gray-300 rounded px-2 py-1"
          />
          <input
            type="text"
            placeholder="Delay (s)"
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>
      </div>
    </div>
  );
};


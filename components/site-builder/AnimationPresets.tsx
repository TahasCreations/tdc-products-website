"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEditorStore } from '@/lib/site-builder/store';

const ANIMATION_PRESETS = [
  {
    name: 'Fade In',
    key: 'fadeIn',
    config: {
      type: 'fade',
      duration: '0.5s',
      delay: '0s',
      trigger: 'load',
    },
    preview: (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded"
      />
    ),
  },
  {
    name: 'Slide In Left',
    key: 'slideInLeft',
    config: {
      type: 'slide',
      duration: '0.6s',
      delay: '0s',
      trigger: 'load',
    },
    preview: (
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded"
      />
    ),
  },
  {
    name: 'Slide In Right',
    key: 'slideInRight',
    config: {
      type: 'slide',
      duration: '0.6s',
      delay: '0s',
      trigger: 'load',
    },
    preview: (
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded"
      />
    ),
  },
  {
    name: 'Slide Up',
    key: 'slideUp',
    config: {
      type: 'slide',
      duration: '0.7s',
      delay: '0s',
      trigger: 'scroll',
    },
    preview: (
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded"
      />
    ),
  },
  {
    name: 'Scale In',
    key: 'scaleIn',
    config: {
      type: 'scale',
      duration: '0.5s',
      delay: '0s',
      trigger: 'load',
    },
    preview: (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded"
      />
    ),
  },
  {
    name: 'Bounce',
    key: 'bounce',
    config: {
      type: 'bounce',
      duration: '0.8s',
      delay: '0s',
      trigger: 'load',
    },
    preview: (
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
        className="w-full h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded"
      />
    ),
  },
  {
    name: 'Rotate In',
    key: 'rotateIn',
    config: {
      type: 'rotate',
      duration: '0.6s',
      delay: '0s',
      trigger: 'load',
    },
    preview: (
      <motion.div
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded"
      />
    ),
  },
  {
    name: 'Fade & Scale',
    key: 'fadeScale',
    config: {
      type: 'fade',
      duration: '0.7s',
      delay: '0.1s',
      trigger: 'scroll',
    },
    preview: (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="w-full h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded"
      />
    ),
  },
];

export const AnimationPresets: React.FC = () => {
  const { selectedComponentId, updateComponent } = useEditorStore();

  const applyAnimation = (preset: typeof ANIMATION_PRESETS[0]) => {
    if (!selectedComponentId) return;
    
    updateComponent(selectedComponentId, {
      animations: preset.config,
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="font-bold text-gray-900">Animation Presets</h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {ANIMATION_PRESETS.map((preset) => (
          <button
            key={preset.key}
            onClick={() => applyAnimation(preset)}
            className="group p-4 border-2 border-gray-200 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all text-left"
          >
            <div className="mb-2">{preset.preview}</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900 text-sm">{preset.name}</div>
                <div className="text-xs text-gray-500">
                  {preset.config.duration} • {preset.config.trigger}
                </div>
              </div>
              <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Uygula
              </div>
            </div>
          </button>
        ))}
      </div>

      {!selectedComponentId && (
        <div className="text-center py-8 text-sm text-gray-500">
          Animasyon eklemek için bir component seçin
        </div>
      )}
    </div>
  );
};


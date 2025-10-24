"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Type, Box, Sparkles } from 'lucide-react';
import { useEditorStore } from '@/lib/site-builder/store';

export const AdvancedStyleEditor: React.FC = () => {
  const { selectedComponentId, currentPage, updateComponent } = useEditorStore();
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'effects' | 'animations'>('colors');

  const selectedComponent = selectedComponentId && currentPage?.components[selectedComponentId];
  if (!selectedComponent) return null;

  const updateStyle = (key: string, value: string) => {
    const styles = { ...(selectedComponent.styles || {}), [key]: value };
    updateComponent(selectedComponent.id, { styles });
  };

  const tabs = [
    { key: 'colors', name: 'Colors', icon: <Palette className="w-4 h-4" /> },
    { key: 'typography', name: 'Typography', icon: <Type className="w-4 h-4" /> },
    { key: 'effects', name: 'Effects', icon: <Box className="w-4 h-4" /> },
    { key: 'animations', name: 'Animations', icon: <Sparkles className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-white border-t border-gray-200">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'colors' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Color Palette</label>
              <div className="grid grid-cols-5 gap-2">
                {['#000000', '#ffffff', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'].map(color => (
                  <button
                    key={color}
                    onClick={() => updateStyle('color', color)}
                    className="w-full aspect-square rounded-lg border-2 border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Background Gradients</label>
              <div className="space-y-2">
                {[
                  { name: 'Purple-Pink', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                  { name: 'Blue-Cyan', value: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)' },
                  { name: 'Orange-Red', value: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)' },
                  { name: 'Green-Teal', value: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' },
                ].map(gradient => (
                  <button
                    key={gradient.name}
                    onClick={() => updateStyle('background', gradient.value)}
                    className="w-full h-12 rounded-lg border-2 border-gray-300 hover:border-blue-600 transition-colors"
                    style={{ background: gradient.value }}
                  >
                    <span className="text-white font-medium text-xs">{gradient.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Font Family</label>
              <select
                value={selectedComponent.styles?.fontFamily || 'inherit'}
                onChange={(e) => updateStyle('fontFamily', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="inherit">Default</option>
                <option value="'Inter', sans-serif">Inter</option>
                <option value="'Poppins', sans-serif">Poppins</option>
                <option value="'Roboto', sans-serif">Roboto</option>
                <option value="'Montserrat', sans-serif">Montserrat</option>
                <option value="'Playfair Display', serif">Playfair Display</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Text Transform</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'none', label: 'None' },
                  { value: 'uppercase', label: 'ABC' },
                  { value: 'lowercase', label: 'abc' },
                  { value: 'capitalize', label: 'Abc' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => updateStyle('textTransform', option.value)}
                    className={`px-3 py-2 rounded border text-sm font-medium ${
                      selectedComponent.styles?.textTransform === option.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Letter Spacing</label>
              <input
                type="range"
                min="-2"
                max="10"
                step="0.5"
                value={parseFloat(selectedComponent.styles?.letterSpacing || '0')}
                onChange={(e) => updateStyle('letterSpacing', `${e.target.value}px`)}
                className="w-full"
              />
              <div className="text-xs text-gray-600 text-center">{selectedComponent.styles?.letterSpacing || '0px'}</div>
            </div>
          </div>
        )}

        {activeTab === 'effects' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Border</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={selectedComponent.styles?.borderWidth || ''}
                  onChange={(e) => updateStyle('borderWidth', e.target.value)}
                  placeholder="Border Width (e.g., 2px)"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={selectedComponent.styles?.borderColor || ''}
                  onChange={(e) => updateStyle('borderColor', e.target.value)}
                  placeholder="Border Color (e.g., #000000)"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Filter Effects</label>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-600">Blur</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={parseInt(selectedComponent.styles?.filter?.match(/blur\((\d+)px\)/)?.[1] || '0')}
                    onChange={(e) => updateStyle('filter', `blur(${e.target.value}px)`)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Brightness</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={parseInt(selectedComponent.styles?.filter?.match(/brightness\((\d+)%\)/)?.[1] || '100')}
                    onChange={(e) => updateStyle('filter', `brightness(${e.target.value}%)`)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'animations' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Transition</label>
              <input
                type="text"
                value={selectedComponent.styles?.transition || ''}
                onChange={(e) => updateStyle('transition', e.target.value)}
                placeholder="all 0.3s ease"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Hover Transform</label>
              <select
                value={selectedComponent.styles?.transform || 'none'}
                onChange={(e) => updateStyle('transform', e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="none">None</option>
                <option value="scale(1.05)">Scale Up</option>
                <option value="scale(0.95)">Scale Down</option>
                <option value="rotate(5deg)">Rotate Right</option>
                <option value="rotate(-5deg)">Rotate Left</option>
                <option value="translateY(-4px)">Move Up</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


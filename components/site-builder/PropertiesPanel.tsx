"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Type,
  Palette,
  Layout,
  Maximize,
  Move,
  Eye,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Search
} from 'lucide-react';
import { useEditorStore } from '@/lib/site-builder/store';
import { ComponentProps, StyleProps } from '@/lib/site-builder/types';
import { AnimationPresets } from './AnimationPresets';
import { SEOPanel } from './SEOPanel';
import { GlobalThemePanel } from './GlobalThemePanel';
import { AIContentAssistant } from './AIContentAssistant';
import { ColorPalettePicker } from './ColorPalettePicker';
import { TypographyManager } from './TypographyManager';

export const PropertiesPanel: React.FC = () => {
  const {
    currentPage,
    selectedComponentId,
    updateComponent,
    deleteComponent,
    duplicateComponent
  } = useEditorStore();

  const [expandedSections, setExpandedSections] = useState<string[]>(['content', 'layout', 'style']);
  const [activeTab, setActiveTab] = useState<'properties' | 'animations' | 'seo'>('properties');

  const selectedComponent = selectedComponentId && currentPage?.components[selectedComponentId];

  // Tab Navigation (Tema butonu sağ alt köşeye taşındı - FloatingThemeButton)
  const tabs = [
    { key: 'properties', name: 'Properties', icon: <Layout className="w-4 h-4" /> },
    { key: 'animations', name: 'Animations', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'seo', name: 'SEO', icon: <Search className="w-4 h-4" /> },
  ];

  // Render different panels based on active tab
  if (activeTab === 'animations') {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-3 py-3 text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
            </button>
          ))}
        </div>
        <AnimationPresets />
      </div>
    );
  }

  if (activeTab === 'seo') {
    return (
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-3 py-3 text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
            </button>
          ))}
        </div>
        <SEOPanel />
      </div>
    );
  }

  if (!selectedComponent) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="flex border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-3 py-3 text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Component Seçilmedi</h3>
            <p className="text-sm text-gray-600">
              Düzenlemek için bir component seçin
            </p>
          </div>
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const updateStyle = (key: keyof StyleProps, value: string) => {
    const styles = { ...(selectedComponent.styles || {}), [key]: value };
    updateComponent(selectedComponent.id, { styles });
  };

  const updateContent = (key: string, value: any) => {
    const content = { ...(selectedComponent.content || {}), [key]: value };
    updateComponent(selectedComponent.id, { content });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 px-3 py-3 text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
              activeTab === tab.key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-gray-900 mb-1">Properties</h3>
        <p className="text-xs text-gray-600">
          {selectedComponent.settings?.name || selectedComponent.type}
        </p>
      </div>

      {/* Actions */}
      <div className="p-4 border-b border-gray-200 flex gap-2">
        <button
          onClick={() => duplicateComponent(selectedComponent.id)}
          className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
        >
          <Copy className="w-4 h-4" />
          Kopya
        </button>
        <button
          onClick={() => deleteComponent(selectedComponent.id)}
          className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Sil
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Content Section */}
        {(selectedComponent.type === 'text' || 
          selectedComponent.type === 'heading' || 
          selectedComponent.type === 'button' ||
          selectedComponent.type === 'link') && (
          <Section
            title="İçerik"
            icon={<Type className="w-4 h-4" />}
            isExpanded={expandedSections.includes('content')}
            onToggle={() => toggleSection('content')}
          >
            <div className="space-y-3">
              {/* AI Content Assistant */}
              <AIContentAssistant
                contentType={selectedComponent.type === 'heading' ? 'heading' : selectedComponent.type === 'button' ? 'button' : 'text'}
                onContentGenerated={(content) => updateContent('text', content)}
              />
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Metin</label>
                <textarea
                  value={selectedComponent.content?.text || ''}
                  onChange={(e) => updateContent('text', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="İçeriği buraya yazın..."
                />
              </div>
              
              {(selectedComponent.type === 'button' || selectedComponent.type === 'link') && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Link URL</label>
                  <input
                    type="text"
                    value={selectedComponent.content?.href || ''}
                    onChange={(e) => updateContent('href', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://..."
                  />
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Image/Video Content */}
        {(selectedComponent.type === 'image' || selectedComponent.type === 'video') && (
          <Section
            title="Medya"
            icon={<Type className="w-4 h-4" />}
            isExpanded={expandedSections.includes('content')}
            onToggle={() => toggleSection('content')}
          >
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">URL</label>
                <input
                  type="text"
                  value={selectedComponent.content?.src || ''}
                  onChange={(e) => updateContent('src', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="/path/to/image.jpg"
                />
              </div>
              
              {selectedComponent.type === 'image' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Alt Text</label>
                  <input
                    type="text"
                    value={selectedComponent.content?.alt || ''}
                    onChange={(e) => updateContent('alt', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Görsel açıklaması"
                  />
                </div>
              )}
              
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                📁 Medya Kütüphanesinden Seç
              </button>
            </div>
          </Section>
        )}

        {/* Layout Section */}
        <Section
          title="Layout"
          icon={<Layout className="w-4 h-4" />}
          isExpanded={expandedSections.includes('layout')}
          onToggle={() => toggleSection('layout')}
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Width</label>
                <input
                  type="text"
                  value={selectedComponent.styles?.width || ''}
                  onChange={(e) => updateStyle('width', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="auto"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Height</label>
                <input
                  type="text"
                  value={selectedComponent.styles?.height || ''}
                  onChange={(e) => updateStyle('height', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="auto"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Display</label>
              <select
                value={selectedComponent.styles?.display || 'block'}
                onChange={(e) => updateStyle('display', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm"
              >
                <option value="block">Block</option>
                <option value="flex">Flex</option>
                <option value="grid">Grid</option>
                <option value="inline">Inline</option>
                <option value="inline-block">Inline Block</option>
                <option value="none">None</option>
              </select>
            </div>

            {selectedComponent.styles?.display === 'flex' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Flex Direction</label>
                  <select
                    value={selectedComponent.styles?.flexDirection || 'row'}
                    onChange={(e) => updateStyle('flexDirection', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm"
                  >
                    <option value="row">Row</option>
                    <option value="column">Column</option>
                    <option value="row-reverse">Row Reverse</option>
                    <option value="column-reverse">Column Reverse</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Justify</label>
                    <select
                      value={selectedComponent.styles?.justifyContent || 'start'}
                      onChange={(e) => updateStyle('justifyContent', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="start">Start</option>
                      <option value="center">Center</option>
                      <option value="end">End</option>
                      <option value="space-between">Space Between</option>
                      <option value="space-around">Space Around</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Align</label>
                    <select
                      value={selectedComponent.styles?.alignItems || 'start'}
                      onChange={(e) => updateStyle('alignItems', e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="start">Start</option>
                      <option value="center">Center</option>
                      <option value="end">End</option>
                      <option value="stretch">Stretch</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {selectedComponent.styles?.display === 'grid' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Grid Columns</label>
                  <input
                    type="text"
                    value={selectedComponent.styles?.gridTemplateColumns || ''}
                    onChange={(e) => updateStyle('gridTemplateColumns', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="repeat(3, 1fr)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Gap</label>
                  <input
                    type="text"
                    value={selectedComponent.styles?.gap || ''}
                    onChange={(e) => updateStyle('gap', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="1rem"
                  />
                </div>
              </>
            )}
          </div>
        </Section>

        {/* Spacing Section */}
        <Section
          title="Spacing"
          icon={<Move className="w-4 h-4" />}
          isExpanded={expandedSections.includes('spacing')}
          onToggle={() => toggleSection('spacing')}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Padding</label>
              <div className="grid grid-cols-4 gap-1">
                <input
                  type="text"
                  value={selectedComponent.styles?.paddingTop || ''}
                  onChange={(e) => updateStyle('paddingTop', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs text-center"
                  placeholder="Top"
                />
                <input
                  type="text"
                  value={selectedComponent.styles?.paddingRight || ''}
                  onChange={(e) => updateStyle('paddingRight', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs text-center"
                  placeholder="Right"
                />
                <input
                  type="text"
                  value={selectedComponent.styles?.paddingBottom || ''}
                  onChange={(e) => updateStyle('paddingBottom', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs text-center"
                  placeholder="Bottom"
                />
                <input
                  type="text"
                  value={selectedComponent.styles?.paddingLeft || ''}
                  onChange={(e) => updateStyle('paddingLeft', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs text-center"
                  placeholder="Left"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Margin</label>
              <div className="grid grid-cols-4 gap-1">
                <input
                  type="text"
                  value={selectedComponent.styles?.marginTop || ''}
                  onChange={(e) => updateStyle('marginTop', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs text-center"
                  placeholder="Top"
                />
                <input
                  type="text"
                  value={selectedComponent.styles?.marginRight || ''}
                  onChange={(e) => updateStyle('marginRight', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs text-center"
                  placeholder="Right"
                />
                <input
                  type="text"
                  value={selectedComponent.styles?.marginBottom || ''}
                  onChange={(e) => updateStyle('marginBottom', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs text-center"
                  placeholder="Bottom"
                />
                <input
                  type="text"
                  value={selectedComponent.styles?.marginLeft || ''}
                  onChange={(e) => updateStyle('marginLeft', e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-xs text-center"
                  placeholder="Left"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Typography Section */}
        {(selectedComponent.type === 'text' || selectedComponent.type === 'heading' || selectedComponent.type === 'button') && (
          <Section
            title="Typography"
            icon={<Type className="w-4 h-4" />}
            isExpanded={expandedSections.includes('typography')}
            onToggle={() => toggleSection('typography')}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Font Size</label>
                  <input
                    type="text"
                    value={selectedComponent.styles?.fontSize || ''}
                    onChange={(e) => updateStyle('fontSize', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="1rem"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Font Weight</label>
                  <select
                    value={selectedComponent.styles?.fontWeight || '400'}
                    onChange={(e) => updateStyle('fontWeight', e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="300">Light</option>
                    <option value="400">Normal</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                    <option value="800">Extra Bold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Text Align</label>
                <div className="grid grid-cols-4 gap-1">
                  {['left', 'center', 'right', 'justify'].map((align) => (
                    <button
                      key={align}
                      onClick={() => updateStyle('textAlign', align)}
                      className={`px-2 py-1 border rounded text-xs ${
                        selectedComponent.styles?.textAlign === align
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {align[0].toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Line Height</label>
                <input
                  type="text"
                  value={selectedComponent.styles?.lineHeight || ''}
                  onChange={(e) => updateStyle('lineHeight', e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  placeholder="1.5"
                />
              </div>
            </div>
          </Section>
        )}

        {/* Colors Section */}
        <Section
          title="Colors"
          icon={<Palette className="w-4 h-4" />}
          isExpanded={expandedSections.includes('colors')}
          onToggle={() => toggleSection('colors')}
        >
          <div className="space-y-3">
            <ColorPalettePicker
              label="Text Color"
              value={selectedComponent.styles?.color || '#000000'}
              onChange={(color) => updateStyle('color', color)}
            />

            <ColorPalettePicker
              label="Background Color"
              value={selectedComponent.styles?.backgroundColor || '#ffffff'}
              onChange={(color) => updateStyle('backgroundColor', color)}
            />

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Gradient (advanced)</label>
              <input
                type="text"
                value={selectedComponent.styles?.background || ''}
                onChange={(e) => updateStyle('background', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="linear-gradient(...)"
              />
            </div>
          </div>
        </Section>

        {/* Border & Effects */}
        <Section
          title="Border & Effects"
          icon={<Maximize className="w-4 h-4" />}
          isExpanded={expandedSections.includes('effects')}
          onToggle={() => toggleSection('effects')}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Border Radius</label>
              <input
                type="text"
                value={selectedComponent.styles?.borderRadius || ''}
                onChange={(e) => updateStyle('borderRadius', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="8px"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Box Shadow</label>
              <select
                value={selectedComponent.styles?.boxShadow || 'none'}
                onChange={(e) => updateStyle('boxShadow', e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="none">None</option>
                <option value="0 1px 3px rgba(0,0,0,0.1)">Small</option>
                <option value="0 4px 6px rgba(0,0,0,0.1)">Medium</option>
                <option value="0 10px 15px rgba(0,0,0,0.1)">Large</option>
                <option value="0 20px 25px rgba(0,0,0,0.1)">Extra Large</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Opacity</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedComponent.styles?.opacity || '1'}
                onChange={(e) => updateStyle('opacity', e.target.value)}
                className="w-full"
              />
              <div className="text-xs text-gray-600 text-center">{selectedComponent.styles?.opacity || '1'}</div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

// Collapsible Section Component
const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, icon, isExpanded, onToggle, children }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 font-semibold text-gray-900 text-sm">
          {icon}
          {title}
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-4 py-3 bg-gray-50"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};


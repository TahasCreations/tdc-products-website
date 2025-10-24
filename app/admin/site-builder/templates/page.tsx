"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, FileText, Eye, Plus } from 'lucide-react';
import { ADVANCED_TEMPLATES } from '@/lib/site-builder/advanced-templates';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  category: string;
  components: any;
  rootComponentIds: string[];
}

const BASIC_TEMPLATES: Template[] = [
  {
    id: 'blank',
    name: 'Boş Sayfa',
    description: 'Sıfırdan oluşturun',
    thumbnail: '/templates/blank.jpg',
    category: 'basic',
    components: {},
    rootComponentIds: []
  },
  {
    id: 'landing-hero',
    name: 'Landing Page - Hero',
    description: 'Hero section ile landing page',
    thumbnail: '/templates/landing-hero.jpg',
    category: 'landing',
    components: {
      'hero-1': {
        id: 'hero-1',
        type: 'hero',
        content: {
          text: 'Harika Ürünlerinizi Sergileyin'
        },
        styles: {
          padding: '6rem 2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          textAlign: 'center',
          minHeight: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }
      }
    },
    rootComponentIds: ['hero-1']
  },
  {
    id: 'about-page',
    name: 'Hakkımızda Sayfası',
    description: 'Şirket hakkında bilgi sayfası',
    thumbnail: '/templates/about.jpg',
    category: 'content',
    components: {
      'section-1': {
        id: 'section-1',
        type: 'section',
        children: ['container-1'],
        styles: {
          padding: '4rem 1rem',
          backgroundColor: '#ffffff',
        }
      },
      'container-1': {
        id: 'container-1',
        type: 'container',
        parentId: 'section-1',
        children: ['heading-1', 'text-1'],
        styles: {
          maxWidth: '800px',
          margin: '0 auto',
        }
      },
      'heading-1': {
        id: 'heading-1',
        type: 'heading',
        parentId: 'container-1',
        content: { text: 'Hakkımızda' },
        styles: {
          fontSize: '3rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }
      },
      'text-1': {
        id: 'text-1',
        type: 'text',
        parentId: 'container-1',
        content: { text: 'Şirketimiz hakkında harika bir açıklama buraya gelecek...' },
        styles: {
          fontSize: '1.125rem',
          lineHeight: '1.8',
          color: '#4a5568',
        }
      }
    },
    rootComponentIds: ['section-1']
  },
  {
    id: 'product-grid',
    name: 'Ürün Grid',
    description: '3 sütunlu ürün grid',
    thumbnail: '/templates/product-grid.jpg',
    category: 'ecommerce',
    components: {
      'section-1': {
        id: 'section-1',
        type: 'section',
        children: ['grid-1'],
        styles: {
          padding: '4rem 2rem',
        }
      },
      'grid-1': {
        id: 'grid-1',
        type: 'grid',
        parentId: 'section-1',
        styles: {
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }
      }
    },
    rootComponentIds: ['section-1']
  }
];

export default function TemplatesPage() {
  const router = useRouter();
  const allTemplates = [...BASIC_TEMPLATES, ...ADVANCED_TEMPLATES];
  const [templates, setTemplates] = useState<Template[]>(allTemplates);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { key: 'all', name: 'Tümü' },
    { key: 'basic', name: 'Temel' },
    { key: 'landing', name: 'Landing Page' },
    { key: 'content', name: 'İçerik' },
    { key: 'ecommerce', name: 'E-Ticaret' },
    { key: 'marketing', name: 'Marketing' },
    { key: 'layout', name: 'Layout' },
  ];

  const handleUseTemplate = async (template: Template) => {
    try {
      const response = await fetch('/api/site-builder/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Yeni Sayfa - ${template.name}`,
          slug: `new-page-${Date.now()}`,
          template: {
            components: template.components,
            rootComponentIds: template.rootComponentIds
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/admin/site-builder/editor/${data.page.id}`);
      }
    } catch (error) {
      console.error('Error creating page from template:', error);
      alert('Şablon uygulanamadı');
    }
  };

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sayfa Şablonları</h1>
              <p className="text-gray-600">Hazır şablonlarla hızlıca başlayın</p>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex gap-2 flex-wrap"
        >
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === cat.key
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-purple-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-16 h-16 text-purple-400" />
                </div>
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="px-6 py-3 bg-white rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Kullan
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Bu Şablonu Kullan
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


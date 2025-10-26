"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  Loader2,
  X,
  Copy,
  Check,
  MessageSquare,
  Type,
  Image as ImageIcon,
  Zap
} from 'lucide-react';

interface AIContentAssistantProps {
  onContentGenerated?: (content: string) => void;
  contentType?: 'heading' | 'text' | 'button' | 'meta';
  initialPrompt?: string;
}

export const AIContentAssistant: React.FC<AIContentAssistantProps> = ({
  onContentGenerated,
  contentType = 'text',
  initialPrompt = ''
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateContent = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      // Simüle edilmiş AI içerik üretimi
      // Gerçek uygulamada OpenAI veya başka bir AI servisi kullanılabilir
      await new Promise(resolve => setTimeout(resolve, 2000));

      let content = '';
      
      switch (contentType) {
        case 'heading':
          content = generateHeading(prompt);
          break;
        case 'text':
          content = generateText(prompt);
          break;
        case 'button':
          content = generateButtonText(prompt);
          break;
        case 'meta':
          content = generateMetaDescription(prompt);
          break;
      }

      setGeneratedContent(content);
      
      if (onContentGenerated) {
        onContentGenerated(content);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateHeading = (prompt: string): string => {
    const suggestions = [
      `Dönüştürücü ${prompt} Çözümü`,
      `${prompt} ile Geleceği Şekillendirin`,
      `Güçlü ${prompt} Stratejisi`,
      `${prompt} İçin Profesyonel Çözüm`,
      `Modern ${prompt} Yaklaşımı`
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const generateText = (prompt: string): string => {
    return `Harika bir ${prompt} deneyimi sunuyoruz. Profesyonel ekibimiz ve modern teknolojimiz ile size en iyi hizmeti veriyoruz. Kalite ve müşteri memnuniyeti bizim önceliğimizdir.`;
  };

  const generateButtonText = (prompt: string): string => {
    const suggestions = [
      'Şimdi Başla',
      'Ücretsiz Dene',
      'Hemen Keşfet',
      'Daha Fazla Bilgi',
      'Bize Ulaşın'
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const generateMetaDescription = (prompt: string): string => {
    return `${prompt} hakkında detaylı bilgi. Profesyonel çözümler ve kaliteli hizmet. Hemen keşfedin!`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">AI İçerik Asistanı</h3>
          <p className="text-xs text-gray-600">Akıllı içerik önerileri</p>
        </div>
      </div>

      {/* Input */}
      <div className="mb-4">
        <div className="relative">
          <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="İçerik için kısa bir açıklama yazın..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            onKeyPress={(e) => e.key === 'Enter' && generateContent()}
          />
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateContent}
        disabled={isGenerating || !prompt.trim()}
        className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg transition-all"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Üretiliyor...
          </>
        ) : (
          <>
            <Wand2 className="w-4 h-4" />
            İçerik Üret
          </>
        )}
      </button>

      {/* Generated Content */}
      <AnimatePresence>
        {generatedContent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-900">
                <Zap className="w-4 h-4" />
                Önerilen İçerik
              </div>
              <button
                onClick={handleCopy}
                className="p-1 hover:bg-purple-200 rounded transition-colors"
                title="Kopyala"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-purple-600" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-700">{generatedContent}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Suggestions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 mb-2">Hızlı Öneriler:</p>
        <div className="flex flex-wrap gap-2">
          {['Ürün açıklaması', 'Blog yazısı', 'Satış metni', 'Hakkımızda'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Check,
  ChevronDown
} from 'lucide-react';
import { I18nService, supportedLanguages } from '@/lib/i18n/translations';

export const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    const detected = I18nService.detectLanguage();
    setCurrentLang(detected);
    I18nService.setLanguage(detected);
  }, []);

  const handleLanguageChange = (code: string) => {
    setCurrentLang(code);
    I18nService.setLanguage(code);
    setIsOpen(false);
    
    // Reload page to apply language
    window.location.reload();
  };

  const current = supportedLanguages.find(l => l.code === currentLang);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-lg">{current?.flag}</span>
        <span className="text-sm font-medium text-gray-700">{current?.code.toUpperCase()}</span>
        <ChevronDown className="w-4 h-4 text-gray-600" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <h3 className="font-bold text-gray-900">Dil Seç</h3>
                <p className="text-xs text-gray-600 mt-1">Tercih ettiğiniz dili seçin</p>
              </div>

              {/* Languages */}
              <div className="max-h-80 overflow-y-auto">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                      currentLang === lang.code ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-gray-900">{lang.nativeName}</div>
                        <div className="text-xs text-gray-500">{lang.name}</div>
                      </div>
                    </div>
                    {currentLang === lang.code && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};


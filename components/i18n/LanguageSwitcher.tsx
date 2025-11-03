'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { getCurrentLanguage, setLanguage, type Language } from '@/lib/i18n/translations';

const languages = [
  { code: 'tr' as Language, name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
  { code: 'ar' as Language, name: 'العربية', flag: '🇸🇦' },
  { code: 'ru' as Language, name: 'Русский', flag: '🇷🇺' }
];

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<Language>('tr');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentLang(getCurrentLanguage());
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  const current = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-2xl">{current.flag}</span>
        <span className="text-sm font-medium text-gray-700">{current.name}</span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50 min-w-[200px]"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-indigo-50 transition-colors ${
                    lang.code === currentLang ? 'bg-indigo-50' : ''
                  }`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium text-gray-900">{lang.name}</span>
                  {lang.code === currentLang && (
                    <span className="ml-auto text-indigo-600">✓</span>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

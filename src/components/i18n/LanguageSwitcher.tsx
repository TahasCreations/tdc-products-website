'use client';

import { useState, useEffect } from 'react';
import { 
  GlobeAltIcon, 
  CheckIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useI18n } from '../../hooks/useI18n';

interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'zh', name: '中文', flag: '🇨🇳', nativeName: '中文' }
];

interface LanguageSwitcherProps {
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
  showFlags?: boolean;
  showNativeNames?: boolean;
  className?: string;
}

export default function LanguageSwitcher({
  currentLanguage,
  onLanguageChange,
  showFlags = true,
  showNativeNames = true,
  className = ''
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, changeLanguage } = useI18n();
  const selectedLanguage = currentLanguage || locale;

  const handleLanguageChange = (languageCode: string) => {
    setIsOpen(false);

    if (onLanguageChange) {
      onLanguageChange(languageCode);
    } else {
      // i18n hook'unu kullan
      changeLanguage(languageCode);
    }
  };

  const currentLang = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
      >
        {showFlags && (
          <span className="text-lg">{currentLang.flag}</span>
        )}
        <span className="text-sm font-medium text-gray-700">
          {showNativeNames ? currentLang.nativeName : currentLang.name}
        </span>
        <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    selectedLanguage === language.code ? 'bg-blue-50' : ''
                  }`}
                >
                  {showFlags && (
                    <span className="text-lg">{language.flag}</span>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {showNativeNames ? language.nativeName : language.name}
                    </div>
                    {showNativeNames && language.nativeName !== language.name && (
                      <div className="text-sm text-gray-500">{language.name}</div>
                    )}
                  </div>
                  {selectedLanguage === language.code && (
                    <CheckIcon className="w-5 h-5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

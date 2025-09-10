'use client';

import { useState, useEffect } from 'react';
import { supportedLanguages, SupportedLanguage, getTranslation, formatCurrency, formatDate } from '../lib/i18n';

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  showFlags?: boolean;
  showNativeNames?: boolean;
  compact?: boolean;
}

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  showFlags = true,
  showNativeNames = true,
  compact = false
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const currentLang = supportedLanguages.find(lang => lang.code === currentLanguage);
    setIsRTL(currentLang?.rtl || false);
  }, [currentLanguage]);

  const currentLangConfig = supportedLanguages.find(lang => lang.code === currentLanguage);

  const handleLanguageChange = (language: SupportedLanguage) => {
    onLanguageChange(language);
    setIsOpen(false);
    
    // Update document direction for RTL languages
    const newLangConfig = supportedLanguages.find(lang => lang.code === language);
    if (newLangConfig) {
      document.documentElement.dir = newLangConfig.rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  };

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          {showFlags && (
            <span className="text-lg">{currentLangConfig?.flag}</span>
          )}
          <span className="text-sm font-medium uppercase">
            {currentLanguage}
          </span>
          <i className={`ri-arrow-down-s-line transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-32">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2 ${
                  currentLanguage === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                } ${lang.code === supportedLanguages[0].code ? 'rounded-t-lg' : ''} ${
                  lang.code === supportedLanguages[supportedLanguages.length - 1].code ? 'rounded-b-lg' : ''
                }`}
              >
                {showFlags && <span className="text-base">{lang.flag}</span>}
                <span className="font-medium uppercase">{lang.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
      >
        {showFlags && (
          <span className="text-xl">{currentLangConfig?.flag}</span>
        )}
        <div className="text-left">
          <div className="font-medium text-gray-900">
            {showNativeNames ? currentLangConfig?.nativeName : currentLangConfig?.name}
          </div>
          <div className="text-sm text-gray-500">
            {currentLangConfig?.name}
          </div>
        </div>
        <i className={`ri-arrow-down-s-line transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-64">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 px-2">
              {getTranslation('common.language', currentLanguage)}
            </div>
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3 ${
                  currentLanguage === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="flex-1">
                  <div className="font-medium">
                    {showNativeNames ? lang.nativeName : lang.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {lang.name}
                  </div>
                </div>
                {currentLanguage === lang.code && (
                  <i className="ri-check-line text-blue-600"></i>
                )}
              </button>
            ))}
          </div>
          
          {/* Language Info */}
          <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-lg">
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>{getTranslation('common.currency', currentLanguage)}:</span>
                <span className="font-medium">{currentLangConfig?.currency}</span>
              </div>
              <div className="flex justify-between">
                <span>{getTranslation('common.dateFormat', currentLanguage)}:</span>
                <span className="font-medium">{currentLangConfig?.dateFormat}</span>
              </div>
              <div className="flex justify-between">
                <span>{getTranslation('common.direction', currentLanguage)}:</span>
                <span className="font-medium">
                  {currentLangConfig?.rtl ? 'RTL' : 'LTR'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}

// Language Context Hook
export function useLanguage() {
  const [language, setLanguage] = useState<SupportedLanguage>('tr');

  useEffect(() => {
    // Get language from localStorage or browser
    const savedLanguage = localStorage.getItem('language') as SupportedLanguage;
    const browserLanguage = navigator.language.split('-')[0] as SupportedLanguage;
    
    const initialLanguage = savedLanguage || 
      (supportedLanguages.some(lang => lang.code === browserLanguage) ? browserLanguage : 'tr');
    
    setLanguage(initialLanguage);
    
    // Update document
    const langConfig = supportedLanguages.find(lang => lang.code === initialLanguage);
    if (langConfig) {
      document.documentElement.dir = langConfig.rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = initialLanguage;
    }
  }, []);

  const changeLanguage = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // Update document
    const langConfig = supportedLanguages.find(lang => lang.code === newLanguage);
    if (langConfig) {
      document.documentElement.dir = langConfig.rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = newLanguage;
    }
  };

  return {
    language,
    changeLanguage,
    formatCurrency: (amount: number) => formatCurrency(amount, language),
    formatDate: (date: Date) => formatDate(date, language),
    formatNumber: (number: number) => number.toLocaleString(language),
    t: (key: string) => getTranslation(key, language),
    isRTL: supportedLanguages.find(lang => lang.code === language)?.rtl || false
  };
}

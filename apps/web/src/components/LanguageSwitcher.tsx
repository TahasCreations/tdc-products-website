'use client';

import { useState, useEffect } from 'react';
import { 
  supportedLanguages, 
  SupportedLanguage, 
  getSavedLanguagePreference, 
  saveLanguagePreference,
  getTranslation 
} from '../lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function LanguageSwitcher({ 
  className = '', 
  showLabel = true, 
  size = 'md' 
}: LanguageSwitcherProps) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('tr');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved language preference
    const savedLang = getSavedLanguagePreference();
    setCurrentLanguage(savedLang);
  }, []);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    saveLanguagePreference(lang);
    setIsOpen(false);
    
    // Trigger language change event
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: lang } 
    }));
    
    // In a real app, you might want to reload the page or update the URL
    // window.location.reload();
  };

  const currentLangData = supportedLanguages.find(lang => lang.code === currentLanguage);

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3'
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-2 bg-white border border-gray-300 rounded-lg 
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 
          transition-colors duration-200 ${sizeClasses[size]}
        `}
      >
        <span className="text-lg">{currentLangData?.flag}</span>
        {showLabel && (
          <span className="font-medium text-gray-700">
            {currentLangData?.name}
          </span>
        )}
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            <div className="py-1">
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-2 text-left 
                    hover:bg-gray-50 transition-colors duration-150
                    ${currentLanguage === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                  `}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                  {currentLanguage === lang.code && (
                    <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
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

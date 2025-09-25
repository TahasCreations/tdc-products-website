'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
// Mock translation hook for now
const useTranslation = () => ({ t: (key: string) => key });
import {
  GlobeAltIcon,
  ChevronDownIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface Language {
  code: string;
  name: string;
  native_name: string;
  flag_emoji: string;
  is_rtl: boolean;
  is_active: boolean;
}

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'dropdown' | 'buttons' | 'select';
}

export default function LanguageSwitcher({ 
  className = '', 
  showLabel = true,
  variant = 'dropdown' 
}: LanguageSwitcherProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();
  const { i18n } = useTranslation();

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (languages.length > 0) {
      const current = languages.find(lang => lang.code === i18n.language) || languages[0];
      setCurrentLanguage(current);
    }
  }, [languages, i18n.language]);

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/i18n/languages');
      if (response.ok) {
        const data = await response.json();
        setLanguages(data.filter((lang: Language) => lang.is_active));
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (languageCode: string) => {
    try {
      // Update i18n language
      await i18n.changeLanguage(languageCode);
      
      // Update document direction for RTL languages
      const selectedLanguage = languages.find(lang => lang.code === languageCode);
      if (selectedLanguage) {
        document.documentElement.dir = selectedLanguage.is_rtl ? 'rtl' : 'ltr';
        document.documentElement.lang = languageCode;
      }

      // Save language preference
      await fetch('/api/i18n/user-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          language: languageCode,
          type: 'language'
        })
      });

      setIsOpen(false);
      
      // Refresh the page to apply language changes
      router.refresh();
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  if (loading || !currentLanguage) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <GlobeAltIcon className="w-5 h-5 text-gray-400 animate-pulse" />
        {showLabel && <span className="text-sm text-gray-400">Yükleniyor...</span>}
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">Dil:</span>
        )}
        <div className="flex space-x-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                currentLanguage.code === language.code
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={language.native_name}
            >
              <span className="mr-1">{language.flag_emoji}</span>
              <span className="hidden sm:inline">{language.code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'select') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700">Dil:</span>
        )}
        <select
          value={currentLanguage.code}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.flag_emoji} {language.native_name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <GlobeAltIcon className="w-4 h-4" />
        {showLabel && <span>Dil:</span>}
        <span className="mr-1">{currentLanguage.flag_emoji}</span>
        <span className="hidden sm:inline">{currentLanguage.native_name}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                    currentLanguage.code === language.code ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{language.flag_emoji}</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {language.native_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {language.name}
                      </div>
                    </div>
                  </div>
                  {currentLanguage.code === language.code && (
                    <CheckIcon className="w-4 h-4 text-blue-600" />
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

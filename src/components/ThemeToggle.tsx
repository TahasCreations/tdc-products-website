'use client';

import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: 'light', label: 'Açık', icon: 'ri-sun-line' },
    { value: 'dark', label: 'Koyu', icon: 'ri-moon-line' },
    { value: 'system', label: 'Sistem', icon: 'ri-computer-line' }
  ] as const;

  const getCurrentThemeIcon = () => {
    if (theme === 'system') {
      return isDark ? 'ri-moon-line' : 'ri-sun-line';
    }
    return theme === 'dark' ? 'ri-moon-line' : 'ri-sun-line';
  };

  const getCurrentThemeLabel = () => {
    if (theme === 'system') {
      return isDark ? 'Koyu (Sistem)' : 'Açık (Sistem)';
    }
    return theme === 'dark' ? 'Koyu' : 'Açık';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
        aria-label="Tema değiştir"
      >
        <i className={`${getCurrentThemeIcon()} text-lg`}></i>
        <span className="hidden sm:inline text-sm font-medium">
          {getCurrentThemeLabel()}
        </span>
        <i className={`ri-arrow-down-s-line text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="py-2">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                  theme === themeOption.value
                    ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <i className={`${themeOption.icon} text-lg`}></i>
                <span className="text-sm font-medium">{themeOption.label}</span>
                {theme === themeOption.value && (
                  <i className="ri-check-line ml-auto text-orange-600 dark:text-orange-400"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

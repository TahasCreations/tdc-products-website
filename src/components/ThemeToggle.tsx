'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themes = [
    { value: 'light', label: 'Açık', icon: '☀️' },
    { value: 'dark', label: 'Koyu', icon: '🌙' },
    { value: 'system', label: 'Sistem', icon: '💻' }
  ];

  return (
    <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {themes.map((themeOption) => (
        <button
          key={themeOption.value}
          onClick={() => setTheme(themeOption.value as 'light' | 'dark' | 'system')}
          className={`relative px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            theme === themeOption.value
              ? 'text-white'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          {theme === themeOption.value && (
            <motion.div
              layoutId="theme-bg"
              className="absolute inset-0 bg-indigo-600 rounded-md"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative flex items-center space-x-1">
            <span>{themeOption.icon}</span>
            <span className="hidden sm:inline">{themeOption.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

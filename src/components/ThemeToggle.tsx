'use client';

import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const order: Array<'system' | 'light' | 'dark'> = ['system', 'light', 'dark'];
  const nextTheme = () => {
    const idx = order.indexOf(theme);
    const next = order[(idx + 1) % order.length];
    setTheme(next);
  };

  const icon = theme === 'system' ? '💻' : resolvedTheme === 'dark' ? '🌙' : '☀️';
  const label = theme === 'system' ? 'Sistem' : resolvedTheme === 'dark' ? 'Koyu' : 'Açık';

  return (
    <button
      onClick={nextTheme}
      aria-label={`Tema: ${label}`}
      className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all bg-gray-100 dark:bg-gray-800 text-ink-700 dark:text-ink-200 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

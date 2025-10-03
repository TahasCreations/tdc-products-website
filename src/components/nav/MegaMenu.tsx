'use client';

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES, type Cat } from '@/data/nav';

interface MegaMenuContextType {
  activeCategory: Cat | null;
  setActiveCategory: (category: Cat | null) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const MegaMenuContext = createContext<MegaMenuContextType | null>(null);

const useMegaMenu = () => {
  const context = useContext(MegaMenuContext);
  if (!context) {
    throw new Error('useMegaMenu must be used within MegaMenu.Root');
  }
  return context;
};

// Root component - provides context
export function Root({ children }: { children: ReactNode }) {
  const [activeCategory, setActiveCategory] = useState<Cat | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetActiveCategory = (category: Cat | null) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (category) {
      setActiveCategory(category);
      setIsOpen(true);
    } else {
      // 120ms delay before closing to prevent flicker
      timeoutRef.current = setTimeout(() => {
        setActiveCategory(null);
        setIsOpen(false);
      }, 120);
    }
  };

  const handleSetOpen = (open: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(open);
    if (!open) {
      setActiveCategory(null);
    }
  };

  // Close on scroll
  useEffect(() => {
    const handleScroll = () => {
      handleSetOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSetOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('[data-mega-menu]')) {
        handleSetOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <MegaMenuContext.Provider
      value={{
        activeCategory,
        setActiveCategory: handleSetActiveCategory,
        isOpen,
        setIsOpen: handleSetOpen,
      }}
    >
      <div className="relative" data-mega-menu>
        {children}
      </div>
    </MegaMenuContext.Provider>
  );
}

// Trigger component - hover/focus handler
export function Trigger({ cat, children }: { cat: Cat; children: ReactNode }) {
  const { setActiveCategory, setIsOpen } = useMegaMenu();

  const handleMouseEnter = () => {
    setActiveCategory(cat);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
  };

  const handleFocus = () => {
    setActiveCategory(cat);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveCategory(cat);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={false}
      className="relative"
    >
      {children}
    </div>
  );
}

// Panel component - the dropdown
export function Panel() {
  const { activeCategory, isOpen } = useMegaMenu();

  if (!activeCategory) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.12, ease: 'easeOut' }}
          className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[min(1100px,92vw)] z-50"
          role="menu"
        >
          <div className="rounded-2xl shadow-xl bg-white/95 backdrop-blur-sm border border-gray-200/50 overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {activeCategory.label}
                </h3>
                <Link
                  href={activeCategory.href}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
                >
                  Tümünü gör →
                </Link>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeCategory.children.map((subcat, index) => (
                  <Link
                    key={index}
                    href={subcat.href}
                    className="group p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-700 group-hover:text-indigo-600 font-medium transition-colors">
                      {subcat.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Mobile accordion for touch devices
export function MobileAccordion({ cat }: { cat: Cat }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isExpanded}
      >
        <span className="font-medium text-gray-700">{cat.label}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-6 pb-3 space-y-2">
              {cat.children.map((subcat, index) => (
                <Link
                  key={index}
                  href={subcat.href}
                  className="block py-2 text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  {subcat.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Export default object for easier usage
const MegaMenu = {
  Root,
  Trigger,
  Panel,
  MobileAccordion,
};

export default MegaMenu;

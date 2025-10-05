'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface A11yContextType {
  // Focus management
  focusElement: (element: HTMLElement | null) => void;
  trapFocus: (container: HTMLElement) => void;
  releaseFocus: () => void;
  
  // Screen reader announcements
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  
  // Reduced motion
  prefersReducedMotion: boolean;
  
  // High contrast mode
  prefersHighContrast: boolean;
  
  // Keyboard navigation
  isKeyboardUser: boolean;
  
  // Font size preferences
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  
  // Color scheme preferences
  colorScheme: 'light' | 'dark' | 'auto';
  setColorScheme: (scheme: 'light' | 'dark' | 'auto') => void;
}

const A11yContext = createContext<A11yContextType | undefined>(undefined);

export function useA11y() {
  const context = useContext(A11yContext);
  if (!context) {
    throw new Error('useA11y must be used within an A11yProvider');
  }
  return context;
}

interface A11yProviderProps {
  children: React.ReactNode;
}

export function A11yProvider({ children }: A11yProviderProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  const [focusTrapContainer, setFocusTrapContainer] = useState<HTMLElement | null>(null);

  // Detect user preferences
  useEffect(() => {
    // Reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    // High contrast
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(contrastQuery.matches);
    
    const handleContrastChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };
    contrastQuery.addEventListener('change', handleContrastChange);

    // Keyboard user detection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
      }
    };
    
    const handleMouseDown = () => {
      setIsKeyboardUser(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Load saved preferences
  useEffect(() => {
    const savedFontSize = localStorage.getItem('tdc-font-size') as 'small' | 'medium' | 'large' | null;
    const savedColorScheme = localStorage.getItem('tdc-color-scheme') as 'light' | 'dark' | 'auto' | null;
    
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }
    if (savedColorScheme) {
      setColorScheme(savedColorScheme);
    }
  }, []);

  // Apply font size changes
  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px';
    localStorage.setItem('tdc-font-size', fontSize);
  }, [fontSize]);

  // Apply color scheme changes
  useEffect(() => {
    const root = document.documentElement;
    if (colorScheme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else if (colorScheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      // Auto - let system preference handle it
      root.classList.remove('light', 'dark');
    }
    localStorage.setItem('tdc-color-scheme', colorScheme);
  }, [colorScheme]);

  // Focus management
  const focusElement = useCallback((element: HTMLElement | null) => {
    if (element) {
      element.focus();
      setFocusedElement(element);
    }
  }, []);

  const trapFocus = useCallback((container: HTMLElement) => {
    setFocusTrapContainer(container);
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const releaseFocus = useCallback(() => {
    setFocusTrapContainer(null);
  }, []);

  // Screen reader announcements
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  const value: A11yContextType = {
    focusElement,
    trapFocus,
    releaseFocus,
    announce,
    prefersReducedMotion,
    prefersHighContrast,
    isKeyboardUser,
    fontSize,
    setFontSize,
    colorScheme,
    setColorScheme
  };

  return (
    <A11yContext.Provider value={value}>
      {children}
    </A11yContext.Provider>
  );
}

// Accessibility settings component
export function A11ySettings() {
  const { 
    fontSize, 
    setFontSize, 
    colorScheme, 
    setColorScheme, 
    announce,
    prefersReducedMotion,
    prefersHighContrast 
  } = useA11y();

  const handleFontSizeChange = (newSize: 'small' | 'medium' | 'large') => {
    setFontSize(newSize);
    announce(`Font boyutu ${newSize === 'small' ? 'küçük' : newSize === 'large' ? 'büyük' : 'orta'} olarak ayarlandı`);
  };

  const handleColorSchemeChange = (newScheme: 'light' | 'dark' | 'auto') => {
    setColorScheme(newScheme);
    announce(`Renk teması ${newScheme === 'light' ? 'açık' : newScheme === 'dark' ? 'koyu' : 'otomatik'} olarak ayarlandı`);
  };

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-900">Erişilebilirlik Ayarları</h2>
      
      {/* Font Size */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Font Boyutu
        </label>
        <div className="flex space-x-2">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => handleFontSizeChange(size)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                fontSize === size
                  ? 'bg-[#CBA135] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-pressed={fontSize === size}
            >
              {size === 'small' ? 'Küçük' : size === 'large' ? 'Büyük' : 'Orta'}
            </button>
          ))}
        </div>
      </div>

      {/* Color Scheme */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Renk Teması
        </label>
        <div className="flex space-x-2">
          {(['light', 'dark', 'auto'] as const).map((scheme) => (
            <button
              key={scheme}
              onClick={() => handleColorSchemeChange(scheme)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                colorScheme === scheme
                  ? 'bg-[#CBA135] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-pressed={colorScheme === scheme}
            >
              {scheme === 'light' ? 'Açık' : scheme === 'dark' ? 'Koyu' : 'Otomatik'}
            </button>
          ))}
        </div>
      </div>

      {/* System Preferences Info */}
      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Sistem tercihleri algılandı
        </p>
        {prefersReducedMotion && (
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Azaltılmış hareket tercih ediliyor
          </p>
        )}
        {prefersHighContrast && (
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            Yüksek kontrast tercih ediliyor
          </p>
        )}
      </div>
    </div>
  );
}

// Skip links component
export function SkipLinks() {
  const { focusElement } = useA11y();

  const handleSkip = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      focusElement(target);
    }
  };

  return (
    <div className="sr-only focus-within:not-sr-only">
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          handleSkip('main-content');
        }}
        className="absolute top-4 left-4 bg-[#CBA135] text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2"
      >
        Ana içeriğe geç
      </a>
      <a
        href="#navigation"
        onClick={(e) => {
          e.preventDefault();
          handleSkip('navigation');
        }}
        className="absolute top-4 left-32 bg-[#CBA135] text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-[#CBA135] focus:ring-offset-2"
      >
        Navigasyona geç
      </a>
    </div>
  );
}

// Focus trap component
interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
}

export function FocusTrap({ children, active }: FocusTrapProps) {
  const { trapFocus, releaseFocus } = useA11y();
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active && containerRef.current) {
      const cleanup = trapFocus(containerRef.current);
      return cleanup;
    } else {
      releaseFocus();
    }
  }, [active, trapFocus, releaseFocus]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}

// Announcement component
interface AnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

export function Announcement({ message, priority = 'polite' }: AnnouncementProps) {
  const { announce } = useA11y();

  useEffect(() => {
    if (message) {
      announce(message, priority);
    }
  }, [message, priority, announce]);

  return null;
}

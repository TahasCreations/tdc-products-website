'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AccessibilityState {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
}

interface AccessibilityContextType {
  state: AccessibilityState;
  updateState: (updates: Partial<AccessibilityState>) => void;
  resetToDefaults: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [state, setState] = useState<AccessibilityState>({
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    screenReader: false,
    keyboardNavigation: false,
    focusVisible: false
  });

  // Load saved preferences
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse accessibility preferences:', error);
      }
    }

    // Detect system preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setState(prev => ({ ...prev, reducedMotion: mediaQuery.matches }));

    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    setState(prev => ({ ...prev, highContrast: contrastQuery.matches }));

    // Detect screen reader
    const hasScreenReader = window.speechSynthesis && window.speechSynthesis.getVoices().length > 0;
    setState(prev => ({ ...prev, screenReader: hasScreenReader }));

    // Listen for system preference changes
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, highContrast: e.matches }));
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-preferences', JSON.stringify(state));
  }, [state]);

  // Apply accessibility styles to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Reduced motion
    if (state.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--animation-iteration-count', '1');
      root.classList.add('reduced-motion');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--animation-iteration-count');
      root.classList.remove('reduced-motion');
    }

    // High contrast
    if (state.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font size
    root.classList.remove('font-small', 'font-medium', 'font-large');
    root.classList.add(`font-${state.fontSize}`);

    // Focus visible
    if (state.focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
  }, [state]);

  const updateState = (updates: Partial<AccessibilityState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetToDefaults = () => {
    setState({
      reducedMotion: false,
      highContrast: false,
      fontSize: 'medium',
      screenReader: false,
      keyboardNavigation: false,
      focusVisible: false
    });
  };

  return (
    <AccessibilityContext.Provider value={{ state, updateState, resetToDefaults }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// Accessibility utilities
export const accessibilityUtils = {
  // Generate ARIA labels
  generateAriaLabel(text: string, context?: string): string {
    if (context) {
      return `${text}, ${context}`;
    }
    return text;
  },

  // Generate unique IDs for form elements
  generateId(prefix: string = 'element'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Check if element is focusable
  isFocusable(element: HTMLElement): boolean {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ];

    return focusableSelectors.some(selector => element.matches(selector));
  },

  // Trap focus within element
  trapFocus(element: HTMLElement): () => void {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  },

  // Announce to screen readers
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Skip to main content
  createSkipLink(targetId: string = 'main-content'): HTMLElement {
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 1000;
      border-radius: 4px;
    `;

    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    return skipLink;
  }
};

// Accessibility hook for keyboard navigation
export function useKeyboardNavigation() {
  const { state, updateState } = useAccessibility();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        updateState({ keyboardNavigation: true });
      }
    };

    const handleMouseDown = () => {
      updateState({ keyboardNavigation: false });
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [updateState]);

  return state.keyboardNavigation;
}

// Accessibility hook for focus management
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

  const focusElement = (element: HTMLElement | null) => {
    if (element) {
      element.focus();
      setFocusedElement(element);
    }
  };

  const blurElement = () => {
    if (focusedElement) {
      focusedElement.blur();
      setFocusedElement(null);
    }
  };

  return {
    focusedElement,
    focusElement,
    blurElement
  };
}

export default AccessibilityProvider;

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  className?: string;
  placeholder?: React.ReactNode;
  onIntersect?: () => void;
}

export function LazyLoad({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  once = true,
  className,
  placeholder,
  onIntersect
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    
    if (entry.isIntersecting) {
      setIsVisible(true);
      setHasIntersected(true);
      onIntersect?.();
      
      if (once && elementRef.current) {
        observer.disconnect();
      }
    } else if (!once) {
      setIsVisible(false);
    }
  }, [once, onIntersect]);

  const [observer] = useState(() => 
    new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin
    })
  );

  useEffect(() => {
    if (elementRef.current && (!once || !hasIntersected)) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [observer, once, hasIntersected]);

  return (
    <div ref={elementRef} className={className}>
      <AnimatePresence mode="wait">
        {isVisible ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {placeholder || fallback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Lazy image component with blur placeholder
interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  placeholder,
  onLoad,
  onError,
  priority = false
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setError(true);
    onError?.();
  }, [onError]);

  if (priority) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        loading="eager"
      />
    );
  }

  return (
    <LazyLoad
      placeholder={
        <div 
          className={`bg-gray-200 animate-pulse ${className}`}
          style={{ width, height }}
        >
          {placeholder && (
            <img
              src={placeholder}
              alt=""
              className="w-full h-full object-cover opacity-30"
            />
          )}
        </div>
      }
    >
      <div className="relative">
        {!loaded && !error && (
          <div 
            className={`bg-gray-200 animate-pulse absolute inset-0 ${className}`}
            style={{ width, height }}
          />
        )}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
        {error && (
          <div 
            className={`bg-gray-100 flex items-center justify-center ${className}`}
            style={{ width, height }}
          >
            <span className="text-gray-400 text-sm">Görsel yüklenemedi</span>
          </div>
        )}
      </div>
    </LazyLoad>
  );
}

// Lazy component wrapper for code splitting
interface LazyComponentProps {
  load: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: any;
}

export function LazyComponent({ load, fallback, props }: LazyComponentProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    load()
      .then((module) => {
        setComponent(() => module.default);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load component:', err);
        setError(true);
        setLoading(false);
      });
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        {fallback || (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#CBA135]"></div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Bileşen yüklenirken hata oluştu
      </div>
    );
  }

  if (Component) {
    return <Component {...props} />;
  }

  return null;
}

// Lazy section component for page sections
interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
  skeleton?: React.ReactNode;
}

export function LazySection({ 
  children, 
  className, 
  minHeight = '200px',
  skeleton 
}: LazySectionProps) {
  return (
    <LazyLoad
      className={className}
      placeholder={
        skeleton || (
          <div 
            className="bg-gray-100 animate-pulse rounded-lg"
            style={{ minHeight }}
          >
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        )
      }
    >
      {children}
    </LazyLoad>
  );
}

// Intersection observer hook
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return { isIntersecting, hasIntersected };
}

// Performance optimized list component
interface VirtualizedListProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function VirtualizedList({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5
}: VirtualizedListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + overscan,
    items.length
  );

  const visibleItems = items.slice(
    Math.max(0, visibleStart - overscan),
    visibleEnd
  );

  const offsetY = Math.max(0, visibleStart - overscan) * itemHeight;

  return (
    <div
      ref={containerRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={(e) => {
        setScrollTop(e.currentTarget.scrollTop);
      }}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={visibleStart - overscan + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleStart - overscan + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

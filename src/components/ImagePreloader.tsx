'use client';

import { useEffect, useState } from 'react';

interface ImagePreloaderProps {
  images: string[];
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export default function ImagePreloader({ images, onLoad, onError }: ImagePreloaderProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;

    let loadedCount = 0;
    const totalImages = images.length;

    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(src);
            return newSet;
          });
          loadedCount++;
          setLoadingProgress((loadedCount / totalImages) * 100);
          resolve();
        };
        
        img.onerror = () => {
          console.warn(`Failed to preload image: ${src}`);
          reject(new Error(`Failed to load ${src}`));
        };
        
        img.src = src;
      });
    };

    const preloadAllImages = async () => {
      try {
        await Promise.allSettled(images.map(preloadImage));
        onLoad?.();
      } catch (error) {
        onError?.(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    preloadAllImages();
  }, [images, onLoad, onError]);

  // Bu component görünmez, sadece preloading yapar
  return null;
}

// Hook for image preloading
export function useImagePreloader(images: string[]) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!images || images.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setLoadedImages(new Set());

    let loadedCount = 0;
    const totalImages = images.length;

    const preloadImage = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        
        img.onload = () => {
          setLoadedImages(prev => {
            const newSet = new Set(prev);
            newSet.add(src);
            return newSet;
          });
          loadedCount++;
          setProgress((loadedCount / totalImages) * 100);
          resolve();
        };
        
        img.onerror = () => {
          console.warn(`Failed to preload image: ${src}`);
          reject(new Error(`Failed to load ${src}`));
        };
        
        img.src = src;
      });
    };

    const preloadAllImages = async () => {
      try {
        await Promise.allSettled(images.map(preloadImage));
        setIsLoading(false);
      } catch (error) {
        console.error('Image preloading error:', error);
        setIsLoading(false);
      }
    };

    preloadAllImages();
  }, [images]);

  return { isLoading, progress, loadedImages };
}

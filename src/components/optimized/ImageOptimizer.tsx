'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  PhotoIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  className?: string;
  fallback?: string;
  lazy?: boolean;
  sizes?: string;
}

export default function ImageOptimizer({
  src,
  alt,
  width = 400,
  height = 300,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  className = '',
  fallback = '/placeholder.jpg',
  lazy = true,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: ImageOptimizerProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageStats, setImageStats] = useState<{
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
  } | null>(null);

  useEffect(() => {
    // Simulate image loading and optimization stats
    const loadImage = async () => {
      try {
        setIsLoading(true);
        
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock optimization stats
        setImageStats({
          originalSize: Math.floor(Math.random() * 500) + 200, // KB
          optimizedSize: Math.floor(Math.random() * 200) + 50, // KB
          compressionRatio: Math.floor(Math.random() * 30) + 60 // %
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Image loading error:', error);
        setImageError(true);
        setIsLoading(false);
      }
    };

    loadImage();
  }, [src]);

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const getOptimizationLevel = (ratio: number) => {
    if (ratio >= 80) return { level: 'Excellent', color: 'text-green-600 bg-green-100' };
    if (ratio >= 60) return { level: 'Good', color: 'text-yellow-600 bg-yellow-100' };
    return { level: 'Poor', color: 'text-red-600 bg-red-100' };
  };

  if (imageError) {
    return (
      <div className={`relative bg-gray-200 rounded-lg flex items-center justify-center ${className}`} style={{ width, height }}>
        <div className="text-center">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Resim yüklenemedi</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative group ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <ArrowPathIcon className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-500">Yükleniyor...</p>
          </div>
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        sizes={sizes}
        onError={handleImageError}
        onLoad={() => setIsLoading(false)}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Optimization Stats Overlay */}
      {imageStats && !isLoading && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-black bg-opacity-75 text-white text-xs p-2 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <CogIcon className="w-3 h-3" />
              <span>Optimizasyon</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Orijinal:</span>
                <span>{imageStats.originalSize} KB</span>
              </div>
              <div className="flex justify-between">
                <span>Optimize:</span>
                <span>{imageStats.optimizedSize} KB</span>
              </div>
              <div className="flex justify-between">
                <span>Sıkıştırma:</span>
                <span className={getOptimizationLevel(imageStats.compressionRatio).color}>
                  %{imageStats.compressionRatio}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quality Indicator */}
      {imageStats && !isLoading && (
        <div className="absolute bottom-2 left-2">
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
            getOptimizationLevel(imageStats.compressionRatio).color
          }`}>
            {getOptimizationLevel(imageStats.compressionRatio).level}
          </span>
        </div>
      )}
    </div>
  );
}


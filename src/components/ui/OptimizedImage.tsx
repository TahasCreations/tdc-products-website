'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { motion } from 'framer-motion';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  blurDataURL?: string;
  fallbackSrc?: string;
}

export default function OptimizedImage({
  src,
  alt,
  blurDataURL,
  fallbackSrc = '/images/placeholder.png',
  className = '',
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer"
          style={{
            backgroundSize: '200% 100%'
          }}
        />
      )}
      
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: isLoading ? 0 : 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={error ? fallbackSrc : src}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setError(true);
            setIsLoading(false);
          }}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          className={className}
          {...props}
        />
      </motion.div>
    </div>
  );
}

// Product Image with zoom
interface ProductImageProps extends OptimizedImageProps {
  enableZoom?: boolean;
}

export function ProductImage({ 
  enableZoom = true,
  className = '',
  ...props 
}: ProductImageProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <motion.div
      className="relative cursor-zoom-in"
      onHoverStart={() => enableZoom && setIsZoomed(true)}
      onHoverEnd={() => enableZoom && setIsZoomed(false)}
      whileHover={enableZoom ? { scale: 1.05 } : undefined}
      transition={{ duration: 0.3 }}
    >
      <OptimizedImage
        className={`transition-transform duration-300 ${isZoomed ? 'scale-110' : ''} ${className}`}
        {...props}
      />
      
      {enableZoom && isZoomed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/10 pointer-events-none"
        />
      )}
    </motion.div>
  );
}

// Avatar with fallback
interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

export function Avatar({ 
  src, 
  alt, 
  size = 'md',
  fallback 
}: AvatarProps) {
  const [error, setError] = useState(false);

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-xl'
  };

  if (!src || error) {
    return (
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-[#CBA135] to-[#F4D03F] flex items-center justify-center text-white font-semibold ${textSizes[size]}`}>
        {fallback || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden relative`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}

// Image Gallery
interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        <ProductImage
          src={images[selectedIndex]}
          alt={`${alt} - ${selectedIndex + 1}`}
          fill
          className="object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <motion.button
              key={index}
              onClick={() => setSelectedIndex(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative aspect-square rounded-lg overflow-hidden
                ${selectedIndex === index 
                  ? 'ring-2 ring-[#CBA135] ring-offset-2' 
                  : 'opacity-60 hover:opacity-100'
                }
                transition-all duration-200
              `}
            >
              <Image
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

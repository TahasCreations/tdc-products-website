'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Image as ImageIcon } from 'lucide-react';

import { AutoImageOrchestrator, SlotContext, AutoImageResult } from '@/lib/media/autoImage';

interface AutoImageProps {
  context: SlotContext;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  alt?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function AutoImage({
  context,
  className = '',
  priority = false,
  quality = 90,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  alt,
  onLoad,
  onError
}: AutoImageProps) {
  const [imageResult, setImageResult] = useState<AutoImageResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [orchestrator] = useState(() => new AutoImageOrchestrator(null));

  useEffect(() => {
    let isMounted = true;

    const generateImage = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        
        const result = await orchestrator.generateImage(context);
        
        if (isMounted) {
          setImageResult(result);
          setIsLoading(false);
          onLoad?.();
        }
      } catch (error) {
        console.error('AutoImage generation failed:', error);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
          onError?.();
        }
      }
    };

    generateImage();

    return () => {
      isMounted = false;
    };
  }, [context, orchestrator, onLoad, onError]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-[#CBA135] border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className={`relative overflow-hidden bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Görsel yüklenemedi</p>
        </div>
      </div>
    );
  }

  if (!imageResult) {
    return null;
  }

  // SVG görseller için farklı render
  if (imageResult.format === 'svg') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden ${className}`}
        style={{ aspectRatio: `${imageResult.width} / ${imageResult.height}` }}
      >
        <img
          src={imageResult.url}
          alt={alt || imageResult.alt}
          className="w-full h-full object-cover"
          style={{ width: imageResult.width, height: imageResult.height }}
          onLoad={onLoad}
          onError={onError}
        />
        
        {/* Source indicator */}
        {imageResult.source !== 'media_library' && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {imageResult.source === 'procedural_svg' && 'Otomatik'}
            {imageResult.source === 'dynamic_og' && 'OG'}
            {imageResult.source === 'ai_generated' && 'AI'}
          </div>
        )}
      </motion.div>
    );
  }

  // Normal görseller için Next.js Image
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={imageResult.url}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative overflow-hidden ${className}`}
      >
        <Image
          src={imageResult.url}
          alt={alt || imageResult.alt}
          width={imageResult.width}
          height={imageResult.height}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL || getDefaultBlurDataURL()}
          sizes={sizes || getDefaultSizes(context)}
          className="w-full h-full object-cover"
          onLoad={onLoad}
          onError={onError}
        />
        
        {/* Source indicator */}
        {imageResult.source !== 'media_library' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm"
          >
            {imageResult.source === 'procedural_svg' && 'Otomatik'}
            {imageResult.source === 'dynamic_og' && 'OG'}
            {imageResult.source === 'ai_generated' && 'AI'}
          </motion.div>
        )}

        {/* Loading overlay */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute inset-0 bg-gray-900/20 flex items-center justify-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-6 h-6 bg-[#CBA135] rounded-full opacity-80"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Specific image components for different use cases
export function ProductCardImage({ 
  src, 
  alt, 
  className = "w-full h-full object-cover" 
}: { 
  src?: string; 
  alt: string; 
  className?: string; 
}) {
  return (
    <AutoImage
      context={{
        slotType: 'product.card',
        category: 'product',
        title: alt
      }}
      className={className}
    />
  );
}

export function CategoryHeroImage({ 
  src, 
  alt, 
  className = "w-full h-full object-cover" 
}: { 
  src?: string; 
  alt: string; 
  className?: string; 
}) {
  return (
    <AutoImage
      context={{
        slotType: 'category.hero',
        category: 'category',
        title: alt
      }}
      className={className}
    />
  );
}

export function AutoCategoryHero({ 
  category, 
  title, 
  description,
  className = "w-full h-full object-cover"
}: {
  category: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <AutoImage
      context={{
        slotType: 'category.hero',
        category,
        title
      }}
      className={className}
    />
  );
}

// Yardımcı fonksiyonlar
function getDefaultBlurDataURL(): string {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0B0B0B;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
    </svg>
  `)}`;
}

function getDefaultSizes(context: SlotContext): string {
  switch (context.slotType) {
    case 'category.hero':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw';
    case 'product.card':
      return '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw';
    case 'product.hero':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw';
    case 'category.banner':
    case 'editorial.banner':
      return '(max-width: 768px) 100vw, 80vw';
    default:
      return '(max-width: 768px) 100vw, 50vw';
  }
}

// Özel hook - AutoImage için
export function useAutoImage(context: SlotContext) {
  const [imageResult, setImageResult] = useState<AutoImageResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [orchestrator] = useState(() => new AutoImageOrchestrator(null));

  useEffect(() => {
    let isMounted = true;

    const generateImage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await orchestrator.generateImage(context);
        
        if (isMounted) {
          setImageResult(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
          setIsLoading(false);
        }
      }
    };

    generateImage();

    return () => {
      isMounted = false;
    };
  }, [context, orchestrator]);

  return {
    imageResult,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setError(null);
      setImageResult(null);
    }
  };
}

// Preset context'ler
export const createCategoryHeroContext = (
  category: string,
  title: string,
  subtitle?: string,
  ctaText?: string
): SlotContext => ({
  slotType: 'category.hero',
  category,
  title,
  subtitle,
  ctaText,
  accentColor: '#CBA135'
});

export const createProductCardContext = (
  productName: string,
  category?: string
): SlotContext => ({
  slotType: 'product.card',
  category,
  title: productName,
  accentColor: '#CBA135'
});

export const createEditorialBannerContext = (
  title: string,
  subtitle?: string
): SlotContext => ({
  slotType: 'editorial.banner',
  title,
  subtitle,
  accentColor: '#CBA135'
});
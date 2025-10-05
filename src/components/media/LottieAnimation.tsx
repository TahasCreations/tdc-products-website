'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface LottieAnimationProps {
  src: string | object;
  width?: number;
  height?: number;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  onLoopComplete?: () => void;
  ariaLabel?: string;
  role?: string;
}

export function LottieAnimation({
  src,
  width = 200,
  height = 200,
  loop = true,
  autoplay = true,
  speed = 1,
  className = '',
  onComplete,
  onLoopComplete,
  ariaLabel,
  role = 'img'
}: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animation, setAnimation] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLottie = async () => {
      try {
        // Lottie kütüphanesini dinamik olarak yükle
        const lottie = await import('lottie-web');
        
        if (!containerRef.current) return;

        // Önceki animasyonu temizle
        if (animation) {
          animation.destroy();
        }

        // Yeni animasyon oluştur
        const anim = lottie.default.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop,
          autoplay,
          animationData: typeof src === 'string' ? undefined : src,
          path: typeof src === 'string' ? src : undefined,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
          }
        });

        // Animasyon ayarları
        anim.setSpeed(speed);

        // Event listener'lar
        if (onComplete) {
          anim.addEventListener('complete', onComplete);
        }

        if (onLoopComplete) {
          anim.addEventListener('loopComplete', onLoopComplete);
        }

        anim.addEventListener('DOMLoaded', () => {
          setIsLoaded(true);
          setError(null);
        });

        anim.addEventListener('data_failed', () => {
          setError('Animation data failed to load');
          setIsLoaded(false);
        });

        setAnimation(anim);
      } catch (err) {
        console.error('Failed to load Lottie animation:', err);
        setError('Failed to load animation');
        setIsLoaded(false);
      }
    };

    loadLottie();

    return () => {
      if (animation) {
        animation.destroy();
      }
    };
  }, [src, loop, autoplay, speed]);

  // Animasyon kontrolü
  const play = () => {
    if (animation) {
      animation.play();
    }
  };

  const pause = () => {
    if (animation) {
      animation.pause();
    }
  };

  const stop = () => {
    if (animation) {
      animation.stop();
    }
  };

  const goToAndStop = (frame: number) => {
    if (animation) {
      animation.goToAndStop(frame, true);
    }
  };

  const goToAndPlay = (frame: number) => {
    if (animation) {
      animation.goToAndPlay(frame, true);
    }
  };

  // Reduced motion kontrolü
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  if (prefersReducedMotion && !autoplay) {
    // Reduced motion için statik görsel göster
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ width, height }}
        aria-label={ariaLabel}
        role={role}
      >
        <div className="w-8 h-8 bg-[#CBA135] rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={`relative ${className}`}
      style={{ width, height }}
      ref={containerRef}
      aria-label={ariaLabel}
      role={role}
    >
      {/* Loading state */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-[#CBA135] border-t-transparent rounded-full"
          />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center p-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2" />
            <p className="text-xs text-gray-500">Animation Error</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// Preset animasyonlar
export const LottiePresets = {
  loading: {
    src: '/animations/loading.json',
    width: 64,
    height: 64,
    loop: true,
    autoplay: true
  },
  
  success: {
    src: '/animations/success.json',
    width: 64,
    height: 64,
    loop: false,
    autoplay: true
  },
  
  error: {
    src: '/animations/error.json',
    width: 64,
    height: 64,
    loop: false,
    autoplay: true
  },
  
  empty: {
    src: '/animations/empty.json',
    width: 200,
    height: 200,
    loop: true,
    autoplay: true
  },
  
  hero: {
    src: '/animations/hero.json',
    width: 400,
    height: 300,
    loop: true,
    autoplay: true
  }
};

// Özel hook - Lottie kontrolü için
export function useLottieControl() {
  const [animation, setAnimation] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);

  const play = () => {
    if (animation) {
      animation.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (animation) {
      animation.pause();
      setIsPlaying(false);
    }
  };

  const stop = () => {
    if (animation) {
      animation.stop();
      setIsPlaying(false);
    }
  };

  const goToFrame = (frame: number) => {
    if (animation) {
      animation.goToAndStop(frame, true);
      setCurrentFrame(frame);
    }
  };

  const setSpeed = (speed: number) => {
    if (animation) {
      animation.setSpeed(speed);
    }
  };

  return {
    animation,
    setAnimation,
    isPlaying,
    currentFrame,
    totalFrames,
    play,
    pause,
    stop,
    goToFrame,
    setSpeed
  };
}

// Mikro animasyon bileşeni
export function MicroAnimation({ 
  type = 'loading',
  size = 'md',
  className = '' 
}: {
  type?: 'loading' | 'success' | 'error' | 'empty';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeMap = {
    sm: { width: 32, height: 32 },
    md: { width: 64, height: 64 },
    lg: { width: 128, height: 128 }
  };

  const preset = LottiePresets[type];
  const dimensions = sizeMap[size];

  return (
    <LottieAnimation
      {...preset}
      {...dimensions}
      className={className}
    />
  );
}

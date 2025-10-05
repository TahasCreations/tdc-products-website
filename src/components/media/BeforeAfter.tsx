'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

interface BeforeAfterProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  width?: number;
  height?: number;
  className?: string;
  showLabels?: boolean;
  showControls?: boolean;
  initialPosition?: number; // 0-1 arası
  onPositionChange?: (position: number) => void;
  ariaLabel?: string;
}

export function BeforeAfter({
  beforeImage,
  afterImage,
  beforeLabel = 'Öncesi',
  afterLabel = 'Sonrası',
  width = 800,
  height = 600,
  className = '',
  showLabels = true,
  showControls = true,
  initialPosition = 0.5,
  onPositionChange,
  ariaLabel = 'Öncesi ve sonrası karşılaştırması'
}: BeforeAfterProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isKeyboardControlled, setIsKeyboardControlled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(position * width);
  const opacity = useTransform(x, [0, width], [1, 0]);
  const afterOpacity = useTransform(x, [0, width], [0, 1]);

  // Pozisyon güncelleme
  const updatePosition = (newPosition: number) => {
    const clampedPosition = Math.max(0, Math.min(1, newPosition));
    setPosition(clampedPosition);
    onPositionChange?.(clampedPosition);
  };

  // Mouse olayları
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    const newPosition = (e.clientX - rect.left) / rect.width;
    updatePosition(newPosition);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const newPosition = (e.clientX - rect.left) / rect.width;
    updatePosition(newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch olayları
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const newPosition = (touch.clientX - rect.left) / rect.width;
    updatePosition(newPosition);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const newPosition = (touch.clientX - rect.left) / rect.width;
    updatePosition(newPosition);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Klavye kontrolü
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.target !== containerRef.current) return;
    
    setIsKeyboardControlled(true);
    let newPosition = position;
    
    switch (e.key) {
      case 'ArrowLeft':
        newPosition = position - 0.05;
        break;
      case 'ArrowRight':
        newPosition = position + 0.05;
        break;
      case 'Home':
        newPosition = 0;
        break;
      case 'End':
        newPosition = 1;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    updatePosition(newPosition);
  };

  // Reset
  const handleReset = () => {
    updatePosition(0.5);
  };

  // Event listener'ları ekle/kaldır
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [position]);

  // X değerini güncelle
  useEffect(() => {
    x.set(position * width);
  }, [position, width, x]);

  // Klavye kontrolü timeout
  useEffect(() => {
    if (isKeyboardControlled) {
      const timer = setTimeout(() => {
        setIsKeyboardControlled(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isKeyboardControlled]);

  return (
    <div className={`relative ${className}`}>
      {/* Ana container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg shadow-lg cursor-col-resize select-none"
        style={{ width, height }}
        onClick={handleMouseDown}
        onTouchStart={handleTouchStart}
        tabIndex={0}
        role="img"
        aria-label={ariaLabel}
        aria-valuenow={Math.round(position * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${Math.round(position * 100)}% öncesi görünür`}
      >
        {/* Öncesi görsel */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity }}
        >
          <img
            src={beforeImage}
            alt="Öncesi"
            className="w-full h-full object-cover"
            draggable={false}
          />
          {showLabels && (
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium">
              {beforeLabel}
            </div>
          )}
        </motion.div>

        {/* Sonrası görsel */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: afterOpacity }}
        >
          <img
            src={afterImage}
            alt="Sonrası"
            className="w-full h-full object-cover"
            draggable={false}
          />
          {showLabels && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-medium">
              {afterLabel}
            </div>
          )}
        </motion.div>

        {/* Slider çizgisi */}
        <motion.div
          ref={sliderRef}
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
          style={{ x: x }}
        >
          {/* Slider handle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-300 flex items-center justify-center">
            <div className="w-4 h-4 flex">
              <ArrowLeft className="w-2 h-2 text-gray-600" />
              <ArrowRight className="w-2 h-2 text-gray-600" />
            </div>
          </div>
        </motion.div>

        {/* Klavye kontrolü göstergesi */}
        {isKeyboardControlled && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-md text-xs"
          >
            Klavye ile kontrol ediliyor
          </motion.div>
        )}

        {/* Focus ring */}
        <div className="absolute inset-0 rounded-lg pointer-events-none focus-within:ring-2 focus-within:ring-[#CBA135] focus-within:ring-offset-2" />
      </div>

      {/* Kontroller */}
      {showControls && (
        <div className="flex items-center justify-center space-x-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePosition(0)}
            aria-label="Tamamen öncesi göster"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            aria-label="Ortaya sıfırla"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => updatePosition(1)}
            aria-label="Tamamen sonrası göster"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Pozisyon göstergesi */}
      <div className="text-center mt-2">
        <span className="text-sm text-gray-600">
          {Math.round(position * 100)}% {beforeLabel} görünür
        </span>
      </div>

      {/* Kullanım talimatları */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-1">Kullanım:</p>
        <ul className="space-y-1 text-xs">
          <li>• Mouse ile sürükleyin</li>
          <li>• Ok tuşları ile kontrol edin</li>
          <li>• Home/End tuşları ile uçlara gidin</li>
          <li>• Dokunmatik ekranlarda kaydırın</li>
        </ul>
      </div>
    </div>
  );
}

// Özel hook - BeforeAfter kontrolü için
export function useBeforeAfter() {
  const [position, setPosition] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);

  const reset = () => setPosition(0.5);
  const showBefore = () => setPosition(0);
  const showAfter = () => setPosition(1);
  
  const setPositionPercent = (percent: number) => {
    setPosition(Math.max(0, Math.min(1, percent / 100)));
  };

  const playAnimation = () => {
    setIsPlaying(true);
    // Animasyon mantığı burada olabilir
  };

  const stopAnimation = () => {
    setIsPlaying(false);
  };

  return {
    position,
    isPlaying,
    reset,
    showBefore,
    showAfter,
    setPositionPercent,
    playAnimation,
    stopAnimation
  };
}

// Preset konfigürasyonlar
export const BeforeAfterPresets = {
  product: {
    beforeLabel: 'Ham Ürün',
    afterLabel: 'Bitmiş Ürün',
    showLabels: true,
    showControls: true
  },
  
  customization: {
    beforeLabel: 'Standart',
    afterLabel: 'Kişiselleştirilmiş',
    showLabels: true,
    showControls: true
  },
  
  transformation: {
    beforeLabel: 'Başlangıç',
    afterLabel: 'Sonuç',
    showLabels: true,
    showControls: true
  }
};

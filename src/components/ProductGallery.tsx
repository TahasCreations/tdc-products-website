'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  // Görsel yoksa placeholder göster
  const validImages = images && images.length > 0 && images.some(img => img && img.trim() !== '') 
    ? images.filter(img => img && img.trim() !== '') 
    : [];
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [animating, setAnimating] = useState(false);

  const goTo = (idx: number) => {
    if (idx === activeIndex) return;
    setPrevIndex(activeIndex);
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 250);
  };

  const goPrev = () => goTo((activeIndex - 1 + validImages.length) % validImages.length);
  const goNext = () => goTo((activeIndex + 1) % validImages.length);

  // Görsel yoksa placeholder göster
  if (validImages.length === 0) {
    return (
      <div className="relative w-full overflow-hidden rounded-xl border border-gray-200">
        <div className="relative h-80 md:h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <div className="text-center">
            <i className="ri-image-line text-6xl text-gray-400 mb-4"></i>
            <p className="text-gray-500 text-lg">Görsel yok</p>
            <p className="text-gray-400 text-sm">Bu ürün için henüz görsel yüklenmemiş</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative w-full overflow-hidden rounded-xl border border-gray-200">
        <div className="relative h-80 md:h-96">
          {/* Outgoing image */}
          {animating && prevIndex !== null && (
            <Image
              key={`prev-${prevIndex}`}
              src={validImages[prevIndex]}
              alt={alt}
              width={800}
              height={400}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-200 ease-out ${
                direction === 1 ? 'opacity-0 scale-95 -translate-x-3' : 'opacity-0 scale-95 translate-x-3'
              }`}
            />
          )}

          {/* Active image */}
          <Image
            key={`active-${activeIndex}`}
            src={validImages[activeIndex]}
            alt={alt}
            width={800}
            height={400}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-200 ease-out ${
              animating
                ? direction === 1
                  ? 'opacity-100 scale-100 translate-x-0'
                  : 'opacity-100 scale-100 translate-x-0'
                : 'opacity-100 scale-100'
            }`}
            onError={(e) => {
              console.error('Image load error:', validImages[activeIndex]);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', validImages[activeIndex]);
            }}
          />

          {/* Controls */}
          {validImages.length > 1 && (
            <>
              <button
                aria-label="Önceki görsel"
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow"
              >
                <i className="ri-arrow-left-s-line text-xl"></i>
              </button>
              <button
                aria-label="Sonraki görsel"
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow"
              >
                <i className="ri-arrow-right-s-line text-xl"></i>
              </button>
            </>
          )}
        </div>
      </div>

      {validImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto">
          {validImages.map((src, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`relative min-w-[64px] rounded-lg overflow-hidden border transition ${
                activeIndex === idx ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image src={src} alt={`${alt} ${idx + 1}`} width={64} height={64} className="w-16 h-16 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}



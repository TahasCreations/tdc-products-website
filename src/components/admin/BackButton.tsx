'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface BackButtonProps {
  className?: string;
  children?: React.ReactNode;
  fallbackPath?: string;
}

export default function BackButton({ 
  className = '', 
  children,
  fallbackPath = '/admin'
}: BackButtonProps) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Tarayıcı geçmişinde geri gidilebilir sayfa var mı kontrol et
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleBack = () => {
    if (canGoBack) {
      // Scroll pozisyonunu geri yükle
      const scrollPosition = sessionStorage.getItem('admin-scroll-position');
      if (scrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(scrollPosition));
        }, 100);
      }
      router.back();
    } else {
      router.push(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`
        inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 
        bg-white border border-gray-300 rounded-lg hover:bg-gray-50 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        transition-colors duration-200
        ${className}
      `}
      title={canGoBack ? 'Önceki sayfaya dön' : 'Ana sayfaya dön'}
    >
      <ArrowLeftIcon className="w-4 h-4" />
      {children || 'Geri'}
    </button>
  );
}

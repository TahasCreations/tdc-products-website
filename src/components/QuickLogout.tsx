'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface QuickLogoutProps {
  className?: string;
  showText?: boolean;
}

export default function QuickLogout({ className = '', showText = true }: QuickLogoutProps) {
  const router = useRouter();

  const handleQuickLogout = useCallback(() => {
    // Immediate UI feedback
    const button = document.activeElement as HTMLElement;
    if (button) {
      button.style.opacity = '0.5';
      button.style.transform = 'scale(0.95)';
    }

    // Clear localStorage immediately
    localStorage.removeItem('admin_user');
    
    // Fast redirect
    router.replace('/admin/login');
  }, [router]);

  return (
    <button
      onClick={handleQuickLogout}
      className={`text-red-600 hover:text-red-700 transition-all duration-150 hover:bg-red-50 px-2 py-1 rounded-md ${className}`}
      title="Anında çıkış yap"
    >
      <i className="ri-logout-box-r-line mr-1"></i>
      {showText && 'Hızlı Çıkış'}
    </button>
  );
}

"use client";
import { useEffect } from 'react';
import { initPWA } from '@/lib/pwa';
import PWAInstallButton from './pwa/PWAInstallButton';

export default function PWAInstaller() {
  useEffect(() => {
    // Initialize PWA
    initPWA({
      serviceWorkerPath: '/sw.js',
      enableNotifications: true,
      enableBackgroundSync: true,
      cacheStrategy: 'stale-while-revalidate'
    });
  }, []);

  return (
    <>
      {/* Install Button - Banner for mobile */}
      <PWAInstallButton 
        variant="banner" 
        showOnMobile={true}
        showOnDesktop={false}
      />
      
      {/* Install Button - Floating */}
      <PWAInstallButton 
        variant="floating"
        showOnMobile={true}
        showOnDesktop={true}
      />
    </>
  );
}
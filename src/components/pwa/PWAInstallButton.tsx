"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { getPWA } from '@/lib/pwa';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'floating' | 'inline' | 'banner';
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
}

export default function PWAInstallButton({
  className = '',
  variant = 'floating',
  showOnMobile = true,
  showOnDesktop = false
}: PWAInstallButtonProps) {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [deviceType, setDeviceType] = useState<'mobile' | 'desktop'>('desktop');

  useEffect(() => {
    // Device type detection
    const isMobile = window.innerWidth <= 768;
    setDeviceType(isMobile ? 'mobile' : 'desktop');

    // Check if should show install button
    const shouldShow = (isMobile && showOnMobile) || (!isMobile && showOnDesktop);
    if (!shouldShow) return;

    // Check PWA status
    const pwa = getPWA();
    if (pwa) {
      const status = pwa.getPWAStatus();
      setCanInstall(status.canInstall && !status.isInstalled);
      setIsInstalled(status.isInstalled);

      // Show banner for mobile users
      if (isMobile && status.canInstall && !status.isInstalled) {
        const hasSeenBanner = localStorage.getItem('pwa-banner-seen');
        if (!hasSeenBanner) {
          setShowBanner(true);
        }
      }
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setCanInstall(true);
    };

    // Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setShowBanner(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [showOnMobile, showOnDesktop]);

  const handleInstall = async () => {
    const pwa = getPWA();
    if (!pwa) return;

    setIsInstalling(true);
    try {
      const success = await pwa.showInstallPrompt();
      if (success) {
        setIsInstalled(true);
        setCanInstall(false);
        setShowBanner(false);
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-banner-seen', 'true');
  };

  const getInstallText = () => {
    if (isInstalling) return 'Yükleniyor...';
    if (deviceType === 'mobile') return 'Uygulamayı Yükle';
    return 'Uygulamayı Yükle';
  };

  const getInstallIcon = () => {
    if (isInstalling) return null;
    if (deviceType === 'mobile') return <Smartphone className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  // Don't show if installed or can't install
  if (isInstalled || !canInstall) return null;

  // Banner variant
  if (variant === 'banner' && showBanner) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">TDC Market Uygulaması</h3>
                  <p className="text-xs opacity-80">Hızlı erişim ve daha iyi deneyim için</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-black/80 disabled:opacity-50 transition-colors"
                >
                  {isInstalling ? 'Yükleniyor...' : 'Yükle'}
                </button>
                <button
                  onClick={handleDismissBanner}
                  className="p-2 hover:bg-black/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Floating variant
  if (variant === 'floating') {
    return (
      <AnimatePresence>
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleInstall}
          disabled={isInstalling}
          className={`fixed bottom-6 right-6 z-40 bg-[#CBA135] text-black p-4 rounded-full shadow-lg hover:shadow-xl disabled:opacity-50 transition-all duration-200 ${className}`}
          title="TDC Market Uygulamasını Yükle"
        >
          {isInstalling ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
          ) : (
            getInstallIcon() || <Download className="w-6 h-6" />
          )}
        </motion.button>
      </AnimatePresence>
    );
  }

  // Inline variant
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleInstall}
      disabled={isInstalling}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-[#CBA135] text-black rounded-lg font-medium hover:bg-[#B8941F] disabled:opacity-50 transition-colors ${className}`}
    >
      {isInstalling ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
      ) : (
        getInstallIcon()
      )}
      <span>{getInstallText()}</span>
    </motion.button>
  );
}

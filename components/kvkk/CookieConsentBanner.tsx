"use client";

import { useState, useEffect } from 'react';
import { X, Cookie, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface CookieConsentBannerProps {
  onConsentChange?: (consents: CookieConsents) => void;
}

interface CookieConsents {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export default function CookieConsentBanner({ onConsentChange }: CookieConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consents, setConsents] = useState<CookieConsents>({
    necessary: true, // Zorunlu çerezler her zaman aktif
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // LocalStorage'dan çerez onay durumunu kontrol et
    const savedConsent = localStorage.getItem('cookieConsent');
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      const parsed = JSON.parse(savedConsent);
      setConsents(parsed);
    }
  }, []);

  const handleAcceptAll = async () => {
    const allConsents = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setConsents(allConsents);
    await saveConsents(allConsents);
    setShowBanner(false);
  };

  const handleRejectAll = async () => {
    const minimalConsents = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setConsents(minimalConsents);
    await saveConsents(minimalConsents);
    setShowBanner(false);
  };

  const handleSaveSettings = async () => {
    await saveConsents(consents);
    setShowSettings(false);
    setShowBanner(false);
  };

  const saveConsents = async (consentsToSave: CookieConsents) => {
    // LocalStorage'a kaydet
    localStorage.setItem('cookieConsent', JSON.stringify(consentsToSave));

    // API'ye gönder (kullanıcı giriş yapmışsa)
    try {
      const response = await fetch('/api/kvkk/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consentType: 'cookies',
          consentStatus: true,
          consentText: JSON.stringify(consentsToSave),
        }),
      });

      if (response.ok) {
        onConsentChange?.(consentsToSave);
      }
    } catch (error) {
      console.error('Cookie consent kaydedilemedi:', error);
    }
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-2xl"
        >
          <div className="container mx-auto px-4 py-6 max-w-6xl">
            {!showSettings ? (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-[#CBA135] rounded-full p-3">
                    <Cookie className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      Çerez Kullanımı
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Web sitemizde size en iyi deneyimi sunabilmek için çerezler kullanıyoruz.{' '}
                      <Link href="/cerez-politikasi" className="text-[#CBA135] hover:underline">
                        Çerez Politikası
                      </Link>
                      {' '}ve{' '}
                      <Link href="/kvkk" className="text-[#CBA135] hover:underline">
                        KVKK Aydınlatma Metni
                      </Link>
                      {' '}hakkında bilgi alabilirsiniz.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Ayarlar
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Reddet
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-6 py-2 bg-[#CBA135] hover:bg-[#B8941F] text-white rounded-lg transition-colors font-semibold"
                  >
                    Tümünü Kabul Et
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    Çerez Ayarları
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Zorunlu Çerezler</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Web sitesinin çalışması için gerekli çerezler
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={consents.necessary}
                      disabled
                      className="w-5 h-5 text-[#CBA135] rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Analitik Çerezler</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Web sitesi kullanımını analiz etmek için
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={consents.analytics}
                      onChange={(e) => setConsents({ ...consents, analytics: e.target.checked })}
                      className="w-5 h-5 text-[#CBA135] rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Pazarlama Çerezleri</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Kişiselleştirilmiş reklamlar için
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={consents.marketing}
                      onChange={(e) => setConsents({ ...consents, marketing: e.target.checked })}
                      className="w-5 h-5 text-[#CBA135] rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Fonksiyonel Çerezler</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Gelişmiş özellikler ve kişiselleştirme için
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={consents.functional}
                      onChange={(e) => setConsents({ ...consents, functional: e.target.checked })}
                      className="w-5 h-5 text-[#CBA135] rounded"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2 bg-[#CBA135] hover:bg-[#B8941F] text-white rounded-lg transition-colors font-semibold"
                  >
                    Ayarları Kaydet
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}




'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Gift, Search, Heart, ShoppingCart, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function InteractiveOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem('onboarding_completed');
    if (completed) {
      setHasCompletedOnboarding(true);
      return;
    }

    // Show onboarding after 2 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'TDC Market\'e Hoş Geldiniz! 🎉',
      description: 'Türkiye\'nin en kapsamlı e-ticaret platformuna hoş geldiniz. Size özel bir tur yapalım mı?',
      icon: <Sparkles className="w-16 h-16 text-yellow-500" />
    },
    {
      id: 'search',
      title: 'Aradığınızı Kolayca Bulun 🔍',
      description: 'Sesli arama, gelişmiş filtreler ve AI destekli öneri sistemiyle istediğiniz ürünü anında bulun.',
      icon: <Search className="w-16 h-16 text-indigo-500" />
    },
    {
      id: 'wishlist',
      title: 'Favori Ürünlerinizi Kaydedin ❤️',
      description: 'Beğendiğiniz ürünleri favorilere ekleyin, fiyat düşüşlerinden haberdar olun.',
      icon: <Heart className="w-16 h-16 text-red-500" />
    },
    {
      id: 'cart',
      title: 'Güvenli Alışveriş 🛒',
      description: 'Kapıda ödeme, taksit seçenekleri ve 14 gün iade garantisi ile güvenle alışveriş yapın.',
      icon: <ShoppingCart className="w-16 h-16 text-green-500" />
    },
    {
      id: 'gift',
      title: 'İlk Siparişinize Özel! 🎁',
      description: 'Size özel %20 indirim kuponu hazırladık. Kod: HOSGELDIN20',
      icon: <Gift className="w-16 h-16 text-purple-500" />,
      action: {
        label: 'Kuponu Kopyala',
        onClick: () => {
          navigator.clipboard.writeText('HOSGELDIN20');
          toast.success('Kupon kopyalandı! 🎉');
        }
      }
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setIsOpen(false);
    setHasCompletedOnboarding(true);
    toast.success('Hoş geldiniz! Alışverişe başlayabilirsiniz 🎊');
  };

  if (hasCompletedOnboarding) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
          />

          {/* Onboarding Modal */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Progress Bar */}
              <div className="h-2 bg-gray-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center"
                  >
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      {steps[currentStep].icon}
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {steps[currentStep].title}
                    </h2>

                    {/* Description */}
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      {steps[currentStep].description}
                    </p>

                    {/* Action Button (if exists) */}
                    {steps[currentStep].action && (
                      <button
                        onClick={steps[currentStep].action!.onClick}
                        className="mb-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        {steps[currentStep].action!.label}
                      </button>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-0 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Geri</span>
                  </button>

                  {/* Step Indicator */}
                  <div className="flex space-x-2">
                    {steps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentStep
                            ? 'bg-indigo-600 w-8'
                            : index < currentStep
                            ? 'bg-indigo-300'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Next/Complete Button */}
                  <button
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <span>{currentStep === steps.length - 1 ? 'Başla' : 'İleri'}</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Skip Button */}
                <div className="text-center mt-6">
                  <button
                    onClick={handleSkip}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Turu Atla
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}


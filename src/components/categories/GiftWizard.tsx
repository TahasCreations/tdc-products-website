'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface GiftWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (giftData: GiftData) => void;
}

interface GiftData {
  recipient: string;
  budget: string;
  style: string;
  occasion: string;
  preferences: string[];
}

const steps = [
  {
    id: 'recipient',
    title: 'Kime hediye alıyorsunuz?',
    options: [
      { id: 'partner', label: 'Eş/Sevgili', icon: '💕', description: 'Romantik ve özel hediyeler' },
      { id: 'family', label: 'Aile', icon: '👨‍👩‍👧‍👦', description: 'Aile bireyleri için hediyeler' },
      { id: 'friend', label: 'Arkadaş', icon: '👫', description: 'Eğlenceli ve samimi hediyeler' },
      { id: 'colleague', label: 'İş Arkadaşı', icon: '👔', description: 'Profesyonel ve uygun hediyeler' },
      { id: 'child', label: 'Çocuk', icon: '🧸', description: 'Eğitici ve eğlenceli hediyeler' },
      { id: 'elderly', label: 'Yaşlı', icon: '👴', description: 'Anlamlı ve kullanışlı hediyeler' }
    ]
  },
  {
    id: 'budget',
    title: 'Bütçeniz nedir?',
    options: [
      { id: 'low', label: '50₺ - 150₺', icon: '💰', description: 'Uygun fiyatlı seçenekler' },
      { id: 'medium', label: '150₺ - 300₺', icon: '💎', description: 'Kaliteli ve özel hediyeler' },
      { id: 'high', label: '300₺ - 500₺', icon: '👑', description: 'Premium ve lüks hediyeler' },
      { id: 'luxury', label: '500₺+', icon: '✨', description: 'En özel ve değerli hediyeler' }
    ]
  },
  {
    id: 'style',
    title: 'Hangi tarzı tercih edersiniz?',
    options: [
      { id: 'modern', label: 'Modern', icon: '🏢', description: 'Çağdaş ve şık tasarım' },
      { id: 'classic', label: 'Klasik', icon: '🏛️', description: 'Zamansız ve zarif' },
      { id: 'vintage', label: 'Vintage', icon: '📻', description: 'Nostaljik ve retro' },
      { id: 'minimalist', label: 'Minimalist', icon: '⚪', description: 'Sade ve fonksiyonel' },
      { id: 'colorful', label: 'Renkli', icon: '🌈', description: 'Canlı ve eğlenceli' },
      { id: 'eco', label: 'Ekolojik', icon: '🌱', description: 'Çevre dostu ve sürdürülebilir' }
    ]
  },
  {
    id: 'occasion',
    title: 'Hangi özel gün için?',
    options: [
      { id: 'birthday', label: 'Doğum Günü', icon: '🎂', description: 'Yaşınızın güzelliğini kutlayın' },
      { id: 'anniversary', label: 'Yıldönümü', icon: '💍', description: 'Özel anıları hatırlayın' },
      { id: 'valentine', label: 'Sevgililer Günü', icon: '💕', description: 'Aşkınızı kutlayın' },
      { id: 'mothers', label: 'Anneler Günü', icon: '🌹', description: 'Annelerin değerini gösterin' },
      { id: 'fathers', label: 'Babalar Günü', icon: '👨‍👧‍👦', description: 'Babaların gücünü onurlandırın' },
      { id: 'graduation', label: 'Mezuniyet', icon: '🎓', description: 'Başarıyı kutlayın' },
      { id: 'wedding', label: 'Düğün', icon: '💒', description: 'Mutlu günü kutlayın' },
      { id: 'baby', label: 'Bebek', icon: '👶', description: 'Yeni doğanı karşılayın' },
      { id: 'christmas', label: 'Yılbaşı', icon: '🎄', description: 'Yeni yılı karşılayın' },
      { id: 'just-because', label: 'Sadece Öyle', icon: '🎁', description: 'Herhangi bir neden olmadan' }
    ]
  }
];

export default function GiftWizard({ isOpen, onClose, onComplete }: GiftWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [giftData, setGiftData] = useState<GiftData>({
    recipient: '',
    budget: '',
    style: '',
    occasion: '',
    preferences: []
  });

  const handleOptionSelect = (optionId: string) => {
    const stepId = steps[currentStep].id;
    setGiftData(prev => ({
      ...prev,
      [stepId]: optionId
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(giftData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setGiftData({
      recipient: '',
      budget: '',
      style: '',
      occasion: '',
      preferences: []
    });
    onClose();
  };

  const canProceed = () => {
    const stepId = steps[currentStep].id;
    return giftData[stepId as keyof GiftData] !== '';
  };

  const getRecommendations = () => {
    const { recipient, budget, style, occasion } = giftData;
    
    // Mock recommendations based on selections
    const recommendations = [
      {
        id: '1',
        title: 'Kişiye Özel Fotoğraf Çerçevesi',
        price: 79.99,
        image: 'https://via.placeholder.com/300x300/8E44AD/FFFFFF?text=Custom+Frame',
        reason: 'Anlamlı anıları ölümsüzleştirin'
      },
      {
        id: '2',
        title: 'Premium Hediye Kutusu',
        price: 149.99,
        image: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Gift+Box',
        reason: 'Özel paketleme ile sunum'
      },
      {
        id: '3',
        title: 'El Yapımı Seramik Kupa',
        price: 89.99,
        image: 'https://via.placeholder.com/300x300/27AE60/FFFFFF?text=Ceramic+Mug',
        reason: 'Günlük kullanım için özel'
      }
    ];

    return recommendations;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Hediye Bulucu</h2>
              <p className="text-gray-600 mt-1">
                Adım {currentStep + 1} / {steps.length}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close dialog"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-indigo-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {currentStep < steps.length ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-gray-600">
                    Size en uygun seçeneği belirleyin
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {steps[currentStep].options.map((option) => {
                    const isSelected = giftData[steps[currentStep].id as keyof GiftData] === option.id;
                    
                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => handleOptionSelect(option.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-6 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                        }`}
                      >
                        <div className="text-4xl mb-3">{option.icon}</div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {option.label}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                        {isSelected && (
                          <div className="mt-3 flex items-center text-indigo-600">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">Seçildi</span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Mükemmel Hediye Bulundu! 🎁
                  </h3>
                  <p className="text-gray-600">
                    Seçimlerinize göre özel olarak seçilmiş hediyeler
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getRecommendations().map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {product.reason}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-indigo-600">
                          {new Intl.NumberFormat('tr-TR', {
                            style: 'currency',
                            currency: 'TRY',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(product.price)}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          Sepete Ekle
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Geri
            </button>

            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                İptal
              </button>
              <motion.button
                onClick={handleNext}
                disabled={!canProceed()}
                whileHover={{ scale: canProceed() ? 1.02 : 1 }}
                whileTap={{ scale: canProceed() ? 0.98 : 1 }}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  canProceed()
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentStep === steps.length - 1 ? 'Hediyeleri Gör' : 'İleri'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

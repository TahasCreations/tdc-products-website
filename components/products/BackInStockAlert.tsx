'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Mail, X } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface BackInStockAlertProps {
  productId: string;
  productTitle: string;
}

export default function BackInStockAlert({ productId, productTitle }: BackInStockAlertProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/products/stock-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          email
        })
      });

      if (response.ok) {
        setIsSubscribed(true);
        toast.success('Stokta olunca size haber vereceğiz! 🔔');
        setTimeout(() => {
          setIsOpen(false);
          setEmail('');
          setIsSubscribed(false);
        }, 2000);
      } else {
        toast.error('Bir hata oluştu, lütfen tekrar deneyin');
      }
    } catch (error) {
      console.error('Stock alert error:', error);
      toast.error('Bağlantı hatası');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
      >
        <Bell className="w-5 h-5" />
        <span>Stokta Olunca Haber Ver</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            <div className="fixed inset-0 z-[51] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
              >
                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                {/* Content */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Stokta Olunca Haber Ver
                  </h3>
                  <p className="text-gray-600 text-sm">
                    <span className="font-semibold">{productTitle}</span> stokta olduğunda size email göndereceğiz
                  </p>
                </div>

                {isSubscribed ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="text-6xl mb-4">✅</div>
                    <p className="text-lg font-semibold text-green-600">
                      Bildirim Aktif!
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Stokta olduğunda size haber vereceğiz
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-1" />
                        E-posta Adresiniz
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ornek@email.com"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none text-gray-900"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? '⏳ Kaydediliyor...' : '🔔 Bana Haber Ver'}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      Email adresinizi sadece stok bildirimi için kullanacağız
                    </p>
                  </form>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}


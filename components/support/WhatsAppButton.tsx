"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = '905558988242'; // Telefon numaranız
  
  const predefinedMessages = [
    { text: 'Ürün hakkında bilgi almak istiyorum', emoji: '🛍️' },
    { text: 'Siparişim hakkında bilgi almak istiyorum', emoji: '📦' },
    { text: 'Ödeme konusunda yardım istiyorum', emoji: '💳' },
    { text: 'Kargo bilgisi almak istiyorum', emoji: '🚚' },
    { text: 'Genel destek', emoji: '💬' },
  ];

  const sendWhatsAppMessage = (message: string) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all duration-300"
          aria-label="WhatsApp Destek"
        >
          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20" />
          <div className="relative flex items-center justify-center">
            {isOpen ? (
              <X className="w-7 h-7 text-white" />
            ) : (
              <MessageCircle className="w-7 h-7 text-white" />
            )}
          </div>
          
          {/* Online Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </button>

        {/* Tooltip */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-20 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg"
          >
            Yardıma mı ihtiyacınız var? 💬
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-45 w-2 h-2 bg-gray-900" />
          </motion.div>
        )}
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">WhatsApp Destek</h3>
                  <p className="text-xs text-green-100">Online - Genellikle birkaç dakika içinde yanıt verir</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 max-h-96 overflow-y-auto">
              <p className="text-sm text-gray-600 mb-4">
                Merhaba! 👋 Size nasıl yardımcı olabiliriz?
              </p>

              <div className="space-y-2">
                {predefinedMessages.map((msg, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => sendWhatsAppMessage(msg.text)}
                    className="w-full text-left p-3 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{msg.emoji}</span>
                      <span className="text-sm text-gray-700 group-hover:text-green-700 font-medium">
                        {msg.text}
                      </span>
                      <Send className="w-4 h-4 text-gray-400 group-hover:text-green-600 ml-auto" />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Custom Message */}
              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => sendWhatsAppMessage('Merhaba, yardım almak istiyorum.')}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp'ta Sohbete Başla</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t text-center">
              <p className="text-xs text-gray-500">
                <span className="text-green-600 font-semibold">7/24</span> destek hattımız aktif
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}



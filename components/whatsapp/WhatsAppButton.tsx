'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { whatsappIntegration } from '@/lib/whatsapp/whatsapp-integration';

interface WhatsAppButtonProps {
  message?: string;
  className?: string;
  variant?: 'floating' | 'inline';
}

export default function WhatsAppButton({ 
  message = 'Merhaba! TDC Market hakkında bilgi almak istiyorum.',
  className = '',
  variant = 'floating'
}: WhatsAppButtonProps) {
  
  const handleClick = () => {
    const chatLink = whatsappIntegration.generateChatLink(undefined, message);
    window.open(chatLink, '_blank');
  };

  if (variant === 'floating') {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-colors ${className}`}
        aria-label="WhatsApp ile iletişime geç"
      >
        <MessageCircle className="w-7 h-7" />
        
        {/* Online Indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
      </motion.button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl ${className}`}
    >
      <MessageCircle className="w-5 h-5" />
      <span>WhatsApp Destek</span>
    </button>
  );
}


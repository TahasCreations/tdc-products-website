"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Phone, Mail, Clock, User, Minimize2 } from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  avatar?: string;
}

const QUICK_REPLIES = [
  'Sipariş durumu',
  'İade/Değişim',
  'Ürün bilgisi',
  'Ödeme sorunları',
];

const SUPPORT_TEAM = {
  name: 'Destek Ekibi',
  avatar: '/images/support-avatar.png',
  status: 'online',
  responseTime: '~2 dakika',
};

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! 👋 Size nasıl yardımcı olabilirim?',
      sender: 'support',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate typing indicator
    setIsTyping(true);

    // Send to backend
    try {
      const response = await fetch('/api/chat/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputValue,
          sessionId: `session-${Date.now()}`,
        }),
      });

      const data = await response.json();

      setTimeout(() => {
        setIsTyping(false);
        if (data.reply) {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              text: data.reply,
              sender: 'support',
              timestamp: new Date(),
            },
          ]);
        }
      }, 1500);
    } catch (error) {
      setIsTyping(false);
      console.error('Chat error:', error);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
  };

  const openWhatsApp = () => {
    const phoneNumber = '905XXXXXXXXX'; // Telefon numaranızı buraya ekleyin
    const message = encodeURIComponent('Merhaba, yardım almak istiyorum.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-indigo-500/50 transition-all"
          >
            <MessageCircle className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '60px' : '600px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxWidth: '400px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-bold text-sm">{SUPPORT_TEAM.name}</h3>
                  <p className="text-xs text-white/80 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {SUPPORT_TEAM.responseTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                            : 'bg-white shadow-sm'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === 'user'
                              ? 'text-white/70'
                              : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {messages.length <= 1 && (
                  <div className="px-4 py-2 bg-white border-t">
                    <p className="text-xs text-gray-600 mb-2">Hızlı Yanıtlar:</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_REPLIES.map((reply) => (
                        <button
                          key={reply}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-full transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 bg-white border-t">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Mesajınızı yazın..."
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-full focus:border-indigo-500 outline-none text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Alternative Contact Methods */}
                  <div className="flex items-center justify-center space-x-4 mt-3 pt-3 border-t">
                    <button
                      onClick={openWhatsApp}
                      className="flex items-center space-x-2 text-xs text-gray-600 hover:text-green-600 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>WhatsApp</span>
                    </button>
                    <span className="text-gray-300">|</span>
                    <a
                      href="mailto:destek@tdc.com"
                      className="flex items-center space-x-2 text-xs text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>E-posta</span>
                    </a>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


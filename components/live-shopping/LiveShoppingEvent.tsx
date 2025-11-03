'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, ShoppingBag, Heart, MessageCircle, Users, Send, Gift, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface LiveEvent {
  id: string;
  title: string;
  host: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  streamUrl: string;
  thumbnail: string;
  viewerCount: number;
  status: 'upcoming' | 'live' | 'ended';
  startTime: string;
  featuredProducts: Array<{
    id: string;
    title: string;
    price: number;
    image: string;
    stock: number;
    liveDiscount: number;
  }>;
}

interface LiveShoppingEventProps {
  event: LiveEvent;
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveShoppingEvent({ event, isOpen, onClose }: LiveShoppingEventProps) {
  const [messages, setMessages] = useState<Array<{ user: string; text: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      // Simulate live messages
      const interval = setInterval(() => {
        const users = ['Ahmet', 'Ayşe', 'Mehmet', 'Zeynep', 'Ali'];
        const comments = [
          'Harika ürün! 🔥',
          'Fiyat çok iyi',
          'Sipariş verdim 🛒',
          'Stok var mı?',
          'Çok beğendim ❤️'
        ];

        const newMessage = {
          user: users[Math.floor(Math.random() * users.length)],
          text: comments[Math.floor(Math.random() * comments.length)]
        };

        setMessages(prev => [...prev, newMessage].slice(-50)); // Keep last 50
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages(prev => [...prev, { user: 'Sen', text: inputMessage }]);
      setInputMessage('');
    }
  };

  const handleAddToCart = (product: any) => {
    toast.success(`${product.title} sepete eklendi! 🎉`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 z-[9999]"
          />

          {/* Live Shopping Interface */}
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-black rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Stream (Left - 70%) */}
              <div className="flex-1 relative">
                {/* Video Player */}
                <video
                  ref={videoRef}
                  src={event.streamUrl}
                  poster={event.thumbnail}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                />

                {/* Live Badge */}
                <div className="absolute top-4 left-4 px-4 py-2 bg-red-600 text-white rounded-full font-bold flex items-center space-x-2 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>CANLI</span>
                </div>

                {/* Viewer Count */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-black/70 backdrop-blur-sm text-white rounded-full font-bold flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{event.viewerCount.toLocaleString()}</span>
                </div>

                {/* Host Info */}
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl p-4 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center font-bold">
                      {event.host.avatar || event.host.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{event.host.name}</span>
                        {event.host.verified && <span className="text-blue-400">✓</span>}
                      </div>
                      <p className="text-sm opacity-80">{event.title}</p>
                    </div>
                  </div>
                </div>

                {/* Like Button */}
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="absolute bottom-24 right-4 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <Heart className={`w-7 h-7 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
                </button>

                {/* Share Button */}
                <button className="absolute bottom-40 right-4 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                  <Send className="w-7 h-7 text-white" />
                </button>
              </div>

              {/* Right Panel (30%) */}
              <div className="w-96 bg-white flex flex-col">
                {/* Header */}
                <div className="p-4 border-b-2 border-gray-200">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors text-white"
                  >
                    ✕
                  </button>
                  <h3 className="text-lg font-bold text-gray-900">Canlı Yayın</h3>
                  <p className="text-sm text-gray-600">Chat ve ürünler</p>
                </div>

                {/* Products Section */}
                <div className="p-4 border-b-2 border-gray-200 max-h-64 overflow-y-auto">
                  <h4 className="font-bold text-gray-900 mb-3">🔥 Canlı Ürünler</h4>
                  <div className="space-y-3">
                    {event.featuredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-semibold text-gray-900 truncate">
                            {product.title}
                          </h5>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-indigo-600">
                              {product.price.toLocaleString('tr-TR')} ₺
                            </span>
                            {product.liveDiscount > 0 && (
                              <span className="px-2 py-0.5 bg-red-500 text-white rounded-full text-xs font-bold">
                                -%{product.liveDiscount}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600">
                            Stok: {product.stock} adet
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Section */}
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {messages.map((msg, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {msg.user.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-900">{msg.user}</div>
                          <div className="text-sm text-gray-700">{msg.text}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t-2 border-gray-200">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Mesajınızı yazın..."
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-full focus:border-indigo-500 outline-none text-sm"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}


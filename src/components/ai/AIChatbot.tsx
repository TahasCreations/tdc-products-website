'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  UserIcon,
  CpuChipIcon,
  LightBulbIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: Array<{
    type: 'add_to_cart' | 'view_product' | 'search' | 'contact_support';
    label: string;
    data?: any;
  }>;
}

interface ChatContext {
  userType: 'customer' | 'admin';
  currentPage?: string;
  userPreferences?: any;
  cartItems?: any[];
  recentSearches?: string[];
}

interface AIChatbotProps {
  context?: ChatContext;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'light' | 'dark' | 'auto';
  language?: 'tr' | 'en';
}

export default function AIChatbot({
  context = { userType: 'customer' },
  position = 'bottom-right',
  theme = 'auto',
  language = 'tr'
}: AIChatbotProps) {
  const { user } = useAuth();
  const { state: cartState } = useCart();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getWelcomeMessage = useCallback(() => {
    const greetings = {
      tr: [
        "Merhaba! 👋 TDC Products AI asistanınızım. Size nasıl yardımcı olabilirim?",
        "Selam! 🤖 Ürünler, siparişler veya genel sorularınız için buradayım.",
        "Hoş geldiniz! ✨ Size en uygun ürünleri bulmanızda yardımcı olabilirim."
      ],
      en: [
        "Hello! 👋 I'm your TDC Products AI assistant. How can I help you today?",
        "Hi there! 🤖 I'm here to help with products, orders, or any questions you have.",
        "Welcome! ✨ I can help you find the perfect products for you."
      ]
    };
    
    const greetingList = greetings[language];
    return greetingList[Math.floor(Math.random() * greetingList.length)];
  }, [language]);

  const getWelcomeSuggestions = useCallback(() => {
    const suggestions = {
      tr: [
        "Ürün önerisi ver",
        "Sepetimdeki ürünleri göster",
        "Kampanyaları listele",
        "Sipariş durumu sorgula"
      ],
      en: [
        "Recommend products",
        "Show cart items",
        "List campaigns",
        "Check order status"
      ]
    };
    
    return suggestions[language];
  }, [language]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'assistant',
        content: getWelcomeMessage(),
        timestamp: new Date(),
        suggestions: getWelcomeSuggestions()
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length, getWelcomeMessage, getWelcomeSuggestions]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      const response = await generateAIResponse(inputValue.trim());
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions,
        actions: response.actions as any
      };

      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1000 + Math.random() * 2000); // Simulate thinking time

    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: language === 'tr' 
          ? "Üzgünüm, şu anda bir hata oluştu. Lütfen tekrar deneyin."
          : "Sorry, an error occurred. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (userInput: string) => {
    // Simulate AI processing
    const input = userInput.toLowerCase();
    
    // Product recommendations
    if (input.includes('ürün') || input.includes('product') || input.includes('öneri') || input.includes('recommend')) {
      return {
        content: language === 'tr' 
          ? "Size özel ürün önerileri hazırlıyorum! 🛍️\n\n• Akıllı telefonlar\n• Laptoplar\n• Kulaklıklar\n• Spor ayakkabılar\n\nHangi kategoride ürün arıyorsunuz?"
          : "I'm preparing personalized product recommendations for you! 🛍️\n\n• Smartphones\n• Laptops\n• Headphones\n• Sports shoes\n\nWhich category are you looking for?",
        suggestions: language === 'tr' 
          ? ["Telefon öner", "Laptop öner", "Kulaklık öner", "Ayakkabı öner"]
          : ["Recommend phones", "Recommend laptops", "Recommend headphones", "Recommend shoes"],
        actions: [
          { type: 'search', label: language === 'tr' ? 'Ürünleri Görüntüle' : 'View Products', data: { category: 'all' } }
        ]
      };
    }

    // Cart information
    if (input.includes('sepet') || input.includes('cart') || input.includes('basket')) {
      const cartCount = cartState.items.length;
      return {
        content: language === 'tr' 
          ? `Sepetinizde ${cartCount} ürün bulunuyor. 🛒\n\nToplam tutar: ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(cartState.total)}\n\nSepetinizi görüntülemek ister misiniz?`
          : `You have ${cartCount} items in your cart. 🛒\n\nTotal amount: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cartState.total)}\n\nWould you like to view your cart?`,
        suggestions: language === 'tr' 
          ? ["Sepeti görüntüle", "Ödeme yap", "Ürün ekle"]
          : ["View cart", "Checkout", "Add products"],
        actions: [
          { type: 'view_product', label: language === 'tr' ? 'Sepeti Görüntüle' : 'View Cart', data: { url: '/cart' } }
        ]
      };
    }

    // Campaigns
    if (input.includes('kampanya') || input.includes('campaign') || input.includes('indirim') || input.includes('discount')) {
      return {
        content: language === 'tr' 
          ? "🔥 Aktif kampanyalarımız:\n\n• %20 indirim - Tüm elektronik ürünlerde\n• Ücretsiz kargo - 500₺ ve üzeri alışverişlerde\n• 2+1 kampanyası - Seçili ürünlerde\n• Yeni müşteri indirimi - %15 indirim\n\nHangi kampanyayı detaylandırmamı istersiniz?"
          : "🔥 Our active campaigns:\n\n• 20% off - All electronics\n• Free shipping - Orders over $50\n• Buy 2 Get 1 - Selected products\n• New customer discount - 15% off\n\nWhich campaign would you like me to detail?",
        suggestions: language === 'tr' 
          ? ["Elektronik indirimi", "Ücretsiz kargo", "2+1 kampanyası", "Yeni müşteri indirimi"]
          : ["Electronics discount", "Free shipping", "Buy 2 Get 1", "New customer discount"],
        actions: [
          { type: 'search', label: language === 'tr' ? 'Kampanyaları Görüntüle' : 'View Campaigns', data: { category: 'campaigns' } }
        ]
      };
    }

    // Order status
    if (input.includes('sipariş') || input.includes('order') || input.includes('durum') || input.includes('status')) {
      return {
        content: language === 'tr' 
          ? "Sipariş durumunuzu kontrol etmek için sipariş numaranızı verebilir misiniz? 📦\n\nVeya son siparişlerinizi listeleyebilirim."
          : "To check your order status, could you provide your order number? 📦\n\nOr I can list your recent orders.",
        suggestions: language === 'tr' 
          ? ["Son siparişlerim", "Sipariş numarası ver", "Kargo takibi"]
          : ["My recent orders", "Provide order number", "Track shipment"],
        actions: [
          { type: 'view_product', label: language === 'tr' ? 'Siparişlerim' : 'My Orders', data: { url: '/orders' } }
        ]
      };
    }

    // Support
    if (input.includes('yardım') || input.includes('help') || input.includes('destek') || input.includes('support')) {
      return {
        content: language === 'tr' 
          ? "Size nasıl yardımcı olabilirim? 🤝\n\n• Ürün arama ve öneriler\n• Sipariş takibi\n• Kampanya bilgileri\n• Teknik destek\n• İade ve değişim\n\nHangi konuda yardıma ihtiyacınız var?"
          : "How can I help you? 🤝\n\n• Product search and recommendations\n• Order tracking\n• Campaign information\n• Technical support\n• Returns and exchanges\n\nWhat do you need help with?",
        suggestions: language === 'tr' 
          ? ["Teknik destek", "İade işlemi", "Değişim işlemi", "İletişim bilgileri"]
          : ["Technical support", "Return process", "Exchange process", "Contact information"],
        actions: [
          { type: 'contact_support', label: language === 'tr' ? 'Destek İletişim' : 'Contact Support', data: {} }
        ]
      };
    }

    // Default response
    return {
      content: language === 'tr' 
        ? "Anladım! Size daha iyi yardımcı olabilmem için biraz daha detay verebilir misiniz? 😊\n\nÜrün arama, sipariş takibi, kampanyalar veya başka bir konuda yardıma ihtiyacınız var mı?"
        : "I understand! Could you provide a bit more detail so I can help you better? 😊\n\nDo you need help with product search, order tracking, campaigns, or something else?",
      suggestions: language === 'tr' 
        ? ["Ürün ara", "Sipariş durumu", "Kampanyalar", "Yardım"]
        : ["Search products", "Order status", "Campaigns", "Help"],
      actions: []
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleActionClick = (action: any) => {
    switch (action.type) {
      case 'add_to_cart':
        // Add to cart logic
        break;
      case 'view_product':
        if (action.data?.url) {
          window.open(action.data.url, '_blank');
        }
        break;
      case 'search':
        if (action.data?.category) {
          window.open(`/products?category=${action.data.category}`, '_blank');
        }
        break;
      case 'contact_support':
        window.open('/contact', '_blank');
        break;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed ${getPositionClasses()} z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110`}
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed ${getPositionClasses()} z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col`}>
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center">
              <SparklesIcon className="w-6 h-6 mr-2" />
              <div>
                <h3 className="font-semibold">TDC AI Asistan</h3>
                <p className="text-xs opacity-90">Çevrimiçi</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start">
                    {message.type === 'assistant' && (
                      <CpuChipIcon className="w-4 h-4 mr-2 mt-1 text-blue-600" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-xs bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleActionClick(action)}
                          className="block w-full text-left text-xs bg-blue-500 hover:bg-blue-400 p-2 rounded transition-colors"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                  <div className="flex items-center">
                    <CpuChipIcon className="w-4 h-4 mr-2 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={language === 'tr' ? 'Mesajınızı yazın...' : 'Type your message...'}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

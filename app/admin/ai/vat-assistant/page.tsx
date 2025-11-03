'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  calculateVAT, 
  extractVATFromTotal, 
  generateTaxResponse, 
  getSmartSuggestions,
  VAT_RATES,
  vatAI,
  type VATCalculation
} from '@/lib/ai/vat-assistant-engine';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  calculation?: VATCalculation;
  timestamp: Date;
}

export default function VatAssistantPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'calculator' | 'suggestions'>('chat');
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Merhaba! 👋 Ben AI KDV Danışmanınız. Size KDV, stopaj, kurumlar vergisi ve beyannameler konusunda yardımcı olabilirim. Ne öğrenmek istersiniz?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Calculator state
  const [calculatorMode, setCalculatorMode] = useState<'add' | 'extract'>('add');
  const [calcAmount, setCalcAmount] = useState('');
  const [calcVatRate, setCalcVatRate] = useState(VAT_RATES.STANDARD);
  const [calcResult, setCalcResult] = useState<VATCalculation | null>(null);

  // Quick questions
  const quickQuestions = [
    'KDV nasıl hesaplanır?',
    'KDV beyannamesi nasıl hazırlanır?',
    'KDV istisnası nedir?',
    'Stopaj oranları nelerdir?',
    'İhracat KDV iadesi nasıl alınır?',
    'Vergi optimizasyonu için ne yapabilirim?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI Chat Handler
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Kullanıcı mesajı ekle
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    // AI yanıtı oluştur
    setTimeout(() => {
      const aiResponse = vatAI.ask(inputMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.answer,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Öneriler varsa ekle
      if (aiResponse.suggestions && aiResponse.suggestions.length > 0) {
        const suggestionsMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: `📌 **İlgili konular:** ${aiResponse.suggestions.join(' • ')}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, suggestionsMessage]);
      }
      
      setIsProcessing(false);
    }, 1000);
  };

  // KDV Calculator Handler
  const handleCalculate = () => {
    const amount = parseFloat(calcAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Lütfen geçerli bir tutar girin');
      return;
    }

    const result = calculatorMode === 'add' 
      ? calculateVAT(amount, calcVatRate)
      : extractVATFromTotal(amount, calcVatRate);

    setCalcResult(result);
  };

  // Suggestions
  const smartSuggestions = getSmartSuggestions({
    revenue: 250000,
    expenses: 180000,
    vatPayable: 14000,
    period: '2024-11'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">🤖</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">AI KDV Asistanı</h1>
                  <p className="text-gray-600">Yapay zeka destekli vergi danışmanlığı</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-green-700 font-medium">AI Aktif</span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'chat', label: 'AI Sohbet', icon: '💬' },
                { key: 'calculator', label: 'KDV Hesaplayıcı', icon: '🧮' },
                { key: 'suggestions', label: 'Akıllı Öneriler', icon: '💡' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all ${
                    activeTab === tab.key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Chat Area */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-xl h-[600px] flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                            {message.type === 'ai' && (
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm">🤖</span>
                                </div>
                                <span className="text-sm text-gray-500 font-medium">AI Asistan</span>
                              </div>
                            )}
                            <div
                              className={`rounded-2xl px-6 py-4 ${
                                message.type === 'user'
                                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                  : 'bg-white shadow-md border border-gray-200'
                              }`}
                            >
                              <div className={`text-sm whitespace-pre-line ${
                                message.type === 'user' ? 'text-white' : 'text-gray-800'
                              }`}>
                                {message.content}
                              </div>
                              <div className={`text-xs mt-2 ${
                                message.type === 'user' ? 'text-white/70' : 'text-gray-400'
                              }`}>
                                {message.timestamp.toLocaleTimeString('tr-TR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {isProcessing && (
                        <div className="flex justify-start">
                          <div className="bg-white rounded-2xl px-6 py-4 shadow-md">
                            <div className="flex space-x-2">
                              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
                              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t bg-white rounded-b-xl">
                      <div className="flex items-end space-x-3">
                        <textarea
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          placeholder="KDV, stopaj veya muhasebe sorunuzu yazın..."
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none resize-none text-gray-900 placeholder:text-gray-400"
                          rows={2}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim() || isProcessing}
                          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                          Gönder 🚀
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Questions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Hızlı Sorular</h3>
                  <div className="space-y-2">
                    {quickQuestions.map((q, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setInputMessage(q)}
                        className="w-full text-left p-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-xl border border-indigo-200 transition-all"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-lg">❓</span>
                          <span className="text-sm text-gray-700">{q}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <div className="text-xs text-green-700 font-medium mb-2">Bu Ay Özet</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Çıktı KDV:</span>
                        <span className="font-semibold text-gray-900">₺0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Girdi KDV:</span>
                        <span className="font-semibold text-gray-900">₺0</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-green-200 pt-1">
                        <span className="text-gray-700 font-medium">Net KDV:</span>
                        <span className="font-bold text-green-700">₺0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Calculator Tab */}
          {activeTab === 'calculator' && (
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                {/* Mode Selector */}
                <div className="flex space-x-4 mb-6">
                  <button
                    onClick={() => setCalculatorMode('add')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      calculatorMode === 'add'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">➕</div>
                    <div className="font-semibold text-gray-900">KDV Ekle</div>
                    <div className="text-sm text-gray-600">Tutara KDV ekleyin</div>
                  </button>
                  <button
                    onClick={() => setCalculatorMode('extract')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      calculatorMode === 'extract'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">➖</div>
                    <div className="font-semibold text-gray-900">KDV Çıkar</div>
                    <div className="text-sm text-gray-600">Tutardan KDV ayıklayın</div>
                  </button>
                </div>

                {/* Calculator Form */}
                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    {calculatorMode === 'add' ? 'Tutara KDV Ekle' : 'Tutardan KDV Çıkar'}
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {calculatorMode === 'add' ? 'KDV Hariç Tutar (₺)' : 'KDV Dahil Tutar (₺)'}
                      </label>
                      <input
                        type="number"
                        value={calcAmount}
                        onChange={(e) => setCalcAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-indigo-500 outline-none text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        KDV Oranı
                      </label>
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          { value: VAT_RATES.STANDARD, label: '%20', desc: 'Standart' },
                          { value: VAT_RATES.REDUCED, label: '%10', desc: 'İndirimli' },
                          { value: VAT_RATES.SUPER_REDUCED, label: '%1', desc: 'Özel' },
                          { value: VAT_RATES.ZERO, label: '%0', desc: 'İstisna' }
                        ].map((rate) => (
                          <button
                            key={rate.value}
                            onClick={() => setCalcVatRate(rate.value)}
                            className={`p-3 rounded-xl border-2 transition-all ${
                              calcVatRate === rate.value
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                            }`}
                          >
                            <div className="text-lg font-bold">{rate.label}</div>
                            <div className="text-xs">{rate.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleCalculate}
                      className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
                    >
                      Hesapla 🚀
                    </button>
                  </div>

                  {/* Result */}
                  <AnimatePresence>
                    {calcResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200"
                      >
                        <h4 className="font-bold text-green-900 mb-4 flex items-center">
                          <span className="text-2xl mr-2">✅</span>
                          Hesaplama Sonucu
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-gray-700">Matrah (KDV Hariç):</span>
                            <span className="text-xl font-bold text-gray-900">
                              {calcResult.baseAmount.toLocaleString('tr-TR')} ₺
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-gray-700">KDV Tutarı (%{calcResult.vatRate}):</span>
                            <span className="text-xl font-bold text-indigo-600">
                              {calcResult.vatAmount.toLocaleString('tr-TR')} ₺
                            </span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-2 border-green-300">
                            <span className="text-gray-900 font-semibold">Toplam (KDV Dahil):</span>
                            <span className="text-2xl font-bold text-green-700">
                              {calcResult.totalWithVAT.toLocaleString('tr-TR')} ₺
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-4 italic">
                          💡 {calcResult.explanation}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quick Reference */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-3">📊 KDV Oranları</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Standart:</span>
                        <span className="font-bold text-blue-700">%20</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">İndirimli:</span>
                        <span className="font-bold text-blue-700">%10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Özel:</span>
                        <span className="font-bold text-blue-700">%1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">İstisna:</span>
                        <span className="font-bold text-blue-700">%0</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
                    <h4 className="font-bold text-orange-900 mb-3">⏰ Beyan Tarihleri</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div>• KDV Beyanı: Her ayın <strong>24'ü</strong></div>
                      <div>• Muhtasar: Her ayın <strong>23'ü</strong></div>
                      <div>• Geçici Vergi: Ayın <strong>17'si</strong></div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                    <h4 className="font-bold text-purple-900 mb-3">💡 Hızlı İpuçları</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div>✓ Girdi KDV belgelerinizi saklayın</div>
                      <div>✓ İhracat KDV iadesi alabilirsiniz</div>
                      <div>✓ İndirimli oranlı ürünleri bilin</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Akıllı Vergi Önerileri</h3>
              
              {smartSuggestions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💡</div>
                  <p className="text-gray-500">Şu an için öneri yok. Verileriniz analiz edildikçe öneriler burada görünecek.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {smartSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 rounded-xl border-2 ${
                        suggestion.type === 'warning' ? 'bg-red-50 border-red-200' :
                        suggestion.type === 'opportunity' ? 'bg-green-50 border-green-200' :
                        suggestion.type === 'reminder' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">
                            {suggestion.type === 'warning' ? '⚠️' :
                             suggestion.type === 'opportunity' ? '💰' :
                             suggestion.type === 'reminder' ? '⏰' : '💡'}
                          </span>
                          <div>
                            <h4 className="font-bold text-gray-900">{suggestion.title}</h4>
                            <p className="text-sm text-gray-700 mt-1">{suggestion.description}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                          suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {suggestion.priority === 'high' ? 'Yüksek' :
                           suggestion.priority === 'medium' ? 'Orta' : 'Düşük'}
                        </span>
                      </div>
                      {suggestion.action && (
                        <button className={`mt-3 px-4 py-2 rounded-lg font-medium text-sm ${
                          suggestion.type === 'warning' ? 'bg-red-600 text-white hover:bg-red-700' :
                          suggestion.type === 'opportunity' ? 'bg-green-600 text-white hover:bg-green-700' :
                          'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}>
                          {suggestion.action}
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

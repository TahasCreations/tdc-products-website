"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generateAccountingResponse,
  generateJournalEntry,
  calculateFinancialRatios,
  getAccountingInsights,
  accountingAI,
  STANDARD_ACCOUNTS,
  type JournalEntry,
  type FinancialRatios
} from '@/lib/ai/accounting-assistant-engine';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  journalEntry?: JournalEntry;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'journal' | 'analysis'>('chat');
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Merhaba! 👋 Ben AI Muhasebe Asistanınız. Size yevmiye kayıtları, mali tablolar, borç-alacak mantığı ve muhasebe soruları konusunda yardımcı olabilirim. Nasıl yardımcı olabilirim?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Journal Generator state
  const [transactionType, setTransactionType] = useState<'sale' | 'purchase' | 'payment' | 'receipt' | 'expense' | 'salary'>('sale');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionVatRate, setTransactionVatRate] = useState(20);
  const [transactionDesc, setTransactionDesc] = useState('');
  const [generatedJournal, setGeneratedJournal] = useState<JournalEntry | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Quick questions
  const quickQuestions = [
    'Satış işlemi nasıl kaydedilir?',
    'Alış kaydı örneği göster',
    'Maaş ödemesi nasıl kaydedilir?',
    'Bilanço nedir?',
    'Amortisman hesaplama',
    'Borç-alacak mantığı nedir?'
  ];

  // Chat handler
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    setTimeout(() => {
      const aiResponse = accountingAI.ask(inputMessage);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.answer,
        journalEntry: aiResponse.journalEntry,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Suggestions ekle
      if (aiResponse.suggestions && aiResponse.suggestions.length > 0) {
        const suggestionsMsg: ChatMessage = {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: `📌 **İlgili konular:** ${aiResponse.suggestions.join(' • ')}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, suggestionsMsg]);
      }
      
      setIsProcessing(false);
    }, 1200);
  };

  // Journal Generator handler
  const handleGenerateJournal = () => {
    const amount = parseFloat(transactionAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Lütfen geçerli bir tutar girin');
      return;
    }

    const journal = generateJournalEntry({
      type: transactionType,
      amount,
      vatRate: transactionVatRate,
      description: transactionDesc
    });

    setGeneratedJournal(journal);
  };

  // Financial Analysis (example data)
  const exampleFinancialData = {
    revenue: 500000,
    grossProfit: 200000,
    netProfit: 75000,
    totalAssets: 800000,
    currentAssets: 400000,
    inventory: 150000,
    cash: 100000,
    currentLiabilities: 250000,
    totalLiabilities: 400000,
    equity: 400000
  };

  const ratios = calculateFinancialRatios(exampleFinancialData);
  const insights = getAccountingInsights(ratios);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
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
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">🧮</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">AI Muhasebe Asistanı</h1>
                  <p className="text-gray-600">Yapay zeka destekli muhasebe danışmanlığı</p>
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
                { key: 'journal', label: 'Yevmiye Oluşturucu', icon: '📝' },
                { key: 'analysis', label: 'Mali Analiz', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all ${
                    activeTab === tab.key
                      ? 'border-purple-500 text-purple-600'
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
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-sm">🧮</span>
                                </div>
                                <span className="text-sm text-gray-500 font-medium">Muhasebe AI</span>
                              </div>
                            )}
                            <div
                              className={`rounded-2xl px-6 py-4 ${
                                message.type === 'user'
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                  : 'bg-white shadow-md border border-gray-200'
                              }`}
                            >
                              <div className={`text-sm whitespace-pre-line ${
                                message.type === 'user' ? 'text-white' : 'text-gray-800'
                              }`}>
                                {message.content}
                              </div>
                              
                              {/* Journal Entry Display */}
                              {message.journalEntry && (
                                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                  <div className="font-semibold text-blue-900 mb-2">📋 Yevmiye Fişi:</div>
                                  <div className="text-sm space-y-1">
                                    <div className="font-medium text-gray-700">Tarih: {message.journalEntry.date}</div>
                                    <div className="text-gray-600">{message.journalEntry.description}</div>
                                    <div className="mt-2 grid grid-cols-2 gap-4">
                                      <div>
                                        <div className="font-semibold text-red-700 mb-1">BORÇ:</div>
                                        {message.journalEntry.debit.map((d, i) => (
                                          <div key={i} className="text-xs text-gray-700">
                                            {d.account}: {d.amount.toLocaleString('tr-TR')} ₺
                                          </div>
                                        ))}
                                      </div>
                                      <div>
                                        <div className="font-semibold text-blue-700 mb-1">ALACAK:</div>
                                        {message.journalEntry.credit.map((c, i) => (
                                          <div key={i} className="text-xs text-gray-700">
                                            {c.account}: {c.amount.toLocaleString('tr-TR')} ₺
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

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
                              <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce"></div>
                              <div className="w-3 h-3 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
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
                          placeholder="Muhasebe sorunuzu yazın... (Örn: Satış işlemi nasıl kaydedilir?)"
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none resize-none text-gray-900 placeholder:text-gray-400"
                          rows={2}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim() || isProcessing}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                          Gönder 🚀
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Questions & Account Search */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Hızlı Sorular</h3>
                    <div className="space-y-2">
                      {quickQuestions.map((q, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setInputMessage(q)}
                          className="w-full text-left p-3 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl border border-purple-200 transition-all"
                        >
                          <div className="flex items-start space-x-2">
                            <span className="text-base">❓</span>
                            <span className="text-sm text-gray-700">{q}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <div className="text-xs text-green-700 font-medium mb-3">Bu Ay Özet</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Toplam Gelir:</span>
                        <span className="font-bold text-gray-900">₺0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Toplam Gider:</span>
                        <span className="font-bold text-gray-900">₺0</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-green-200 pt-2">
                        <span className="text-gray-700 font-medium">Net Kar:</span>
                        <span className="font-bold text-green-700">₺0</span>
                      </div>
                    </div>
                  </div>

                  {/* Account Quick Reference */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                    <h4 className="font-bold text-blue-900 mb-3">📚 Hesap Planı</h4>
                    <div className="space-y-1 text-xs">
                      <div className="text-gray-700">100 - Kasa</div>
                      <div className="text-gray-700">102 - Bankalar</div>
                      <div className="text-gray-700">120 - Alıcılar</div>
                      <div className="text-gray-700">153 - Ticari Mallar</div>
                      <div className="text-gray-700">320 - Satıcılar</div>
                      <div className="text-gray-700">600 - Satışlar</div>
                      <div className="text-gray-700">770 - Genel Giderler</div>
                    </div>
                    <button 
                      onClick={() => setInputMessage('Hesap planını göster')}
                      className="mt-3 text-xs text-blue-700 hover:text-blue-900 font-medium"
                    >
                      Tümünü gör →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Journal Generator Tab */}
          {activeTab === 'journal' && (
            <div className="p-6">
              <div className="max-w-5xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Input Form */}
                  <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg border-2 border-purple-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="text-2xl mr-2">📝</span>
                      Yevmiye Kaydı Oluştur
                    </h3>

                    <div className="space-y-4">
                      {/* Transaction Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          İşlem Türü
                        </label>
                        <select
                          value={transactionType}
                          onChange={(e) => setTransactionType(e.target.value as any)}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none text-gray-900"
                        >
                          <option value="sale">Satış</option>
                          <option value="purchase">Alış</option>
                          <option value="payment">Ödeme</option>
                          <option value="receipt">Tahsilat</option>
                          <option value="expense">Gider</option>
                          <option value="salary">Maaş</option>
                        </select>
                      </div>

                      {/* Amount */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tutar (₺)
                        </label>
                        <input
                          type="number"
                          value={transactionAmount}
                          onChange={(e) => setTransactionAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none text-gray-900"
                        />
                      </div>

                      {/* VAT Rate (only for sale/purchase) */}
                      {(transactionType === 'sale' || transactionType === 'purchase') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            KDV Oranı (%)
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {[20, 10, 1, 0].map((rate) => (
                              <button
                                key={rate}
                                onClick={() => setTransactionVatRate(rate)}
                                className={`p-2 rounded-lg border-2 transition-all ${
                                  transactionVatRate === rate
                                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="font-bold">%{rate}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Açıklama (Opsiyonel)
                        </label>
                        <input
                          type="text"
                          value={transactionDesc}
                          onChange={(e) => setTransactionDesc(e.target.value)}
                          placeholder="İşlem açıklaması"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 outline-none text-gray-900"
                        />
                      </div>

                      <button
                        onClick={handleGenerateJournal}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
                      >
                        Yevmiye Kaydı Oluştur 🚀
                      </button>
                    </div>
                  </div>

                  {/* Journal Entry Display */}
                  <div>
                    {generatedJournal ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl shadow-lg border-2 border-purple-200 p-6"
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                          <span className="text-2xl mr-2">✅</span>
                          Yevmiye Kaydı
                        </h3>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                            <div>
                              <span className="text-sm text-gray-600">Tarih:</span>
                              <div className="font-medium text-gray-900">{generatedJournal.date}</div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Açıklama:</span>
                              <div className="font-medium text-gray-900">{generatedJournal.description}</div>
                            </div>
                          </div>

                          {/* Debit Side */}
                          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <div className="font-bold text-red-900 mb-3 flex items-center">
                              <span className="mr-2">📤</span>
                              BORÇ (Debit)
                            </div>
                            {generatedJournal.debit.map((entry, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-red-100 last:border-0">
                                <span className="text-sm text-gray-700">{entry.account}</span>
                                <span className="font-bold text-red-700">{entry.amount.toLocaleString('tr-TR')} ₺</span>
                              </div>
                            ))}
                            <div className="flex justify-between items-center pt-2 mt-2 border-t-2 border-red-300">
                              <span className="font-semibold text-gray-900">Toplam Borç:</span>
                              <span className="font-bold text-red-700 text-lg">
                                {generatedJournal.debit.reduce((sum, d) => sum + d.amount, 0).toLocaleString('tr-TR')} ₺
                              </span>
                            </div>
                          </div>

                          {/* Credit Side */}
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <div className="font-bold text-blue-900 mb-3 flex items-center">
                              <span className="mr-2">📥</span>
                              ALACAK (Credit)
                            </div>
                            {generatedJournal.credit.map((entry, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-blue-100 last:border-0">
                                <span className="text-sm text-gray-700">{entry.account}</span>
                                <span className="font-bold text-blue-700">{entry.amount.toLocaleString('tr-TR')} ₺</span>
                              </div>
                            ))}
                            <div className="flex justify-between items-center pt-2 mt-2 border-t-2 border-blue-300">
                              <span className="font-semibold text-gray-900">Toplam Alacak:</span>
                              <span className="font-bold text-blue-700 text-lg">
                                {generatedJournal.credit.reduce((sum, c) => sum + c.amount, 0).toLocaleString('tr-TR')} ₺
                              </span>
                            </div>
                          </div>

                          {/* Explanation */}
                          {generatedJournal.explanation && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <div className="flex items-start space-x-2">
                                <span className="text-lg">💡</span>
                                <div>
                                  <div className="font-semibold text-yellow-900 mb-1">Açıklama:</div>
                                  <div className="text-sm text-gray-700">{generatedJournal.explanation}</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Balance Check */}
                          <div className={`p-4 rounded-lg border-2 ${
                            generatedJournal.debit.reduce((sum, d) => sum + d.amount, 0) === 
                            generatedJournal.credit.reduce((sum, c) => sum + c.amount, 0)
                              ? 'bg-green-50 border-green-300'
                              : 'bg-red-50 border-red-300'
                          }`}>
                            <div className="flex items-center justify-center space-x-2">
                              <span className="text-xl">
                                {generatedJournal.debit.reduce((sum, d) => sum + d.amount, 0) === 
                                 generatedJournal.credit.reduce((sum, c) => sum + c.amount, 0) ? '✅' : '❌'}
                              </span>
                              <span className={`font-semibold ${
                                generatedJournal.debit.reduce((sum, d) => sum + d.amount, 0) === 
                                generatedJournal.credit.reduce((sum, c) => sum + c.amount, 0)
                                  ? 'text-green-700'
                                  : 'text-red-700'
                              }`}>
                                {generatedJournal.debit.reduce((sum, d) => sum + d.amount, 0) === 
                                 generatedJournal.credit.reduce((sum, c) => sum + c.amount, 0)
                                  ? 'Kayıt Dengeli ✓'
                                  : 'Kayıt Dengesiz!'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-12 text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Yevmiye Kaydı Hazır</h3>
                        <p className="text-gray-600">
                          Sol taraftan işlem bilgilerini girin ve otomatik yevmiye kaydı oluşturun.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="p-6">
              <div className="max-w-6xl mx-auto space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Mali Oran Analizi</h3>

                {/* Profitability Ratios */}
                <div className="bg-white rounded-xl shadow-md border p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-xl mr-2">📈</span>
                    Kârlılık Oranları
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm text-gray-600 mb-1">Brüt Kar Marjı</div>
                      <div className="text-2xl font-bold text-green-700">
                        %{ratios.profitability.grossProfitMargin.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm text-gray-600 mb-1">Net Kar Marjı</div>
                      <div className="text-2xl font-bold text-blue-700">
                        %{ratios.profitability.netProfitMargin.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-sm text-gray-600 mb-1">Aktif Karlılık (ROA)</div>
                      <div className="text-2xl font-bold text-purple-700">
                        %{ratios.profitability.returnOnAssets.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                      <div className="text-sm text-gray-600 mb-1">Özkaynak Karlılığı (ROE)</div>
                      <div className="text-2xl font-bold text-pink-700">
                        %{ratios.profitability.returnOnEquity.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Liquidity Ratios */}
                <div className="bg-white rounded-xl shadow-md border p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-xl mr-2">💧</span>
                    Likidite Oranları
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm text-gray-600 mb-1">Cari Oran</div>
                      <div className="text-2xl font-bold text-blue-700">
                        {ratios.liquidity.currentRatio.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">İdeal: 1.5-3.0</div>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="text-sm text-gray-600 mb-1">Asit-Test Oranı</div>
                      <div className="text-2xl font-bold text-indigo-700">
                        {ratios.liquidity.quickRatio.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">İdeal: &gt;1.0</div>
                    </div>
                    <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                      <div className="text-sm text-gray-600 mb-1">Nakit Oranı</div>
                      <div className="text-2xl font-bold text-cyan-700">
                        {ratios.liquidity.cashRatio.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">İdeal: &gt;0.5</div>
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="bg-white rounded-xl shadow-md border p-6">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                    <span className="text-xl mr-2">🤖</span>
                    AI İçgörüleri
                  </h4>
                  <div className="space-y-3">
                    {insights.map((insight, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${
                          insight.type === 'success' ? 'bg-green-50 border-green-500' :
                          insight.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                          insight.type === 'danger' ? 'bg-red-50 border-red-500' :
                          'bg-blue-50 border-blue-500'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                insight.type === 'success' ? 'bg-green-200 text-green-800' :
                                insight.type === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                                insight.type === 'danger' ? 'bg-red-200 text-red-800' :
                                'bg-blue-200 text-blue-800'
                              }`}>
                                {insight.category}
                              </span>
                            </div>
                            <div className="font-semibold text-gray-900 mb-1">{insight.message}</div>
                            <div className="text-sm text-gray-600">💡 {insight.recommendation}</div>
                          </div>
                          <span className="text-2xl">
                            {insight.type === 'success' ? '✅' :
                             insight.type === 'warning' ? '⚠️' :
                             insight.type === 'danger' ? '🚨' : 'ℹ️'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Gift, Send, Heart, Star, Sparkles } from 'lucide-react';
import Image from 'next/image';

const GIFT_DESIGNS = [
  { id: '1', name: 'Doğum Günü', image: '/images/gift-cards/birthday.png', color: 'from-pink-500 to-rose-500' },
  { id: '2', name: 'Kutlama', image: '/images/gift-cards/celebration.png', color: 'from-purple-500 to-indigo-500' },
  { id: '3', name: 'Teşekkür', image: '/images/gift-cards/thanks.png', color: 'from-blue-500 to-cyan-500' },
  { id: '4', name: 'Sevgiliye', image: '/images/gift-cards/love.png', color: 'from-red-500 to-pink-500' },
];

const AMOUNTS = [100, 250, 500, 1000, 2500];

export default function GiftCardsPage() {
  const [selectedDesign, setSelectedDesign] = useState(GIFT_DESIGNS[0]);
  const [amount, setAmount] = useState(250);
  const [customAmount, setCustomAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');

  const handlePurchase = async () => {
    const finalAmount = customAmount ? parseInt(customAmount) : amount;
    
    try {
      const response = await fetch('/api/gift-cards/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          design: selectedDesign.id,
          recipientEmail,
          recipientName,
          senderName,
          message,
        }),
      });

      if (response.ok) {
        alert('Hediye kartınız başarıyla oluşturuldu!');
      }
    } catch (error) {
      console.error('Gift card purchase error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-4"
          >
            <Gift className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hediye Kartı
          </h1>
          <p className="text-lg text-gray-600">
            Sevdiklerinize TDC Market hediye kartı gönderin
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Configuration */}
          <div className="space-y-6">
            {/* Design Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>Tasarım Seçin</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {GIFT_DESIGNS.map((design) => (
                  <button
                    key={design.id}
                    onClick={() => setSelectedDesign(design)}
                    className={`relative aspect-video rounded-xl overflow-hidden border-4 transition-all ${
                      selectedDesign.id === design.id
                        ? 'border-purple-600 scale-105'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-full bg-gradient-to-br ${design.color} flex items-center justify-center`}>
                      <span className="text-white font-bold">{design.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tutar Seçin</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      amount === amt && !customAmount
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    ₺{amt}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  veya Özel Tutar Girin
                </label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Özel tutar"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                  min="50"
                  max="10000"
                />
              </div>
            </div>

            {/* Recipient Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Send className="w-5 h-5 text-purple-600" />
                <span>Alıcı Bilgileri</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alıcının Adı
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Ahmet Yılmaz"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alıcının E-postası
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="ahmet@example.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gönderenin Adı
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Sizin adınız"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mesajınız (Opsiyonel)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="İyi ki varsın..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Preview & Purchase */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Önizleme</h3>
              
              {/* Gift Card Preview */}
              <div className="mb-8">
                <div className={`aspect-[1.6] rounded-2xl bg-gradient-to-br ${selectedDesign.color} p-8 text-white relative overflow-hidden shadow-2xl`}>
                  <div className="absolute top-4 right-4 text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    TDC Market
                  </div>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="text-4xl font-bold mb-2">
                      ₺{customAmount || amount}
                    </div>
                    {recipientName && (
                      <div className="text-sm opacity-90">Gönderen: {recipientName}</div>
                    )}
                  </div>
                  <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-10">
                    <Gift className="w-32 h-32" />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Tasarım:</span>
                  <span className="font-semibold">{selectedDesign.name}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tutar:</span>
                  <span className="font-semibold">₺{customAmount || amount}</span>
                </div>
                {recipientEmail && (
                  <div className="flex justify-between text-gray-700">
                    <span>Alıcı:</span>
                    <span className="font-semibold">{recipientEmail}</span>
                  </div>
                )}
                <div className="pt-4 border-t flex justify-between text-lg font-bold">
                  <span>Toplam:</span>
                  <span className="text-purple-600">₺{customAmount || amount}</span>
                </div>
              </div>

              {/* Purchase Button */}
              <button
                onClick={handlePurchase}
                disabled={!recipientEmail || !recipientName}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Heart className="w-5 h-5" />
                <span>Hediye Kartı Satın Al</span>
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Hediye kartı alıcıya e-posta ile gönderilecektir
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


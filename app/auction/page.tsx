"use client";

// Client components are dynamic by default

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Clock, TrendingUp, Users, Zap } from 'lucide-react';

interface Auction {
  id: string;
  productName: string;
  currentBid: number;
  startingBid: number;
  bidCount: number;
  endTime: Date;
  highestBidder: string;
  image: string;
}

const SAMPLE_AUCTIONS: Auction[] = [
  {
    id: '1',
    productName: 'Limited Edition Anime Figure',
    currentBid: 1250,
    startingBid: 800,
    bidCount: 23,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    highestBidder: 'user***45',
    image: '/images/auction-1.jpg',
  },
  {
    id: '2',
    productName: 'Rare Collectible Set',
    currentBid: 2800,
    startingBid: 2000,
    bidCount: 45,
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours
    highestBidder: 'colle***89',
    image: '/images/auction-2.jpg',
  },
];

export default function AuctionPage() {
  const [auctions, setAuctions] = useState<Auction[]>(SAMPLE_AUCTIONS);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);

  useEffect(() => {
    // Countdown timer güncelleme
    const interval = setInterval(() => {
      setAuctions(prev => [...prev]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTimeRemaining = (endTime: Date) => {
    const total = endTime.getTime() - Date.now();
    const hours = Math.floor(total / (1000 * 60 * 60));
    const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((total % (1000 * 60)) / 1000);

    if (total <= 0) return 'Sona erdi';
    return `${hours}s ${minutes}d ${seconds}sn`;
  };

  const handleBid = (auction: Auction) => {
    if (bidAmount <= auction.currentBid) {
      alert('Teklifiniz mevcut tekliften yüksek olmalıdır!');
      return;
    }

    // Bid logic
    console.log(`Placing bid: ${bidAmount} for ${auction.productName}`);
    alert(`${bidAmount}₺ teklifi verildi!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mb-4"
          >
            <Gavel className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Açık Artırma
          </h1>
          <p className="text-lg text-gray-600">
            Nadir ve özel ürünleri en iyi fiyata kapın
          </p>
        </div>

        {/* Live Auctions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {auctions.map((auction) => {
            const timeRemaining = getTimeRemaining(auction.endTime);
            const isEnding = auction.endTime.getTime() - Date.now() < 60 * 60 * 1000; // 1 hour

            return (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden ${
                  isEnding ? 'ring-4 ring-red-500' : ''
                }`}
              >
                {isEnding && (
                  <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white text-center py-2 font-bold animate-pulse">
                    ⚡ SON DAKIKA!
                  </div>
                )}

                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  <Gavel className="w-32 h-32 text-orange-300" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white font-bold rounded-full text-sm flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{timeRemaining}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {auction.productName}
                  </h3>

                  {/* Current Bid */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Şu Anki Teklif</p>
                    <p className="text-3xl font-bold text-red-600">
                      ₺{auction.currentBid.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Başlangıç: ₺{auction.startingBid.toLocaleString()}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{auction.bidCount} teklif</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>En yüksek: {auction.highestBidder}</span>
                    </span>
                  </div>

                  {/* Bid Input */}
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(parseInt(e.target.value) || 0)}
                        placeholder={`Min: ₺${auction.currentBid + 50}`}
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 outline-none"
                      />
                      <button
                        onClick={() => handleBid(auction)}
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center space-x-2"
                      >
                        <Zap className="w-5 h-5" />
                        <span>Teklif Ver</span>
                      </button>
                    </div>
                    
                    {/* Quick bids */}
                    <div className="flex space-x-2">
                      {[50, 100, 200].map((increment) => (
                        <button
                          key={increment}
                          onClick={() => setBidAmount(auction.currentBid + increment)}
                          className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-colors"
                        >
                          +₺{increment}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* How it Works */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Açık Artırma Nasıl Çalışır?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: '1. Ürünü Seç', desc: 'İlgilendiğiniz açık artırmayı bulun' },
              { title: '2. Teklif Ver', desc: 'Mevcut teklifin üzerine çıkın' },
              { title: '3. Takip Et', desc: 'Süre bitene kadar takip edin' },
              { title: '4. Kazan', desc: 'En yüksek teklif sizse kazanın!' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600 font-bold text-lg">
                  {i + 1}
                </div>
                <h4 className="font-bold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


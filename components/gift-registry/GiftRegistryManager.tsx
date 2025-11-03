'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Plus, Share2, Calendar, Users, Heart, ShoppingBag, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface GiftRegistry {
  id: string;
  title: string;
  eventType: 'birthday' | 'wedding' | 'baby' | 'anniversary' | 'other';
  eventDate: string;
  description: string;
  isPublic: boolean;
  shareCode: string;
  items: GiftRegistryItem[];
  contributorsCount: number;
  totalValue: number;
  purchasedValue: number;
}

interface GiftRegistryItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  quantity: number;
  quantityPurchased: number;
  priority: 'high' | 'medium' | 'low';
  notes?: string;
}

export default function GiftRegistryManager() {
  const [registries, setRegistries] = useState<GiftRegistry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchRegistries();
  }, []);

  const fetchRegistries = async () => {
    try {
      const response = await fetch('/api/gift-registry/list');
      if (response.ok) {
        const data = await response.json();
        setRegistries(data.registries || []);
      }
    } catch (error) {
      console.error('Failed to fetch registries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (registry: GiftRegistry) => {
    const shareUrl = `${window.location.origin}/gift-registry/${registry.shareCode}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Hediye listesi linki kopyalandı! 🎁');
  };

  const eventIcons = {
    birthday: '🎂',
    wedding: '💍',
    baby: '👶',
    anniversary: '💐',
    other: '🎉'
  };

  const eventNames = {
    birthday: 'Doğum Günü',
    wedding: 'Düğün',
    baby: 'Bebek',
    anniversary: 'Yıldönümü',
    other: 'Özel Gün'
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-48 bg-gray-200 rounded-xl"></div>
      <div className="h-48 bg-gray-200 rounded-xl"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">🎁 Hediye Listelerim</h2>
          <p className="text-gray-600 mt-1">Özel günleriniz için hediye listesi oluşturun</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Yeni Liste Oluştur</span>
        </button>
      </div>

      {/* Registries Grid */}
      {registries.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-gray-200">
          <Gift className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz Hediye Listesi Yok</h3>
          <p className="text-gray-600 mb-6">Özel günleriniz için hediye listesi oluşturun</p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            İlk Listeyi Oluştur
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {registries.map((registry) => {
            const progress = (registry.purchasedValue / registry.totalValue) * 100;

            return (
              <motion.div
                key={registry.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-pink-300 transition-all"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 to-red-500 p-6 text-white">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-4xl mb-2">{eventIcons[registry.eventType]}</div>
                      <h3 className="text-2xl font-bold mb-1">{registry.title}</h3>
                      <p className="text-sm opacity-90">{eventNames[registry.eventType]}</p>
                    </div>
                    <button
                      onClick={() => handleShare(registry)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Event Date */}
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(registry.eventDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <ShoppingBag className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{registry.items.length}</div>
                      <div className="text-xs text-gray-600">Ürün</div>
                    </div>
                    <div className="text-center">
                      <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{registry.contributorsCount}</div>
                      <div className="text-xs text-gray-600">Katkıda Bulunan</div>
                    </div>
                    <div className="text-center">
                      <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</div>
                      <div className="text-xs text-gray-600">Tamamlandı</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>{registry.purchasedValue.toLocaleString('tr-TR')} ₺</span>
                      <span>{registry.totalValue.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-pink-600 to-red-600 h-3 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-2 border-2 border-gray-200 rounded-lg font-medium hover:border-pink-300 transition-colors">
                      Listeyi Görüntüle
                    </button>
                    <button
                      onClick={() => handleShare(registry)}
                      className="py-2 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Paylaş</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}


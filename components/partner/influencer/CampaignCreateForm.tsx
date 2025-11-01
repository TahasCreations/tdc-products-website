"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  DollarSign, Users, TrendingUp, Eye, Heart, Image,
  Video, FileText, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';

interface CampaignCreateFormProps {
  influencerId: string;
  influencerData: {
    platform: string;
    followersCount: number;
    engagementRate: number;
  };
}

export default function CampaignCreateForm({ influencerId, influencerData }: CampaignCreateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'all',
    platform: influencerData.platform,
    pricePerPost: '',
    pricePerStory: '',
    pricePerReel: '',
    followersCount: influencerData.followersCount,
    engagementRate: influencerData.engagementRate,
    avgViews: '',
    avgLikes: '',
  });

  const categories = [
    { value: 'all', label: 'Tüm Kategoriler' },
    { value: 'fashion', label: 'Moda & Aksesuar' },
    { value: 'electronics', label: 'Elektronik' },
    { value: 'beauty', label: 'Kozmetik & Güzellik' },
    { value: 'food', label: 'Gıda & İçecek' },
    { value: 'sports', label: 'Spor & Outdoor' },
    { value: 'home', label: 'Ev & Yaşam' },
  ];

  const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/influencer/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          influencerId,
          pricePerPost: parseFloat(formData.pricePerPost),
          pricePerStory: formData.pricePerStory ? parseFloat(formData.pricePerStory) : null,
          pricePerReel: formData.pricePerReel ? parseFloat(formData.pricePerReel) : null,
          avgViews: formData.avgViews ? parseInt(formData.avgViews) : null,
          avgLikes: formData.avgLikes ? parseInt(formData.avgLikes) : null,
        }),
      });

      if (response.ok) {
        router.push('/partner/influencer/campaigns');
      } else {
        alert('Hata oluştu');
      }
    } catch (error) {
      console.error('Campaign create error:', error);
      alert('Hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border-2 border-gray-100 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-pink-600" />
          <span>Temel Bilgiler</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kampanya Başlığı *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none transition-all"
              placeholder="Örn: Moda & Lifestyle İş Birlikleri"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Açıklama *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none transition-all"
              placeholder="Hangi tür ürünler için reklam yapmak istediğinizi, içerik tarzınızı ve şartlarınızı açıklayın..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none transition-all"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none transition-all"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pricing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border-2 border-gray-100 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <span>Fiyatlandırma</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Post Başı Fiyat (₺) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.pricePerPost}
              onChange={(e) => setFormData({ ...formData, pricePerPost: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none transition-all"
              placeholder="2500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Story Başı Fiyat (₺)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.pricePerStory}
              onChange={(e) => setFormData({ ...formData, pricePerStory: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none transition-all"
              placeholder="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reel/Video Başı Fiyat (₺)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.pricePerReel}
              onChange={(e) => setFormData({ ...formData, pricePerReel: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none transition-all"
              placeholder="3500"
            />
          </div>
        </div>
      </motion.div>

      {/* Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border-2 border-gray-100 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>Performans Metrikleri</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Takipçi Sayısı *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                required
                min="0"
                value={formData.followersCount}
                onChange={(e) => setFormData({ ...formData, followersCount: parseInt(e.target.value) })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Engagement (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.engagementRate}
              onChange={(e) => setFormData({ ...formData, engagementRate: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none transition-all"
              placeholder="5.2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ort. Görüntülenme
            </label>
            <div className="relative">
              <Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                min="0"
                value={formData.avgViews}
                onChange={(e) => setFormData({ ...formData, avgViews: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none transition-all"
                placeholder="15000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ort. Beğeni
            </label>
            <div className="relative">
              <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                min="0"
                value={formData.avgLikes}
                onChange={(e) => setFormData({ ...formData, avgLikes: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none transition-all"
                placeholder="1200"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Submit */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center space-x-4"
      >
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Oluşturuluyor...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>İlanı Yayınla</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:shadow-md transition-all font-semibold"
        >
          İptal
        </button>
      </motion.div>

      {/* Info */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-semibold text-blue-900 mb-1">İlan Onay Süreci</p>
            <p>İlanınız yayınlandıktan sonra admin ekibimiz tarafından incelenecektir. Onaylandıktan sonra satıcılar ilanınızı görebilecek ve size teklif gönderebilecektir.</p>
          </div>
        </div>
      </div>
    </form>
  );
}



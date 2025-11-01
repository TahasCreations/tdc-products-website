"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, Eye, Heart, DollarSign, Star,
  MessageCircle, Filter, Search, Sparkles, CheckCircle2
} from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  platform: string;
  pricePerPost: number;
  pricePerStory: number | null;
  pricePerReel: number | null;
  followersCount: number;
  engagementRate: number;
  avgViews: number | null;
  avgLikes: number | null;
  influencer: {
    user: {
      name: string;
      image: string | null;
    };
  };
  _count: {
    proposals: number;
  };
}

export default function InfluencerMarketplace({ userId }: { userId: string }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, [selectedCategory, selectedPlatform]);

  const fetchCampaigns = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedPlatform !== 'all') params.append('platform', selectedPlatform);

      const response = await fetch(`/api/influencer/campaigns?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error('Fetch campaigns error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendProposal = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowProposalModal(true);
  };

  const filteredCampaigns = campaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="İnfluencer veya kampanya ara..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all"
          >
            <option value="all">Tüm Kategoriler</option>
            <option value="fashion">Moda & Aksesuar</option>
            <option value="electronics">Elektronik</option>
            <option value="beauty">Kozmetik</option>
            <option value="food">Gıda</option>
            <option value="sports">Spor</option>
            <option value="home">Ev & Yaşam</option>
          </select>

          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-all"
          >
            <option value="all">Tüm Platformlar</option>
            <option value="Instagram">Instagram</option>
            <option value="TikTok">TikTok</option>
            <option value="YouTube">YouTube</option>
            <option value="Twitter">Twitter</option>
          </select>
        </div>
      </div>

      {/* Campaign Cards */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-100">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Henüz kampanya bulunamadı</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border-2 border-gray-100 hover:border-indigo-300 hover:shadow-xl transition-all overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {campaign.influencer.user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{campaign.influencer.user.name}</h3>
                      <p className="text-sm text-gray-600">{campaign.platform}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-full font-semibold">
                    {campaign.category}
                  </div>
                </div>
                
                <h2 className="text-lg font-bold text-gray-900 mb-2">{campaign.title}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">{campaign.description}</p>
              </div>

              {/* Metrics */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Takipçi</p>
                      <p className="font-bold text-gray-900">
                        {(campaign.followersCount / 1000).toFixed(1)}K
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Engagement</p>
                      <p className="font-bold text-gray-900">{campaign.engagementRate}%</p>
                    </div>
                  </div>

                  {campaign.avgViews && (
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">Ort. Görüntülenme</p>
                        <p className="font-bold text-gray-900">
                          {(campaign.avgViews / 1000).toFixed(1)}K
                        </p>
                      </div>
                    </div>
                  )}

                  {campaign.avgLikes && (
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-600" />
                      <div>
                        <p className="text-xs text-gray-600">Ort. Beğeni</p>
                        <p className="font-bold text-gray-900">
                          {(campaign.avgLikes / 1000).toFixed(1)}K
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-700">Fiyatlandırma</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Post:</span>
                      <span className="font-bold text-gray-900">₺{campaign.pricePerPost}</span>
                    </div>
                    {campaign.pricePerStory && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Story:</span>
                        <span className="font-bold text-gray-900">₺{campaign.pricePerStory}</span>
                      </div>
                    )}
                    {campaign.pricePerReel && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reel/Video:</span>
                        <span className="font-bold text-gray-900">₺{campaign.pricePerReel}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleSendProposal(campaign)}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Teklif Gönder</span>
                </button>

                {campaign._count.proposals > 0 && (
                  <p className="text-xs text-center text-gray-500 mt-2">
                    {campaign._count.proposals} teklif gönderildi
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Proposal Modal - Will implement next */}
      {showProposalModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-4">Teklif Gönder</h2>
            <p className="text-gray-600 mb-4">
              {selectedCampaign.influencer.user.name} ile iş birliği başlatmak için mesajınızı yazın.
            </p>
            {/* Form will be added in chat implementation */}
            <button
              onClick={() => setShowProposalModal(false)}
              className="w-full py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



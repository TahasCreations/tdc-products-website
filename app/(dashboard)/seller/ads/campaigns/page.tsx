"use client";

import { useState, useEffect } from 'react';

interface Campaign {
  id: string;
  name: string;
  dailyBudget: number;
  cpcMax: number;
  keywords: string[];
  status: string;
  spentToday: number;
  adTargets: Array<{
    productId: string;
    product: {
      title: string;
    };
  }>;
}

interface Product {
  id: string;
  title: string;
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    dailyBudget: '',
    cpcMax: '',
    keywords: '',
    targets: [] as string[]
  });

  useEffect(() => {
    fetchCampaigns();
    fetchProducts();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/ads/campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      // Mock data - gerçek uygulamada API'den gelecek
      setProducts([
        { id: '1', title: 'Anime Figür - Naruto' },
        { id: '2', title: 'El Yapımı Seramik Vazo' },
        { id: '3', title: 'Vintage Poster Seti' }
      ]);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/ads/campaigns', {
        method: editingCampaign ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dailyBudget: Number(formData.dailyBudget),
          cpcMax: Number(formData.cpcMax),
          keywords: formData.keywords.split(',').map(k => k.trim())
        })
      });
      
      if (response.ok) {
        setShowModal(false);
        setEditingCampaign(null);
        setFormData({ name: '', dailyBudget: '', cpcMax: '', keywords: '', targets: [] });
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      dailyBudget: campaign.dailyBudget.toString(),
      cpcMax: campaign.cpcMax.toString(),
      keywords: campaign.keywords.join(', '),
      targets: campaign.adTargets.map(t => t.productId)
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Kampanyayı silmek istediğinizden emin misiniz?')) return;
    
    try {
      const response = await fetch(`/api/ads/campaigns/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchCampaigns();
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800';
      case 'PAUSED': return 'bg-orange-100 text-orange-800';
      case 'ENDED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reklam Kampanyaları</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Yeni Kampanya
        </button>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Kampanyalar</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kampanya Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Günlük Bütçe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harcanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hedef Ürünler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₺{campaign.dailyBudget.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₺{campaign.spentToday.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.adTargets.length} ürün
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(campaign)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCampaign ? 'Kampanya Düzenle' : 'Yeni Kampanya'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kampanya Adı
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Günlük Bütçe (₺)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.dailyBudget}
                      onChange={(e) => setFormData({...formData, dailyBudget: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max CPC (₺)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.cpcMax}
                      onChange={(e) => setFormData({...formData, cpcMax: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anahtar Kelimeler (virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                    placeholder="anime, figür, koleksiyon"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hedef Ürünler
                  </label>
                  <select
                    multiple
                    value={formData.targets}
                    onChange={(e) => setFormData({...formData, targets: Array.from(e.target.selectedOptions, option => option.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {editingCampaign ? 'Güncelle' : 'Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

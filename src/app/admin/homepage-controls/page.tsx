'use client';

import { useState, useEffect } from 'react';
import AdminProtection from '../../../components/AdminProtection';
import AdvancedForm from '../../../components/admin/AdvancedForm';
import { 
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Campaign {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: number;
  originalPrice?: number;
  newPrice?: number;
  category: string;
  link: string;
  badge?: string;
  gradient: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  order: number;
}

interface HomepageSection {
  id: string;
  title: string;
  isVisible: boolean;
  order: number;
  content: any;
}

export default function HomepageControls() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadHomepageData();
  }, []);

  const loadHomepageData = async () => {
    try {
      // Mock data - gerçek uygulamada API'den gelecek
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          title: 'Yaz Kampanyası',
          description: 'Tüm figürlerde %30 indirim!',
          image: '/api/placeholder/800/400',
          discount: 30,
          originalPrice: 500,
          newPrice: 350,
          category: 'Tüm Kategoriler',
          link: '/products?campaign=summer',
          badge: 'YENİ',
          gradient: 'from-orange-400 to-red-500',
          isActive: true,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          order: 1
        },
        {
          id: '2',
          title: 'Anime Koleksiyonu',
          description: 'En sevilen anime karakterleri %25 indirimle!',
          image: '/api/placeholder/800/400',
          discount: 25,
          category: 'Anime',
          link: '/products?category=anime&campaign=anime',
          badge: 'POPÜLER',
          gradient: 'from-purple-400 to-pink-500',
          isActive: true,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          order: 2
        },
        {
          id: '3',
          title: 'Gaming Figürleri',
          description: 'Oyun dünyasının efsane karakterleri!',
          image: '/api/placeholder/800/400',
          discount: 20,
          category: 'Gaming',
          link: '/products?category=gaming&campaign=gaming',
          badge: 'ÖZEL',
          gradient: 'from-blue-400 to-cyan-500',
          isActive: false,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          order: 3
        }
      ];

      const mockSections: HomepageSection[] = [
        {
          id: 'hero',
          title: 'Ana Banner',
          isVisible: true,
          order: 1,
          content: { title: 'TDC Products', subtitle: 'Premium Figürler & Koleksiyon Ürünleri' }
        },
        {
          id: 'campaigns',
          title: 'Kampanyalar',
          isVisible: true,
          order: 2,
          content: { autoPlay: true, showDots: true }
        },
        {
          id: 'features',
          title: 'Özellikler',
          isVisible: true,
          order: 3,
          content: { showIcons: true, showDescriptions: true }
        },
        {
          id: 'products',
          title: 'Öne Çıkan Ürünler',
          isVisible: true,
          order: 4,
          content: { limit: 4, showPrices: true }
        },
        {
          id: 'cta',
          title: 'Çağrı Butonu',
          isVisible: true,
          order: 5,
          content: { text: 'Koleksiyonunuza Başlayın', buttonText: 'Alışverişe Başla' }
        }
      ];

      setCampaigns(mockCampaigns);
      setSections(mockSections);
    } catch (error) {
      console.error('Ana sayfa verileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const campaignFormFields = [
    {
      name: 'title',
      label: 'Kampanya Başlığı',
      type: 'text' as const,
      required: true,
      placeholder: 'Örn: Yaz Kampanyası'
    },
    {
      name: 'description',
      label: 'Açıklama',
      type: 'textarea' as const,
      required: true,
      placeholder: 'Kampanya açıklaması...'
    },
    {
      name: 'discount',
      label: 'İndirim Yüzdesi',
      type: 'number' as const,
      required: true,
      validation: { minLength: 1, maxLength: 3 }
    },
    {
      name: 'originalPrice',
      label: 'Orijinal Fiyat (TL)',
      type: 'number' as const,
      placeholder: 'Boş bırakılabilir'
    },
    {
      name: 'newPrice',
      label: 'İndirimli Fiyat (TL)',
      type: 'number' as const,
      placeholder: 'Boş bırakılabilir'
    },
    {
      name: 'category',
      label: 'Kategori',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'Tüm Kategoriler', label: 'Tüm Kategoriler' },
        { value: 'Anime', label: 'Anime' },
        { value: 'Gaming', label: 'Gaming' },
        { value: 'Film', label: 'Film' },
        { value: 'Manga', label: 'Manga' }
      ]
    },
    {
      name: 'badge',
      label: 'Rozet',
      type: 'select' as const,
      options: [
        { value: '', label: 'Rozet Yok' },
        { value: 'YENİ', label: 'YENİ' },
        { value: 'POPÜLER', label: 'POPÜLER' },
        { value: 'ÖZEL', label: 'ÖZEL' },
        { value: 'SINIRLI', label: 'SINIRLI' }
      ]
    },
    {
      name: 'gradient',
      label: 'Gradient Rengi',
      type: 'select' as const,
      required: true,
      options: [
        { value: 'from-orange-400 to-red-500', label: 'Turuncu-Kırmızı' },
        { value: 'from-purple-400 to-pink-500', label: 'Mor-Pembe' },
        { value: 'from-blue-400 to-cyan-500', label: 'Mavi-Cyan' },
        { value: 'from-green-400 to-emerald-500', label: 'Yeşil-Emerald' },
        { value: 'from-yellow-400 to-orange-500', label: 'Sarı-Turuncu' }
      ]
    },
    {
      name: 'startDate',
      label: 'Başlangıç Tarihi',
      type: 'date' as const,
      required: true
    },
    {
      name: 'endDate',
      label: 'Bitiş Tarihi',
      type: 'date' as const,
      required: true
    },
    {
      name: 'isActive',
      label: 'Aktif',
      type: 'checkbox' as const
    }
  ];

  const handleCampaignSubmit = (data: any) => {
    const newCampaign: Campaign = {
      id: editingCampaign?.id || Date.now().toString(),
      ...data,
      image: '/api/placeholder/800/400', // Gerçek uygulamada dosya yükleme olacak
      link: `/products?campaign=${data.title.toLowerCase().replace(/\s+/g, '-')}`,
      order: campaigns.length + 1
    };

    if (editingCampaign) {
      setCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? newCampaign : c));
    } else {
      setCampaigns(prev => [...prev, newCampaign]);
    }

    setShowCampaignForm(false);
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Bu kampanyayı silmek istediğinizden emin misiniz?')) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleToggleCampaign = (id: string) => {
    setCampaigns(prev => prev.map(c => 
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ));
  };

  const handleMoveCampaign = (id: string, direction: 'up' | 'down') => {
    setCampaigns(prev => {
      const index = prev.findIndex(c => c.id === id);
      if (index === -1) return prev;

      const newCampaigns = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      if (targetIndex >= 0 && targetIndex < newCampaigns.length) {
        [newCampaigns[index], newCampaigns[targetIndex]] = [newCampaigns[targetIndex], newCampaigns[index]];
        newCampaigns[index].order = index + 1;
        newCampaigns[targetIndex].order = targetIndex + 1;
      }

      return newCampaigns;
    });
  };

  const handleToggleSection = (id: string) => {
    setSections(prev => prev.map(s => 
      s.id === id ? { ...s, isVisible: !s.isVisible } : s
    ));
  };

  if (loading) {
    return (
      <AdminProtection>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
                <div className="h-96 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </AdminProtection>
    );
  }

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Ana Sayfa Kontrolleri</h1>
                <p className="text-gray-600">Ana sayfa içeriklerini ve kampanyaları yönetin</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    previewMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {previewMode ? <EyeSlashIcon className="w-5 h-5 mr-2 inline" /> : <EyeIcon className="w-5 h-5 mr-2 inline" />}
                  {previewMode ? 'Önizleme Kapat' : 'Önizleme'}
                </button>
                <button
                  onClick={() => {
                    setEditingCampaign(null);
                    setShowCampaignForm(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="w-5 h-5 mr-2 inline" />
                  Yeni Kampanya
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Kampanyalar */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Kampanyalar</h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {campaigns.filter(c => c.isActive).length} Aktif
                </span>
              </div>

              <div className="space-y-4">
                {campaigns.map((campaign, index) => (
                  <div
                    key={campaign.id}
                    className={`p-4 border rounded-lg transition-all ${
                      campaign.isActive 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{campaign.title}</h3>
                          {campaign.badge && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {campaign.badge}
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            campaign.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{campaign.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>%{campaign.discount} İndirim</span>
                          <span>•</span>
                          <span>{campaign.category}</span>
                          <span>•</span>
                          <span>Sıra: {index + 1}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleMoveCampaign(campaign.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowUpIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveCampaign(campaign.id, 'down')}
                          disabled={index === campaigns.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowDownIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleCampaign(campaign.id)}
                          className={`p-1 rounded ${
                            campaign.isActive 
                              ? 'text-green-600 hover:text-green-700' 
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {campaign.isActive ? <CheckIcon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingCampaign(campaign);
                            setShowCampaignForm(true);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-700"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCampaign(campaign.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sayfa Bölümleri */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Sayfa Bölümleri</h2>
              
              <div className="space-y-4">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className={`p-4 border rounded-lg transition-all ${
                      section.isVisible 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{section.title}</h3>
                        <p className="text-sm text-gray-600">Sıra: {section.order}</p>
                      </div>
                      <button
                        onClick={() => handleToggleSection(section.id)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          section.isVisible
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {section.isVisible ? 'Görünür' : 'Gizli'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kampanya Form Modal */}
          {showCampaignForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {editingCampaign ? 'Kampanya Düzenle' : 'Yeni Kampanya'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowCampaignForm(false);
                        setEditingCampaign(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>

                  <AdvancedForm
                    fields={campaignFormFields}
                    onSubmit={handleCampaignSubmit}
                    submitText={editingCampaign ? 'Güncelle' : 'Oluştur'}
                    className="space-y-4"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Önizleme Modal */}
          {previewMode && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Ana Sayfa Önizleme</h3>
                    <button
                      onClick={() => setPreviewMode(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-center text-gray-500">
                      Ana sayfa önizlemesi burada görünecek
                    </p>
                    {/* Gerçek uygulamada ana sayfa bileşeni burada render edilecek */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminProtection>
  );
}

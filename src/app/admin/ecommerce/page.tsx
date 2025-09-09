'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminProtection from '../../../components/AdminProtection';
import OptimizedLoader from '../../../components/OptimizedLoader';

interface ShippingCompany {
  id: string;
  name: string;
  code: string;
  delivery_time_min: number;
  delivery_time_max: number;
  base_price: number;
  is_active: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  type: string;
  provider: string;
  is_online: boolean;
  processing_fee_percentage: number;
  processing_fee_fixed: number;
  min_amount: number;
  max_amount: number;
  is_active: boolean;
}

interface Coupon {
  id: string;
  code: string;
  name: string;
  description: string;
  type: string;
  value: number;
  min_order_amount: number;
  max_discount_amount: number;
  usage_limit: number;
  used_count: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
}

interface SocialMediaAccount {
  id: string;
  platform: string;
  username: string;
  url: string;
  followers_count: number;
  is_active: boolean;
  last_sync: string;
}

interface GoogleAd {
  id: string;
  campaign_name: string;
  ad_type: string;
  budget_daily: number;
  budget_total: number;
  status: string;
  start_date: string;
  end_date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
}

export default function AdminEcommercePage() {
  const router = useRouter();
  const [shippingCompanies, setShippingCompanies] = useState<ShippingCompany[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [socialMediaAccounts, setSocialMediaAccounts] = useState<SocialMediaAccount[]>([]);
  const [googleAds, setGoogleAds] = useState<GoogleAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'shipping' | 'payment' | 'coupons' | 'social' | 'ads'>('shipping');
  const [showAddShipping, setShowAddShipping] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [showAddSocial, setShowAddSocial] = useState(false);
  const [showAddAd, setShowAddAd] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const [newShippingCompany, setNewShippingCompany] = useState({
    name: '',
    code: '',
    delivery_time_min: '',
    delivery_time_max: '',
    base_price: '',
    pricing_type: 'fixed',
    price_per_kg: '',
    free_shipping_threshold: ''
  });

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    name: '',
    code: '',
    type: 'card',
    provider: '',
    is_online: true,
    processing_fee_percentage: '',
    processing_fee_fixed: '',
    min_amount: '',
    max_amount: ''
  });

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percentage',
    value: '',
    min_order_amount: '',
    max_discount_amount: '',
    usage_limit: '',
    usage_limit_per_customer: '1',
    valid_from: new Date().toISOString().split('T')[0],
    valid_until: ''
  });

  const [newSocialAccount, setNewSocialAccount] = useState({
    platform: 'instagram',
    username: '',
    url: '',
    followers_count: '',
    is_active: true
  });

  const [newGoogleAd, setNewGoogleAd] = useState({
    campaign_name: '',
    ad_type: 'search',
    budget_daily: '',
    budget_total: '',
    status: 'draft',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    target_keywords: '',
    target_audience: '',
    ad_copy: ''
  });

  useEffect(() => {
    fetchEcommerceData();
  }, []);

  const fetchEcommerceData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [shippingResponse, paymentResponse, couponsResponse, socialResponse, adsResponse] = await Promise.all([
        fetch('/api/ecommerce?type=shipping_companies'),
        fetch('/api/ecommerce?type=payment_methods'),
        fetch('/api/ecommerce?type=coupons'),
        fetch('/api/ecommerce?type=social_accounts'),
        fetch('/api/ecommerce?type=google_ads')
      ]);

      const [shippingData, paymentData, couponsData, socialData, adsData] = await Promise.all([
        shippingResponse.json(),
        paymentResponse.json(),
        couponsResponse.json(),
        socialResponse.json(),
        adsResponse.json()
      ]);

      if (shippingData.success) {
        setShippingCompanies(shippingData.companies);
      }

      if (paymentData.success) {
        setPaymentMethods(paymentData.methods);
      }

      if (couponsData.success) {
        setCoupons(couponsData.coupons);
      }

      if (socialData.success) {
        setSocialMediaAccounts(socialData.accounts);
      }

      if (adsData.success) {
        setGoogleAds(adsData.ads);
      }

    } catch (error) {
      console.error('Fetch ecommerce data error:', error);
      setMessage('Veriler yüklenemedi');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddShippingCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/ecommerce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_shipping_company',
          ...newShippingCompany,
          delivery_time_min: parseInt(newShippingCompany.delivery_time_min) || 1,
          delivery_time_max: parseInt(newShippingCompany.delivery_time_max) || 3,
          base_price: parseFloat(newShippingCompany.base_price) || 0,
          price_per_kg: parseFloat(newShippingCompany.price_per_kg) || 0,
          free_shipping_threshold: parseFloat(newShippingCompany.free_shipping_threshold) || null
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Kargo firması başarıyla eklendi');
        setMessageType('success');
        setNewShippingCompany({
          name: '',
          code: '',
          delivery_time_min: '',
          delivery_time_max: '',
          base_price: '',
          pricing_type: 'fixed',
          price_per_kg: '',
          free_shipping_threshold: ''
        });
        setShowAddShipping(false);
        fetchEcommerceData();
      } else {
        setMessage(data.error || 'Kargo firması eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add shipping company error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/ecommerce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_payment_method',
          ...newPaymentMethod,
          processing_fee_percentage: parseFloat(newPaymentMethod.processing_fee_percentage) || 0,
          processing_fee_fixed: parseFloat(newPaymentMethod.processing_fee_fixed) || 0,
          min_amount: parseFloat(newPaymentMethod.min_amount) || 0,
          max_amount: parseFloat(newPaymentMethod.max_amount) || null
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Ödeme yöntemi başarıyla eklendi');
        setMessageType('success');
        setNewPaymentMethod({
          name: '',
          code: '',
          type: 'card',
          provider: '',
          is_online: true,
          processing_fee_percentage: '',
          processing_fee_fixed: '',
          min_amount: '',
          max_amount: ''
        });
        setShowAddPayment(false);
        fetchEcommerceData();
      } else {
        setMessage(data.error || 'Ödeme yöntemi eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add payment method error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/ecommerce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_coupon',
          ...newCoupon,
          value: parseFloat(newCoupon.value) || 0,
          min_order_amount: parseFloat(newCoupon.min_order_amount) || 0,
          max_discount_amount: parseFloat(newCoupon.max_discount_amount) || null,
          usage_limit: parseInt(newCoupon.usage_limit) || null,
          usage_limit_per_customer: parseInt(newCoupon.usage_limit_per_customer) || 1,
          valid_until: newCoupon.valid_until || null,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Kupon başarıyla oluşturuldu');
        setMessageType('success');
        setNewCoupon({
          code: '',
          name: '',
          description: '',
          type: 'percentage',
          value: '',
          min_order_amount: '',
          max_discount_amount: '',
          usage_limit: '',
          usage_limit_per_customer: '1',
          valid_from: new Date().toISOString().split('T')[0],
          valid_until: ''
        });
        setShowAddCoupon(false);
        fetchEcommerceData();
      } else {
        setMessage(data.error || 'Kupon oluşturulamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add coupon error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const getCouponTypeText = (type: string) => {
    const types: Record<string, string> = {
      'percentage': 'Yüzde İndirim',
      'fixed_amount': 'Sabit Tutar',
      'free_shipping': 'Ücretsiz Kargo',
      'buy_x_get_y': 'Al X Get Y'
    };
    return types[type] || type;
  };

  const getPaymentTypeText = (type: string) => {
    const types: Record<string, string> = {
      'card': 'Kart',
      'bank_transfer': 'Banka Havalesi',
      'cash': 'Nakit',
      'digital_wallet': 'Dijital Cüzdan',
      'installment': 'Taksit'
    };
    return types[type] || type;
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      'instagram': 'ri-instagram-line',
      'facebook': 'ri-facebook-line',
      'twitter': 'ri-twitter-line',
      'tiktok': 'ri-tiktok-line',
      'youtube': 'ri-youtube-line',
      'linkedin': 'ri-linkedin-line'
    };
    return icons[platform] || 'ri-global-line';
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      'instagram': 'text-pink-600',
      'facebook': 'text-blue-600',
      'twitter': 'text-blue-400',
      'tiktok': 'text-black',
      'youtube': 'text-red-600',
      'linkedin': 'text-blue-700'
    };
    return colors[platform] || 'text-gray-600';
  };

  const handleAddSocialAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/ecommerce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_social_account',
          ...newSocialAccount,
          followers_count: parseInt(newSocialAccount.followers_count) || 0,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Sosyal medya hesabı başarıyla eklendi');
        setMessageType('success');
        setNewSocialAccount({
          platform: 'instagram',
          username: '',
          url: '',
          followers_count: '',
          is_active: true
        });
        setShowAddSocial(false);
        fetchEcommerceData();
      } else {
        setMessage(data.error || 'Sosyal medya hesabı eklenemedi');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add social account error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  const handleAddGoogleAd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

      const response = await fetch('/api/ecommerce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_google_ad',
          ...newGoogleAd,
          budget_daily: parseFloat(newGoogleAd.budget_daily) || 0,
          budget_total: parseFloat(newGoogleAd.budget_total) || 0,
          end_date: newGoogleAd.end_date || null,
          created_by: currentAdmin?.id
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Google reklam kampanyası başarıyla oluşturuldu');
        setMessageType('success');
        setNewGoogleAd({
          campaign_name: '',
          ad_type: 'search',
          budget_daily: '',
          budget_total: '',
          status: 'draft',
          start_date: new Date().toISOString().split('T')[0],
          end_date: '',
          target_keywords: '',
          target_audience: '',
          ad_copy: ''
        });
        setShowAddAd(false);
        fetchEcommerceData();
      } else {
        setMessage(data.error || 'Google reklam kampanyası oluşturulamadı');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Add Google ad error:', error);
      setMessage('Bağlantı hatası');
      setMessageType('error');
    }
  };

  if (loading) {
    return <OptimizedLoader message="E-ticaret verileri yükleniyor..." />;
  }

  return (
    <AdminProtection>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gelişmiş E-ticaret Yönetimi</h1>
            <p className="text-gray-600">Kargo, ödeme, kupon, sosyal medya ve Google reklamları</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/admin"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <i className="ri-close-line mr-2"></i>
              Çıkış
            </Link>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message}
            <button
              onClick={() => setMessage('')}
              className="float-right text-lg font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'shipping'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-truck-line mr-2"></i>
                Kargo Firmaları
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payment'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-bank-card-line mr-2"></i>
                Ödeme Yöntemleri
              </button>
              <button
                onClick={() => setActiveTab('coupons')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'coupons'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-coupon-line mr-2"></i>
                Kuponlar
              </button>
              <button
                onClick={() => setActiveTab('social')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'social'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-share-line mr-2"></i>
                Sosyal Medya
              </button>
              <button
                onClick={() => setActiveTab('ads')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ads'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="ri-advertisement-line mr-2"></i>
                Google Reklamları
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Kargo Firmaları</h3>
                  <button
                    onClick={() => setShowAddShipping(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Kargo Firması Ekle
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Firma Adı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kod
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Teslimat Süresi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Temel Fiyat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {shippingCompanies.map((company) => (
                        <tr key={company.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {company.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {company.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {company.delivery_time_min}-{company.delivery_time_max} gün
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(company.base_price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              company.is_active 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {company.is_active ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Ödeme Yöntemleri</h3>
                  <button
                    onClick={() => setShowAddPayment(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Ödeme Yöntemi Ekle
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Yöntem Adı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tip
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sağlayıcı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlem Ücreti
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Online
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paymentMethods.map((method) => (
                        <tr key={method.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {method.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getPaymentTypeText(method.type)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {method.provider || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {method.processing_fee_percentage > 0 && `${method.processing_fee_percentage}%`}
                            {method.processing_fee_fixed > 0 && ` + ${formatCurrency(method.processing_fee_fixed)}`}
                            {method.processing_fee_percentage === 0 && method.processing_fee_fixed === 0 && 'Ücretsiz'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              method.is_online 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {method.is_online ? 'Online' : 'Offline'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              method.is_active 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {method.is_active ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'coupons' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Kuponlar</h3>
                  <button
                    onClick={() => setShowAddCoupon(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Kupon Oluştur
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kupon Kodu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tip
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Değer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kullanım
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Geçerlilik
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {coupons.map((coupon) => (
                        <tr key={coupon.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {coupon.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {coupon.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getCouponTypeText(coupon.type)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {coupon.type === 'percentage' ? `%${coupon.value}` : formatCurrency(coupon.value)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {coupon.used_count}/{coupon.usage_limit || '∞'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {coupon.valid_until ? formatDate(coupon.valid_until) : 'Sınırsız'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              coupon.is_active 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {coupon.is_active ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Sosyal Medya Hesapları</h3>
                  <button
                    onClick={() => setShowAddSocial(true)}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Hesap Ekle
                  </button>
                </div>

                {/* Sosyal Medya Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {socialMediaAccounts.map((account) => (
                    <div key={account.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <i className={`${getPlatformIcon(account.platform)} text-2xl ${getPlatformColor(account.platform)} mr-3`}></i>
                          <div>
                            <h4 className="font-semibold text-gray-900 capitalize">{account.platform}</h4>
                            <p className="text-sm text-gray-500">@{account.username}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          account.is_active 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {account.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Takipçi:</span>
                          <span className="font-medium">{account.followers_count.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Son Senkron:</span>
                          <span className="font-medium">{formatDate(account.last_sync)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <a
                          href={account.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm text-center transition-colors"
                        >
                          <i className="ri-external-link-line mr-1"></i>
                          Görüntüle
                        </a>
                        <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                          <i className="ri-settings-line"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Örnek Sosyal Medya Hesapları */}
                  <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <i className="ri-instagram-line text-2xl text-pink-600 mr-3"></i>
                      <div>
                        <h4 className="font-semibold text-gray-900">Instagram</h4>
                        <p className="text-sm text-gray-500">@sirket_adi</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Takipçi:</span>
                        <span className="font-medium">12,450</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Son Senkron:</span>
                        <span className="font-medium">2 saat önce</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Aktif
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <i className="ri-facebook-line text-2xl text-blue-600 mr-3"></i>
                      <div>
                        <h4 className="font-semibold text-gray-900">Facebook</h4>
                        <p className="text-sm text-gray-500">@sirket_adi</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Takipçi:</span>
                        <span className="font-medium">8,920</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Son Senkron:</span>
                        <span className="font-medium">1 saat önce</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Aktif
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ads' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Google Reklam Kampanyaları</h3>
                  <button
                    onClick={() => setShowAddAd(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Kampanya Oluştur
                  </button>
                </div>

                {/* Google Ads Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {googleAds.map((ad) => (
                    <div key={ad.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">{ad.campaign_name}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          ad.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : ad.status === 'paused'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {ad.status === 'active' ? 'Aktif' : ad.status === 'paused' ? 'Duraklatıldı' : 'Taslak'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Tip:</span>
                          <span className="font-medium capitalize">{ad.ad_type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Günlük Bütçe:</span>
                          <span className="font-medium">{formatCurrency(ad.budget_daily)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Toplam Bütçe:</span>
                          <span className="font-medium">{formatCurrency(ad.budget_total)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Gösterim:</span>
                          <span className="font-medium">{ad.impressions.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Tıklama:</span>
                          <span className="font-medium">{ad.clicks.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Dönüşüm:</span>
                          <span className="font-medium">{ad.conversions}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Maliyet:</span>
                          <span className="font-medium">{formatCurrency(ad.cost)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors">
                          <i className="ri-eye-line mr-1"></i>
                          Detaylar
                        </button>
                        <button className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                          <i className="ri-settings-line"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Örnek Google Ads Kampanyaları */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Ürün Tanıtım Kampanyası</h4>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Aktif
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tip:</span>
                        <span className="font-medium">Arama</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Günlük Bütçe:</span>
                        <span className="font-medium">₺150</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Gösterim:</span>
                        <span className="font-medium">45,230</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tıklama:</span>
                        <span className="font-medium">1,250</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Dönüşüm:</span>
                        <span className="font-medium">45</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Marka Bilinirliği</h4>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Duraklatıldı
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tip:</span>
                        <span className="font-medium">Görüntülü</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Günlük Bütçe:</span>
                        <span className="font-medium">₺200</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Gösterim:</span>
                        <span className="font-medium">125,450</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tıklama:</span>
                        <span className="font-medium">2,180</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Dönüşüm:</span>
                        <span className="font-medium">78</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Shipping Company Modal */}
        {showAddShipping && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Kargo Firması Ekle</h2>
              <form onSubmit={handleAddShippingCompany} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Firma Adı</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newShippingCompany.name}
                      onChange={(e) => setNewShippingCompany({ ...newShippingCompany, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kod</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newShippingCompany.code}
                      onChange={(e) => setNewShippingCompany({ ...newShippingCompany, code: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min. Teslimat (gün)</label>
                    <input
                      type="number"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newShippingCompany.delivery_time_min}
                      onChange={(e) => setNewShippingCompany({ ...newShippingCompany, delivery_time_min: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max. Teslimat (gün)</label>
                    <input
                      type="number"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newShippingCompany.delivery_time_max}
                      onChange={(e) => setNewShippingCompany({ ...newShippingCompany, delivery_time_max: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Temel Fiyat</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newShippingCompany.base_price}
                      onChange={(e) => setNewShippingCompany({ ...newShippingCompany, base_price: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ücretsiz Kargo Eşiği</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newShippingCompany.free_shipping_threshold}
                      onChange={(e) => setNewShippingCompany({ ...newShippingCompany, free_shipping_threshold: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddShipping(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Payment Method Modal */}
        {showAddPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ödeme Yöntemi Ekle</h2>
              <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Yöntem Adı</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPaymentMethod.name}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kod</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPaymentMethod.code}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, code: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tip</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPaymentMethod.type}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, type: e.target.value })}
                    >
                      <option value="card">Kart</option>
                      <option value="bank_transfer">Banka Havalesi</option>
                      <option value="cash">Nakit</option>
                      <option value="digital_wallet">Dijital Cüzdan</option>
                      <option value="installment">Taksit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sağlayıcı</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPaymentMethod.provider}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, provider: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">İşlem Ücreti (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPaymentMethod.processing_fee_percentage}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, processing_fee_percentage: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sabit Ücret</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPaymentMethod.processing_fee_fixed}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, processing_fee_fixed: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min. Tutar</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPaymentMethod.min_amount}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, min_amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max. Tutar</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newPaymentMethod.max_amount}
                      onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, max_amount: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_online"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={newPaymentMethod.is_online}
                    onChange={(e) => setNewPaymentMethod({ ...newPaymentMethod, is_online: e.target.checked })}
                  />
                  <label htmlFor="is_online" className="ml-2 block text-sm text-gray-900">
                    Online ödeme
                  </label>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddPayment(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Coupon Modal */}
        {showAddCoupon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Kupon Oluştur</h2>
              <form onSubmit={handleAddCoupon} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kupon Kodu</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ad</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCoupon.name}
                      onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                    <textarea
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCoupon.description}
                      onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tip</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCoupon.type}
                      onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                    >
                      <option value="percentage">Yüzde İndirim</option>
                      <option value="fixed_amount">Sabit Tutar</option>
                      <option value="free_shipping">Ücretsiz Kargo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Değer</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCoupon.value}
                      onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min. Sipariş Tutarı</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCoupon.min_order_amount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, min_order_amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max. İndirim Tutarı</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCoupon.max_discount_amount}
                      onChange={(e) => setNewCoupon({ ...newCoupon, max_discount_amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kullanım Limiti</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCoupon.usage_limit}
                      onChange={(e) => setNewCoupon({ ...newCoupon, usage_limit: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri Başına Limit</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCoupon.usage_limit_per_customer}
                      onChange={(e) => setNewCoupon({ ...newCoupon, usage_limit_per_customer: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Geçerlilik Başlangıcı</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCoupon.valid_from}
                      onChange={(e) => setNewCoupon({ ...newCoupon, valid_from: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Geçerlilik Bitişi</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCoupon.valid_until}
                      onChange={(e) => setNewCoupon({ ...newCoupon, valid_until: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Oluştur
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCoupon(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Social Media Account Modal */}
        {showAddSocial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Sosyal Medya Hesabı Ekle</h2>
              <form onSubmit={handleAddSocialAccount} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newSocialAccount.platform}
                      onChange={(e) => setNewSocialAccount({ ...newSocialAccount, platform: e.target.value })}
                    >
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="twitter">Twitter</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="linkedin">LinkedIn</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı Adı</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newSocialAccount.username}
                      onChange={(e) => setNewSocialAccount({ ...newSocialAccount, username: e.target.value })}
                      placeholder="@kullanici_adi"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <input
                      type="url"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newSocialAccount.url}
                      onChange={(e) => setNewSocialAccount({ ...newSocialAccount, url: e.target.value })}
                      placeholder="https://instagram.com/kullanici_adi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Takipçi Sayısı</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newSocialAccount.followers_count}
                      onChange={(e) => setNewSocialAccount({ ...newSocialAccount, followers_count: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_active_social"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={newSocialAccount.is_active}
                      onChange={(e) => setNewSocialAccount({ ...newSocialAccount, is_active: e.target.checked })}
                    />
                    <label htmlFor="is_active_social" className="ml-2 block text-sm text-gray-900">
                      Aktif hesap
                    </label>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Hesap Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSocial(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Google Ad Modal */}
        {showAddAd && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Google Reklam Kampanyası Oluştur</h2>
              <form onSubmit={handleAddGoogleAd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kampanya Adı</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newGoogleAd.campaign_name}
                      onChange={(e) => setNewGoogleAd({ ...newGoogleAd, campaign_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reklam Tipi</label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newGoogleAd.ad_type}
                      onChange={(e) => setNewGoogleAd({ ...newGoogleAd, ad_type: e.target.value })}
                    >
                      <option value="search">Arama Reklamları</option>
                      <option value="display">Görüntülü Reklamlar</option>
                      <option value="video">Video Reklamlar</option>
                      <option value="shopping">Alışveriş Reklamları</option>
                      <option value="app">Uygulama Reklamları</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Günlük Bütçe (₺)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newGoogleAd.budget_daily}
                      onChange={(e) => setNewGoogleAd({ ...newGoogleAd, budget_daily: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Toplam Bütçe (₺)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newGoogleAd.budget_total}
                      onChange={(e) => setNewGoogleAd({ ...newGoogleAd, budget_total: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newGoogleAd.status}
                      onChange={(e) => setNewGoogleAd({ ...newGoogleAd, status: e.target.value })}
                    >
                      <option value="draft">Taslak</option>
                      <option value="active">Aktif</option>
                      <option value="paused">Duraklatıldı</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlangıç Tarihi</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newGoogleAd.start_date}
                      onChange={(e) => setNewGoogleAd({ ...newGoogleAd, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bitiş Tarihi</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newGoogleAd.end_date}
                      onChange={(e) => setNewGoogleAd({ ...newGoogleAd, end_date: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Anahtar Kelimeler</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newGoogleAd.target_keywords}
                      onChange={(e) => setNewGoogleAd({ ...newGoogleAd, target_keywords: e.target.value })}
                      placeholder="ürün, satış, indirim (virgülle ayırın)"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hedef Kitle</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newGoogleAd.target_audience}
                      onChange={(e) => setNewGoogleAd({ ...newGoogleAd, target_audience: e.target.value })}
                      placeholder="18-45 yaş, İstanbul, teknoloji ilgilisi"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reklam Metni</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newGoogleAd.ad_copy}
                      onChange={(e) => setNewGoogleAd({ ...newGoogleAd, ad_copy: e.target.value })}
                      placeholder="Reklam metninizi buraya yazın..."
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Kampanya Oluştur
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAd(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminProtection>
  );
}

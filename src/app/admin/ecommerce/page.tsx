'use client';

import { useState, useEffect } from 'react';
import AdminProtection from '../../../components/AdminProtection';
import { PageLoader } from '../../../components/LoadingSpinner';

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

export default function AdminEcommercePage() {
  const [shippingCompanies, setShippingCompanies] = useState<ShippingCompany[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'shipping' | 'payment' | 'coupons'>('shipping');
  const [showAddShipping, setShowAddShipping] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showAddCoupon, setShowAddCoupon] = useState(false);
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

  useEffect(() => {
    fetchEcommerceData();
  }, []);

  const fetchEcommerceData = async () => {
    try {
      setLoading(true);
      
      const [shippingResponse, paymentResponse, couponsResponse] = await Promise.all([
        fetch('/api/ecommerce?type=shipping_companies'),
        fetch('/api/ecommerce?type=payment_methods'),
        fetch('/api/ecommerce?type=coupons')
      ]);

      const [shippingData, paymentData, couponsData] = await Promise.all([
        shippingResponse.json(),
        paymentResponse.json(),
        couponsResponse.json()
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

    } catch (error) {
      console.error('Fetch ecommerce data error:', error);
      setMessage('Veriler yüklenemedi');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return <PageLoader text="E-ticaret verileri yükleniyor..." />;
  }

  return (
    <AdminProtection>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">E-ticaret Yönetimi</h1>
            <p className="text-gray-600">Kargo, ödeme ve kupon sistemleri</p>
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
                Kuponlar
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
      </div>
    </AdminProtection>
  );
}

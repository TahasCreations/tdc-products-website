'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Plus,
  Check,
  X,
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw,
  Info,
  Crown,
  Zap,
} from 'lucide-react';

interface Domain {
  id: string;
  hostname: string;
  status: string;
  dnsTarget: string | null;
  verifiedAt: string | null;
  createdAt: string;
}

interface SellerDomainManagementProps {
  data: {
    seller: {
      id: string;
      storeName: string;
      storeSlug: string;
    };
    domains: Domain[];
    subscription: any;
    domainAllowances: any[];
  };
}

const statusConfig = {
  PENDING: {
    label: 'Beklemede',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle,
  },
  VERIFYING: {
    label: 'Doğrulanıyor',
    color: 'bg-blue-100 text-blue-800',
    icon: RefreshCw,
  },
  ACTIVE: {
    label: 'Aktif',
    color: 'bg-green-100 text-green-800',
    icon: Check,
  },
  REJECTED: {
    label: 'Reddedildi',
    color: 'bg-red-100 text-red-800',
    icon: X,
  },
};

export default function SellerDomainManagement({ data }: SellerDomainManagementProps) {
  const { seller, domains, subscription, domainAllowances } = data;
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedText, setCopiedText] = useState('');

  const canAddDomain = subscription?.plan !== 'FREE' || domainAllowances.length > 0;
  const maxDomains = subscription?.plan === 'PRO' ? 10 : subscription?.plan === 'GROWTH' ? 3 : 1;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const handleAddDomain = async () => {
    if (!newDomain) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/seller/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostname: newDomain,
          sellerId: seller.id,
        }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.message || 'Domain eklenirken hata oluştu');
      }
    } catch (error) {
      alert('Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    try {
      const response = await fetch(`/api/seller/domains/${domainId}/verify`, {
        method: 'POST',
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Domain doğrulanırken hata oluştu');
      }
    } catch (error) {
      alert('Bir hata oluştu');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Domain Yönetimi</h1>
          <p className="text-gray-600">
            Kendi domain adresinizi mağazanıza bağlayın
          </p>
        </div>
        {canAddDomain && domains.length < maxDomains && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all inline-flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Domain Ekle</span>
          </button>
        )}
      </div>

      {/* Subscription Info */}
      {!canAddDomain && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <Crown className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900 mb-2">
                Custom Domain Özelliği Premium Planlarda
              </h3>
              <p className="text-amber-800 mb-4">
                Kendi domain adresinizi kullanmak için planınızı yükseltin veya domain hakkı satın alın.
              </p>
              <div className="flex items-center space-x-3">
                <a
                  href="/seller/billing"
                  className="px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors inline-flex items-center space-x-2"
                >
                  <Zap className="w-5 h-5" />
                  <span>Planı Yükselt</span>
                </a>
                <span className="text-sm text-amber-700">
                  veya domain hakkı satın alın
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Default Domain */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-100 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Varsayılan Adres</h2>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            TDC Subdomain
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-gray-400" />
            <code className="text-lg font-mono text-gray-900">
              tdcmarket.com/{seller.storeSlug}
            </code>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCopy(`https://tdcmarket.com/${seller.storeSlug}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Kopyala"
            >
              <Copy className="w-5 h-5 text-gray-600" />
            </button>
            <a
              href={`https://tdcmarket.com/${seller.storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Ziyaret Et"
            >
              <ExternalLink className="w-5 h-5 text-gray-600" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Custom Domains */}
      {domains.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Custom Domainler</h2>
          {domains.map((domain, index) => {
            const statusInfo = statusConfig[domain.status as keyof typeof statusConfig];
            const StatusIcon = statusInfo.icon;

            return (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <code className="text-lg font-mono text-gray-900">
                        {domain.hostname}
                      </code>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color} inline-flex items-center space-x-1`}>
                        <StatusIcon className="w-4 h-4" />
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Eklendi: {new Date(domain.createdAt).toLocaleDateString('tr-TR')}
                      {domain.verifiedAt && ` • Doğrulandı: ${new Date(domain.verifiedAt).toLocaleDateString('tr-TR')}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {domain.status === 'PENDING' && (
                      <button
                        onClick={() => handleVerifyDomain(domain.id)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Doğrula
                      </button>
                    )}
                    <button
                      onClick={() => handleCopy(domain.hostname)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Copy className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* DNS Instructions */}
                {domain.status !== 'ACTIVE' && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start space-x-2">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          DNS Ayarları
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Domain sağlayıcınızın DNS ayarlarına aşağıdaki kayıtları ekleyin:
                        </p>
                        <div className="space-y-2">
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Type:</span>
                                <code className="ml-2 font-mono font-semibold">CNAME</code>
                              </div>
                              <div>
                                <span className="text-gray-600">Name:</span>
                                <code className="ml-2 font-mono font-semibold">@</code>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-gray-600">Value:</span>
                                  <code className="ml-2 font-mono font-semibold">
                                    cname.vercel-dns.com
                                  </code>
                                </div>
                                <button
                                  onClick={() => handleCopy('cname.vercel-dns.com')}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  <Copy className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          DNS değişikliklerinin yayılması 24-48 saat sürebilir.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Domain Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Yeni Domain Ekle
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain Adresi
                </label>
                <input
                  type="text"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="ornek.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  www olmadan domain adresinizi girin (örn: ornek.com)
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleAddDomain}
                  disabled={isSubmitting || !newDomain}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Ekleniyor...' : 'Domain Ekle'}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Copy Toast */}
      {copiedText && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2"
        >
          <Check className="w-5 h-5 text-green-400" />
          <span>Kopyalandı!</span>
        </motion.div>
      )}
    </div>
  );
}


"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  generateDNSRecords, 
  DNS_PROVIDERS,
  type DNSRecord 
} from '@/lib/domain/dns-verification';

interface StoreDomain {
  id: string;
  hostname: string;
  status: 'PENDING' | 'VERIFYING' | 'ACTIVE' | 'REJECTED';
  dnsTarget: string;
  verifiedAt?: string;
  createdAt: string;
}

export default function DomainSettingsPage() {
  const [domains, setDomains] = useState<StoreDomain[]>([]);
  const [hostname, setHostname] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<StoreDomain | null>(null);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/seller/domains');
      const data = await response.json();
      setDomains(data.domains || []);
    } catch (error) {
      console.error('Error fetching domains:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostname.trim()) return;
    
    setIsSubmitting(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/domains/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hostname: hostname.trim().toLowerCase() })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Domain başarıyla eklendi! Şimdi DNS ayarlarını yapın.');
        setHostname('');
        setShowAddModal(false);
        fetchDomains();
      } else {
        setMessage('❌ ' + (data.error || 'Hata oluştu'));
      }
    } catch (error) {
      setMessage('❌ Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    setVerifying(domainId);
    try {
      const response = await fetch(`/api/seller/domains/${domainId}/verify`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ ' + data.message);
        fetchDomains();
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (error) {
      setMessage('❌ Doğrulama sırasında hata oluştu');
    } finally {
      setVerifying(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage('📋 Kopyalandı!');
    setTimeout(() => setMessage(''), 2000);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      PENDING: { label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
      VERIFYING: { label: 'Doğrulanıyor', color: 'bg-blue-100 text-blue-800', icon: '🔍' },
      ACTIVE: { label: 'Aktif', color: 'bg-green-100 text-green-800', icon: '✅' },
      REJECTED: { label: 'Reddedildi', color: 'bg-red-100 text-red-800', icon: '❌' }
    };
    
    const { label, color, icon } = config[status as keyof typeof config] || config.PENDING;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
        {icon} {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Domain Yönetimi</h1>
          <p className="text-gray-600">Mağazanız için özel domain ekleyin ve yönetin</p>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' :
              message.includes('❌') ? 'bg-red-50 text-red-800 border border-red-200' :
              'bg-blue-50 text-blue-800 border border-blue-200'
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-200"
          >
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="font-bold text-gray-900 mb-2">Özel Domain</h3>
            <p className="text-sm text-gray-600">
              Mağazanıza özel domain ekleyerek profesyonel görünün
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200"
          >
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-bold text-gray-900 mb-2">SSL Sertifikası</h3>
            <p className="text-sm text-gray-600">
              Otomatik SSL sertifikası ile güvenli alışveriş
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200"
          >
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-gray-900 mb-2">Hızlı Kurulum</h3>
            <p className="text-sm text-gray-600">
              Sadece CNAME kaydı ekleyin, gerisini biz halledelim
            </p>
          </motion.div>
        </div>

        {/* Add Domain Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Yeni Domain Ekle</span>
          </button>
        </div>

        {/* Domains List */}
        <div className="space-y-4">
          {domains.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🌐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz Domain Eklenmemiş</h3>
              <p className="text-gray-600 mb-6">
                Mağazanız için özel domain ekleyerek profesyonel görünün
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                İlk Domain'inizi Ekleyin
              </button>
            </div>
          ) : (
            domains.map((domain) => (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{domain.hostname}</h3>
                      {getStatusBadge(domain.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Oluşturuldu: {new Date(domain.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                    {domain.verifiedAt && (
                      <p className="text-sm text-green-600">
                        ✓ Doğrulandı: {new Date(domain.verifiedAt).toLocaleDateString('tr-TR')}
                      </p>
                    )}
                  </div>

                  {domain.status === 'PENDING' && (
                    <button
                      onClick={() => handleVerifyDomain(domain.id)}
                      disabled={verifying === domain.id}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                    >
                      {verifying === domain.id ? '⏳ Doğrulanıyor...' : '🔍 DNS Doğrula'}
                    </button>
                  )}

                  {domain.status === 'ACTIVE' && (
                    <a
                      href={`https://${domain.hostname}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      🌐 Ziyaret Et
                    </a>
                  )}
                </div>

                {/* DNS Instructions */}
                {(domain.status === 'PENDING' || domain.status === 'VERIFYING') && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">📋 DNS Ayarları</h4>
                    
                    <div className="space-y-3">
                      {/* CNAME Record */}
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">CNAME Record</span>
                          <button
                            onClick={() => copyToClipboard(domain.dnsTarget || '')}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            📋 Kopyala
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Type</div>
                            <code className="text-gray-900 font-mono">CNAME</code>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Name/Host</div>
                            <code className="text-gray-900 font-mono">{domain.hostname}</code>
                          </div>
                          <div className="col-span-2">
                            <div className="text-xs text-gray-500 mb-1">Value/Points to</div>
                            <code className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded block">
                              {domain.dnsTarget}
                            </code>
                          </div>
                        </div>
                      </div>

                      {/* Quick Guide */}
                      <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <strong className="text-blue-900">💡 Nasıl Yapılır?</strong>
                        <ol className="mt-2 space-y-1 list-decimal list-inside">
                          <li>Domain sağlayıcınızın DNS paneline gidin</li>
                          <li>Yukarıdaki CNAME kaydını ekleyin</li>
                          <li>Değişikliklerin yayılması için 24-48 saat bekleyin</li>
                          <li>"DNS Doğrula" butonuna tıklayın</li>
                        </ol>
                      </div>

                      {/* Provider Guides */}
                      <button
                        onClick={() => setSelectedDomain(domain)}
                        className="w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm"
                      >
                        📚 Detaylı DNS Kurulum Kılavuzu →
                      </button>
                    </div>
                  </div>
                )}

                {/* Active Domain Info */}
                {domain.status === 'ACTIVE' && (
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center space-x-2 text-green-800">
                      <span className="text-xl">✅</span>
                      <div>
                        <div className="font-semibold">Domain Aktif!</div>
                        <div className="text-sm">
                          Mağazanız <a href={`https://${domain.hostname}`} target="_blank" className="underline font-medium">
                            {domain.hostname}
                          </a> adresinden erişilebilir.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Add Domain Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Yeni Domain Ekle</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Domain Adı
                    </label>
                    <input
                      type="text"
                      value={hostname}
                      onChange={(e) => setHostname(e.target.value)}
                      placeholder="ornek.com veya magaza.ornek.com"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 outline-none text-gray-900"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Subdomain kullanabilirsiniz (örn: shop.siteniz.com)
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-start space-x-2">
                      <span className="text-xl">⚠️</span>
                      <div className="text-sm text-yellow-800">
                        <strong>Önemli:</strong> Domain'inizi ekledikten sonra DNS ayarlarını yapmanız gerekecek.
                        Detaylı talimatları size göstereceğiz.
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
                    >
                      {isSubmitting ? '⏳ Ekleniyor...' : 'Domain Ekle'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* DNS Setup Guide Modal */}
        <AnimatePresence>
          {selectedDomain && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 my-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">DNS Kurulum Kılavuzu</h2>
                  <button
                    onClick={() => setSelectedDomain(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* DNS Records */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Eklenecek DNS Kayıtları</h3>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-300 mb-3">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-xs text-gray-500 font-medium mb-1">Type</div>
                          <code className="text-gray-900 font-mono font-bold">CNAME</code>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-medium mb-1">Name</div>
                          <code className="text-gray-900 font-mono">{selectedDomain.hostname}</code>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 font-medium mb-1">Value</div>
                          <code className="text-gray-900 font-mono bg-yellow-50 px-2 py-1 rounded">
                            {selectedDomain.dnsTarget}
                          </code>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(selectedDomain.dnsTarget || '')}
                        className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        📋 Hedef Domain'i Kopyala
                      </button>
                    </div>
                  </div>

                  {/* Provider Guides */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">DNS Sağlayıcınıza Göre Kurulum</h3>
                    <div className="space-y-3">
                      {DNS_PROVIDERS.map((provider) => (
                        <details key={provider.name} className="bg-gray-50 rounded-lg border border-gray-200">
                          <summary className="px-4 py-3 cursor-pointer hover:bg-gray-100 rounded-lg font-medium text-gray-900 flex items-center space-x-2">
                            <span className="text-xl">{provider.icon}</span>
                            <span>{provider.name}</span>
                          </summary>
                          <div className="px-4 pb-4 pt-2">
                            <ol className="space-y-2 text-sm text-gray-700">
                              {provider.steps.map((step, index) => (
                                <li key={index} className="flex items-start space-x-2">
                                  <span className="font-bold text-indigo-600">{index + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                            {provider.setupGuide && (
                              <a
                                href={provider.setupGuide}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-block text-xs text-indigo-600 hover:underline"
                              >
                                📖 Detaylı Kılavuz →
                              </a>
                            )}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDomain(null)}
                    className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Kapat
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

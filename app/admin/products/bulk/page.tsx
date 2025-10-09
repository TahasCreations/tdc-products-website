'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Edit, Trash2, Tag, DollarSign, Package, CheckCircle, AlertCircle, FileSpreadsheet, Zap } from 'lucide-react';

export default function ProductBulkPage() {
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'update' | 'delete'>('import');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const simulateProcess = () => {
    setIsProcessing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const bulkOperations = [
    {
      id: 'import',
      title: 'Toplu Ürün İçe Aktarma',
      description: 'Excel veya CSV dosyasından toplu ürün ekleyin',
      icon: Upload,
      color: 'blue',
      features: [
        'Excel (.xlsx) veya CSV dosya desteği',
        'Otomatik veri doğrulama',
        'Hatalı satırlar için detaylı rapor',
        'Kategori ve fiyat bilgisi dahil',
        'Toplu resim yükleme desteği'
      ]
    },
    {
      id: 'export',
      title: 'Toplu Ürün Dışa Aktarma',
      description: 'Tüm ürünleri Excel veya CSV formatında indirin',
      icon: Download,
      color: 'green',
      features: [
        'Filtrelenmiş ürün dışa aktarma',
        'Özel alan seçimi',
        'Excel veya CSV format seçeneği',
        'Kategori bazlı dışa aktarma',
        'Stok raporu dahil'
      ]
    },
    {
      id: 'update',
      title: 'Toplu Güncelleme',
      description: 'Birden fazla ürünü aynı anda güncelleyin',
      icon: Edit,
      color: 'yellow',
      features: [
        'Toplu fiyat güncelleme',
        'Stok miktarı güncelleme',
        'Kategori değiştirme',
        'Durum güncelleme (aktif/pasif)',
        'İndirim oranı uygulama'
      ]
    },
    {
      id: 'delete',
      title: 'Toplu Silme',
      description: 'Seçili ürünleri toplu olarak silin',
      icon: Trash2,
      color: 'red',
      features: [
        'Güvenli toplu silme',
        'Silme öncesi onay',
        'Geri alınabilir silme (30 gün)',
        'Kategori bazlı silme',
        'Stok durumuna göre silme'
      ]
    }
  ];

  const recentOperations = [
    {
      id: 1,
      type: 'import',
      description: '150 ürün içe aktarıldı',
      date: '2024-01-15 14:30',
      status: 'success',
      user: 'Admin'
    },
    {
      id: 2,
      type: 'update',
      description: '45 ürünün fiyatı güncellendi',
      date: '2024-01-15 12:15',
      status: 'success',
      user: 'Admin'
    },
    {
      id: 3,
      type: 'export',
      description: 'Tüm ürünler dışa aktarıldı',
      date: '2024-01-14 16:45',
      status: 'success',
      user: 'Admin'
    },
    {
      id: 4,
      type: 'delete',
      description: '12 ürün silindi',
      date: '2024-01-14 10:20',
      status: 'warning',
      user: 'Admin'
    }
  ];

  const quickActions = [
    {
      title: 'Fiyat Güncelleme',
      description: 'Toplu fiyat değişikliği yapın',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      action: () => setActiveTab('update')
    },
    {
      title: 'Stok Güncelleme',
      description: 'Toplu stok miktarı güncelleyin',
      icon: Package,
      color: 'from-blue-500 to-cyan-600',
      action: () => setActiveTab('update')
    },
    {
      title: 'Etiket Yönetimi',
      description: 'Toplu etiket ekle/çıkar',
      icon: Tag,
      color: 'from-purple-500 to-pink-600',
      action: () => setActiveTab('update')
    }
  ];

  const getOperationColor = (type: string) => {
    switch (type) {
      case 'import': return 'text-blue-600';
      case 'export': return 'text-green-600';
      case 'update': return 'text-yellow-600';
      case 'delete': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Toplu İşlemler</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Ürünlerde toplu işlemler yapın ve zamandan tasarruf edin</p>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-[#CBA135] to-[#F4D03F] px-4 py-2 rounded-lg">
          <Zap className="w-5 h-5 text-black" />
          <span className="font-bold text-black">Hızlı İşlem</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {bulkOperations.map((op, index) => {
          const Icon = op.icon;
          return (
            <motion.button
              key={op.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveTab(op.id as any)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                activeTab === op.id
                  ? 'border-[#CBA135] bg-gradient-to-br from-[#CBA135]/10 to-[#F4D03F]/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-[#CBA135]/50'
              }`}
            >
              <Icon className={`w-8 h-8 mb-3 ${activeTab === op.id ? 'text-[#CBA135]' : 'text-gray-600 dark:text-gray-400'}`} />
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">{op.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{op.description}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Operation Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            {activeTab === 'import' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Toplu Ürün İçe Aktarma</h2>
                  <p className="text-gray-600 dark:text-gray-400">Excel veya CSV dosyasından ürünleri sisteme aktarın</p>
                </div>

                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-[#CBA135] transition-colors">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Dosya Yükle
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Excel (.xlsx) veya CSV dosyanızı sürükleyip bırakın veya seçin
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block bg-[#CBA135] text-black px-6 py-2 rounded-lg font-bold cursor-pointer hover:bg-[#F4D03F] transition-colors"
                  >
                    Dosya Seç
                  </label>
                  {selectedFile && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                        ✓ {selectedFile.name} seçildi
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">📋 Şablon İndir</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                    Doğru formatta veri yüklemek için örnek şablonu indirin
                  </p>
                  <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Excel Şablonu İndir</span>
                  </button>
                </div>

                {selectedFile && (
                  <button
                    onClick={simulateProcess}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-[#CBA135] to-[#F4D03F] text-black font-bold py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isProcessing ? 'İşleniyor...' : 'İçe Aktarmayı Başlat'}
                  </button>
                )}

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>İlerleme</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-[#CBA135] to-[#F4D03F] h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'export' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Toplu Ürün Dışa Aktarma</h2>
                  <p className="text-gray-600 dark:text-gray-400">Ürünleri Excel veya CSV formatında indirin</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Dışa Aktarma Formatı
                    </label>
                    <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option>Excel (.xlsx)</option>
                      <option>CSV (.csv)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Kategori Filtresi
                    </label>
                    <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option>Tüm Kategoriler</option>
                      <option>Elektronik</option>
                      <option>Giyim</option>
                      <option>Ev & Yaşam</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Durum Filtresi
                    </label>
                    <select className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option>Tüm Ürünler</option>
                      <option>Aktif Ürünler</option>
                      <option>Pasif Ürünler</option>
                      <option>Stokta Olanlar</option>
                      <option>Stokta Olmayanlar</option>
                    </select>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Dışa Aktar</span>
                </button>
              </div>
            )}

            {activeTab === 'update' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Toplu Güncelleme</h2>
                  <p className="text-gray-600 dark:text-gray-400">Birden fazla ürünü aynı anda güncelleyin</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={action.action}
                        className={`p-6 rounded-xl bg-gradient-to-br ${action.color} text-white text-left hover:shadow-xl transition-all`}
                      >
                        <Icon className="w-8 h-8 mb-3" />
                        <h3 className="font-bold mb-1">{action.title}</h3>
                        <p className="text-sm opacity-90">{action.description}</p>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">⚠️ Dikkat</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Toplu güncelleme işlemleri geri alınamaz. Lütfen işlem öncesi emin olun.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'delete' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Toplu Silme</h2>
                  <p className="text-gray-600 dark:text-gray-400">Seçili ürünleri toplu olarak silin</p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-red-900 dark:text-red-300 mb-2">Tehlikeli İşlem</h3>
                      <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                        Bu işlem birden fazla ürünü kalıcı olarak silecektir. Silinen ürünler 30 gün içinde geri yüklenebilir.
                      </p>
                      <ul className="text-sm text-red-700 dark:text-red-400 space-y-1 mb-4">
                        <li>• Ürün bilgileri silinecek</li>
                        <li>• Ürün görselleri arşivlenecek</li>
                        <li>• Satış geçmişi korunacak</li>
                        <li>• 30 gün sonra kalıcı olarak silinecek</li>
                      </ul>
                      <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-bold">
                        Toplu Silme İşlemini Başlat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Features List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Özellikler</h3>
            <ul className="space-y-3">
              {bulkOperations.find(op => op.id === activeTab)?.features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Operations */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Son İşlemler</h3>
            <div className="space-y-4">
              {recentOperations.map((op, index) => (
        <motion.div
                  key={op.id}
                  initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-sm font-semibold ${getOperationColor(op.type)}`}>
                      {op.type.toUpperCase()}
                    </span>
                    {getStatusIcon(op.status)}
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white font-medium mb-1">{op.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{op.date}</span>
                    <span>{op.user}</span>
                  </div>
        </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#CBA135] to-[#F4D03F] rounded-xl p-6 text-black">
            <h3 className="text-lg font-bold mb-2">💡 İpucu</h3>
            <p className="text-sm opacity-90">
              Toplu işlemler yapmadan önce verilerinizi yedeklemenizi öneririz. Dışa aktarma özelliğini kullanarak mevcut ürünlerinizi yedekleyebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

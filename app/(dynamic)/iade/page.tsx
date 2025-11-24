"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, AlertCircle, CheckCircle, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  createdAt: string;
  items: Array<{
    id: string;
    productTitle: string;
    quantity: number;
    price: number;
  }>;
}

export default function ReturnPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [reason, setReason] = useState('');
  const [reasonCategory, setReasonCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Kullanıcının iade yapılabilir siparişlerini getir
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.orders) {
          // Sadece paid, shipped, delivered durumundaki ve 14 gün içindeki siparişler
          const eligibleOrders = data.orders.filter((order: any) => {
            const orderDate = new Date(order.createdAt);
            const daysSinceOrder = Math.floor(
              (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            return ['paid', 'shipped', 'delivered'].includes(order.status) && daysSinceOrder <= 14;
          });
          setOrders(eligibleOrders);
        }
      })
      .catch(err => console.error('Siparişler getirilemedi:', err));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder,
          orderItemId: selectedItem || undefined,
          reason,
          reasonCategory,
          description,
          images,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'İade talebi oluşturulamadı');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/orders');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedOrderData = orders.find(o => o.id === selectedOrder);

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            İade Talebi Alındı
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            İade talebiniz başarıyla oluşturuldu. En kısa sürede değerlendirilecektir.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#CBA135] rounded-full mb-6">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            İade ve Değişim
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            14 günlük cayma hakkınızı kullanarak ürünlerinizi iade edebilirsiniz
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-2">Önemli Bilgiler:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>İade süresi: Sipariş tarihinden itibaren 14 gün</li>
                <li>Ürün orijinal ambalajında ve kullanılmamış olmalıdır</li>
                <li>İade kargo ücreti müşteriye aittir (ürün hatası durumunda ücretsiz)</li>
                <li>Ödeme 14 iş günü içinde iade edilir</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
          {/* Sipariş Seçimi */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Sipariş Seçin *
            </label>
            <select
              value={selectedOrder}
              onChange={(e) => {
                setSelectedOrder(e.target.value);
                setSelectedItem('');
              }}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
            >
              <option value="">Sipariş seçin...</option>
              {orders.map(order => (
                <option key={order.id} value={order.id}>
                  {order.orderNumber} - {new Date(order.createdAt).toLocaleDateString('tr-TR')} - ₺{order.total.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* Ürün Seçimi */}
          {selectedOrderData && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                İade Edilecek Ürün (Tüm sipariş için boş bırakın)
              </label>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
              >
                <option value="">Tüm sipariş</option>
                {selectedOrderData.items.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.productTitle} (Adet: {item.quantity})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* İade Sebebi Kategorisi */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              İade Sebebi Kategorisi *
            </label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
            >
              <option value="">Kategori seçin...</option>
              <option value="product_defect">Ürün Hatası</option>
              <option value="wrong_product">Yanlış Ürün</option>
              <option value="not_as_described">Açıklamaya Uygun Değil</option>
              <option value="damaged">Hasarlı</option>
              <option value="size_issue">Beden Sorunu</option>
              <option value="color_issue">Renk Sorunu</option>
              <option value="changed_mind">Fikrim Değişti</option>
              <option value="other">Diğer</option>
            </select>
          </div>

          {/* İade Sebebi */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              İade Sebebi (En az 10 karakter) *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              minLength={10}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
              placeholder="İade sebebinizi detaylı olarak açıklayın..."
            />
          </div>

          {/* Ek Açıklama */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Ek Açıklama (Opsiyonel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#CBA135] focus:border-transparent"
              placeholder="Ek bilgiler..."
            />
          </div>

          {/* Fotoğraf Yükleme */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Ürün Fotoğrafları (Opsiyonel)
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Fotoğraf yüklemek için tıklayın
                </span>
              </label>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img src={img} alt={`İade ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-800 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#CBA135] hover:bg-[#B8941F] disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors"
          >
            {isSubmitting ? 'Gönderiliyor...' : 'İade Talebi Oluştur'}
          </button>
        </form>
      </div>
    </div>
  );
}




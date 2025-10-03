'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import { applySeller } from './actions';
import { motion } from 'framer-motion';
import ImageUpload from '@/src/components/upload/ImageUpload';

export default function SellerApplyPage() {
  const [state, formAction] = useFormState(applySeller, { ok: false, error: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    if (logoUrl) {
      formData.set('logoUrl', logoUrl);
    }
    await formAction(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              TDC Market'te Satıcı Ol
            </h1>
            <p className="text-gray-600">
              Mağazanızı açın ve ürünlerinizi binlerce müşteriye ulaştırın
            </p>
          </div>

          {state.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">
                {state.error === 'auth_required' && 'Giriş yapmanız gerekiyor'}
                {state.error === 'invalid_data' && 'Lütfen tüm alanları doğru şekilde doldurun'}
                {state.error === 'database_error' && 'Bir hata oluştu, lütfen tekrar deneyin'}
              </p>
            </div>
          )}

          {state.ok && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700">
                Başvurunuz alındı! En kısa sürede değerlendirilecek ve size dönüş yapılacaktır.
              </p>
            </div>
          )}

          <form action={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-2">
                Mağaza Adı *
              </label>
              <input
                type="text"
                id="storeName"
                name="storeName"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Örn: Anime Figür Dünyası"
              />
            </div>

            <div>
              <label htmlFor="storeSlug" className="block text-sm font-medium text-gray-700 mb-2">
                Mağaza URL'i *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  tdcmarket.com/seller/
                </span>
                <input
                  type="text"
                  id="storeSlug"
                  name="storeSlug"
                  required
                  pattern="^[a-z0-9-]+$"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="anime-figur-dunyasi"
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Sadece küçük harf, rakam ve tire kullanabilirsiniz
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Mağaza Açıklaması
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Mağazanız hakkında kısa bir açıklama yazın..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  VKN/TCKN
                </label>
                <input
                  type="text"
                  id="taxNumber"
                  name="taxNumber"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1234567890"
                />
              </div>

              <div>
                <label htmlFor="iban" className="block text-sm font-medium text-gray-700 mb-2">
                  IBAN
                </label>
                <input
                  type="text"
                  id="iban"
                  name="iban"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="TR12 0006 4000 0011 2345 6789 01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mağaza Logosu (Opsiyonel)
              </label>
              <ImageUpload
                onUpload={setLogoUrl}
                type="image"
                maxSize={2}
                className="max-w-md"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Başvuru Süreci</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Başvurunuz 1-2 iş günü içinde değerlendirilir</li>
                <li>• Onaylandıktan sonra ürün eklemeye başlayabilirsiniz</li>
                <li>• Komisyon oranı: %5 (ilk 3 ay %3)</li>
                <li>• Ödemeler haftalık olarak yapılır</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

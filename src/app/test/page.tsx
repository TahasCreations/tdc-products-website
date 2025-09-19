'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useToast } from '../../components/Toast';

export default function TestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const { addItem } = useCart();
  const { addToWishlist } = useWishlist();
  const { addToast } = useToast();

  useEffect(() => {
    const tests = [
      'Test sayfası yüklendi',
      'React hooks çalışıyor',
      'State management aktif'
    ];

    setTestResults(tests);
  }, []);

  const testCart = () => {
    try {
      addItem({
        id: 'test-1',
        title: 'Test Ürün',
        price: 100,
        image: '/test.jpg',
        slug: 'test-urun'
      }, 1);
      addToast({
        type: 'success',
        title: 'Başarılı!',
        message: 'Sepete eklendi'
      });
      setTestResults(prev => [...prev, 'Sepet işlevi çalışıyor']);
    } catch (error) {
      setTestResults(prev => [...prev, `Sepet hatası: ${error}`]);
    }
  };

  const testWishlist = async () => {
    try {
      await addToWishlist('test-1');
      addToast({
        type: 'success',
        title: 'Başarılı!',
        message: 'İstek listesine eklendi'
      });
      setTestResults(prev => [...prev, 'İstek listesi işlevi çalışıyor']);
    } catch (error) {
      setTestResults(prev => [...prev, `İstek listesi hatası: ${error}`]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Site Test Sayfası</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Test Sonuçları</h2>
          <ul className="space-y-2">
            {testResults.map((result, index) => (
              <li key={index} className="flex items-center">
                <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                  ✓
                </span>
                {result}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Sepet Testi</h3>
            <button
              onClick={testCart}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Sepete Ekle
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">İstek Listesi Testi</h3>
            <button
              onClick={testWishlist}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
            >
              İstek Listesine Ekle
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors inline-block"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}

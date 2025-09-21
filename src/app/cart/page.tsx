'use client';

import { useCart } from '../../contexts/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SimpleRecommendationEngine from '../../components/ai/SimpleRecommendationEngine';

export default function CartPage() {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <i className="ri-shopping-cart-line text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Sepetiniz Boş</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Henüz sepete ürün eklemediniz. Ürünlerimizi keşfetmeye başlayın!
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
            >
              <i className="ri-store-line mr-2"></i>
              Ürünlere Git
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Alışveriş Sepeti</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {state.itemCount} ürün • {formatPrice(state.total)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ürün Listesi */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="p-6">
                <div className="space-y-6">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Birim Fiyat: {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <i className="ri-subtract-line"></i>
                          </button>
                          <span className="px-4 py-1 text-center min-w-[3rem] font-medium text-gray-900 dark:text-gray-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <i className="ri-add-line"></i>
                          </button>
                        </div>
                        
                        <div className="text-right min-w-[6rem]">
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2"
                          title="Ürünü kaldır"
                        >
                          <i className="ri-delete-bin-line text-lg"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors font-medium"
                  >
                    <i className="ri-delete-bin-line mr-2"></i>
                    Sepeti Temizle
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Özet */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24 transition-colors duration-300">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Sipariş Özeti</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Ara Toplam:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{formatPrice(state.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Kargo:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">Ücretsiz</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900 dark:text-gray-100">Toplam:</span>
                    <span className="text-orange-600 dark:text-orange-400">{formatPrice(state.total)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                <div className="flex items-center justify-center">
                  <i className="ri-shopping-bag-line mr-2"></i>
                  Ödemeye Geç
                </div>
              </button>

              <div className="mt-4 text-center">
                <Link
                  href="/products"
                  className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium text-sm"
                >
                  <i className="ri-arrow-left-line mr-1"></i>
                  Alışverişe Devam Et
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* AI Önerileri */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                🤖 Size Özel Öneriler
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Sepetinizdeki ürünlere benzer figürler ve kişiselleştirilmiş öneriler
              </p>
            </div>
            <SimpleRecommendationEngine
              context="cart"
              limit={6}
              
              
            />
          </div>
        </section>
      </div>
    </div>
  );
}

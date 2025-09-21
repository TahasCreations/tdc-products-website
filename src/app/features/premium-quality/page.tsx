'use client';

import Link from 'next/link';
import { 
  StarIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function PremiumQualityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <StarIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Premium Kalite
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              En yüksek kalitede malzemelerle üretilen figürler
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <CheckBadgeIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sertifikalı Malzemeler</h3>
              <p className="text-gray-600">
                Tüm figürlerimizde kullanılan malzemeler uluslararası standartlarda sertifikalıdır.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <ShieldCheckIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kalite Kontrolü</h3>
              <p className="text-gray-600">
                Her ürün 3 aşamalı kalite kontrolünden geçer ve mükemmellik standartlarını karşılar.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <SparklesIcon className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">El İşçiliği</h3>
              <p className="text-gray-600">
                Uzman sanatçılarımız tarafından özenle işlenen her detay mükemmellik arayışımızı yansıtır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Premium Kalite Garantisi
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Tüm ürünlerimizde %100 kalite garantisi veriyoruz. Memnun kalmadığınız takdirde iade edebilirsiniz.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <i className="ri-shopping-bag-line mr-2"></i>
            Ürünleri İncele
          </Link>
        </div>
      </section>
    </div>
  );
}
